/**
 * AgentOracle — JavaScript/Node.js SDK Example
 * Pay-per-query research API using x402 protocol on Base.
 * No API keys needed. Just USDC on Base.
 *
 * npm install axios @x402/core
 */

const axios = require("axios");

const AGENT_ORACLE_URL = "https://agentoracle.co";

// ─── Free Preview (no payment) ──────────────────────────────────

async function previewQuery(query) {
  const { data } = await axios.post(`${AGENT_ORACLE_URL}/preview`, {
    query,
  });
  return data;
}

// ─── Paid Research (x402 payment) ───────────────────────────────

async function paidResearch(query, tier = "standard") {
  const endpoint = tier === "deep" ? "/deep-research" : "/research";
  const body = tier === "deep" ? { query } : { query, tier };

  try {
    // Attempt request — will return 402 if unpaid
    const { data } = await axios.post(
      `${AGENT_ORACLE_URL}${endpoint}`,
      body,
      { timeout: 60000 }
    );
    return data;
  } catch (err) {
    if (err.response?.status === 402) {
      const paymentRequired = err.response.headers["payment-required"];
      console.log("Payment required:", paymentRequired);

      // Use x402 client SDK to sign payment:
      //
      //   import { createPaymentHeader } from "@x402/core";
      //   const paymentHeader = await createPaymentHeader(
      //     paymentRequired,
      //     walletClient  // viem wallet client with USDC on Base
      //   );
      //
      //   const { data } = await axios.post(
      //     `${AGENT_ORACLE_URL}${endpoint}`,
      //     body,
      //     { headers: { "X-PAYMENT": paymentHeader } }
      //   );
      //   return data;
      //
      // See: https://github.com/coinbase/x402

      throw new Error(
        "402 Payment Required — use @x402/core to sign payment. " +
        "See https://github.com/coinbase/x402"
      );
    }
    throw err;
  }
}

// ─── Full x402 Client Example (with payment) ───────────────────

async function fullX402Example() {
  // This is the complete flow using x402 SDK + viem wallet
  //
  // const { createPublicClient, createWalletClient, http } = require("viem");
  // const { base } = require("viem/chains");
  // const { privateKeyToAccount } = require("viem/accounts");
  // const { withPayment } = require("@x402/axios");
  //
  // const account = privateKeyToAccount("0xYOUR_PRIVATE_KEY");
  // const walletClient = createWalletClient({
  //   account,
  //   chain: base,
  //   transport: http(),
  // });
  //
  // // Wrap axios with x402 payment support
  // const client = withPayment(axios, walletClient);
  //
  // // Now requests automatically handle 402 → pay → retry
  // const { data } = await client.post(
  //   "https://agentoracle.co/research",
  //   { query: "What are the top DeFi yields right now?" }
  // );
  //
  // console.log(data.result.summary);
  // console.log(`Freshness: ${data.freshness}`);
  // console.log(`Sources: ${data.confidence.sources_count}`);
  // console.log(`Response time: ${data.metadata.response_time_ms}ms`);
}

// ─── Usage ──────────────────────────────────────────────────────

(async () => {
  // 1. Free preview
  console.log("=== Free Preview ===");
  const preview = await previewQuery(
    "What is the current state of x402 protocol adoption?"
  );
  console.log("Summary:", preview.result.summary);
  console.log("Confidence:", preview.result.confidence_score);
  console.log("Previews remaining:", preview.preview_remaining);
  console.log();

  // 2. Paid research (uncomment when wallet is funded)
  // console.log("=== Standard Research ($0.02) ===");
  // const result = await paidResearch("Latest Base L2 ecosystem metrics");
  // console.log("Summary:", result.result.summary);
  // console.log("Sources:", result.confidence.sources_count);
  // console.log("Freshness:", result.freshness);
  // console.log("Response time:", result.metadata.response_time_ms, "ms");
})();

// ─── Example Response (v1.3.0) ──────────────────────────────────
//
// {
//   "query": "Latest Base L2 ecosystem metrics",
//   "tier": "standard",
//   "result": {
//     "summary": "Base L2 continues strong growth in 2026...",
//     "key_facts": ["Base processes 15M+ daily transactions", ...],
//     "sources": ["https://basescan.org/...", ...],
//     "confidence_score": 0.88
//   },
//   "confidence": {
//     "score": 0.88,
//     "level": "high",
//     "sources_count": 6,
//     "facts_count": 5
//   },
//   "freshness": "recent",
//   "metadata": {
//     "model": "sonar",
//     "api_version": "1.3.0",
//     "response_time_ms": 1890,
//     "timestamp": "2026-03-21T...",
//     "network": "base",
//     "price_paid": "$0.02"
//   }
// }
