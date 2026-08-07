#!/usr/bin/env node
// Conformance-vector generator for the deterministic tier.
//
// Emits one vector per shipped check type (plus rejection vectors) so a
// second implementer can byte-match the deterministic path the same way
// argentum-core byte-matches the judgment path. Vectors are written to
// vectors/deterministic-v0.1/.
//
// Registry-lookup vectors are recorded from a live read and pinned by
// response_sha256; the vector documents the snapshot, not a promise that
// the registry never changes. A re-runner compares the *check logic*, not
// the upstream registry state.
//
// Usage:  node scripts/build-verify-facts-vectors.mjs
//         node scripts/build-verify-facts-vectors.mjs --offline   (skip registry)

import crypto from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { CHECK_IMPL, buildDeterministicPayload } from "../verify-facts.js";
import { jcs, b64uEncode } from "../v_gate_compose.js";

const OUT = new URL("../vectors/deterministic-v0.1/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const OFFLINE = process.argv.includes("--offline");
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");

// Deterministic Ed25519 keypair for the signature_verification vector.
// Seed is fixed so the vector is reproducible by anyone.
const VECTOR_SEED = Buffer.from(
  "9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60",
  "hex"
);
const pkcs8 = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), VECTOR_SEED]);
const vecPriv = crypto.createPrivateKey({ key: pkcs8, format: "der", type: "pkcs8" });
const vecPub = crypto.createPublicKey(vecPriv);
const vecJwk = { ...vecPub.export({ format: "jwk" }), alg: "EdDSA", use: "sig", kid: "vector-ed25519-v1" };

const VECTOR_SIGNING_INPUT = "eyJhbGciOiJFZERTQSJ9.eyJ2ZWN0b3IiOiJhZ2VudG9yYWNsZS1kZXRlcm1pbmlzdGljLXYwLjEifQ";
const vecSig = b64uEncode(crypto.sign(null, Buffer.from(VECTOR_SIGNING_INPUT, "ascii"), vecPriv));

const vectors = [
  {
    id: "det-001-signature-verification-pass",
    expect: "pass",
    check: {
      check_type: "signature_verification",
      input: {
        signing_input_b64u: VECTOR_SIGNING_INPUT,
        signature_b64u: vecSig,
        public_jwk: vecJwk,
        algorithm: "EdDSA",
      },
    },
  },
  {
    id: "det-002-signature-verification-fail",
    expect: "fail",
    check: {
      check_type: "signature_verification",
      input: {
        signing_input_b64u: VECTOR_SIGNING_INPUT,
        // one byte flipped
        signature_b64u: vecSig.slice(0, -2) + (vecSig.slice(-2) === "AA" ? "AB" : "AA"),
        public_jwk: vecJwk,
        algorithm: "EdDSA",
      },
    },
  },
  {
    id: "det-003-hash-comparison-pass",
    expect: "pass",
    check: {
      check_type: "hash_comparison",
      input: {
        content: "agentoracle deterministic tier conformance vector",
        claimed_digest:
          "sha256-" + sha256(Buffer.from("agentoracle deterministic tier conformance vector", "utf8")),
        algorithm: "sha256",
      },
    },
  },
  {
    id: "det-004-hash-comparison-fail",
    expect: "fail",
    check: {
      check_type: "hash_comparison",
      input: {
        content: "agentoracle deterministic tier conformance vector",
        claimed_digest: "sha256-" + "0".repeat(64),
        algorithm: "sha256",
      },
    },
  },
  {
    id: "det-005-regex-match-pass",
    expect: "pass",
    check: {
      check_type: "regex_match",
      input: { value: "sha256-abc123", pattern: "^sha256-[0-9a-f]+$", flags: "i" },
    },
  },
  {
    id: "det-006-regex-match-fail",
    expect: "fail",
    check: {
      check_type: "regex_match",
      input: { value: "md5-abc123", pattern: "^sha256-[0-9a-f]+$", flags: "i" },
    },
  },
  {
    id: "det-007-timestamp-validation-pass",
    expect: "pass",
    check: {
      check_type: "timestamp_validation",
      input: {
        timestamp: "2026-08-06T12:00:00.000Z",
        not_before: "2026-08-01T00:00:00.000Z",
        not_after: "2026-08-31T23:59:59.000Z",
      },
    },
  },
  {
    id: "det-008-timestamp-validation-fail",
    expect: "fail",
    check: {
      check_type: "timestamp_validation",
      input: {
        timestamp: "2026-09-15T12:00:00.000Z",
        not_before: "2026-08-01T00:00:00.000Z",
        not_after: "2026-08-31T23:59:59.000Z",
      },
    },
  },
  {
    id: "det-009-json-schema-conformance-pass",
    expect: "pass",
    check: {
      check_type: "json_schema_conformance",
      input: {
        document: { name: "agentoracle-receipt-verify", version: "0.0.1", verified: true },
        schema: {
          type: "object",
          required: ["name", "version"],
          properties: {
            name: { type: "string", minLength: 1 },
            version: { type: "string", pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$" },
            verified: { type: "boolean" },
          },
        },
      },
    },
  },
  {
    id: "det-010-json-schema-conformance-fail",
    expect: "fail",
    check: {
      check_type: "json_schema_conformance",
      input: {
        document: { name: "", version: "not-semver" },
        schema: {
          type: "object",
          required: ["name", "version"],
          properties: {
            name: { type: "string", minLength: 1 },
            version: { type: "string", pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$" },
          },
        },
      },
    },
  },
];

const registryVector = {
  id: "det-011-registry-lookup-pass",
  expect: "pass",
  check: {
    check_type: "registry_lookup",
    input: { registry: "pypi", identifier: "agentoracle-receipt-verify" },
  },
};

// Rejection vectors — these must NEVER produce a signed receipt.
const rejectionVectors = [
  {
    id: "det-r01-unknown-check-type",
    expect: "422",
    check: { check_type: "vibes_assessment", input: { claim: "this feels right" } },
    note: "Unknown check type. Must 422 with claim_not_deterministic, never fall back to a model.",
  },
  {
    id: "det-r02-missing-required-input",
    expect: "422",
    check: { check_type: "hash_comparison", input: { content: "no digest declared" } },
    note: "Shipped check type, missing required input. Must 422 before any work runs.",
  },
  {
    id: "det-r03-unsupported-schema-keyword",
    expect: "422",
    check: {
      check_type: "json_schema_conformance",
      input: { document: { a: 1 }, schema: { type: "object", allOf: [{ type: "object" }] } },
    },
    note:
      "Schema uses a keyword outside the shipped subset. Must 422 rather than silently pass — " +
      "a receipt must never attest a check we did not actually perform.",
  },
  {
    id: "det-r04-unsupported-registry",
    expect: "422",
    check: { check_type: "registry_lookup", input: { registry: "some-server-i-control", identifier: "x" } },
    note: "Registry outside the allowlist. Open fetch would make the check non-recomputable.",
  },
];

const out = { generated_at: new Date().toISOString(), vectors: [] };

async function run(v) {
  const impl = CHECK_IMPL[v.check.check_type];
  if (!impl) return { ...v, result: { ok: false, reason: "unknown_check_type" } };
  const result = await impl(v.check.input);
  return { ...v, result };
}

const all = [...vectors];
if (!OFFLINE) all.push(registryVector);

for (const v of all) {
  const ran = await run(v);
  const { payload, verdict } = buildDeterministicPayload({
    checks: [v.check],
    results: [ran.result],
    subject: { claim_hash: `sha256-${sha256(Buffer.from(v.id, "utf8"))}` },
    agent_id: "did:ao:conformance-vector:deterministic-v0.1",
  });
  // Timestamps are non-deterministic by nature — vectors pin the canonical
  // form with the timestamp fields REDACTED so a re-runner can compare the
  // stable portion byte-for-byte.
  const stable = { ...payload };
  delete stable.timestamp;
  delete stable.timestamp_ms;
  stable.v_gate = { ...stable.v_gate };
  delete stable.v_gate.signed_at;
  if (stable.check_results?.[0]?.evidence?.observed_at) {
    stable.check_results = structuredClone(stable.check_results);
    delete stable.check_results[0].evidence.observed_at;
  }
  const canonical = jcs(stable);
  out.vectors.push({
    id: v.id,
    expect: v.expect,
    note: v.note ?? null,
    input: v.check,
    outcome: ran.result.ok ? "pass" : "fail",
    failure_reason: ran.result.ok ? null : ran.result.reason,
    verdict,
    canonical_stable_utf8: canonical,
    canonical_stable_sha256: `sha256-${sha256(Buffer.from(canonical, "utf8"))}`,
  });
  console.log(`  ${v.id.padEnd(42)} ${ran.result.ok ? "pass" : "fail"}  verdict=${verdict}`);
}

for (const v of rejectionVectors) {
  out.vectors.push({
    id: v.id,
    expect: "422",
    note: v.note,
    input: v.check,
    outcome: "rejected",
    http_status: 422,
    error: "claim_not_deterministic",
    llm_fallback: false,
    canonical_stable_utf8: null,
    canonical_stable_sha256: null,
  });
  console.log(`  ${v.id.padEnd(42)} 422 (no receipt issued)`);
}

writeFileSync(new URL("vectors.json", OUT), JSON.stringify(out, null, 2) + "\n");
console.log(`\nWrote ${out.vectors.length} vectors -> vectors/deterministic-v0.1/vectors.json`);
