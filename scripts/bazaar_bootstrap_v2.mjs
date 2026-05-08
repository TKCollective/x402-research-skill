// bazaar_bootstrap_v2.mjs — May 8 update (v3, fixed for @x402/fetch SDK)
//
// Triggers a paid /settle through the agentoracle.co fixed code path so we can
// see the EXTENSION-RESPONSES decode (per ethanoroshiba on x402#2207).
// After the May 8 d972aa0a fix (server-side paymentPayload.resource injection),
// this bootstrap should produce {bazaar:{status:"processing"}} or "accepted"
// instead of the prior "rejected / discovery request validation failed".
//
// PREREQUISITES
//   - A test wallet on Base mainnet with at least 0.05 USDC + a few cents of ETH for gas
//   - npm i @x402/fetch @x402/evm @x402/core viem
//   - Node 18+ (uses native fetch + ESM)
//
// USAGE
//   export TEST_WALLET_PK=0x<64hex>   # NEVER your primary wallet
//   node bazaar_bootstrap_v2.mjs
//
// What you should see in the output:
//   - Step 1: 402 challenge body printed (sanity)
//   - Step 2: 200 settle response with on-chain tx hash
//   - "EXTENSION-RESPONSES" header decoded as JSON — this is the indexer signal

import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, publicActions } from "viem";
import { base } from "viem/chains";
import { x402Client, decodePaymentResponseHeader } from "@x402/fetch";
import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";

const URL_BOOTSTRAP = "https://agentoracle.co/bazaar-bootstrap";
const URL_RESEARCH = "https://agentoracle.co/research";

const PK = process.env.TEST_WALLET_PK;
if (!PK || !PK.startsWith("0x") || PK.length !== 66) {
  console.error("[bootstrap] ERROR: set TEST_WALLET_PK to a 0x-prefixed 64-hex private key for a TEST wallet.");
  console.error("              DO NOT use your primary wallet PK. Mainnet USDC will be spent.");
  process.exit(1);
}

const account = privateKeyToAccount(PK);
const wallet = createWalletClient({
  account,
  chain: base,
  transport: http("https://mainnet.base.org"),
}).extend(publicActions);

console.log("[bootstrap] test wallet:", account.address);

// Build the x402 client with the EVM scheme handler. This will sign the EIP-712
// payment authorization when a 402 challenge comes back.
// Note: the SDK auto-populates paymentPayload.resource from paymentRequired.resource
// in v2, so as long as the server emits a correct top-level resource (we do), the
// signed payload includes it.
const signer = toClientEvmSigner(account, wallet);
const evmScheme = new ExactEvmScheme(signer);
const client = new x402Client().register("eip155:8453", evmScheme);

// Pick which endpoint to hit:
//   /research        — production paid path ($0.02 USDC). Best signal for indexer.
//   /bazaar-bootstrap — internal helper that runs verify+settle directly. Same path
//                       through the new server-side resource injection.
const target = process.argv.includes("--research") ? URL_RESEARCH : URL_BOOTSTRAP;
console.log("[bootstrap] target:", target);

// Step 1 — initial unauthenticated POST to see the challenge.
const probe = await fetch(target, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "What is the current price of Bitcoin?" }),
});
console.log("[bootstrap] step1 HTTP", probe.status);
if (probe.status !== 402) {
  console.log("[bootstrap] body:", await probe.text());
  process.exit(2);
}
const challengeBody = await probe.json();
console.log("[bootstrap] challenge.x402Version:", challengeBody.x402Version);
console.log("[bootstrap] challenge.resource:", JSON.stringify(challengeBody.resource));
console.log("[bootstrap] accepts[0]:", JSON.stringify(challengeBody.accepts?.[0]));

// Step 2 — let the SDK handle the full pay-and-retry flow.
// Internally: parses 402, signs paymentPayload (per V2 spec), retries with X-PAYMENT.
// Server-side our middleware will inject paymentPayload.resource if buyer SDK omits it.
console.log("\n[bootstrap] creating payment payload via @x402/core client...");
let r2;
try {
  const paymentPayload = await client.createPaymentPayload(challengeBody);
  console.log("[bootstrap] paymentPayload.x402Version:", paymentPayload.x402Version);
  console.log("[bootstrap] paymentPayload.resource:", JSON.stringify(paymentPayload.resource));
  console.log("[bootstrap] paymentPayload.accepted:", JSON.stringify(paymentPayload.accepted));
  const xpayHeader = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
  console.log("[bootstrap] X-PAYMENT length:", xpayHeader.length);
  r2 = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-PAYMENT": xpayHeader },
    body: JSON.stringify({ query: "What is the current price of Bitcoin?" }),
  });
} catch (e) {
  console.error("[bootstrap] createPaymentPayload() failed:", e?.message ?? e);
  console.error("[bootstrap] full error:", e);
  process.exit(3);
}

console.log("\n[bootstrap] step2 HTTP", r2.status);

console.log("\n[bootstrap] === ALL RESPONSE HEADERS ===");
for (const [k, v] of r2.headers.entries()) {
  console.log(`  ${k}: ${v.length > 200 ? v.slice(0, 200) + "..." : v}`);
}

// === The signal we actually came for ===
const extRespRaw =
  r2.headers.get("extension-responses") ||
  r2.headers.get("Extension-Responses") ||
  r2.headers.get("EXTENSION-RESPONSES");
if (extRespRaw) {
  console.log("\n[bootstrap] === EXTENSION-RESPONSES (raw) ===");
  console.log(extRespRaw);
  try {
    const decoded = JSON.parse(Buffer.from(extRespRaw, "base64").toString("utf8"));
    console.log("\n[bootstrap] === EXTENSION-RESPONSES (decoded JSON) ===");
    console.log(JSON.stringify(decoded, null, 2));
    if (decoded?.bazaar?.status === "rejected") {
      console.log(`\n[bootstrap] BAZAAR STATUS: rejected — reason: ${decoded.bazaar.rejectedReason}`);
    } else if (decoded?.bazaar?.status === "processing") {
      console.log("\n[bootstrap] BAZAAR STATUS: processing — fix WORKED. Wait for indexer crawl.");
    } else if (decoded?.bazaar?.status === "accepted") {
      console.log("\n[bootstrap] BAZAAR STATUS: accepted — fully indexed.");
    }
  } catch {
    try {
      const decoded = JSON.parse(extRespRaw);
      console.log("\n[bootstrap] === EXTENSION-RESPONSES (parsed JSON) ===");
      console.log(JSON.stringify(decoded, null, 2));
    } catch {
      console.log("[bootstrap] could not decode as base64 or JSON");
    }
  }
} else {
  console.log("\n[bootstrap] WARN: no extension-responses header on /settle");
}

// Also try the SDK's own decoder for the paid response receipt header.
const xPaymentResponse = r2.headers.get("x-payment-response");
if (xPaymentResponse) {
  try {
    const decoded = decodePaymentResponseHeader(xPaymentResponse);
    console.log("\n[bootstrap] x-payment-response decoded:");
    console.log(JSON.stringify(decoded, null, 2));
  } catch (e) {
    console.log("[bootstrap] x-payment-response decode failed:", e?.message);
  }
}

console.log("\n[bootstrap] response body:");
const text = await r2.text();
console.log(text.length > 1000 ? text.slice(0, 1000) + "\n... (truncated)" : text);
