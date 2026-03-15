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
 *   FACILITATOR_URL=https://facilitator.xpay.sh
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
import { LANDING_PAGE_HTML } from "./landing-page.js";
import { DEMO_PAGE_HTML, DEMO_VIDEO_HTML } from "./demo-pages.js";
import { FAVICON_ICO, FAVICON_SVG, FAVICON_16, FAVICON_32, APPLE_TOUCH, OG_IMAGE } from "./favicons.js";

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
  "https://facilitator.xpay.sh";

// Base mainnet CAIP-2 identifier
const NETWORK = "eip155:8453";

// Price: $0.02 USDC (standard), $0.10 USDC (deep research)
const PRICE = "$0.02";
const DEEP_PRICE = "$0.10";

// Perplexity models
const PERPLEXITY_MODEL = "sonar";
const PERPLEXITY_MODEL_PRO = "sonar-pro";

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

// ── Favicon routes (inline data for Vercel compatibility) ────────
app.get("/favicon.ico", (_req, res) => {
  res.setHeader("Content-Type", "image/x-icon");
  res.setHeader("Cache-Control", "public, max-age=604800, immutable");
  res.send(FAVICON_ICO);
});
app.get("/favicon.svg", (_req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=604800, immutable");
  res.send(FAVICON_SVG);
});
app.get("/favicon-16x16.png", (_req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=604800, immutable");
  res.send(FAVICON_16);
});
app.get("/favicon-32x32.png", (_req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=604800, immutable");
  res.send(FAVICON_32);
});
app.get("/apple-touch-icon.png", (_req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=604800, immutable");
  res.send(APPLE_TOUCH);
});
app.get("/og-image.png", (_req, res) => {
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(OG_IMAGE);
});

// ═══════════════════════════════════════════════════════════════════
//  x402 Payment Middleware (v2 SDK)
// ═══════════════════════════════════════════════════════════════════

// 1. Connect to the CDP mainnet facilitator
const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
});

// 2. Create resource server and register Base mainnet EVM scheme
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactEvmScheme()
);

// ── Bazaar: register discovery extension (uncomment when ready) ──
// resourceServer.registerExtension(bazaarResourceServerExtension);

// 3. Define route-level payment configuration
const routeConfig = {
  "POST /research": {
    accepts: [
      {
        scheme: "exact",
        price: PRICE,
        network: NETWORK,
        payTo: PAY_TO,
      },
    ],
    description:
      "Broad real-time research for any topic — structured JSON " +
      "with citations, powered by Perplexity Sonar",
    mimeType: "application/json",
  },
  "POST /deep-research": {
    accepts: [
      {
        scheme: "exact",
        price: DEEP_PRICE,
        network: NETWORK,
        payTo: PAY_TO,
      },
    ],
    description:
      "Deep research with extended analysis — comprehensive JSON " +
      "with detailed findings, powered by Perplexity Sonar Pro",
    mimeType: "application/json",
  },
};

// 4. Apply middleware — unpaid requests get HTTP 402 + PAYMENT-REQUIRED header
app.use(paymentMiddleware(routeConfig, resourceServer));

// ═══════════════════════════════════════════════════════════════════
//  GET /preview — Free sample response (no payment required)
// ═══════════════════════════════════════════════════════════════════

app.get("/preview", (_req, res) => {
  res.json({
    note: "Free preview — no payment required. For real-time queries, use POST /research with x402 payment.",
    sample_query: "What are the latest developments in AI agent frameworks?",
    sample_result: {
      summary: "AI agent frameworks are evolving rapidly in 2026. LangChain and CrewAI lead the open-source ecosystem, while x402 protocol enables native agent-to-service payments via USDC micropayments on Base. The MCP standard is becoming the default for tool access, and ERC-8004 is establishing on-chain agent identity.",
      key_facts: [
        "LangChain and CrewAI dominate open-source agent frameworks",
        "x402 protocol enables agent-to-service payments without API keys",
        "MCP (Model Context Protocol) standardizing tool access across providers",
        "ERC-8004 creating on-chain agent identity standard",
        "Over $24M in x402 payment volume processed in the last 30 days"
      ],
      sources: [
        "https://docs.langchain.com",
        "https://www.crewai.com",
        "https://x402.org",
        "https://docs.cdp.coinbase.com/x402"
      ],
      confidence_score: 0.92
    },
    pricing: {
      research: "$0.02 USDC per query (Perplexity Sonar)",
      deep_research: "$0.10 USDC per query (Perplexity Sonar Pro)"
    },
    try_it: "POST /research with x402 payment header — see /.well-known/x402.json for details"
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Static Discovery — .well-known/x402 + .well-known/x402.json
// ═══════════════════════════════════════════════════════════════════

const x402Manifest = {
  x402Version: 2,
  version: "x402/1.0",
  name: "AgentOracle Research API",
  description:
    "Pay-per-query real-time research powered by Perplexity Sonar. " +
    "Two tiers: standard ($0.02) and deep ($0.10). Structured JSON " +
    "with citations, key facts, and confidence scores. No API keys " +
    "needed — just pay with USDC on Base.",
  endpoints: [
    {
      path: "/research",
      method: "POST",
      price: "0.02",
      currency: "USDC",
      chain: "base",
      network: NETWORK,
      scheme: "exact",
      model: "sonar",
      description:
        "Real-time research for any topic — structured JSON " +
        "with citations, powered by Perplexity Sonar",
      input: {
        body: {
          query: {
            type: "string",
            required: true,
            maxLength: 2000,
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
    {
      path: "/deep-research",
      method: "POST",
      price: "0.10",
      currency: "USDC",
      chain: "base",
      network: NETWORK,
      scheme: "exact",
      model: "sonar-pro",
      description:
        "Deep research with comprehensive analysis — detailed JSON " +
        "with expert findings, powered by Perplexity Sonar Pro",
      input: {
        body: {
          query: {
            type: "string",
            required: true,
            maxLength: 4000,
            description: "Natural-language research question for deep analysis",
          },
        },
      },
      output: {
        summary: "string",
        key_facts: "array",
        analysis: "string",
        sources: "array",
        confidence_score: "number",
 
