// ═══════════════════════════════════════════════════════════════════
//  /v1/v_gate — AgentOracle sibling endpoint for v0.3+composed envelopes
//
//  Wires into AgentTrust's /v1/compose orchestrator. Takes an inbound
//  canonical-payload template (with the v_gate field empty), computes
//  the AO verdict, slots it in, JCS-canonicalizes the result, signs
//  with the production composed-envelope kid, and returns the v_gate
//  block + canonical bytes + JWS signature entry. AgentTrust
//  independently re-canonicalizes for the mutual byte-identical check
//  before attaching its own signature and shipping the 2-signer JWS.
//
//  Conformance suite: TKCollective/agentoracle-receipt-spec#2
//  Schema: verification.v0.3+composed (Pote-approved 2026-06-21)
// ═══════════════════════════════════════════════════════════════════

import crypto from "node:crypto";

const COMPOSED_KID = "ao-composed-2026-06-ed25519-c3abfce3";
const COMPOSED_PUBLIC_JWK = {
  crv: "Ed25519",
  x: "FxtN-CSBgykTp3BgFxRrAkxNURIwnmSfRTwfvXBmBSo",
  kty: "OKP",
  kid: COMPOSED_KID,
  alg: "EdDSA",
  use: "sig",
};

// Stable AO mapping pointer for v0.3+composed traffic.
//
// The mapping hash is NOT a constant. It is derived at boot from the bytes of
// the published mapping document, which the entrypoint loads from disk and
// injects via registerVGateCompose({ mappingBytes }). This module deliberately
// does not read the file itself: @vercel/node does not reliably bundle sibling
// JSON into an imported module's filesystem (see the CONFORMANCE_SAMPLE note
// below), and index.js already loads those exact bytes to serve /mappings/.
// One set of bytes, one hash, one source of truth.
//
// This replaces a hard-coded literal that never matched any mapping document.
// Because it was a module constant, it was stamped into every receipt signed by
// /v1/compose and /v1/v_gate, not just into a fixture — so every one of those
// receipts carried a mapping binding no relying party could resolve. The same
// defect class was found in the entrypoint by Msebenzi and fixed there on
// 2026-07-28; this module kept its own stale copy. Deriving it removes the
// possibility of the two drifting again.
//
// Fail loudly, never fall back: a process that cannot establish which mapping
// document it is binding to has nothing honest to sign.
const AO_MAPPING_ID = "agentoracle-v0.3-2026-05-30";
let AO_MAPPING_HASH = null;

/**
 * initMappingBinding — derive the content address from the mapping bytes.
 * Throws rather than defaulting. Idempotent for identical bytes; a second call
 * with different bytes is a hard error, because two mapping documents cannot
 * both be the one this process signs against.
 */
function initMappingBinding(mappingBytes) {
  if (!mappingBytes || typeof mappingBytes.length !== "number" || mappingBytes.length === 0) {
    throw new Error(
      "v_gate_compose: mappingBytes is required — cannot derive v_gate.mapping_hash. " +
      "Pass registerVGateCompose(app, { mappingBytes }) with the bytes of " +
      AO_MAPPING_ID + " as loaded from disk."
    );
  }
  const hex = crypto.createHash("sha256").update(mappingBytes).digest("hex");
  if (!/^[0-9a-f]{64}$/.test(hex)) {
    throw new Error(`v_gate_compose: derived mapping hash is not 64-hex: ${hex}`);
  }
  const derived = "sha256-" + hex;
  if (AO_MAPPING_HASH !== null && AO_MAPPING_HASH !== derived) {
    throw new Error(
      `v_gate_compose: mapping binding already initialised to ${AO_MAPPING_HASH}, ` +
      `refusing to rebind to ${derived}`
    );
  }
  AO_MAPPING_HASH = derived;
  console.log(`[v_gate_compose] mapping binding derived: ${AO_MAPPING_ID} -> ${AO_MAPPING_HASH}`);
  return AO_MAPPING_HASH;
}

/**
 * requireMappingHash — call at every signing site. Refuses to return a value
 * that was never derived, so an unbound process cannot sign a receipt whose
 * mapping binding is a guess.
 */
function requireMappingHash() {
  if (AO_MAPPING_HASH === null) {
    throw new Error(
      "v_gate_compose: refusing to sign — mapping binding was never derived. " +
      "registerVGateCompose must be called with { mappingBytes } before any signing route runs."
    );
  }
  return AO_MAPPING_HASH;
}

// RFC 7468 / RFC 8410 — load an Ed25519 raw seed (base64url) into a
// node:crypto KeyObject usable with sign().
function loadEd25519PrivateKey(b64uSeed) {
  const seed = Buffer.from(
    b64uSeed.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (b64uSeed.length % 4)) % 4),
    "base64"
  );
  if (seed.length !== 32) {
    throw new Error(
      `expected 32-byte Ed25519 seed, got ${seed.length} bytes — check AO_COMPOSED_ED25519_PRIVKEY env var`
    );
  }
  // PKCS#8 wrapper for raw Ed25519 private seed (RFC 8410 §7).
  const pkcs8 = Buffer.concat([
    Buffer.from("302e020100300506032b657004220420", "hex"),
    seed,
  ]);
  return crypto.createPrivateKey({ key: pkcs8, format: "der", type: "pkcs8" });
}

let cachedPrivateKey = null;
function getPrivateKey() {
  if (cachedPrivateKey) return cachedPrivateKey;
  const raw = process.env.AO_COMPOSED_ED25519_PRIVKEY;
  if (!raw) {
    throw new Error(
      "AO_COMPOSED_ED25519_PRIVKEY env var not set — /v1/v_gate cannot sign"
    );
  }
  cachedPrivateKey = loadEd25519PrivateKey(raw.trim());
  return cachedPrivateKey;
}

// base64url helpers (RFC 7515 §2).
function b64uEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function b64uDecode(s) {
  return Buffer.from(
    s.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (s.length % 4)) % 4),
    "base64"
  );
}

// RFC 8785 JCS canonicalization — domain-scoped to the composed envelope
// payload shape (ASCII keys, ISO timestamps, hex digests, integer ms,
// floating confidence). Identical to verify.mjs / verify.py in the
// conformance suite — DO NOT diverge without also updating those.
function jcs(value) {
  if (value === null) return "null";
  if (value === true) return "true";
  if (value === false) return "false";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("JCS forbids non-finite numbers");
    }
    if (Number.isInteger(value)) return String(value);
    return String(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(jcs).join(",") + "]";
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort((a, b) => {
      const ab = Buffer.from(a, "utf16le");
      const bb = Buffer.from(b, "utf16le");
      return Buffer.compare(ab, bb);
    });
    return (
      "{" +
      keys.map((k) => JSON.stringify(k) + ":" + jcs(value[k])).join(",") +
      "}"
    );
  }
  throw new Error(`JCS: unsupported type ${typeof value}`);
}

// AND_PRESENT composition rule (Pote-approved 2026-06-21).
// Absent siblings don't contribute; any present-halt collapses to halt.
function recomposeDecision(payload) {
  const verdicts = [];
  if (payload.v_gate) verdicts.push(payload.v_gate.verdict);
  if (payload.v_gate_skill) verdicts.push(payload.v_gate_skill.verdict);
  if (payload.screen_ref) verdicts.push(payload.screen_ref.verdict);
  if (verdicts.length === 0) return "halt";
  return verdicts.every((v) => v === "act") ? "act" : "halt";
}

// Domain-specific v_gate verdict computation. Hook this up to whatever
// AO's existing /v_gate evaluator is — for now this is a deterministic
// stub returning "act" for any well-formed input. Joe to replace the
// `evaluateVerdict` call with the real AO policy engine.
function evaluateVerdict({ claim_hash, mcp_content, mapping_context }) {
  if (!claim_hash || typeof claim_hash !== "string") {
    return { verdict: "halt", reason: "missing_or_invalid_claim_hash" };
  }
  if (!claim_hash.startsWith("sha256-")) {
    return { verdict: "halt", reason: "claim_hash_format" };
  }
  // Stub: real implementation pulls from AO's policy engine. For the
  // wire-up phase this returns act for any well-formed claim_hash.
  return { verdict: "act", confidence: 0.87 };
}

// AgentTrust orchestration constants (used by /v1/compose).
const AT_BASE_URL = process.env.AT_BASE_URL || "https://agenttrust.uk";

// Mycelium Provider constants for the temporal-precedence anchor sibling.
// AgentOracle is a declared Mycelium Provider per giskard09's confirmation on
// autogen#7353 (2026-06-28). Once /payg/account/self-certify activates trail
// submission, /v1/compose attaches anchor.method='on-chain' with a Mycelium
// trail reference; until then the anchor sibling stays ABSENT (not null) per
// the absent-not-null grammar.
const MYCELIUM_PROVIDER_URL = process.env.MYCELIUM_PROVIDER_URL || "https://argentum.rgiskard.xyz";
const MYCELIUM_API_KEY = process.env.MYCELIUM_API_KEY || "";
const MYCELIUM_SERVICE_ID = process.env.MYCELIUM_SERVICE_ID || "agentoracle-v1";
const MYCELIUM_SELF_CERTIFIED =
  process.env.MYCELIUM_SELF_CERTIFIED === "true" ||
  process.env.MYCELIUM_SELF_CERTIFIED === "1";

// In-process cache of the most recent trail returned by the Mycelium Provider
// for the canonical_sha256 we just signed. Populated by submitTrailAsync() and
// read by the next /v1/compose call when the trail has confirmed on chain.
const trailCache = new Map(); // canonical_sha256 -> { method, reference, anchor_block_time, precedence, recompute_cmd }

async function submitTrailAsync(canonical_sha256, canonical_bytes_b64u, outcome_ts_ms, screen_ref, payload_subject) {
  // Fire-and-forget submission to the Mycelium Provider. Failures are silent
  // by design — the anchor sibling stays absent until a successful confirmation
  // lands. We never fabricate anchor metadata.
  //
  // Endpoint: /nexus/trail (on-chain anchor track) when we have a screen_ref
  // preimage to authenticate via action_ref recomputation. Falls back to
  // /external/trail (karma-only, no on-chain anchor) when api_key is configured
  // and no screen_ref is present — still useful for karma accrual but anchor
  // sibling stays absent because there's no Arbitrum confirmation to cite.
  if (!MYCELIUM_SELF_CERTIFIED) return;
  try {
    let endpoint, body;
    if (screen_ref && screen_ref.action_ref && screen_ref.screen) {
      // NEXUS-format receipt: auth is action_ref recomputation from preimage,
      // no Ed25519 signature carried (the composed envelope already carries
      // three Ed25519 sigs against the canonical bytes).
      endpoint = `${MYCELIUM_PROVIDER_URL}/nexus/trail`;
      // Field name `timestamp` (not `ts`) per giskard09/argentum-core
      // profiles/jcs-rfc8785-action-ref-v1 (commit e76be64, 2026-06-29):
      // canonicalization is content-addressed and field set is
      // {action_type, agent_id, scope, timestamp}, timestamp as string.
      body = {
        packet_version: "1.0",
        canonicalization_profile_id:
          "8c7f71754e3daae1a0390d5e0287d51097d011e40df36bf15cad5c0f47efa05a",
        action_ref: screen_ref.action_ref,
        service: MYCELIUM_SERVICE_ID,
        preimage: {
          agent_id: screen_ref.screen.agent_id,
          action_type: screen_ref.screen.action_type,
          scope: screen_ref.screen.scope,
          timestamp: screen_ref.screen.timestamp,
        },
        payment_hash: payload_subject?.claim_hash || canonical_sha256,
        output_hash: canonical_sha256,
        hash_algo: "SHA-256",
        preimage_format: "jcs",
        timestamp: outcome_ts_ms,
      };
    } else if (MYCELIUM_API_KEY) {
      // Karma-only path — no on-chain anchor surfaces from this call.
      endpoint = `${MYCELIUM_PROVIDER_URL}/external/trail`;
      body = {
        api_key: MYCELIUM_API_KEY,
        action_ref: canonical_sha256.replace(/^sha256-/, ""),
      };
    } else {
      return;
    }
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) return;
    const j = await r.json();
    const trail_id = j?.trail_id || j?.mycelium_trail_id;
    if (!trail_id) return;
    // Poll GET /trails/{trail_id} for confirmation. POST returns committed but
    // anchor=pending; GET returns tx_hash + anchor timestamp once Arbitrum
    // confirms. Anchor sibling only populates when tx_hash is set AND the
    // block timestamp strictly precedes outcome_ts_ms.
    let tx_hash = null;
    let anchor_block_time = null;
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 10_000));
      try {
        const g = await fetch(`${MYCELIUM_PROVIDER_URL}/trails/${trail_id}`);
        if (!g.ok) continue;
        const gj = await g.json();
        if (gj?.tx_hash && typeof gj.timestamp === "number") {
          tx_hash = gj.tx_hash;
          anchor_block_time = gj.timestamp;
          break;
        }
      } catch {
        // keep polling
      }
    }
    if (!tx_hash || typeof anchor_block_time !== "number") return;
    // Strict precedence: block_time(seconds) * 1000 < outcome_ts_ms.
    // Same-block case is rejected.
    const precedence =
      typeof outcome_ts_ms === "number" && anchor_block_time * 1000 < outcome_ts_ms;
    trailCache.set(canonical_sha256, {
      method: "on-chain",
      tier: "on-chain", // babyblueviper1 autogen#7353: discloses which clock the anchor rests on
      reference: trail_id,
      tx_hash,
      anchor_block_time,
      precedence,
      recompute_cmd: `curl -s ${MYCELIUM_PROVIDER_URL}/mycelium/trails/${trail_id}/verify_chain`,
    });
  } catch {
    // Silent. Anchor stays absent.
  }
}

// Wire-up gate. Default OFF: the composed endpoints do not issue while their
// verdict path is a stub. Set STUB_ISSUANCE=allow ONLY in a private test
// environment that does not hold the production signing key.
const STUB_ISSUANCE_ENABLED = process.env.STUB_ISSUANCE === "allow";

// ── SIGNING-ORACLE CLOSURE (2026-08-28) ────────────────────────────────────
// /v1/sign and /v1/sign/batch sign caller-supplied canonical bytes with the
// production issuer key. Both were reachable with no authentication.
//
// Verified 2026-08-28: a fabricated payload for a claim nothing evaluated,
// submitted to /v1/sign/batch, came back signed under COMPOSED_KID. The
// resulting envelope passes the published verifier AND the full
// draft-krausz-verification-state Section 4.3 recompute, because a forger
// controls the inputs and can make them mutually consistent. That is a forgery
// oracle for this receipt format: while it is open, anyone can mint an envelope
// this issuer did not issue, and non-repudiation — the property the format
// exists to provide — does not hold.
//
// There is no key-validation layer at the origin: authentication for the paid
// tier lives in the Zuplo gateway, which is why these routes were never meant
// to be reachable directly. So the gate is a shared secret the gateway (or a
// coordinated partner) presents, and it FAILS CLOSED: if the secret is not
// configured, the routes refuse rather than sign. An unconfigured signer that
// signs anything is the condition being fixed, so it cannot be the default.
//
// This is necessary but NOT sufficient. See the kid-conflation note in
// agenttrust_integration_impact.md: the same COMPOSED_KID signs both receipts
// where AgentOracle evaluated the claim (/evaluate) and receipts where it only
// signed bytes a caller supplied (/v1/sign*). A verifier cannot tell those
// apart from the receipt alone. Separating the kid is the structural fix and it
// is not in this change.
const SIGNING_SECRET = process.env.AO_SIGNING_SECRET || "";

function requireSigningAuth(req, res) {
  if (!SIGNING_SECRET) {
    res.status(503).json({
      status: "not_issuing",
      reason: "signing_auth_not_configured",
      detail:
        "This endpoint signs caller-supplied bytes with the production issuer " +
        "key and refuses to operate without an authentication secret " +
        "configured. No signature is produced.",
    });
    return false;
  }
  const got = req.get && req.get("authorization");
  if (got !== `Bearer ${SIGNING_SECRET}`) {
    res.status(401).json({
      status: "not_issuing",
      reason: "signing_auth_required",
      detail:
        "Signing caller-supplied bytes with the AgentOracle issuer key requires " +
        "authorization. No signature is produced. Note that a signature from " +
        "this endpoint attests only that these bytes were signed, not that " +
        "AgentOracle evaluated the claim they describe.",
    });
    return false;
  }
  return true;
}

function registerVGateCompose(app, { mappingBytes } = {}) {
  // Derive before any route is registered: if the binding cannot be
  // established, this throws at boot rather than at first signature.
  initMappingBinding(mappingBytes);

  // POST /v1/sign/batch
  //
  // Bulk sign primitive: N canonical_bytes_b64u in, N signature entries out.
  // Useful for high-frequency agent loops that need to sign many envelopes
  // in a single round-trip.
  //
  // Request:  { "canonical_bytes_b64u": ["...", "...", ...] }
  // Response: { "signatures": [ { protected, signature, kid }, ... ], "kid": "..." }
  app.post("/v1/sign/batch", async (req, res) => {
    try {
      if (!requireSigningAuth(req, res)) return;
      const body = req.body || {};
      const list = body.canonical_bytes_b64u;
      if (!Array.isArray(list) || list.length === 0) {
        return res.status(400).json({
          error: "missing_or_invalid_canonical_bytes_b64u",
          message: "canonical_bytes_b64u must be a non-empty array of base64url strings",
        });
      }
      if (list.length > 100) {
        return res.status(400).json({ error: "batch_size_limit", message: "max 100 items per batch" });
      }
      const key = getPrivateKey();
      const protectedHeader = {
        alg: "EdDSA",
        kid: COMPOSED_KID,
        typ: "application/vnd.verification.v0.3+composed+jws",
      };
      const protectedB64u = b64uEncode(JSON.stringify(protectedHeader));
      const out = [];
      for (const bytes of list) {
        if (!bytes || typeof bytes !== "string") {
          return res.status(400).json({ error: "item_invalid", message: "every item must be a base64url string" });
        }
        const signingInput = Buffer.from(protectedB64u + "." + bytes, "ascii");
        const signature = crypto.sign(null, signingInput, key);
        out.push({
          protected: protectedB64u,
          signature: b64uEncode(signature),
          kid: COMPOSED_KID,
        });
      }
      return res.status(200).json({ signatures: out, kid: COMPOSED_KID, count: out.length });
    } catch (err) {
      console.error("[/v1/sign/batch] error:", err);
      return res.status(500).json({ error: err.message || "sign_batch_internal_error" });
    }
  });

  // POST /v1/compose
  //
  // Server-side orchestrator for the 2-signer composed envelope (AO + AT).
  // Caller supplies {claim_hash, mcp_content}. AO computes its v_gate, asks
  // AgentTrust for v_gate_skill via /v1/compose, builds the canonical payload
  // with both blocks (preserving AT extension fields), JCS canonicalizes, then
  // signs locally and also asks AT to sign the same canonical bytes via its
  // /v1/sign endpoint. Returns the assembled 2-signer JWS general serialization.
  //
  // Pote (AgentTrust) approved the Option B flow on 2026-06-23.
  //
  // Request:  { "claim_hash": "sha256-...", "mcp_content": { ... } }
  // Response: {
  //   "jws": { "payload": "<b64u canonical>", "signatures": [AT, AO] },
  //   "canonical_sha256": "sha256-<hex>",
  //   "composed_decision": "act" | "halt",
  //   "signers": [{issuer, kid}, ...]
  // }
  // Static conformance-sample envelope for babyblueviper1's harness referee.
  // Bare GET /v1/compose can't mint a valid screen_ref, so the referee call
  // returns anchor=null and the row reads pending. This endpoint serves a
  // pre-generated anchored envelope (2-signer + screen_ref block + Mycelium
  // on-chain anchor with precedence:true) so the harness has a deterministic
  // recompute source. canonical_bytes_utf8 + signatures are byte-stable;
  // anchor proof is recompute-verifiable via the published recompute_cmd.
  // Inlined as a JSON literal because Vercel @vercel/node doesn't bundle
  // sibling JSON files into the function's filesystem by default.
//
// ⚠ TWO COPIES EXIST AND THEY CAN DRIFT. These bytes are duplicated in
// ./conformance_sample.json at the repo root. THE ENDPOINT SERVES THIS LITERAL,
// NOT THAT FILE — editing the file alone changes nothing a caller can see.
// Change both together, or the repo will claim one thing while the endpoint
// serves another. That is exactly how the previous sample went stale.
//
// This sample is a genuine, unmodified /evaluate receipt: real signature, real
// mapping binding matching the published mapping document byte-for-byte, and the
// full signed intermediates (v_verdict, v_confidence, v_adversarial_result,
// v_recommendation, v_gate_threshold) so a relying party can actually run the
// recompute sequence against it. It replaces a sample whose mapping_hash was a
// hand-typed placeholder and which omitted the intermediates entirely —
// reported by Pablo Ferreiro (giskard09) after running the recompute procedure
// we published for that purpose.
//
// Single-issuer. A co-signed two-issuer sample follows when AgentTrust re-signs
// a corrected envelope.
  const CONFORMANCE_SAMPLE = JSON.parse('{"jws":{"payload":"eyJjb21wb3NlZF9kZWNpc2lvbiI6ImFjdCIsImNvbXBvc2VkX2RlY2lzaW9uX3J1bGUiOiJBTkRfUFJFU0VOVCIsImVudmVsb3BlX2tpbmQiOiJ2ZXJpZmljYXRpb24udjAuMytjb21wb3NlZCIsInJlY2VpcHRfdmVyc2lvbiI6IjAuMy4wLWNvbXBvc2VkIiwic2lnbmF0dXJlX21ldGEiOnsiYWdlbnRvcmFjbGVfandrc191cmwiOiJodHRwczovL2FnZW50b3JhY2xlLmNvLy53ZWxsLWtub3duL2p3a3MuanNvbiJ9LCJzdWJqZWN0Ijp7ImNsYWltX2hhc2giOiJzaGEyNTYtYjU1MTBjNTk2OGIzMjJlYTE5NTE4ZWQ4YzU3ZTc5MWQ2OWVjYzUyNDRmNTNkZmI4M2IwNzVjNmMwOGI3ODU3YyIsInNraWxsX2hhc2giOiJzaGEyNTYtMGE3ODI2Mzk3Njc5MGRmNmU3NmNkOWYzZjQ0MWJmNWEzYjVjM2E4MmUzNDZiNWFjYTQzZTQ5NjI2ODgxZDdiMCJ9LCJ0aW1lc3RhbXAiOiIyMDI2LTA4LTI4VDAzOjM3OjE4LjQ1OFoiLCJ0aW1lc3RhbXBfbXMiOjE3ODc4ODgyMzg0NTgsInZfZ2F0ZSI6eyJjb25maWRlbmNlIjoxLCJpc3N1ZXIiOiJhZ2VudG9yYWNsZS5jbyIsIm1hcHBpbmdfaGFzaCI6InNoYTI1Ni0wYTc4MjYzOTc2NzkwZGY2ZTc2Y2Q5ZjNmNDQxYmY1YTNiNWMzYTgyZTM0NmI1YWNhNDNlNDk2MjY4ODFkN2IwIiwibWFwcGluZ19pZCI6ImFnZW50b3JhY2xlLXYwLjMtMjAyNi0wNS0zMCIsInNpZ25lZF9hdCI6IjIwMjYtMDgtMjhUMDM6Mzc6MTguNDU4WiIsInZfYWR2ZXJzYXJpYWxfcmVzdWx0IjoicmVzaWxpZW50Iiwidl9jb25maWRlbmNlIjoxLCJ2X2dhdGVfdGhyZXNob2xkIjowLjcsInZfcmVjb21tZW5kYXRpb24iOiJjb25maWRlbnRfc3VwcG9ydGVkIiwidl92ZXJkaWN0Ijoic3VwcG9ydGVkIiwidmVyZGljdCI6ImFjdCJ9fQ","signatures":[{"protected":"eyJhbGciOiJFZERTQSIsImtpZCI6ImFvLWNvbXBvc2VkLTIwMjYtMDYtZWQyNTUxOS1jM2FiZmNlMyIsInR5cCI6ImFwcGxpY2F0aW9uL3ZuZC52ZXJpZmljYXRpb24udjAuMytjb21wb3NlZCtqd3MifQ","signature":"sbVc7re5Ow4MRP-2CO33_ygKuxsF_ncV_V0dz-yU_TWjiBLt-Z-z4UqNChcXmYb2aMmymGhbLTvBI9jGYkuVBw"}]},"canonical_sha256":"sha256-818541d893b0b5c3e8f1004da793d241491aeeeecc52042c4a9b416d16d4137a","canonical_bytes_length":868,"composed_decision":"act","signers":[{"kid":"ao-composed-2026-06-ed25519-c3abfce3","issuer":"https://agentoracle.co/.well-known/jwks.json"}],"governance":{"envelope_hash":"818541d893b0b5c3e8f1004da793d241491aeeeecc52042c4a9b416d16d4137a","canonical_bytes_utf8":"{\\"composed_decision\\":\\"act\\",\\"composed_decision_rule\\":\\"AND_PRESENT\\",\\"envelope_kind\\":\\"verification.v0.3+composed\\",\\"receipt_version\\":\\"0.3.0-composed\\",\\"signature_meta\\":{\\"agentoracle_jwks_url\\":\\"https://agentoracle.co/.well-known/jwks.json\\"},\\"subject\\":{\\"claim_hash\\":\\"sha256-b5510c5968b322ea19518ed8c57e791d69ecc5244f53dfb83b075c6c08b7857c\\",\\"skill_hash\\":\\"sha256-0a78263976790df6e76cd9f3f441bf5a3b5c3a82e346b5aca43e49626881d7b0\\"},\\"timestamp\\":\\"2026-08-28T03:37:18.458Z\\",\\"timestamp_ms\\":1787888238458,\\"v_gate\\":{\\"confidence\\":1,\\"issuer\\":\\"agentoracle.co\\",\\"mapping_hash\\":\\"sha256-0a78263976790df6e76cd9f3f441bf5a3b5c3a82e346b5aca43e49626881d7b0\\",\\"mapping_id\\":\\"agentoracle-v0.3-2026-05-30\\",\\"signed_at\\":\\"2026-08-28T03:37:18.458Z\\",\\"v_adversarial_result\\":\\"resilient\\",\\"v_confidence\\":1,\\"v_gate_threshold\\":0.7,\\"v_recommendation\\":\\"confident_supported\\",\\"v_verdict\\":\\"supported\\",\\"verdict\\":\\"act\\"}}","mapping_document":"https://agentoracle.co/mappings/agentoracle-v0.3-2026-05-30.json","mapping_sha256":"sha256-0a78263976790df6e76cd9f3f441bf5a3b5c3a82e346b5aca43e49626881d7b0","recompute_procedure":"draft-krausz-verification-state-01 Section 4.3 steps 1-8","issuer_count":1,"note":"Single-issuer snapshot of a genuine /evaluate receipt. Every field is as signed; nothing is synthesized."},"elapsed_ms":76,"note":"Single-issuer snapshot of a genuine /evaluate receipt. A co-signed two-issuer sample follows when AgentTrust re-signs a corrected envelope."}');
  app.get("/v1/conformance/sample", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(CONFORMANCE_SAMPLE);
  });

  app.post("/v1/compose", async (req, res) => {
    const start = Date.now();

// ── WIRE-UP CLOSURE (2026-08-28) ───────────────────────────────────────────
// This endpoint's AO verdict came from evaluateVerdict(), which is a stub: it
// returns act at a hard-coded confidence of 0.87 for any well-formed
// claim_hash, without reading the claim. It was reachable without
// authentication and signed with the production issuer key.
//
// It does not auth-gate. An authenticated stub verdict is still a stub verdict
// with our key on it, and a receipt is a non-repudiable commitment — issuing
// one for an evaluation that never happened is the same defect as the
// 2026-08-21 incident, chosen deliberately instead of by accident.
//
// So it stops issuing. Honest absence, mirroring the /evaluate 503: no
// confidence, no verdict, no recommendation, no receipt, no signature.
// Remove this block only together with the commit that replaces
// evaluateVerdict() with the real policy engine.
if (!STUB_ISSUANCE_ENABLED) {
  return res.status(503).json({
    status: "not_issuing",
    reason: "endpoint_in_wire_up",
    detail:
      "This endpoint is in wire-up and is not issuing signed receipts. The " +
      "verdict path is not yet connected to a verification engine, so any " +
      "receipt it produced would attest an evaluation that did not happen. " +
      "No verdict, confidence, or receipt is returned. Use POST /evaluate, " +
      "which performs a real evaluation and issues a receipt bound to it.",
    alternative: "POST /evaluate",
  });
}
    try {
      const { claim_hash, mcp_content, agent_id, timestamp_ms, screen_ref } = req.body || {};
      if (!claim_hash || typeof claim_hash !== "string") {
        return res.status(400).json({
          error: "missing_or_invalid_claim_hash",
          message: "claim_hash is required and must be a sha256-prefixed string",
        });
      }
      // Optional top-level action identity fields. When present, they become
      // top-level keys in the canonical payload so every co-signer (AO, AT,
      // Presidio screen_ref) attests the SAME action. The screen_ref preimage
      // (action-ref-v1) is derived from {agent_id, action_type, scope,
      // timestamp} — these two fields are the action's, not the screen's, so
      // they have to live above all sibling blocks.
      if (agent_id !== undefined && typeof agent_id !== "string") {
        return res.status(400).json({
          error: "invalid_agent_id",
          message: "agent_id must be a string (DID or URN) when supplied",
        });
      }
      if (timestamp_ms !== undefined) {
        if (typeof timestamp_ms !== "number" || !Number.isInteger(timestamp_ms) || timestamp_ms <= 0) {
          return res.status(400).json({
            error: "invalid_timestamp_ms",
            message: "timestamp_ms must be a positive integer (milliseconds since Unix epoch)",
          });
        }
      }

      // STEP 1: Call AT /v1/compose for v_gate_skill block.
      let atResp;
      try {
        const r = await fetch(`${AT_BASE_URL}/v1/compose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ claim_hash, mcp_content }),
        });
        if (!r.ok) {
          return res.status(502).json({
            error: "at_compose_failed",
            upstream_status: r.status,
            upstream_body: await r.text(),
          });
        }
        atResp = await r.json();
      } catch (err) {
        return res.status(502).json({ error: "at_unreachable", message: err.message });
      }
      const v_gate_skill = atResp?.payload?.v_gate_skill;
      const at_extensions = {
        subject: atResp?.payload?.subject,
        signature_meta: atResp?.payload?.signature_meta,
        receipt_version: atResp?.payload?.receipt_version,
      };
      if (!v_gate_skill) {
        return res.status(502).json({ error: "at_returned_no_v_gate_skill" });
      }

      // STEP 2: Compute AO v_gate verdict block.
      // signed_at is deterministic from top-level timestamp_ms when provided
      // so that identical inputs produce a byte-identical canonical envelope
      // and the same canonical_sha256 — required for trail-cache hits across
      // calls and for any external verifier reproducing the envelope from
      // request inputs. Falls back to wall-clock when timestamp_ms is absent.
      const aoVerdict = evaluateVerdict({ claim_hash, mcp_content });
      const v_gate = {
        issuer: "agentoracle.co",
        mapping_id: AO_MAPPING_ID,
        mapping_hash: requireMappingHash(),
        verdict: aoVerdict.verdict,
        signed_at:
          timestamp_ms !== undefined
            ? (() => {
                const d = new Date(timestamp_ms);
                const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
                return d.toISOString().replace(/\.\d{3}Z$/, `.${ms}Z`);
              })()
            : new Date().toISOString(),
      };
      if (aoVerdict.confidence !== undefined) v_gate.confidence = aoVerdict.confidence;
      if (aoVerdict.reason !== undefined) v_gate.reason = aoVerdict.reason;

      // STEP 2b: Validate optional screen_ref sibling block (Presidio leg).
      // Shape locked by vstantch on x402#2332 (2026-06-28): action-ref-v1
      // pointer with {issuer, verdict, screen:{agent_id, action_type, scope,
      // timestamp}, action_ref, mapping_id}. action_ref recomputes from JCS of
      // the screen object alone; the caller passes the full block verbatim,
      // we don't fabricate it.
      if (screen_ref !== undefined) {
        if (!screen_ref || typeof screen_ref !== "object" || Array.isArray(screen_ref)) {
          return res.status(400).json({ error: "invalid_screen_ref", message: "screen_ref must be an object" });
        }
        const required = ["issuer", "verdict", "screen", "action_ref", "mapping_id"];
        for (const k of required) {
          if (screen_ref[k] === undefined) {
            return res.status(400).json({ error: "invalid_screen_ref", message: `screen_ref.${k} required` });
          }
        }
        if (!screen_ref.screen || typeof screen_ref.screen !== "object") {
          return res.status(400).json({ error: "invalid_screen_ref", message: "screen_ref.screen must be an object" });
        }
        const screenReq = ["agent_id", "action_type", "scope", "timestamp"];
        for (const k of screenReq) {
          if (typeof screen_ref.screen[k] !== "string") {
            return res.status(400).json({ error: "invalid_screen_ref", message: `screen_ref.screen.${k} must be a string` });
          }
        }
        // Recompute action_ref locally — never trust the caller's emitted hash.
        const screenJcs = jcs(screen_ref.screen);
        const recomputed = crypto.createHash("sha256").update(screenJcs, "utf-8").digest("hex");
        if (recomputed !== screen_ref.action_ref) {
          return res.status(400).json({
            error: "screen_ref_action_ref_mismatch",
            message: "caller-supplied action_ref does not recompute from JCS(screen)",
            recomputed,
          });
        }
        // Bind to the top-level action identity — same instant AT and AO sign.
        if (agent_id !== undefined && screen_ref.screen.agent_id !== agent_id) {
          return res.status(400).json({
            error: "screen_ref_agent_id_mismatch",
            message: "screen_ref.screen.agent_id must equal top-level agent_id",
          });
        }
      }

      // STEP 3: Assemble canonical payload with all present sibling blocks.
      const verdicts = [v_gate.verdict, v_gate_skill.verdict].filter(Boolean);
      if (screen_ref) {
        // PII_BLOCKED is a halt-class verdict; only "act" / "PII_REDACTED" /
        // "clean-allow" compose to act under AND_PRESENT.
        const screenAct = screen_ref.verdict === "act" || screen_ref.verdict === "PII_REDACTED" || screen_ref.verdict === "clean-allow";
        verdicts.push(screenAct ? "act" : "halt");
      }
      const composed_decision =
        verdicts.length > 0 && verdicts.every((v) => v === "act") ? "act" : "halt";
      const payload = {
        envelope_kind: "verification.v0.3+composed",
        composed_decision,
        composed_decision_rule: "AND_PRESENT",
        v_gate,
        v_gate_skill,
        ...at_extensions,
      };
      if (screen_ref) payload.screen_ref = screen_ref;
      // Action identity fields go at the top level, above all sibling blocks.
      // RFC 3339 with three fractional digits derived deterministically from
      // timestamp_ms — the same encoding the Presidio screen_ref preimage uses
      // (vstantch x402#2332 2026-06-28). Keeps the act bound to a single
      // instant across AO, AT, and Presidio signatures.
      if (agent_id !== undefined) payload.agent_id = agent_id;
      if (timestamp_ms !== undefined) {
        payload.timestamp_ms = timestamp_ms;
        const d = new Date(timestamp_ms);
        const ms = String(d.getUTCMilliseconds()).padStart(3, "0");
        payload.timestamp = d.toISOString().replace(/\.\d{3}Z$/, `.${ms}Z`);
      }
      // Drop any AT extension keys that came back undefined.
      for (const k of Object.keys(payload)) {
        if (payload[k] === undefined) delete payload[k];
      }

      // STEP 4: JCS canonicalize.
      const canonical_bytes = Buffer.from(jcs(payload), "utf-8");
      const canonical_bytes_b64u = b64uEncode(canonical_bytes);
      const canonical_sha256 =
        "sha256-" + crypto.createHash("sha256").update(canonical_bytes).digest("hex");

      // STEP 5: AO signs the canonical bytes (locally).
      const aoProtected = {
        alg: "EdDSA",
        kid: COMPOSED_KID,
        typ: "application/vnd.verification.v0.3+composed+jws",
      };
      const aoProtectedB64u = b64uEncode(JSON.stringify(aoProtected));
      const aoSigningInput = Buffer.from(
        aoProtectedB64u + "." + canonical_bytes_b64u,
        "ascii"
      );
      const aoSigBytes = crypto.sign(null, aoSigningInput, getPrivateKey());
      const aoSigEntry = {
        protected: aoProtectedB64u,
        signature: b64uEncode(aoSigBytes),
      };

      // STEP 6: Ask AT to sign the same canonical bytes via /v1/sign.
      let atSigEntry;
      try {
        const r = await fetch(`${AT_BASE_URL}/v1/sign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ canonical_bytes_b64u }),
        });
        if (!r.ok) {
          return res.status(502).json({
            error: "at_sign_failed",
            upstream_status: r.status,
            upstream_body: await r.text(),
          });
        }
        const j = await r.json();
        atSigEntry = { protected: j.protected, signature: j.signature };
      } catch (err) {
        return res.status(502).json({ error: "at_sign_unreachable", message: err.message });
      }

      const elapsed_ms = Date.now() - start;

      // Helper: hex-encode a base64url string.
      const b64uToHex = (s) => b64uDecode(s).toString("hex");
      const envelope_hash_hex = canonical_sha256.replace(/^sha256-/, "");
      const ao_pub_hex = b64uToHex(COMPOSED_PUBLIC_JWK.x);
      const at_kid_decoded = JSON.parse(b64uDecode(atSigEntry.protected).toString());

      // Sign the envelope hash DIRECTLY with the same AO key so a conformance
      // verifier can check Ed25519(envelope_hash_raw_bytes) without parsing the
      // JWS signing input convention. The JWS signature in jws.signatures still
      // covers (protected || "." || payload) per RFC 7515; this is an additional
      // commitment over the same hash by the same key, exposed for harness checks.
      const envelope_hash_bytes = Buffer.from(envelope_hash_hex, "hex");
      const admission_sig = crypto.sign(null, envelope_hash_bytes, getPrivateKey());

      // AT cosigner identity — published key from agenttrust.uk JWKS, hardcoded
      // here for stable fixture-alone recompute (rpelevin autogen#7353 verifier
      // key-source binding: every cosigner block needs pubkey + pubkey_hash +
      // key_source so referees can verify multi-signer admission without an
      // out-of-band JWKS fetch). Resolution evidence stays externally
      // verifiable via the published_jwks URL for stale-key checks.
      const AT_PUBKEY_HEX = "98e73aa9d4c701092ccd3f3f450be9ce6293727b41087d5ff9dc83c2e2a91312";
      const AT_PUBKEY_HASH = crypto
        .createHash("sha256")
        .update(Buffer.from(AT_PUBKEY_HEX, "hex"))
        .digest("hex");
      const AT_JWKS_URL = "https://agenttrust.uk/.well-known/jwks.json";

      // Anchor sibling (autogen#7353 design, vstantch + babyblueviper1 + giskard09
      // converged). Three orthogonal axes — provenance (mycelium_trail_id),
      // freshness (ao_calibration.valid_until), precedence (anchor). The anchor
      // sibling carries {method, reference, recompute_cmd} when a Mycelium trail
      // has confirmed for THIS canonical action; otherwise the field is absent.
      // Never null. Never fabricated.
      //
      // Serverless-safe: we query the Mycelium provider directly via
      // GET /trails/verify?agent_id=&action_ref= on every call, since per-Lambda
      // in-process caches don't survive across Vercel invocations. The action_ref
      // (recomputed from screen_ref.screen JCS) is the stable identity across
      // calls with identical inputs; the trail is whatever the provider has
      // anchored for that (agent_id, action_ref) pair.
      // Synchronous submit + poll inside the request handler. Vercel's per-Lambda
      // in-process state and the provider's /trails/verify endpoint are both
      // unreliable for serverless reads, so the safe pattern is: POST the trail
      // now, then GET the returned trail_id in a tight poll loop. If anchor
      // confirms within budget, populate; otherwise stay absent.
      const CANONICALIZATION_PROFILE_ID =
        "8c7f71754e3daae1a0390d5e0287d51097d011e40df36bf15cad5c0f47efa05a";
      let anchor = null;
      if (MYCELIUM_SELF_CERTIFIED && screen_ref && screen_ref.action_ref && screen_ref.screen) {
        try {
          const submitR = await fetch(`${MYCELIUM_PROVIDER_URL}/nexus/trail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              packet_version: "1.0",
              canonicalization_profile_id:
                "8c7f71754e3daae1a0390d5e0287d51097d011e40df36bf15cad5c0f47efa05a",
              action_ref: screen_ref.action_ref,
              service: MYCELIUM_SERVICE_ID,
              preimage: {
                agent_id: screen_ref.screen.agent_id,
                action_type: screen_ref.screen.action_type,
                scope: screen_ref.screen.scope,
                timestamp: screen_ref.screen.timestamp,
              },
              payment_hash: payload.subject?.claim_hash || canonical_sha256,
              output_hash: canonical_sha256,
              hash_algo: "SHA-256",
              preimage_format: "jcs",
              timestamp: timestamp_ms || Date.now(),
            }),
          });
          if (submitR.ok) {
            const sj = await submitR.json();
            const trail_id = sj?.trail_id;
            if (trail_id) {
              // Poll GET /trails/{id} every 3s up to 24s.
              for (let i = 0; i < 8; i++) {
                try {
                  const gr = await fetch(`${MYCELIUM_PROVIDER_URL}/trails/${trail_id}`);
                  if (gr.ok) {
                    const gj = await gr.json();
                    if (gj?.tx_hash && typeof gj.timestamp === "number") {
                      const block_time_ms = gj.timestamp * 1000;
                      const outcome_ts_ms = timestamp_ms;
                      const precedence =
                        typeof outcome_ts_ms === "number" && block_time_ms < outcome_ts_ms;
                      anchor = {
                        method: "on-chain",
                        tier: "on-chain",
                        reference: trail_id,
                        tx_hash: gj.tx_hash,
                        anchor_block: gj.anchor_block,
                        anchor_block_time: gj.timestamp,
                        precedence,
                        canonicalization_profile_id: CANONICALIZATION_PROFILE_ID,
                        // Preimage exposure for end-to-end anchor-existence recompute
                        // (giskard09 commit b4508eb 2026-06-30; babyblueviper1
                        // acceptance criterion on autogen#7353: sha256(preimage_bytes)
                        // must reproduce the on-chain calldata arg AND be reconstructable
                        // from the trail's own public content). anchor_proof.preimage
                        // is the four-field action-ref preimage; SHA-256(JCS(preimage))
                        // = action_ref, which is what the Arbitrum tx commits to.
                        anchor_proof: gj.anchor_proof || null,
                        action_ref: gj.action_ref || null,
                        proof_url: `${MYCELIUM_PROVIDER_URL}/trails/${trail_id}`,
                        recompute_cmd: `curl -s ${MYCELIUM_PROVIDER_URL}/mycelium/trails/${trail_id}/verify_chain`,
                      };
                      break;
                    }
                  }
                } catch {
                  // keep polling
                }
                await new Promise((r) => setTimeout(r, 3000));
              }
            }
          }
        } catch {
          // Silent. Anchor stays absent if provider is unreachable.
        }
      }

      // Conformance-registry compatible governance block. Reports AO's signature
      // as the primary admission signer; co_signers discloses the multi-issuer
      // architecture. See babyblueviper1/preaction-governance-conformance.
      const governance = {
        envelope_hash: envelope_hash_hex,
        canonical_bytes_utf8: canonical_bytes.toString("utf-8"),
        verifier_pubkey: ao_pub_hex,
        signature: admission_sig.toString("hex"),
        sig_scheme: "ed25519-jcs",
        kid: COMPOSED_KID,
        co_signers: [
          {
            issuer: "agenttrust.uk",
            kid: at_kid_decoded.kid,
            pubkey: AT_PUBKEY_HEX,
            pubkey_hash: AT_PUBKEY_HASH,
            key_source: "published_jwks",
            jwks_url: AT_JWKS_URL,
            jws_signature: b64uToHex(atSigEntry.signature),
          },
        ],
      };
      if (anchor) governance.anchor = anchor; // absent-not-null grammar
      // Trail submission is now inline above (synchronous submit + poll). The
      // older fire-and-forget submitTrailAsync was Vercel-unsafe: per-Lambda
      // in-process caches don't survive across invocations.

      return res.status(200).json({
        jws: {
          payload: canonical_bytes_b64u,
          signatures: [atSigEntry, aoSigEntry],
        },
        canonical_sha256,
        canonical_bytes_length: canonical_bytes.length,
        composed_decision,
        signers: [
          { issuer: "agenttrust.uk", kid: at_kid_decoded.kid },
          { issuer: "agentoracle.co", kid: COMPOSED_KID },
        ],
        governance,
        elapsed_ms,
      });
    } catch (err) {
      console.error("[/v1/compose] error:", err);
      return res.status(500).json({ error: err.message || "compose_internal_error" });
    }
  });

  // POST /v1/sign
  //
  // Symmetric signing primitive paired with AgentTrust's /v1/sign. Takes
  // pre-canonicalized bytes, returns AO's JWS signature entry over them.
  // Used by orchestrators that build the composed canonical payload
  // themselves and need both signers to cover identical bytes.
  //
  // Request:  { "canonical_bytes_b64u": "..." }
  // Response: { "protected": "...", "signature": "...", "kid": "..." }
  app.post("/v1/sign", async (req, res) => {
    try {
      if (!requireSigningAuth(req, res)) return;
      const { canonical_bytes_b64u } = req.body || {};
      if (!canonical_bytes_b64u || typeof canonical_bytes_b64u !== "string") {
        return res.status(400).json({
          error: "missing_or_invalid_canonical_bytes_b64u",
          message:
            "canonical_bytes_b64u is required and must be a base64url-encoded string",
        });
      }
      // Validate it's actually base64url and parseable.
      const decoded = b64uDecode(canonical_bytes_b64u);
      if (decoded.length === 0) {
        return res.status(400).json({ error: "empty_canonical_bytes" });
      }

      const protectedHeader = {
        alg: "EdDSA",
        kid: COMPOSED_KID,
        typ: "application/vnd.verification.v0.3+composed+jws",
      };
      const protectedB64u = b64uEncode(JSON.stringify(protectedHeader));
      const signingInput = Buffer.from(
        protectedB64u + "." + canonical_bytes_b64u,
        "ascii"
      );
      const signature = crypto.sign(null, signingInput, getPrivateKey());
      return res.status(200).json({
        protected: protectedB64u,
        signature: b64uEncode(signature),
        kid: COMPOSED_KID,
      });
    } catch (err) {
      console.error("[/v1/sign] error:", err);
      return res.status(500).json({ error: err.message || "sign_internal_error" });
    }
  });

  // POST /v1/v_gate
  //
  // Request body:
  //   {
  //     "claim_hash": "sha256-...",                  required
  //     "mcp_content": { ... } | null,               optional
  //     "canonical_template": { ... } | null,        optional — the full
  //         payload AT proposes, with v_gate as null or absent. If
  //         provided, AO slots its v_gate into the template and signs
  //         over the resulting canonical bytes. If absent, AO builds a
  //         minimal payload itself.
  //     "mapping_context": { ... } | null            optional
  //   }
  //
  // Response (200):
  //   {
  //     "v_gate": { issuer, mapping_id, mapping_hash, verdict, signed_at },
  //     "canonical_bytes_b64u": "...",
  //     "signature_entry": { protected, signature },  RFC 7515 §7.2.1
  //     "kid": "ao-composed-2026-06-ed25519-aeae141a"
  //   }
  app.post("/v1/v_gate", async (req, res) => {
    try {

// ── WIRE-UP CLOSURE (2026-08-28) ───────────────────────────────────────────
// This endpoint's AO verdict came from evaluateVerdict(), which is a stub: it
// returns act at a hard-coded confidence of 0.87 for any well-formed
// claim_hash, without reading the claim. It was reachable without
// authentication and signed with the production issuer key.
//
// It does not auth-gate. An authenticated stub verdict is still a stub verdict
// with our key on it, and a receipt is a non-repudiable commitment — issuing
// one for an evaluation that never happened is the same defect as the
// 2026-08-21 incident, chosen deliberately instead of by accident.
//
// So it stops issuing. Honest absence, mirroring the /evaluate 503: no
// confidence, no verdict, no recommendation, no receipt, no signature.
// Remove this block only together with the commit that replaces
// evaluateVerdict() with the real policy engine.
if (!STUB_ISSUANCE_ENABLED) {
  return res.status(503).json({
    status: "not_issuing",
    reason: "endpoint_in_wire_up",
    detail:
      "This endpoint is in wire-up and is not issuing signed receipts. The " +
      "verdict path is not yet connected to a verification engine, so any " +
      "receipt it produced would attest an evaluation that did not happen. " +
      "No verdict, confidence, or receipt is returned. Use POST /evaluate, " +
      "which performs a real evaluation and issues a receipt bound to it.",
    alternative: "POST /evaluate",
  });
}
      const body = req.body || {};
      const { claim_hash, mcp_content, canonical_template, mapping_context } =
        body;

      // 0. Input validation — fail fast with a 400 before we touch crypto.
      if (!claim_hash || typeof claim_hash !== "string") {
        return res.status(400).json({
          error: "missing_or_invalid_claim_hash",
          message:
            "claim_hash is required and must be a sha256-prefixed string",
          example: { claim_hash: "sha256-<hex>", mcp_content: { tool: "..." } },
        });
      }

      // 1. Compute AO verdict.
      const verdictResult = evaluateVerdict({
        claim_hash,
        mcp_content,
        mapping_context,
      });

      // 2. Build the v_gate sibling block.
      const v_gate = {
        issuer: "agentoracle.co",
        mapping_id: AO_MAPPING_ID,
        mapping_hash: requireMappingHash(),
        verdict: verdictResult.verdict,
        signed_at: new Date().toISOString(),
      };
      if (verdictResult.confidence !== undefined) {
        v_gate.confidence = verdictResult.confidence;
      }
      if (verdictResult.reason !== undefined) {
        v_gate.reason = verdictResult.reason;
      }

      // 3. Compose the full payload.
      let payload;
      if (canonical_template && typeof canonical_template === "object") {
        payload = { ...canonical_template, v_gate };
        // Drop null v_gate field if AT sent one — the grammar requires
        // absent-not-null for unset sibling pointers.
        for (const k of [
          "v_gate_skill",
          "screen_ref",
          "mycelium_trail_id",
        ]) {
          if (payload[k] === null) delete payload[k];
        }
      } else {
        // Minimal payload — AT will need to extend with v_gate_skill
        // before re-canonicalizing on its end.
        payload = {
          envelope_kind: "verification.v0.3+composed",
          claim_hash,
          composed_decision_rule: "AND_PRESENT",
          v_gate,
        };
      }

      // 4. Recompute composed_decision (will only reflect AO's verdict
      //    at this stage; AT recomputes after slotting v_gate_skill).
      payload.composed_decision = recomposeDecision(payload);

      // 5. JCS canonicalize.
      const canonical = Buffer.from(jcs(payload), "utf-8");
      const canonical_bytes_b64u = b64uEncode(canonical);

      // 6. Sign with the JWS general-serialization signing input.
      const protectedHeader = {
        alg: "EdDSA",
        kid: COMPOSED_KID,
        typ: "application/vnd.verification.v0.3+composed+jws",
      };
      const protectedB64u = b64uEncode(JSON.stringify(protectedHeader));
      const signingInput = Buffer.from(
        protectedB64u + "." + canonical_bytes_b64u,
        "ascii"
      );
      const signature = crypto.sign(null, signingInput, getPrivateKey());

      return res.status(200).json({
        v_gate,
        composed_decision_preview: payload.composed_decision,
        canonical_bytes_b64u,
        signature_entry: {
          protected: protectedB64u,
          signature: b64uEncode(signature),
        },
        kid: COMPOSED_KID,
      });
    } catch (err) {
      console.error("[/v1/v_gate] error:", err);
      return res.status(500).json({
        error: err.message || "v_gate_internal_error",
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// /evaluate signed receipt (single AO issuer).
// Called by the /evaluate handler after aggregation completes, to attach
// a JWS-signed composed envelope to the response under `receipt`. Same
// signing key + JCS + typ as /v1/compose, but a single-signature line
// (no AT co-signature; /evaluate is a single-issuer receipt). Payload
// carries the v_gate block derived from real /evaluate aggregation,
// subject hashes tying the receipt to the specific claim text and the
// mapping ruleset, and v_gate.mapping_hash pinning the exact bytes of
// the mapping document that governed the verdict resolution per the
// recommendation_rules table.
//
// Threshold and gate_map both come from the mapping (0.7, gate_map
// authoritative) so callers cannot smuggle a permissive threshold into
// the receipt via the request. mapping_id equals AO_MAPPING_ID; the
// caller passes the sha256 of the mapping bytes served from disk.
// ═══════════════════════════════════════════════════════════════════

function signEvaluateReceipt({
  claim_text,
  mapping_hash_hex,
  v_confidence,
  v_verdict,
  v_adversarial_result,
  timestamp_ms,
}) {
  // ── Guardrails: fail closed on any malformed input rather than sign a
  // ── broken receipt. Matches the mapping's fail_closed clause.
  if (typeof claim_text !== "string" || claim_text.length === 0) {
    throw new Error("signEvaluateReceipt: claim_text must be non-empty string");
  }
  if (typeof mapping_hash_hex !== "string" || !/^[0-9a-f]{64}$/.test(mapping_hash_hex)) {
    throw new Error("signEvaluateReceipt: mapping_hash_hex must be 64-hex sha256");
  }
  const VALID_VERDICTS = new Set(["supported", "refuted", "unverifiable", "unknown"]);
  const VALID_ADV = new Set(["resilient", "vulnerable", "not_checked"]);
  if (!VALID_VERDICTS.has(v_verdict)) {
    throw new Error(`signEvaluateReceipt: invalid v_verdict "${v_verdict}"`);
  }
  if (!VALID_ADV.has(v_adversarial_result)) {
    throw new Error(`signEvaluateReceipt: invalid v_adversarial_result "${v_adversarial_result}"`);
  }
  if (typeof v_confidence !== "number" || !Number.isFinite(v_confidence) || v_confidence < 0 || v_confidence > 1) {
    throw new Error("signEvaluateReceipt: v_confidence must be finite 0..1");
  }

  // ── Threshold is a property of the mapping, NOT the caller. Requests
  // ── that pass min_confidence tune display behaviour in the evaluation
  // ── block; the receipt's v_gate.v_gate_threshold is authoritative and
  // ── comes from mapping-agentoracle-v0.3-2026-05-30.json (0.7).
  const V_GATE_THRESHOLD = 0.7;

  // ── Apply mapping.recommendation_rules in order to derive v_recommendation.
  let v_recommendation;
  if (v_verdict === "refuted") {
    v_recommendation = "refuted";                                  // rule 5
  } else if (v_verdict === "unverifiable" || v_verdict === "unknown") {
    v_recommendation = "unverifiable";                             // rule 6
  } else {
    // v_verdict === "supported"
    if (v_adversarial_result === "resilient" && v_confidence >= V_GATE_THRESHOLD) {
      v_recommendation = "confident_supported";                    // rule 1
    } else if (v_adversarial_result === "not_checked" && v_confidence >= V_GATE_THRESHOLD) {
      v_recommendation = "un_probed_not_cleared";                  // rule 2
    } else if (v_adversarial_result === "vulnerable") {
      v_recommendation = "vulnerable_supported";                   // rule 3
    } else if (
      (v_adversarial_result === "resilient" || v_adversarial_result === "not_checked") &&
      v_confidence < V_GATE_THRESHOLD
    ) {
      v_recommendation = "weak_supported";                         // rule 4
    } else {
      v_recommendation = "error";                                  // rule 7 fallback
    }
  }

  // ── gate_map: only confident_supported → act; all else → halt.
  const verdict = v_recommendation === "confident_supported" ? "act" : "halt";

  // ── Deterministic ISO timestamp derived from timestamp_ms so the same
  // ── inputs produce byte-identical canonical bytes (required for cache
  // ── hits and for external verifier reproducibility from raw inputs).
  const tsMs = typeof timestamp_ms === "number" ? timestamp_ms : Date.now();
  const tsDate = new Date(tsMs);
  const tsMsStr = String(tsDate.getUTCMilliseconds()).padStart(3, "0");
  const tsIso = tsDate.toISOString().replace(/\.\d{3}Z$/, `.${tsMsStr}Z`);

  // ── Subject: content-addressed hashes for the claim + the ruleset that
  // ── evaluated it. skill_hash IS the mapping document hash because for
  // ── /evaluate the "skill" that reduced multi-source signals to a
  // ── verdict is precisely the mapping's recommendation_rules table.
  const claim_hash =
    "sha256-" + crypto.createHash("sha256").update(claim_text, "utf-8").digest("hex");
  const skill_hash = "sha256-" + mapping_hash_hex;

  // ── v_gate block. All fields drawn from real aggregation inputs.
  // ── mapping_hash pins the ruleset bytes; verifiers can (a) fetch by
  // ── sha256, (b) hash the bytes, (c) confirm the bytes match the hash
  // ── embedded here — that is the content-addressing property.
  const v_gate = {
    confidence: v_confidence,
    issuer: "agentoracle.co",
    mapping_hash: "sha256-" + mapping_hash_hex,
    mapping_id: AO_MAPPING_ID,
    signed_at: tsIso,
    v_adversarial_result,
    v_confidence,
    v_gate_threshold: V_GATE_THRESHOLD,
    v_recommendation,
    v_verdict,
    verdict,
  };

  // ── Composed envelope payload (single-issuer form). No v_gate_skill or
  // ── screen_ref sibling blocks because /evaluate is a single AO issuer;
  // ── downstream aggregators can still append their own signatures by
  // ── re-serialising the same canonical_bytes and adding entries to
  // ── signatures[]. composed_decision equals v_gate.verdict here because
  // ── AND_PRESENT over a single present sibling is that sibling's verdict.
  const payload = {
    composed_decision: verdict,
    composed_decision_rule: "AND_PRESENT",
    envelope_kind: "verification.v0.3+composed",
    receipt_version: "0.3.0-composed",
    signature_meta: {
      agentoracle_jwks_url: "https://agentoracle.co/.well-known/jwks.json",
    },
    subject: { claim_hash, skill_hash },
    timestamp: tsIso,
    timestamp_ms: tsMs,
    v_gate,
  };

  // ── JCS canonicalize → utf-8 bytes → base64url payload.
  const canonical_bytes = Buffer.from(jcs(payload), "utf-8");
  const canonical_bytes_b64u = b64uEncode(canonical_bytes);
  const canonical_sha256 =
    "sha256-" + crypto.createHash("sha256").update(canonical_bytes).digest("hex");

  // ── Sign the JWS signing-input per RFC 7515 §5.1.
  const aoProtected = {
    alg: "EdDSA",
    kid: COMPOSED_KID,
    typ: "application/vnd.verification.v0.3+composed+jws",
  };
  const aoProtectedB64u = b64uEncode(JSON.stringify(aoProtected));
  const aoSigningInput = Buffer.from(
    aoProtectedB64u + "." + canonical_bytes_b64u,
    "ascii"
  );
  const aoSigBytes = crypto.sign(null, aoSigningInput, getPrivateKey());

  // ── JWS General Serialization (RFC 7515 §7.2.1) with one signature.
  const jws = {
    payload: canonical_bytes_b64u,
    signatures: [
      {
        protected: aoProtectedB64u,
        signature: b64uEncode(aoSigBytes),
      },
    ],
  };

  return {
    jws,
    canonical_sha256,
    canonical_bytes_length: canonical_bytes.length,
    kid: COMPOSED_KID,
    envelope_kind: "verification.v0.3+composed",
    verdict,
    v_recommendation,
  };
}

// Shared crypto/canonicalization primitives, exported so the deterministic
// tier (/v1/verify-facts) signs with the SAME jcs() implementation and the
// SAME key. There must be exactly one canonicalization implementation in
// this process — a second copy would silently diverge from verify.mjs /
// verify.py in the conformance suite.
export {
  registerVGateCompose,
  COMPOSED_KID,
  COMPOSED_PUBLIC_JWK,
  signEvaluateReceipt,
  jcs,
  b64uEncode,
  b64uDecode,
  getPrivateKey,
  AO_MAPPING_ID,
  initMappingBinding,
  requireMappingHash,
};
