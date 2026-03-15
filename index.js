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
      },
    },
  ],
  facilitator: "xpay",
  facilitator_url: FACILITATOR_URL,
  networks: {
    base: {
      network: NETWORK,
      payTo: PAY_TO,
    },
  },
  pay_to: PAY_TO,
};

// x402scan and other discovery tools look for /.well-known/x402 (no extension)
app.get("/.well-known/x402", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(x402Manifest);
});

// Also serve at /.well-known/x402.json for backward compatibility
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
    endpoints: {
      "/research": { price: PRICE, model: PERPLEXITY_MODEL },
      "/deep-research": { price: DEEP_PRICE, model: PERPLEXITY_MODEL_PRO },
    },
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
    // ── Call Perplexity API ──────────────────────────────────────
    const perplexityResponse = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: PERPLEXITY_MODEL,
        stream: false,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content:
              'Respond only in clean JSON: { "summary": string, "key_facts": array, ' +
              '"sources": array, "confidence_score": number }. ' +
              "Keep concise, accurate, real-time.",
          },
          {
            role: "user",
            content: query.trim(),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30000, // 30-second timeout
      }
    );

    // ── Extract response content ────────────────────────────────
    const choice = perplexityResponse.data?.choices?.[0];
    const rawContent = choice?.message?.content || "";

    // Attempt to parse Perplexity's response as JSON
    let structuredResult;
    try {
      // Strip markdown code fences if the model wraps output
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      structuredResult = JSON.parse(cleaned);
    } catch {
      // If parsing fails, wrap the raw text in our schema
      structuredResult = {
        summary: rawContent,
        key_facts: [],
        sources: [],
        confidence_score: 0.5,
      };
    }

    // ── Enrich with Perplexity citations if available ────────────
    const citations = perplexityResponse.data?.citations || [];
    if (
      citations.length > 0 &&
      (!structuredResult.sources || structuredResult.sources.length === 0)
    ) {
      structuredResult.sources = citations;
    }

    // ── Return structured result ────────────────────────────────
    return res.json({
      query: query.trim(),
      result: structuredResult,
      model: perplexityResponse.data?.model || PERPLEXITY_MODEL,
      usage: perplexityResponse.data?.usage || null,
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
//  Landing Page — served inline (no static files needed)
// ═══════════════════════════════════════════════════════════════════

app.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(LANDING_PAGE_HTML);
});

// ── Demo Pages — interactive walkthrough + terminal animation ────
app.get("/demo", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(DEMO_PAGE_HTML);
});

app.get("/demo/video", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(DEMO_VIDEO_HTML);
});

// ═══════════════════════════════════════════════════════════════════
//  POST /deep-research — Premium Deep Research Endpoint
// ═══════════════════════════════════════════════════════════════════
//
//  Body: { "query": "any natural-language question" }
//  Price: $0.10 USDC — uses sonar-pro for deeper, more comprehensive research
//

app.post("/deep-research", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "query" string.',
      example: { query: "Comprehensive analysis of quantum computing market in 2026" },
    });
  }

  if (query.length > 4000) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Query must be 4000 characters or fewer.",
    });
  }

  try {
    const perplexityResponse = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: PERPLEXITY_MODEL_PRO,
        stream: false,
        max_tokens: 4000,
        messages: [
          {
            role: "system",
            content:
              'Respond only in clean JSON: { "summary": string (detailed 2-3 paragraph summary), ' +
              '"key_facts": array (10-15 detailed facts), "analysis": string (expert analysis paragraph), ' +
              '"sources": array, "confidence_score": number }. ' +
              "Be thorough, detailed, and cite all sources. Provide expert-level analysis.",
          },
          {
            role: "user",
            content: query.trim(),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 60000,
      }
    );

    const choice = perplexityResponse.data?.choices?.[0];
    const rawContent = choice?.message?.content || "";

    let structuredResult;
    try {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      structuredResult = JSON.parse(cleaned);
    } catch {
      structuredResult = {
        summary: rawContent,
        key_facts: [],
        analysis: "",
        sources: [],
        confidence_score: 0.5,
      };
    }

    const citations = perplexityResponse.data?.citations || [];
    if (
      citations.length > 0 &&
      (!structuredResult.sources || structuredResult.sources.length === 0)
    ) {
      structuredResult.sources = citations;
    }

    return res.json({
      query: query.trim(),
      tier: "deep",
      result: structuredResult,
      model: perplexityResponse.data?.model || PERPLEXITY_MODEL_PRO,
      usage: perplexityResponse.data?.usage || null,
    });
  } catch (err) {
    console.error("[/deep-research] Perplexity API error:", err.message);

    if (err.response) {
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
      message: "An unexpected error occurred while processing your deep research query.",
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
      "POST /research": "Standard research ($0.02 USDC on Base)",
      "POST /deep-research": "Deep research with Sonar Pro ($0.10 USDC on Base)",
      "GET /health": "Service health check",
      "GET /.well-known/x402": "x402 discovery document",
      "GET /.well-known/x402.json": "x402 service manifest (alias)",
      "GET /": "AgentOracle landing page",
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
  console.log(`  Discovery:    http://localhost:${PORT}/.well-known/x402`);
  console.log(`  Manifest:     http://localhost:${PORT}/.well-known/x402.json`);
  console.log(`  Chain:        Base mainnet (${NETWORK})`);
  console.log(`  Price:        ${PRICE} USDC per query`);
  console.log(`  Pay to:       ${PAY_TO}`);
  console.log(`  Facilitator:  ${FACILITATOR_URL}`);
  console.log(`  Model:        ${PERPLEXITY_MODEL}`);
  console.log("═══════════════════════════════════════════════════");
});
