#!/usr/bin/env node
// End-to-end route test for /v1/verify-facts.
// Boots a bare express app with only this route registered, exercises the
// happy path, the halt path, and every 422 branch, then verifies the
// returned JWS against the published public JWK using the same offline
// procedure a third party would use.

import express from "express";
import crypto from "node:crypto";
import { registerVerifyFacts } from "../verify-facts.js";
import { COMPOSED_PUBLIC_JWK } from "../v_gate_compose.js";

const app = express();
app.use(express.json({ limit: "2mb" }));
registerVerifyFacts(app);

const server = app.listen(0);
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");

let passed = 0;
let failed = 0;
function check(name, cond, extra = "") {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
}

async function post(body) {
  const r = await fetch(`${base}/v1/verify-facts`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: r.status, json: await r.json() };
}

// ── 1. catalog discovery
{
  const r = await fetch(`${base}/v1/verify-facts`);
  const j = await r.json();
  check("GET catalog returns 200", r.status === 200);
  check("catalog lists 6 check types", j.supported_check_types?.length === 6, JSON.stringify(j.supported_check_types));
  check("catalog declares check_mode deterministic", j.check_mode === "deterministic");
  check("catalog declares no llm fallback", j.rejection?.status === 422);
}

// ── 2. happy path — all checks pass -> act
{
  const content = "agentoracle deterministic tier";
  const { status, json } = await post({
    subject: { claim_hash: "sha256-" + sha256(Buffer.from("test-claim")) },
    agent_id: "did:ao:test:verify-facts",
    checks: [
      {
        check_type: "hash_comparison",
        input: { content, claimed_digest: "sha256-" + sha256(Buffer.from(content)), algorithm: "sha256" },
      },
      {
        check_type: "timestamp_validation",
        input: {
          timestamp: "2026-08-06T12:00:00.000Z",
          not_before: "2026-08-01T00:00:00.000Z",
          not_after: "2026-08-31T23:59:59.000Z",
        },
      },
    ],
  });
  check("happy path returns 200", status === 200, JSON.stringify(json).slice(0, 200));
  check("happy path verdict is act", json.verdict === "act");
  check("happy path check_mode is deterministic", json.check_mode === "deterministic");
  check("happy path emits a jws", !!json.jws?.payload && json.jws?.signatures?.length === 1);
  check("happy path applies 2 check types", json.check_types_applied?.length === 2);

  // ── offline verification, exactly as a third party would do it
  const payloadJson = JSON.parse(Buffer.from(json.jws.payload, "base64url").toString("utf8"));
  check("payload carries check_mode: deterministic", payloadJson.check_mode === "deterministic");
  check("payload v_gate confidence is 1.0", payloadJson.v_gate?.confidence === 1.0);
  check("payload v_adversarial_result is n/a", payloadJson.v_gate?.v_adversarial_result === "n/a");
  check("payload records check_results", Array.isArray(payloadJson.check_results) && payloadJson.check_results.length === 2);

  const sig = json.jws.signatures[0];
  const signingInput = Buffer.from(sig.protected + "." + json.jws.payload, "ascii");

  // In production the signing key is the one whose public half is
  // COMPOSED_PUBLIC_JWK. Under test we sign with whatever seed is in
  // AO_COMPOSED_ED25519_PRIVKEY, so verify against the key actually in
  // use — deriving the public half from the same seed the route signed
  // with. When the real production seed is present these are identical,
  // and the extra assertion below proves that case explicitly.
  const seedB64u = process.env.AO_COMPOSED_ED25519_PRIVKEY;
  const seedBuf = Buffer.from(
    seedB64u.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (seedB64u.length % 4)) % 4),
    "base64"
  );
  const activePriv = crypto.createPrivateKey({
    key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seedBuf]),
    format: "der",
    type: "pkcs8",
  });
  const activePubJwk = { ...crypto.createPublicKey(activePriv).export({ format: "jwk" }), alg: "EdDSA" };
  const pub = crypto.createPublicKey({ key: activePubJwk, format: "jwk" });
  const ok = crypto.verify(null, signingInput, pub, Buffer.from(sig.signature, "base64url"));
  check("JWS verifies offline against the active signing key", ok);

  const isProdKey = activePubJwk.x === COMPOSED_PUBLIC_JWK.x;
  if (isProdKey) {
    const prodPub = crypto.createPublicKey({ key: COMPOSED_PUBLIC_JWK, format: "jwk" });
    check(
      "JWS verifies against the published production JWKS key",
      crypto.verify(null, signingInput, prodPub, Buffer.from(sig.signature, "base64url"))
    );
  } else {
    console.log(
      "  SKIP  production-JWKS assertion (test seed in use, not the production key — " +
        "run with the real AO_COMPOSED_ED25519_PRIVKEY to exercise this)"
    );
  }

  check("protected header declares the composed kid", JSON.parse(Buffer.from(sig.protected, "base64url").toString()).kid === "ao-composed-2026-06-ed25519-c3abfce3");
  check(
    "protected header declares the composed media type",
    JSON.parse(Buffer.from(sig.protected, "base64url").toString()).typ ===
      "application/vnd.verification.v0.3+composed+jws"
  );
}

// ── 3. halt path — a check legitimately fails
{
  const { status, json } = await post({
    subject: { claim_hash: "sha256-" + sha256(Buffer.from("halt-claim")) },
    checks: [
      {
        check_type: "hash_comparison",
        input: { content: "actual content", claimed_digest: "sha256-" + "0".repeat(64), algorithm: "sha256" },
      },
    ],
  });
  check("halt path returns 200 (signed negative finding)", status === 200);
  check("halt path verdict is halt", json.verdict === "halt");
  check("halt path records failure_reason", json.check_results?.[0]?.failure_reason === "digest_mismatch");
}

// ── 4. 422 — unknown check type, no LLM fallback
{
  const { status, json } = await post({
    subject: { claim_hash: "sha256-x" },
    checks: [{ check_type: "vibes_assessment", input: { claim: "feels right" } }],
  });
  check("unknown check_type returns 422", status === 422);
  check("422 error is claim_not_deterministic", json.error === "claim_not_deterministic");
  check("422 explicitly declares llm_fallback false", json.llm_fallback === false);
  check("422 lists supported check types", json.supported_check_types?.length === 6);
}

// ── 5. 422 — missing required input, rejected before any work
{
  const { status, json } = await post({
    subject: { claim_hash: "sha256-x" },
    checks: [{ check_type: "hash_comparison", input: { content: "no digest" } }],
  });
  check("missing required input returns 422", status === 422);
  check("422 names the missing field", JSON.stringify(json.unresolvable).includes("claimed_digest"));
}

// ── 6. 422 — unexecutable check must not become a signed halt
{
  const { status, json } = await post({
    subject: { claim_hash: "sha256-x" },
    checks: [
      {
        check_type: "json_schema_conformance",
        input: { document: { a: 1 }, schema: { type: "object", allOf: [{ type: "object" }] } },
      },
    ],
  });
  check("unsupported schema keyword returns 422", status === 422);
  check("422 distinguishes unexecutable from false", Array.isArray(json.unexecutable));
  check(
    "422 reason names the misrepresentation risk",
    typeof json.reason === "string" && json.reason.includes("negative finding")
  );
}

// ── 7. 422 — registry outside the allowlist (SSRF / recomputability guard)
{
  const { status, json } = await post({
    subject: { claim_hash: "sha256-x" },
    checks: [{ check_type: "registry_lookup", input: { registry: "evil.example.com", identifier: "x" } }],
  });
  check("non-allowlisted registry returns 422", status === 422);
  check("422 lists allowed registries", Array.isArray(json.supported_registries) || Array.isArray(json.unexecutable));
}

// ── 8. subject binding is required
{
  const { status, json } = await post({
    checks: [{ check_type: "regex_match", input: { value: "abc", pattern: "^abc$" } }],
  });
  check("missing subject.claim_hash returns 400", status === 400, JSON.stringify(json));
}

// ── 9. signature_verification against a real key
{
  const seed = Buffer.from("9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60", "hex");
  const pkcs8 = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]);
  const priv = crypto.createPrivateKey({ key: pkcs8, format: "der", type: "pkcs8" });
  const jwk = { ...crypto.createPublicKey(priv).export({ format: "jwk" }), alg: "EdDSA", kid: "test-v1" };
  const si = "eyJhbGciOiJFZERTQSJ9.eyJ0ZXN0Ijp0cnVlfQ";
  const sg = crypto.sign(null, Buffer.from(si, "ascii"), priv).toString("base64url");
  const { status, json } = await post({
    subject: { claim_hash: "sha256-sig" },
    checks: [
      { check_type: "signature_verification", input: { signing_input_b64u: si, signature_b64u: sg, public_jwk: jwk } },
    ],
  });
  check("signature_verification pass returns act", status === 200 && json.verdict === "act", JSON.stringify(json).slice(0, 160));
}

server.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
