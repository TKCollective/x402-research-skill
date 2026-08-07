// ═══════════════════════════════════════════════════════════════════
//  POST /v1/verify-facts — AgentOracle deterministic verification tier
//
//  For claims that are lookups, not judgments. The pipeline never enters
//  an LLM code path. Same JWS envelope as v0.3+composed, same signing key,
//  same published JWKS, same PyPI verifier — what changes is that the
//  v_gate is computed by a deterministic check rather than model judgment,
//  and the payload records check_mode: "deterministic" so a verifier can
//  prove no model was in the trust chain.
//
//  HARD INVARIANT: no code path in this file may call an LLM, a model
//  endpoint, or any non-deterministic external judge. A claim that cannot
//  be resolved by a shipped check type returns HTTP 422 — never a fallback
//  to /v1/compose. The fallback would break the tier's only real promise.
//
//  Scope: post_launch_queue/deterministic_only_tier_scope.md
//  Canonicalization + signing primitives are imported from
//  v_gate_compose.js — DO NOT re-implement jcs() here.
// ═══════════════════════════════════════════════════════════════════

import crypto from "node:crypto";
import {
  jcs,
  b64uEncode,
  getPrivateKey,
  COMPOSED_KID,
  AO_MAPPING_ID,
  AO_MAPPING_HASH,
} from "./v_gate_compose.js";

// Deterministic-tier mapping pointer. Distinct from the judgment-mode
// mapping (AO_MAPPING_ID) because the rule catalog is different: this
// one enumerates check types, not judgment policy.
const DETERMINISTIC_MAPPING_ID = "agentoracle-deterministic-v0.1-2026-08-06";

// Registries permitted for registry_lookup. Allowlist, not freeform URL
// fetch — an open fetch would make the check non-recomputable (the caller
// could point at a server they control) and would be an SSRF surface.
const REGISTRY_CATALOG = {
  pypi: {
    label: "PyPI",
    url: (name) => `https://pypi.org/pypi/${encodeURIComponent(name)}/json`,
    extract: (j) => ({
      exists: true,
      version: j?.info?.version ?? null,
      name: j?.info?.name ?? null,
    }),
  },
  npm: {
    label: "npm",
    url: (name) => `https://registry.npmjs.org/${encodeURIComponent(name)}`,
    extract: (j) => ({
      exists: true,
      version: j?.["dist-tags"]?.latest ?? null,
      name: j?.name ?? null,
    }),
  },
  ietf_datatracker: {
    label: "IETF Datatracker",
    url: (name) =>
      `https://datatracker.ietf.org/api/v1/doc/document/${encodeURIComponent(name)}/?format=json`,
    extract: (j) => ({
      exists: true,
      version: j?.rev ?? null,
      name: j?.name ?? null,
      states: Array.isArray(j?.states) ? j.states.length : null,
    }),
  },
  github_repo: {
    label: "GitHub",
    url: (name) => `https://api.github.com/repos/${name}`,
    extract: (j) => ({
      exists: true,
      version: j?.default_branch ?? null,
      name: j?.full_name ?? null,
    }),
  },
};

const CHECK_TYPES = [
  "signature_verification",
  "hash_comparison",
  "registry_lookup",
  "regex_match",
  "timestamp_validation",
  "json_schema_conformance",
];

// Per-check-type recommendation strings, recorded in the v_gate so the
// receipt states what the deterministic result means, not just pass/fail.
const RECOMMENDATION = {
  signature_verification: {
    act: "signature verifies against the declared key",
    halt: "signature does not verify against the declared key",
  },
  hash_comparison: {
    act: "computed digest matches the claimed digest",
    halt: "computed digest does not match the claimed digest",
  },
  registry_lookup: {
    act: "entry exists in the declared registry and metadata matches",
    halt: "entry absent from the declared registry or metadata mismatch",
  },
  regex_match: {
    act: "value matches the declared pattern",
    halt: "value does not match the declared pattern",
  },
  timestamp_validation: {
    act: "timestamp falls within the declared bounds",
    halt: "timestamp falls outside the declared bounds",
  },
  json_schema_conformance: {
    act: "document conforms to the declared schema",
    halt: "document does not conform to the declared schema",
  },
};

// ── helpers ────────────────────────────────────────────────────────

function sha256Hex(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function normalizeDigest(s) {
  if (typeof s !== "string") return null;
  return s.trim().toLowerCase().replace(/^sha-?256[-:]/, "").replace(/^sha-?512[-:]/, "");
}

function fail(reason, detail) {
  return { ok: false, reason, detail: detail ?? null };
}

function pass(evidence) {
  return { ok: true, evidence };
}

// Bounded fetch — deterministic checks must not hang the request. No
// redirects followed to non-allowlisted hosts (the catalog URLs are fixed).
async function boundedFetchJson(url, timeoutMs = 6000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      signal: ctl.signal,
      redirect: "follow",
      headers: { accept: "application/json", "user-agent": "agentoracle-verify-facts/0.1" },
    });
    if (!r.ok) return { http_status: r.status, json: null };
    return { http_status: r.status, json: await r.json() };
  } finally {
    clearTimeout(t);
  }
}

// ── check type implementations ─────────────────────────────────────
// Each returns { ok: boolean, evidence?: object, reason?: string }.
// Each is a pure function of its declared inputs (plus, for
// registry_lookup, a declared authoritative registry — which is why that
// check records the fetched snapshot in the evidence so the receipt
// remains auditable even after the registry changes).

async function checkSignatureVerification(input) {
  const { signing_input_b64u, signature_b64u, public_jwk, algorithm } = input || {};
  if (!signing_input_b64u || !signature_b64u || !public_jwk) {
    return fail(
      "missing_inputs",
      "signature_verification requires signing_input_b64u, signature_b64u, public_jwk"
    );
  }
  const alg = algorithm || public_jwk.alg || "EdDSA";
  if (alg !== "EdDSA") {
    return fail(
      "unsupported_algorithm",
      `only EdDSA (Ed25519) is shipped in v0.1; got ${alg}`
    );
  }
  if (public_jwk.kty !== "OKP" || public_jwk.crv !== "Ed25519" || !public_jwk.x) {
    return fail("invalid_jwk", "public_jwk must be an Ed25519 OKP JWK with an x parameter");
  }
  let keyObj;
  try {
    keyObj = crypto.createPublicKey({ key: public_jwk, format: "jwk" });
  } catch (e) {
    return fail("invalid_jwk", e.message);
  }
  const sigBuf = Buffer.from(
    signature_b64u.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (signature_b64u.length % 4)) % 4),
    "base64"
  );
  const msgBuf = Buffer.from(signing_input_b64u, "ascii");
  let verified = false;
  try {
    verified = crypto.verify(null, msgBuf, keyObj, sigBuf);
  } catch (e) {
    return fail("verify_error", e.message);
  }
  return verified
    ? pass({
        algorithm: alg,
        kid: public_jwk.kid ?? null,
        signing_input_sha256: `sha256-${sha256Hex(msgBuf)}`,
        signature_length: sigBuf.length,
      })
    : fail("signature_invalid", "Ed25519 verification returned false");
}

function checkHashComparison(input) {
  const { claimed_digest, content, content_b64u, algorithm } = input || {};
  if (!claimed_digest) return fail("missing_inputs", "hash_comparison requires claimed_digest");
  if (content == null && content_b64u == null) {
    return fail("missing_inputs", "hash_comparison requires content or content_b64u");
  }
  const algo = (algorithm || "sha256").toLowerCase();
  if (algo !== "sha256" && algo !== "sha512") {
    return fail("unsupported_algorithm", `only sha256 and sha512 are shipped; got ${algo}`);
  }
  const buf =
    content_b64u != null
      ? Buffer.from(
          content_b64u.replace(/-/g, "+").replace(/_/g, "/") +
            "=".repeat((4 - (content_b64u.length % 4)) % 4),
          "base64"
        )
      : Buffer.from(typeof content === "string" ? content : jcs(content), "utf8");
  const computed = crypto.createHash(algo).update(buf).digest("hex");
  const claimed = normalizeDigest(claimed_digest);
  // Timing-safe compare on equal-length hex strings.
  const equal =
    claimed != null &&
    claimed.length === computed.length &&
    crypto.timingSafeEqual(Buffer.from(claimed, "hex"), Buffer.from(computed, "hex"));
  return equal
    ? pass({
        algorithm: algo,
        computed_digest: `${algo}-${computed}`,
        content_length: buf.length,
        content_canonicalized: content_b64u == null && typeof content !== "string",
      })
    : fail("digest_mismatch", `claimed ${claimed} != computed ${computed}`);
}

async function checkRegistryLookup(input) {
  const { registry, identifier, expect } = input || {};
  if (!registry || !identifier) {
    return fail("missing_inputs", "registry_lookup requires registry and identifier");
  }
  const entry = REGISTRY_CATALOG[registry];
  if (!entry) {
    return fail(
      "unsupported_registry",
      `registry must be one of: ${Object.keys(REGISTRY_CATALOG).join(", ")}`
    );
  }
  let result;
  try {
    result = await boundedFetchJson(entry.url(identifier));
  } catch (e) {
    return fail("registry_unreachable", `${entry.label}: ${e.message}`);
  }
  if (result.http_status === 404 || result.json == null) {
    return fail("entry_not_found", `${entry.label} returned HTTP ${result.http_status}`);
  }
  if (result.http_status !== 200) {
    return fail("registry_error", `${entry.label} returned HTTP ${result.http_status}`);
  }
  const extracted = entry.extract(result.json);
  // Optional metadata assertion — the caller declares what it expects and
  // the check confirms it, so the receipt attests a specific fact rather
  // than bare existence.
  if (expect && typeof expect === "object") {
    for (const [k, v] of Object.entries(expect)) {
      if (extracted[k] !== v) {
        return fail(
          "metadata_mismatch",
          `expected ${k}=${JSON.stringify(v)}, registry has ${JSON.stringify(extracted[k])}`
        );
      }
    }
  }
  return pass({
    registry,
    registry_label: entry.label,
    identifier,
    observed: extracted,
    // The snapshot digest makes the lookup auditable after the registry
    // moves on: a later reader can see exactly what we read.
    response_sha256: `sha256-${sha256Hex(Buffer.from(JSON.stringify(result.json), "utf8"))}`,
    observed_at: new Date().toISOString(),
  });
}

function checkRegexMatch(input) {
  const { value, pattern, flags } = input || {};
  if (typeof value !== "string" || typeof pattern !== "string") {
    return fail("missing_inputs", "regex_match requires string value and string pattern");
  }
  if (pattern.length > 512) {
    return fail("pattern_too_long", "pattern must be <= 512 characters");
  }
  if (value.length > 100000) {
    return fail("value_too_long", "value must be <= 100000 characters");
  }
  const safeFlags = (flags || "").replace(/[^imsu]/g, "");
  let re;
  try {
    re = new RegExp(pattern, safeFlags);
  } catch (e) {
    return fail("invalid_pattern", e.message);
  }
  // Bounded execution — a catastrophic-backtracking pattern must not
  // hang the request. Node has no regex timeout, so we cap input size
  // above and reject nested unbounded quantifiers here.
  if (/(\(\?:?[^)]*[+*]\)[+*])|(\[[^\]]*\][+*]){2,}/.test(pattern)) {
    return fail(
      "pattern_rejected",
      "pattern contains nested unbounded quantifiers (catastrophic backtracking risk)"
    );
  }
  const matched = re.test(value);
  return matched
    ? pass({
        pattern,
        flags: safeFlags,
        value_sha256: `sha256-${sha256Hex(Buffer.from(value, "utf8"))}`,
        value_length: value.length,
      })
    : fail("no_match", "value does not match the declared pattern");
}

function checkTimestampValidation(input) {
  const { timestamp, not_before, not_after } = input || {};
  if (!timestamp) return fail("missing_inputs", "timestamp_validation requires timestamp");
  if (!not_before && !not_after) {
    return fail("missing_inputs", "timestamp_validation requires not_before and/or not_after");
  }
  const t = Date.parse(timestamp);
  if (Number.isNaN(t)) return fail("invalid_timestamp", `cannot parse ${timestamp}`);
  const nb = not_before ? Date.parse(not_before) : null;
  const na = not_after ? Date.parse(not_after) : null;
  if (not_before && Number.isNaN(nb)) return fail("invalid_bound", `cannot parse not_before ${not_before}`);
  if (not_after && Number.isNaN(na)) return fail("invalid_bound", `cannot parse not_after ${not_after}`);
  if (nb != null && t < nb) return fail("before_lower_bound", `${timestamp} < ${not_before}`);
  if (na != null && t > na) return fail("after_upper_bound", `${timestamp} > ${not_after}`);
  return pass({
    timestamp: new Date(t).toISOString(),
    timestamp_ms: t,
    not_before: nb != null ? new Date(nb).toISOString() : null,
    not_after: na != null ? new Date(na).toISOString() : null,
  });
}

// Minimal JSON Schema subset validator — deliberately not a full
// implementation. Supports type / required / properties / enum /
// minimum / maximum / minLength / maxLength / pattern / items.
// A schema using unsupported keywords is REJECTED rather than
// silently passing, so a caller never gets a signed receipt for a
// check we did not actually perform.
const SUPPORTED_SCHEMA_KEYWORDS = new Set([
  "type", "required", "properties", "enum", "minimum", "maximum",
  "minLength", "maxLength", "pattern", "items", "additionalProperties",
  "$schema", "title", "description",
]);

function collectUnsupportedKeywords(schema, found = new Set()) {
  if (schema == null || typeof schema !== "object") return found;
  if (Array.isArray(schema)) {
    for (const s of schema) collectUnsupportedKeywords(s, found);
    return found;
  }
  for (const k of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(k)) found.add(k);
  }
  if (schema.properties && typeof schema.properties === "object") {
    for (const s of Object.values(schema.properties)) collectUnsupportedKeywords(s, found);
  }
  if (schema.items) collectUnsupportedKeywords(schema.items, found);
  return found;
}

function jsonType(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (Number.isInteger(v)) return "integer";
  return typeof v;
}

function validateAgainstSchema(doc, schema, path = "$") {
  const errs = [];
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = jsonType(doc);
    const ok = types.some((t) => (t === "number" ? actual === "number" || actual === "integer" : t === actual));
    if (!ok) errs.push(`${path}: expected type ${types.join("|")}, got ${actual}`);
  }
  if (schema.enum && !schema.enum.some((e) => jcs(e) === jcs(doc))) {
    errs.push(`${path}: value not in enum`);
  }
  if (typeof doc === "number") {
    if (schema.minimum != null && doc < schema.minimum) errs.push(`${path}: ${doc} < minimum ${schema.minimum}`);
    if (schema.maximum != null && doc > schema.maximum) errs.push(`${path}: ${doc} > maximum ${schema.maximum}`);
  }
  if (typeof doc === "string") {
    if (schema.minLength != null && doc.length < schema.minLength) errs.push(`${path}: shorter than minLength`);
    if (schema.maxLength != null && doc.length > schema.maxLength) errs.push(`${path}: longer than maxLength`);
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern).test(doc)) errs.push(`${path}: does not match pattern`);
      } catch {
        errs.push(`${path}: invalid pattern in schema`);
      }
    }
  }
  if (doc && typeof doc === "object" && !Array.isArray(doc)) {
    for (const r of schema.required || []) {
      if (!(r in doc)) errs.push(`${path}: missing required property "${r}"`);
    }
    if (schema.properties) {
      for (const [k, sub] of Object.entries(schema.properties)) {
        if (k in doc) errs.push(...validateAgainstSchema(doc[k], sub, `${path}.${k}`));
      }
      if (schema.additionalProperties === false) {
        for (const k of Object.keys(doc)) {
          if (!(k in schema.properties)) errs.push(`${path}: additional property "${k}" not allowed`);
        }
      }
    }
  }
  if (Array.isArray(doc) && schema.items) {
    doc.forEach((item, i) => errs.push(...validateAgainstSchema(item, schema.items, `${path}[${i}]`)));
  }
  return errs;
}

function checkJsonSchemaConformance(input) {
  const { document, schema } = input || {};
  if (document === undefined || schema == null || typeof schema !== "object") {
    return fail("missing_inputs", "json_schema_conformance requires document and inline schema object");
  }
  const unsupported = collectUnsupportedKeywords(schema);
  if (unsupported.size > 0) {
    return fail(
      "unsupported_schema_keywords",
      `schema uses keywords outside the shipped subset: ${[...unsupported].join(", ")}. ` +
        `Supported: ${[...SUPPORTED_SCHEMA_KEYWORDS].join(", ")}`
    );
  }
  const errs = validateAgainstSchema(document, schema);
  return errs.length === 0
    ? pass({
        schema_sha256: `sha256-${sha256Hex(Buffer.from(jcs(schema), "utf8"))}`,
        document_sha256: `sha256-${sha256Hex(Buffer.from(jcs(document), "utf8"))}`,
        keywords_applied: [...new Set(Object.keys(schema).filter((k) => SUPPORTED_SCHEMA_KEYWORDS.has(k)))].sort(),
      })
    : fail("schema_violation", errs.slice(0, 10).join("; "));
}

const CHECK_IMPL = {
  signature_verification: checkSignatureVerification,
  hash_comparison: checkHashComparison,
  registry_lookup: checkRegistryLookup,
  regex_match: checkRegexMatch,
  timestamp_validation: checkTimestampValidation,
  json_schema_conformance: checkJsonSchemaConformance,
};

// Input-shape gate. A claim is "deterministic" only if the declared check
// type is shipped AND the inputs it needs are present. This is what makes
// the 422 honest: we reject before doing any work, and the error names
// exactly what was missing.
function checkTypeIsResolvable(check_type, input) {
  if (!CHECK_TYPES.includes(check_type)) {
    return { resolvable: false, why: `unknown check_type "${check_type}"` };
  }
  const required = {
    signature_verification: ["signing_input_b64u", "signature_b64u", "public_jwk"],
    hash_comparison: ["claimed_digest"],
    registry_lookup: ["registry", "identifier"],
    regex_match: ["value", "pattern"],
    timestamp_validation: ["timestamp"],
    json_schema_conformance: ["document", "schema"],
  }[check_type];
  const missing = required.filter((k) => input == null || input[k] === undefined);
  if (missing.length > 0) {
    return { resolvable: false, why: `check_type "${check_type}" requires: ${missing.join(", ")}` };
  }
  return { resolvable: true };
}

// ── receipt assembly ───────────────────────────────────────────────

function buildDeterministicPayload({ checks, results, subject, agent_id }) {
  const allPassed = results.every((r) => r.ok);
  const verdict = allPassed ? "act" : "halt";
  const now = new Date();
  const iso = now.toISOString();

  const check_results = checks.map((c, i) => {
    const r = results[i];
    const base = {
      check_type: c.check_type,
      outcome: r.ok ? "pass" : "fail",
      recommendation: RECOMMENDATION[c.check_type][r.ok ? "act" : "halt"],
    };
    if (r.ok) base.evidence = r.evidence;
    else {
      base.failure_reason = r.reason;
      if (r.detail) base.failure_detail = r.detail;
    }
    return base;
  });

  const payload = {
    agent_id: agent_id || "did:ao:verify-facts:anonymous",
    check_mode: "deterministic",
    check_results,
    check_types_applied: [...new Set(checks.map((c) => c.check_type))].sort(),
    envelope_kind: "verification.v0.3+composed",
    receipt_version: "0.3.0-composed",
    signature_meta: {
      agentoracle_jwks_url: "https://agentoracle.co/.well-known/jwks.json",
    },
    subject,
    timestamp: iso,
    timestamp_ms: now.getTime(),
    v_gate: {
      // Deterministic checks are not probabilistic. Confidence is 1.0 by
      // construction — the check either resolved or it did not, and a
      // check that could not resolve returns 422 rather than a low score.
      confidence: 1.0,
      issuer: "agentoracle.co",
      mapping_hash: AO_MAPPING_HASH,
      mapping_id: AO_MAPPING_ID,
      // Deterministic-tier rule catalog, distinct from judgment policy.
      deterministic_mapping_id: DETERMINISTIC_MAPPING_ID,
      signed_at: iso,
      // No adversarial pass on a lookup — there is no judgment to contest.
      v_adversarial_result: "n/a",
      verdict,
    },
  };
  return { payload, verdict };
}

function signPayload(payload) {
  const canonical = jcs(payload);
  const canonical_bytes = Buffer.from(canonical, "utf8");
  const payloadB64u = b64uEncode(canonical_bytes);
  const protectedHeader = {
    alg: "EdDSA",
    kid: COMPOSED_KID,
    typ: "application/vnd.verification.v0.3+composed+jws",
  };
  const protectedB64u = b64uEncode(JSON.stringify(protectedHeader));
  const signingInput = Buffer.from(protectedB64u + "." + payloadB64u, "ascii");
  const sig = crypto.sign(null, signingInput, getPrivateKey());
  return {
    jws: {
      payload: payloadB64u,
      signatures: [{ protected: protectedB64u, signature: b64uEncode(sig) }],
    },
    canonical_sha256: `sha256-${sha256Hex(canonical_bytes)}`,
    canonical_bytes_length: canonical_bytes.length,
  };
}

// ── route ──────────────────────────────────────────────────────────

function registerVerifyFacts(app) {
  // GET /v1/verify-facts — catalog discovery. Docs pull the shipped check
  // types from here so the page cannot drift from what the endpoint does.
  app.get("/v1/verify-facts", (_req, res) => {
    res.status(200).json({
      endpoint: "/v1/verify-facts",
      check_mode: "deterministic",
      description:
        "For claims that are lookups, not judgments. No LLM in the trust chain. " +
        "Returns the same JWS envelope as /v1/compose, verifiable offline with the same published JWKS.",
      supported_check_types: CHECK_TYPES,
      supported_registries: Object.keys(REGISTRY_CATALOG),
      deterministic_mapping_id: DETERMINISTIC_MAPPING_ID,
      rejection: {
        status: 422,
        error: "claim_not_deterministic",
        note: "No LLM fallback. Move to POST /v1/compose or POST /evaluate for judgment.",
      },
      kid: COMPOSED_KID,
      jwks_url: "https://agentoracle.co/.well-known/jwks.json",
    });
  });

  // POST /v1/verify-facts
  //
  // Request:
  //   {
  //     "subject": { "claim_hash": "sha256-…", "skill_hash": "sha256-…" },
  //     "agent_id": "did:ao:…",                       // optional
  //     "checks": [
  //       { "check_type": "hash_comparison", "input": { … } },
  //       { "check_type": "registry_lookup", "input": { … } }
  //     ]
  //   }
  //
  // Response 200: { jws, canonical_sha256, verdict, check_mode, check_results }
  // Response 422: { error: "claim_not_deterministic", … }
  app.post("/v1/verify-facts", async (req, res) => {
    const started = Date.now();
    try {
      const body = req.body || {};
      const checks = body.checks;

      if (!Array.isArray(checks) || checks.length === 0) {
        return res.status(400).json({
          error: "missing_or_invalid_checks",
          message: "checks must be a non-empty array of { check_type, input }",
          supported_check_types: CHECK_TYPES,
        });
      }
      if (checks.length > 20) {
        return res.status(400).json({
          error: "too_many_checks",
          message: "max 20 checks per request",
        });
      }

      // ── 422 gate. Every check must be resolvable BEFORE any work runs.
      // Partial execution then falling back would break the tier promise.
      const unresolvable = [];
      for (const [i, c] of checks.entries()) {
        const verdict = checkTypeIsResolvable(c?.check_type, c?.input);
        if (!verdict.resolvable) unresolvable.push({ index: i, reason: verdict.why });
      }
      if (unresolvable.length > 0) {
        return res.status(422).json({
          error: "claim_not_deterministic",
          reason:
            "Claim cannot be resolved by any deterministic check type in the current catalog. " +
            "Consider POST /v1/compose (judgment mode) or POST /evaluate.",
          unresolvable,
          supported_check_types: CHECK_TYPES,
          supported_registries: Object.keys(REGISTRY_CATALOG),
          // Explicit: this endpoint does not silently escalate to a model.
          llm_fallback: false,
        });
      }

      // ── run the checks. No LLM path exists in any branch below.
      const results = [];
      for (const c of checks) {
        const impl = CHECK_IMPL[c.check_type];
        const r = await impl(c.input);
        results.push(r);
      }

      // A check that errored on its own inputs (rather than legitimately
      // failing) is a 422, not a signed halt — we must not sign a receipt
      // asserting "this claim is false" when we actually could not check it.
      const inputErrors = results
        .map((r, i) => ({ r, i }))
        .filter(
          ({ r }) =>
            !r.ok &&
            [
              "missing_inputs",
              "unsupported_algorithm",
              "invalid_jwk",
              "unsupported_registry",
              "invalid_pattern",
              "pattern_too_long",
              "pattern_rejected",
              "value_too_long",
              "invalid_timestamp",
              "invalid_bound",
              "unsupported_schema_keywords",
              "verify_error",
              "registry_unreachable",
              "registry_error",
            ].includes(r.reason)
        );
      if (inputErrors.length > 0) {
        return res.status(422).json({
          error: "claim_not_deterministic",
          reason:
            "One or more checks could not be executed as declared. No receipt is issued for an " +
            "unexecutable check — a signed halt would misrepresent an inability to check as a negative finding.",
          unexecutable: inputErrors.map(({ r, i }) => ({
            index: i,
            check_type: checks[i].check_type,
            reason: r.reason,
            detail: r.detail,
          })),
          supported_check_types: CHECK_TYPES,
          llm_fallback: false,
        });
      }

      const subject = body.subject || {};
      if (!subject.claim_hash) {
        return res.status(400).json({
          error: "missing_subject_claim_hash",
          message: "subject.claim_hash is required so the receipt binds to a specific claim",
        });
      }

      const { payload, verdict } = buildDeterministicPayload({
        checks,
        results,
        subject,
        agent_id: body.agent_id,
      });
      const signed = signPayload(payload);

      return res.status(200).json({
        ...signed,
        verdict,
        check_mode: "deterministic",
        check_types_applied: payload.check_types_applied,
        check_results: payload.check_results,
        kid: COMPOSED_KID,
        envelope_kind: "verification.v0.3+composed",
        jwks_url: "https://agentoracle.co/.well-known/jwks.json",
        elapsed_ms: Date.now() - started,
      });
    } catch (err) {
      console.error("[/v1/verify-facts] error:", err);
      return res.status(500).json({ error: err.message || "verify_facts_internal_error" });
    }
  });
}

export {
  registerVerifyFacts,
  CHECK_TYPES,
  REGISTRY_CATALOG,
  DETERMINISTIC_MAPPING_ID,
  // exported for the conformance-vector generator
  buildDeterministicPayload,
  checkTypeIsResolvable,
  CHECK_IMPL,
};
