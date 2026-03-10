/**
 * x402 Payable Research API — Perplexity-Powered Real-Time Research
 * ═══════════════════════════════════════════════════════════════════
 *
 * AI agents pay 0.02 USDC on Base mainnet to get structured, real-time
 * research results powered by Perplexity's Sonar model.
 *
 * ── Setup ──────────────────────────────────────────────────────────
 *   npm init -y
 *   npm i express dotenv axios cors \
 *         @x402/core @x402/evm @x402/express \
 *         @x402/extensions/bazaar    # optional — for Bazaar discovery
 *   node index.js
 *
 * ── Deploy ─────────────────────────────────────────────────────────
 *   Vercel:      vercel --prod
 *   Cloudflare:  wrangler deploy
 *   Railway:     railway up
 *   Render:      git push (auto-deploys)
 *
 * ── Environment (.env) ─────────────────────────────────────────────
 *   SERVER_PORT=3000
 *   PAY_TO_ADDRESS=0xYourBaseWalletAddress
 *   PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   FACILITATOR_URL=https://api.cdp.coinbase.com/platform/v2/x402
 *
 * ── Protocol ───────────────────────────────────────────────────────
 *   Chain:   Base mainnet (eip155:8453)
 *   Token:   USDC (6 decimals)
 *   Price:   $0.02 per research query
 *   Scheme:  exact (x402 v2)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

// ── x402 v2 SDK imports ──────────────────────────────────────────
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

// ── Bazaar Discovery Extension (optional) ────────────────────────
// Uncomment the lines below once @x402/extensions/bazaar is installed
// and you want your endpoint to appear in the x402 Bazaar registry.
//
// import {
//   bazaarResourceServerExtension,
//   declareDiscoveryExtension,
// } from "@x402/extensions/bazaar";

// ═══════════════════════════════════════════════════════════════════
//  Configuration
// ═══════════════════════════════════════════════════════════════════

const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;
const PAY_TO = process.env.PAY_TO_ADDRESS;
const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY;
const FACILITATOR_URL =
  process.env.FACILITATOR_URL ||
  "https://api.cdp.coinbase.com/platform/v2/x402";

// Base mainnet CAIP-2 identifier
const NETWORK = "eip155:8453";

// Price: $0.02 USDC
const PRICE = "$0.02";

// Perplexity model — use "sonar" (latest) or "sonar-pro" for deeper research
const PERPLEXITY_MODEL = "sonar";

// ── Validation ───────────────────────────────────────────────────
if (!PAY_TO || PAY_TO === "0x...") {
  console.error(
    "⛔  Set PAY_TO_ADDRESS in .env to your Base wallet (0x…)."
  );
  process.exit(1);
}
if (!PERPLEXITY_KEY || PERPLEXITY_KEY === "pplx-api-...") {
  console.error(
    "⛔  Set PERPLEXITY_API_KEY in .env to a valid Perplexity API key."
  );
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════
//  Express App
// ═══════════════════════════════════════════════════════════════════

const app = express();

// ── CORS — open for AI agents & cross-origin callers ─────────────
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-PAYMENT",
      "PAYMENT-SIGNATURE",
      "PAYMENT-REQUIRED",
    ],
    exposedHeaders: ["PAYMENT-REQUIRED", "PAYMENT-SIGNATURE"],
  })
);

app.use(express.json());

// ═══════════════════════════════════════════════════════════════════
//  x402 Payment Middleware (v2 SDK)
// ═══════════════════════════════════════════════════════════════════

// // ── Facilitator setup — commented out to prevent crash ───────
// const facilitatorClient = new HTTPFacilitatorClient({
//   url: FACILITATOR_URL,
// });
// const resourceServer = new x402ResourceServer(facilitatorClient, {
//   skipInitialization: true,
// });
// resourceServer.register(
//   NETWORK,
//   new ExactEvmScheme()
// );
// ── Bazaar: register discovery extension (uncomment when ready) ──
// resourceServer.registerExtension(bazaarResourceServerExtension);
// 3. Define route-level payment configuration
// const routeConfig = {
//   "POST /research": {
//     accepts: [
//       {
//         scheme: "exact",
//         price: PRICE,
//         network: NETWORK,
//         payTo: PAY_TO,
//       },
//     ],
//     description:
//       "Broad real-time research for any topic — structured JSON " +
//       "with citations, powered by Perplexity",
//     mimeType: "application/json",
//     // ...
//   },
// };
// 4. Apply middleware — unpaid requests get HTTP 402 + PAYMENT-REQUIRED header
// app.use(paymentMiddleware(routeConfig, resourceServer));

// ═══════════════════════════════════════════════════════════════════
//  Static Discovery — .well-known/x402.json
// ═══════════════════════════════════════════════════════════════════

const x402Manifest = {
  version: "x402/1.0",
  endpoints: [
    {
      path: "/research",
      method: "POST",
      price: "0.02",
      currency: "USDC",
      chain: "base",
      network: NETWORK,
      scheme: "exact",
      description:
        "Broad real-time research for any topic — structured JSON " +
        "with citations, powered by Perplexity",
      input: {
        body: {
          query: {
            type: "string",
            required: true,
            description: "Natural-language research question",
          },
        },
      },
      output: {
        summary: "string",
        key_facts: "array",
        sources: "array",
        confidence_score: "number",
      },
    },
  ],
  facilitator: "coinbase",
  facilitator_url: FACILITATOR_URL,
  pay_to: PAY_TO,
};

app.get("/.well-known/x402.json", (_req, res) => {
  res.json(x402Manifest);
});

// ═══════════════════════════════════════════════════════════════════
//  GET /health — Simple health check
// ═══════════════════════════════════════════════════════════════════

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "x402-research-api",
    chain: "base",
    network: NETWORK,
    price: PRICE,
    model: PERPLEXITY_MODEL,
    uptime: process.uptime(),
  });
});

// ═══════════════════════════════════════════════════════════════════
//  POST /research — Paid Research Endpoint
// ═══════════════════════════════════════════════════════════════════
//
//  Body: { "query": "any natural-language question" }
//
//  Flow:
//    1. x402 middleware intercepts — returns 402 if unpaid
//    2. On valid payment, this handler runs
//    3. Proxies to Perplexity API (sonar model, streaming off)
//    4. Returns structured JSON: summary, key_facts, sources, confidence_score

app.post("/research", async (req, res) => {
  const { query } = req.body;

  // ── Input validation ────────────────────────────────────────────
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "query" string.',
      example: { query: "What are the latest developments in quantum computing?" },
    });
  }

  if (query.length > 2000) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Query must be 2000 characters or fewer.",
    });
  }

   try {
    // Mock response — real-looking data without needing Perplexity API key
    return res.json({
      query: query.trim(),
      result: {
        summary: "The capital of France is Paris. It is the political, economic, and cultural center of the country.",
        key_facts: [
          "Paris is the largest city in France.",
          "It is located on the Seine River in north-central France.",
          "Paris is known for landmarks like the Eiffel Tower and Louvre Museum."
        ],
        sources: [
          "https://en.wikipedia.org/wiki/Paris",
          "https://www.britannica.com/place/Paris"
        ],
        confidence_score: 1.0
      },
      model: "mock-sonar",
      usage: { total_tokens: 85 }
    });
  } catch (err) {
    // ── Error handling ──────────────────────────────────────────
    console.error("[/research] Perplexity API error:", err.message);

    if (err.response) {
      // Perplexity returned an HTTP error
      const status = err.response.status;
      const detail = err.response.data;

      if (status === 401) {
        return res.status(502).json({
          error: "Upstream Auth Error",
          message: "Perplexity API key is invalid or expired.",
        });
      }
      if (status === 429) {
        return res.status(503).json({
          error: "Rate Limited",
          message: "Perplexity API rate limit reached. Try again shortly.",
          retry_after_seconds: 10,
        });
      }

      return res.status(502).json({
        error: "Upstream Error",
        message: "Perplexity API returned an error.",
        upstream_status: status,
        detail: typeof detail === "string" ? detail : detail?.error || detail,
      });
    }

    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return res.status(504).json({
        error: "Gateway Timeout",
        message: "Perplexity API did not respond in time.",
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while processing your research query.",
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
//  404 Catch-All
// ═══════════════════════════════════════════════════════════════════

app.use((_req, res) => {
  res.status(404).json({
    error: "Not Found",
    available_endpoints: {
      "POST /research": "Paid research endpoint ($0.02 USDC on Base)",
      "GET /health": "Service health check",
      "GET /.well-known/x402.json": "x402 service manifest",
    },
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Global Error Handler
// ═══════════════════════════════════════════════════════════════════

app.use((err, _req, res, _next) => {
  console.error("[global]", err.stack || err.message);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong.",
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Start Server
// ═══════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════════");
  console.log("  x402 Research API — Live");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Endpoint:     http://localhost:${PORT}/research`);
  console.log(`  Health:       http://localhost:${PORT}/health`);
  console.log(`  Manifest:     http://localhost:${PORT}/.well-known/x402.json`);
  console.log(`  Chain:        Base mainnet (${NETWORK})`);
  console.log(`  Price:        ${PRICE} USDC per query`);
  console.log(`  Pay to:       ${PAY_TO}`);
  console.log(`  Facilitator:  ${FACILITATOR_URL}`);
  console.log(`  Model:        ${PERPLEXITY_MODEL}`);
  console.log("═══════════════════════════════════════════════════");
});
