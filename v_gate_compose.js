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
const AO_MAPPING_ID = "agentoracle-v0.3-2026-05-30";
const AO_MAPPING_HASH =
  "sha256-3b1f2d8e7a5c4b9f6e0a1d2c3b4a5e6f7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a";

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

function registerVGateCompose(app) {
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
        mapping_hash: AO_MAPPING_HASH,
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

export { registerVGateCompose, COMPOSED_KID, COMPOSED_PUBLIC_JWK };
