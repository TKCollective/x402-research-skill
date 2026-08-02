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

function registerVGateCompose(app) {
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
  const CONFORMANCE_SAMPLE = JSON.parse('{"jws":{"payload":"eyJhZ2VudF9pZCI6ImRpZDphbzpjb25mb3JtYW5jZS1zYW1wbGU6YWdlbnRvcmFjbGUtdjEiLCJjb21wb3NlZF9kZWNpc2lvbiI6ImhhbHQiLCJjb21wb3NlZF9kZWNpc2lvbl9ydWxlIjoiQU5EX1BSRVNFTlQiLCJlbnZlbG9wZV9raW5kIjoidmVyaWZpY2F0aW9uLnYwLjMrY29tcG9zZWQiLCJyZWNlaXB0X3ZlcnNpb24iOiIwLjMuMC1jb21wb3NlZCIsInNjcmVlbl9yZWYiOnsiYWN0aW9uX3JlZiI6Ijg2YWMxNjUzYTI0YmE5NjMxOWU0MmM1ODY5YmIxOGNiNWJhZTNhOWM4NGIzNzQ0ODUzYWM3YWYxZDEzOGU3MjYiLCJpc3N1ZXIiOiJwcmVzaWRpbyIsIm1hcHBpbmdfaWQiOiJwcmVzaWRpby14NDAyLXNjcmVlbi12MC4xLTIwMjYtMDYiLCJzY3JlZW4iOnsiYWN0aW9uX3R5cGUiOiJwaWlfc2NyZWVuIiwiYWdlbnRfaWQiOiJkaWQ6YW86Y29uZm9ybWFuY2Utc2FtcGxlOmFnZW50b3JhY2xlLXYxIiwic2NvcGUiOiJwcmVzaWRpbzp4NDAyLnNjcmVlbjpQSUlfQkxPQ0tFRDpFTUFJTF9BRERSRVNTLFVTX1NTTiIsInRpbWVzdGFtcCI6IjIwMjYtMDYtMzBUMTM6Mjg6MTguMDAwWiJ9LCJ2ZXJkaWN0IjoiUElJX0JMT0NLRUQifSwic2lnbmF0dXJlX21ldGEiOnsiYWdlbnRvcmFjbGVfandrc191cmwiOiJodHRwczovL2FnZW50b3JhY2xlLmNvLy53ZWxsLWtub3duL2p3a3MuanNvbiIsImFnZW50dHJ1c3Rfandrc191cmwiOiJodHRwczovL2FnZW50dHJ1c3QudWsvLndlbGwta25vd24vandrcy5qc29uIn0sInN1YmplY3QiOnsiY2xhaW1faGFzaCI6InNoYTI1Ni1jb25mb3JtYW5jZS1zYW1wbGUtYWdlbnRvcmFjbGUtdjEiLCJza2lsbF9oYXNoIjoic2hhMjU2LWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEifSwidGltZXN0YW1wIjoiMjAyNi0wNi0zMFQxMzoyODoxOC42NzRaIiwidGltZXN0YW1wX21zIjoxNzgyODI2MDk4Njc0LCJ2X2dhdGUiOnsiY29uZmlkZW5jZSI6MC44NywiaXNzdWVyIjoiYWdlbnRvcmFjbGUuY28iLCJtYXBwaW5nX2hhc2giOiJzaGEyNTYtM2IxZjJkOGU3YTVjNGI5ZjZlMGExZDJjM2I0YTVlNmY3YzhkOWUwYTFiMmMzZDRlNWY2YTdiOGM5ZDBlMWYyYSIsIm1hcHBpbmdfaWQiOiJhZ2VudG9yYWNsZS12MC4zLTIwMjYtMDUtMzAiLCJzaWduZWRfYXQiOiIyMDI2LTA2LTMwVDEzOjI4OjE4LjY3NFoiLCJ2ZXJkaWN0IjoiYWN0In0sInZfZ2F0ZV9za2lsbCI6eyJlbmRwb2ludF9yZXN1bHRzIjpbXSwiaXNzdWVyIjoiYWdlbnR0cnVzdCIsIm1hcHBpbmdfaWQiOiJhZ2VudHRydXN0LXYwLjMtMjAyNi0wNi0wNyIsIm1jcF9yZXN1bHRzIjpbXSwic2tpbGxfcmVzdWx0cyI6W3sic3RhdHVzIjoiY2xlYW4ifV0sInZfZ2F0ZV9tYXBwaW5nX2hhc2giOiJzaGEyNTYtMzA3ZGI5ZmFhMzY0Y2ZlMTQ5ZmI1MTIwZDA0NTExNzUxNzVkZTQwZDc0MzNjNDQ5MTViZmVjNTdhY2MxNmVjNCIsInZlcmRpY3QiOiJhY3QifX0","signatures":[{"protected":"eyJhbGciOiJFZERTQSIsImtpZCI6ImFnZW50dHJ1c3QtZWQyNTUxOS12MSIsInR5cCI6ImFwcGxpY2F0aW9uL3ZuZC52ZXJpZmljYXRpb24udjAuMytjb21wb3NlZCtqd3MifQ","signature":"BaPe-qC6Gcdn5OHmILs0UDW0tDaejSit6poj-LjBgd-3uA-mhUOiMwINTxujYtibbozhN1sCBj_9IgtbrEOEBQ"},{"protected":"eyJhbGciOiJFZERTQSIsImtpZCI6ImFvLWNvbXBvc2VkLTIwMjYtMDYtZWQyNTUxOS1jM2FiZmNlMyIsInR5cCI6ImFwcGxpY2F0aW9uL3ZuZC52ZXJpZmljYXRpb24udjAuMytjb21wb3NlZCtqd3MifQ","signature":"vmF3_KOZjYZIykvW-7BgRmALcDbMyc_CsEiw49p2mp32GRZAOGiDOqVKFpELFdQj8jZ86l-RVsiaxL_pnEGiDg"}]},"canonical_sha256":"sha256-b18238d6e425f239b5011e2a01f865f39173200e9c463708272c5fccecc8225d","canonical_bytes_length":1475,"composed_decision":"halt","signers":[{"issuer":"agenttrust.uk","kid":"agenttrust-ed25519-v1"},{"issuer":"agentoracle.co","kid":"ao-composed-2026-06-ed25519-c3abfce3"}],"governance":{"envelope_hash":"b18238d6e425f239b5011e2a01f865f39173200e9c463708272c5fccecc8225d","canonical_bytes_utf8":"{\\"agent_id\\":\\"did:ao:conformance-sample:agentoracle-v1\\",\\"composed_decision\\":\\"halt\\",\\"composed_decision_rule\\":\\"AND_PRESENT\\",\\"envelope_kind\\":\\"verification.v0.3+composed\\",\\"receipt_version\\":\\"0.3.0-composed\\",\\"screen_ref\\":{\\"action_ref\\":\\"86ac1653a24ba96319e42c5869bb18cb5bae3a9c84b3744853ac7af1d138e726\\",\\"issuer\\":\\"presidio\\",\\"mapping_id\\":\\"presidio-x402-screen-v0.1-2026-06\\",\\"screen\\":{\\"action_type\\":\\"pii_screen\\",\\"agent_id\\":\\"did:ao:conformance-sample:agentoracle-v1\\",\\"scope\\":\\"presidio:x402.screen:PII_BLOCKED:EMAIL_ADDRESS,US_SSN\\",\\"timestamp\\":\\"2026-06-30T13:28:18.000Z\\"},\\"verdict\\":\\"PII_BLOCKED\\"},\\"signature_meta\\":{\\"agentoracle_jwks_url\\":\\"https://agentoracle.co/.well-known/jwks.json\\",\\"agenttrust_jwks_url\\":\\"https://agenttrust.uk/.well-known/jwks.json\\"},\\"subject\\":{\\"claim_hash\\":\\"sha256-conformance-sample-agentoracle-v1\\",\\"skill_hash\\":\\"sha256-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\"},\\"timestamp\\":\\"2026-06-30T13:28:18.674Z\\",\\"timestamp_ms\\":1782826098674,\\"v_gate\\":{\\"confidence\\":0.87,\\"issuer\\":\\"agentoracle.co\\",\\"mapping_hash\\":\\"sha256-3b1f2d8e7a5c4b9f6e0a1d2c3b4a5e6f7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a\\",\\"mapping_id\\":\\"agentoracle-v0.3-2026-05-30\\",\\"signed_at\\":\\"2026-06-30T13:28:18.674Z\\",\\"verdict\\":\\"act\\"},\\"v_gate_skill\\":{\\"endpoint_results\\":[],\\"issuer\\":\\"agenttrust\\",\\"mapping_id\\":\\"agenttrust-v0.3-2026-06-07\\",\\"mcp_results\\":[],\\"skill_results\\":[{\\"status\\":\\"clean\\"}],\\"v_gate_mapping_hash\\":\\"sha256-307db9faa364cfe149fb5120d0451175175de40d7433c44915bfec57acc16ec4\\",\\"verdict\\":\\"act\\"}}","verifier_pubkey":"171b4df82481832913a7706017146b024c4d5112309e649f453c1fbd7066052a","signature":"f047a31029a8d1d428ef0c32c542eb0227521a95d2905c27e4fc49b8dec9bb23b4bcfdd31503d7669a2559ed313d6468d31d75245eadf2065c44bcd3f8cfe308","sig_scheme":"ed25519-jcs","kid":"ao-composed-2026-06-ed25519-c3abfce3","co_signers":[{"issuer":"agenttrust.uk","kid":"agenttrust-ed25519-v1","pubkey":"98e73aa9d4c701092ccd3f3f450be9ce6293727b41087d5ff9dc83c2e2a91312","pubkey_hash":"0d60ec39d3d5f69fee6141c4fd82a13edb224412ea2079bc699428936141b148","key_source":"published_jwks","jwks_url":"https://agenttrust.uk/.well-known/jwks.json","jws_signature":"05a3defaa0ba19c767e4e1e620bb345035b4b4369e8d28adea9a23f8b8c181dfb7b80fa68543a233020d4f1ba362d89b6e8ce1375b02063ffd220b5bac438405"}],"anchor":{"method":"on-chain","tier":"on-chain","reference":"9f390877-41e8-4b0c-8b03-7e8639323f75","tx_hash":"d1eddc5b6ccc487af4cdd67e6b8baf5690099062d8db0ffd55becef30fe14b42","anchor_block":478930660,"anchor_block_time":1782824299,"precedence":true,"canonicalization_profile_id":"8c7f71754e3daae1a0390d5e0287d51097d011e40df36bf15cad5c0f47efa05a","anchor_proof":{"preimage":{"action_type":"pii_screen","agent_id":"did:ao:conformance-sample:agentoracle-v1","scope":"presidio:x402.screen:PII_BLOCKED:EMAIL_ADDRESS,US_SSN","timestamp":"2026-06-30T13:28:18.000Z"},"hash_algo":"sha256","preimage_format":"jcs-rfc8785","action_ref_verified":true},"action_ref":"86ac1653a24ba96319e42c5869bb18cb5bae3a9c84b3744853ac7af1d138e726","proof_url":"https://argentum.rgiskard.xyz/trails/9f390877-41e8-4b0c-8b03-7e8639323f75","recompute_cmd":"curl -s https://argentum.rgiskard.xyz/mycelium/trails/9f390877-41e8-4b0c-8b03-7e8639323f75/verify_chain","anchor_status":"anchored"}},"elapsed_ms":663}');
  app.get("/v1/conformance/sample", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(CONFORMANCE_SAMPLE);
  });

  app.post("/v1/compose", async (req, res) => {
    const start = Date.now();
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
        mapping_hash: AO_MAPPING_HASH,
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

export { registerVGateCompose, COMPOSED_KID, COMPOSED_PUBLIC_JWK, signEvaluateReceipt };
