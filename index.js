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

// SKALE Base — gasless agent payments
// PayAI facilitator supports both SKALE mainnet and testnet
// Mainnet chain ID: 1187947933 | Testnet chain ID: 324705682
const SKALE_NETWORK = process.env.SKALE_NETWORK || "eip155:1187947933";
const SKALE_FACILITATOR_URL =
  process.env.SKALE_FACILITATOR_URL ||
  "https://facilitator.payai.network";
const SKALE_USDC_ADDRESS =
  process.env.SKALE_USDC_ADDRESS || "0x85889c8c714505E0c94b30fcfcF64fE3Ac8FCb20";
const SKALE_USDC_NAME = "USDC.e (SKALE Base)";
const SKALE_IS_TESTNET = SKALE_NETWORK.includes("324705682");

// Price: $0.02 USDC (standard), $0.10 USDC (deep research)
const PRICE = "$0.02";
const DEEP_PRICE = "$0.10";

// Perplexity models
const PERPLEXITY_MODEL = "sonar";
const PERPLEXITY_MODEL_PRO = "sonar-pro";

// ── Rate Limiting (in-memory, per-IP) ────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 100; // 100 requests per hour per IP
const rateLimitStore = new Map();

function getRateLimitInfo(ip) {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
    rateLimitStore.set(ip, entry);
  }
  return entry;
}

function consumeRateLimit(ip) {
  const entry = getRateLimitInfo(ip);
  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return entry;
}

function setRateLimitHeaders(res, entry) {
  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  const resetAt = Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS) / 1000);
  res.setHeader("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(resetAt));
}

// Clean up stale rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

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
    exposedHeaders: [
      "PAYMENT-REQUIRED",
      "PAYMENT-SIGNATURE",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
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

// 1. Connect to facilitators
const baseFacilitator = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
});

// SKALE facilitator (PayAI) — initialized but only added when
// SKALE_FACILITATOR_READY=true to allow controlled rollout
// endpoint currently returns 404 which causes SDK init timeouts.
const SKALE_FACILITATOR_READY = process.env.SKALE_FACILITATOR_READY === "true";
let skaleFacilitator;
if (SKALE_FACILITATOR_READY) {
  skaleFacilitator = new HTTPFacilitatorClient({
    url: SKALE_FACILITATOR_URL,
  });
}

// 2. Create resource server — register EVM scheme
//    When SKALE facilitator is ready, pass both; otherwise Base only
const facilitators = SKALE_FACILITATOR_READY && skaleFacilitator
  ? [baseFacilitator, skaleFacilitator]
  : baseFacilitator;
const resourceServer = new x402ResourceServer(facilitators)
  .register(NETWORK, new ExactEvmScheme());
if (SKALE_FACILITATOR_READY) {
  resourceServer.register(SKALE_NETWORK, new ExactEvmScheme());
}

// ── Bazaar: register discovery extension (uncomment when ready) ──
// resourceServer.registerExtension(bazaarResourceServerExtension);

// 3. Define route-level payment configuration
//    When SKALE facilitator is ready, agents can pay via either network
const baseAcceptResearch = {
  scheme: "exact",
  price: PRICE,
  network: NETWORK,
  payTo: PAY_TO,
};
const baseAcceptDeep = {
  scheme: "exact",
  price: DEEP_PRICE,
  network: NETWORK,
  payTo: PAY_TO,
};
const skaleAcceptResearch = {
  scheme: "exact",
  price: PRICE,
  network: SKALE_NETWORK,
  payTo: PAY_TO,
};
const skaleAcceptDeep = {
  scheme: "exact",
  price: DEEP_PRICE,
  network: SKALE_NETWORK,
  payTo: PAY_TO,
};

const routeConfig = {
  "POST /research": {
    accepts: SKALE_FACILITATOR_READY
      ? [baseAcceptResearch, skaleAcceptResearch]
      : [baseAcceptResearch],
    description:
      "Broad real-time research for any topic — structured JSON " +
      "with citations, powered by Perplexity Sonar." +
      (SKALE_FACILITATOR_READY
        ? " Accepts payment on Base (eip155:8453) or SKALE Base (gasless)."
        : ""),
    mimeType: "application/json",
  },
  "POST /deep-research": {
    accepts: SKALE_FACILITATOR_READY
      ? [baseAcceptDeep, skaleAcceptDeep]
      : [baseAcceptDeep],
    description:
      "Deep research with extended analysis — comprehensive JSON " +
      "with detailed findings, powered by Perplexity Sonar Pro." +
      (SKALE_FACILITATOR_READY
        ? " Accepts payment on Base (eip155:8453) or SKALE Base (gasless)."
        : ""),
    mimeType: "application/json",
  },
};

// 4. Apply middleware — unpaid requests get HTTP 402 + PAYMENT-REQUIRED header
app.use(paymentMiddleware(routeConfig, resourceServer));

// ═══════════════════════════════════════════════════════════════════
//  POST /preview — Live preview (free, truncated results)
// ═══════════════════════════════════════════════════════════════════
//
//  Agents can test a real query before paying. Returns a truncated
//  summary (first 200 chars), limited key_facts (max 2), no sources,
//  and a confidence score. Full results require x402 payment.
//
//  Rate limited: 10 preview requests per hour per IP.

const PREVIEW_RATE_LIMIT = 10;
const previewRateLimitStore = new Map();

app.post("/preview", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "query" string.',
      example: { query: "What are the latest developments in AI agent frameworks?" },
    });
  }

  if (query.length > 2000) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Query must be 2000 characters or fewer.",
    });
  }

  // Preview-specific rate limiting (stricter)
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  let pEntry = previewRateLimitStore.get(ip);
  if (!pEntry || now - pEntry.windowStart > RATE_LIMIT_WINDOW_MS) {
    pEntry = { windowStart: now, count: 0 };
  }
  pEntry.count += 1;
  previewRateLimitStore.set(ip, pEntry);

  if (pEntry.count > PREVIEW_RATE_LIMIT) {
    return res.status(429).json({
      error: "Rate Limited",
      message: `Preview is limited to ${PREVIEW_RATE_LIMIT} requests per hour. Use POST /research with x402 payment for unlimited queries.`,
      upgrade: "POST /research ($0.02 USDC) or POST /deep-research ($0.10 USDC)",
    });
  }

  try {
    const perplexityResponse = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: PERPLEXITY_MODEL,
        stream: false,
        max_tokens: 500, // shorter for preview
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
        timeout: 15000,
      }
    );

    const choice = perplexityResponse.data?.choices?.[0];
    const rawContent = choice?.message?.content || "";

    let fullResult;
    try {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      fullResult = JSON.parse(cleaned);
    } catch {
      fullResult = {
        summary: rawContent,
        key_facts: [],
        sources: [],
        confidence_score: 0.5,
      };
    }

    // Truncate for preview
    const truncatedSummary = fullResult.summary
      ? fullResult.summary.substring(0, 200) + (fullResult.summary.length > 200 ? "..." : "")
      : "";
    const truncatedFacts = (fullResult.key_facts || []).slice(0, 2);
    const totalFacts = (fullResult.key_facts || []).length;
    const totalSources = (fullResult.sources || []).length;

    return res.json({
      preview: true,
      query: query.trim(),
      result: {
        summary: truncatedSummary,
        key_facts: truncatedFacts,
        confidence_score: fullResult.confidence_score || 0.5,
      },
      truncated: {
        summary_length: fullResult.summary ? fullResult.summary.length : 0,
        total_key_facts: totalFacts,
        shown_key_facts: truncatedFacts.length,
        total_sources: totalSources,
        shown_sources: 0,
      },
      upgrade: {
        message: "Pay to unlock full results with all facts, sources, and complete summary.",
        standard: "POST /research — $0.02 USDC (Sonar)",
        deep: "POST /deep-research — $0.10 USDC (Sonar Pro)",
        how: "See /.well-known/x402.json for payment details",
      },
      preview_remaining: Math.max(0, PREVIEW_RATE_LIMIT - pEntry.count),
    });
  } catch (err) {
    console.error("[/preview] Perplexity API error:", err.message, err.response?.status, JSON.stringify(err.response?.data));
    
    if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        return res.status(502).json({
          error: "Preview Unavailable",
          message: "Upstream API key error.",
        });
      }
      if (status === 429) {
        return res.status(503).json({
          error: "Preview Unavailable",
          message: "Upstream rate limit reached. Try again shortly.",
          retry_after_seconds: 10,
        });
      }
    }
    
    return res.status(502).json({
      error: "Preview Unavailable",
      message: "Could not generate preview. Try again shortly.",
      debug: process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
  }
});

// Keep GET /preview for backward compatibility (static sample)
app.get("/preview", (_req, res) => {
  res.json({
    note: "Free preview — send a POST request with {\"query\": \"your question\"} to get a live truncated preview. No payment required.",
    sample_query: "What are the latest developments in AI agent frameworks?",
    sample_result: {
      summary: "AI agent frameworks are evolving rapidly in 2026. LangChain and CrewAI lead the open-source ecosystem, while x402 protocol enables native agent-to-service payments...",
      key_facts: [
        "LangChain and CrewAI dominate open-source agent frameworks",
        "x402 protocol enables agent-to-service payments without API keys"
      ],
      confidence_score: 0.92
    },
    pricing: {
      research: "$0.02 USDC per query (Perplexity Sonar)",
      deep_research: "$0.10 USDC per query (Perplexity Sonar Pro)"
    },
    try_it: "POST /preview with {\"query\": \"...\"} for a live preview, or POST /research with x402 payment for full results"
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
      path: "/preview",
      method: "POST",
      price: "0.00",
      currency: "USDC",
      chain: "base",
      network: NETWORK,
      scheme: "free",
      model: "sonar",
      description:
        "Free live preview — returns truncated summary (200 chars), " +
        "2 key facts, confidence score. No sources. 10 requests/hour.",
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
        summary: "string (truncated)",
        key_facts: "array (max 2)",
        confidence_score: "number",
      },
    },
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
          tier: {
            type: "string",
            required: false,
            enum: ["standard", "deep"],
            default: "standard",
            description: "Pass 'deep' to upgrade to Sonar Pro ($0.10)",
          },
        },
      },
      output: {
        summary: "string",
        key_facts: "array",
        sources: "array",
        confidence_score: "number",
        confidence_level: "string (high|medium|low)",
        freshness: "string (real-time|recent|historical)",
        response_time_ms: "number",
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
        freshness: "string (real-time|recent|historical)",
        response_time_ms: "number",
      },
    },
  ],
  facilitators: {
    base: { name: "xpay", url: FACILITATOR_URL },
    skale_base: { name: "payai", url: SKALE_FACILITATOR_URL },
  },
  networks: {
    base: {
      network: NETWORK,
      payTo: PAY_TO,
    },
    skale_base: {
      network: SKALE_NETWORK,
      payTo: PAY_TO,
      facilitator_url: SKALE_FACILITATOR_URL,
      gasless: true,
      usdc_address: SKALE_USDC_ADDRESS,
      note: "Zero gas fees — agents pay only the query price",
    },
  },
  pay_to: PAY_TO,
};

// x402scan and other discovery tools look for /.well-known/x402 (no extension)
app.get("/.well-known/x402", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(x402Manifest);
});

// Also serve at /.well-known/x402.json for backward compatibility
app.get("/.well-known/x402.json", (_req, res) => {
  res.json(x402Manifest);
});

// ═══════════════════════════════════════════════════════════════════
//  GET /health — Health check with feature flags
// ═══════════════════════════════════════════════════════════════════

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    version: "1.3.0",
    service: "x402-research-api",
    chain: "base + skale",
    networks: {
      base: NETWORK,
      skale_base: SKALE_NETWORK,
    },
    endpoints: {
      "POST /preview": { price: "free", model: PERPLEXITY_MODEL, note: "Live truncated preview, 10/hr" },
      "POST /research": { price: PRICE, model: PERPLEXITY_MODEL, tier_selector: true },
      "POST /deep-research": { price: DEEP_PRICE, model: PERPLEXITY_MODEL_PRO },
    },
    features: {
      live_preview: true,
      confidence_scoring: true,
      freshness_detection: true,
      rate_limit_headers: true,
      tier_selector: true,
      free_promo: promoQueriesUsed < PROMO_MAX_QUERIES,
      defi_vertical_beta: true,
      skale_gasless: SKALE_FACILITATOR_READY,
      skale_testnet: SKALE_IS_TESTNET,
      skale_facilitator_ready: SKALE_FACILITATOR_READY,
    },
    rate_limits: {
      paid: `${RATE_LIMIT_MAX}/hour per IP`,
      preview: `${PREVIEW_RATE_LIMIT}/hour per IP`,
    },
    uptime: process.uptime(),
  });
});

// ═══════════════════════════════════════════════════════════════════
//  POST /research — Paid Research Endpoint (with tier selector)
// ═══════════════════════════════════════════════════════════════════
//
//  Body: { "query": "any question", "tier": "standard"|"deep" }
//
//  Features (v1.1):
//    - Tier selector: pass tier: "deep" to use Sonar Pro ($0.10)
//    - Rate limit headers: X-RateLimit-Limit, Remaining, Reset
//    - Confidence scoring: multi-signal confidence with level flag
//    - Default tier is "standard" ($0.02, Sonar)

app.post("/research", async (req, res) => {
  const { query, tier } = req.body;

  // ── Input validation ────────────────────────────────────────────
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "query" string.',
      example: { query: "What are the latest developments in quantum computing?", tier: "standard" },
    });
  }

  // ── Tier selector ───────────────────────────────────────────────
  const useDeep = tier === "deep";
  const selectedModel = useDeep ? PERPLEXITY_MODEL_PRO : PERPLEXITY_MODEL;
  const maxLen = useDeep ? 4000 : 2000;
  const selectedTier = useDeep ? "deep" : "standard";

  if (query.length > maxLen) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Query must be ${maxLen} characters or fewer for ${selectedTier} tier.`,
    });
  }

  // ── Rate limiting ───────────────────────────────────────────────
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const rlEntry = consumeRateLimit(ip);
  setRateLimitHeaders(res, rlEntry);

  if (rlEntry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: "Rate Limited",
      message: `Maximum ${RATE_LIMIT_MAX} requests per hour. Try again later.`,
      retry_after_seconds: Math.ceil((rlEntry.windowStart + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000),
    });
  }

  const requestStartTime = Date.now();

  try {
    // ── Call Perplexity API ──────────────────────────────────────
    const systemPrompt = useDeep
      ? 'Respond only in clean JSON: { "summary": string (detailed 2-3 paragraph summary), ' +
        '"key_facts": array (10-15 detailed facts), "analysis": string (expert analysis paragraph), ' +
        '"sources": array, "confidence_score": number }. ' +
        "Be thorough, detailed, and cite all sources. Provide expert-level analysis."
      : 'Respond only in clean JSON: { "summary": string, "key_facts": array, ' +
        '"sources": array, "confidence_score": number }. ' +
        "Keep concise, accurate, real-time.";

    const perplexityResponse = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: selectedModel,
        stream: false,
        max_tokens: maxLen,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query.trim() },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: useDeep ? 60000 : 30000,
      }
    );

    // ── Extract response content ────────────────────────────────
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
        sources: [],
        confidence_score: 0.5,
      };
    }

    // ── Enrich with Perplexity citations ─────────────────────────
    const citations = perplexityResponse.data?.citations || [];
    if (
      citations.length > 0 &&
      (!structuredResult.sources || structuredResult.sources.length === 0)
    ) {
      structuredResult.sources = citations;
    }

    // ── Confidence scoring ───────────────────────────────────────
    const rawScore = structuredResult.confidence_score || 0.5;
    const sourceCount = (structuredResult.sources || []).length;
    const factCount = (structuredResult.key_facts || []).length;
    let adjustedScore = rawScore;
    if (sourceCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.05);
    if (sourceCount === 0) adjustedScore = Math.max(0.1, adjustedScore - 0.15);
    if (factCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.03);
    adjustedScore = Math.round(adjustedScore * 100) / 100;
    const confidenceLevel = adjustedScore >= 0.85 ? "high" : adjustedScore >= 0.6 ? "medium" : "low";
    structuredResult.confidence_score = adjustedScore;

    // ── Freshness detection ───────────────────────────────────
    const summaryText = (structuredResult.summary || "") + " " + (structuredResult.key_facts || []).join(" ");
    const currentYear = new Date().getFullYear();
    const hasRecentYear = summaryText.includes(String(currentYear)) || summaryText.includes(String(currentYear - 1));
    const timeWords = /today|yesterday|this week|this month|hours ago|minutes ago|just announced|breaking/i;
    const hasTimeWords = timeWords.test(summaryText);
    const freshness = hasTimeWords ? "real-time" : hasRecentYear ? "recent" : "historical";

    // ── Response time ─────────────────────────────────────────
    const responseTimeMs = Date.now() - requestStartTime;

    // ── Return structured result ────────────────────────────────
    return res.json({
      query: query.trim(),
      tier: selectedTier,
      result: structuredResult,
      confidence: {
        score: adjustedScore,
        level: confidenceLevel,
        sources_count: sourceCount,
        facts_count: factCount,
      },
      freshness,
      metadata: {
        model: perplexityResponse.data?.model || selectedModel,
        api_version: "1.3.0",
        response_time_ms: responseTimeMs,
        timestamp: new Date().toISOString(),
        network: "base",
        price_paid: useDeep ? DEEP_PRICE : PRICE,
      },
      usage: perplexityResponse.data?.usage || null,
    });
  } catch (err) {
    // ── Error handling ──────────────────────────────────────────
    console.error("[/research] Perplexity API error:", err.message);

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
      message: "An unexpected error occurred while processing your research query.",
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
//  POST /free — Promotional Free Queries (First 100)
// ═══════════════════════════════════════════════════════════════════
//
//  Promo: First 100 full research queries are free.
//  Agents send a promo code to get full (non-truncated) results.
//  This gets agents hooked on the quality, then they convert to paid.
//
//  Body: { "query": "...", "promo_code": "AGENT100" }

const PROMO_CODE = process.env.PROMO_CODE || "AGENT100";
const PROMO_MAX_QUERIES = parseInt(process.env.PROMO_MAX_QUERIES, 10) || 100;
let promoQueriesUsed = 0;

app.post("/free", async (req, res) => {
  const { query, promo_code } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "query" string and "promo_code".',
      example: { query: "What are the top DeFi yields on Base?", promo_code: "AGENT100" },
    });
  }

  if (!promo_code || promo_code !== PROMO_CODE) {
    return res.status(403).json({
      error: "Invalid Promo Code",
      message: "Valid promo code required for free queries.",
      hint: "Follow @AgentOracle_AI on X for promo codes.",
    });
  }

  if (promoQueriesUsed >= PROMO_MAX_QUERIES) {
    return res.status(410).json({
      error: "Promotion Ended",
      message: `All ${PROMO_MAX_QUERIES} free queries have been claimed. Use POST /research with x402 payment for full results.`,
      upgrade: "POST /research — $0.02 USDC per query",
      queries_used: promoQueriesUsed,
    });
  }

  if (query.length > 2000) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Query must be 2000 characters or fewer.",
    });
  }

  promoQueriesUsed++;
  const queryNumber = promoQueriesUsed;
  const requestStartTime = Date.now();

  try {
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
          { role: "user", content: query.trim() },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30000,
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
        sources: [],
        confidence_score: 0.5,
      };
    }

    const citations = perplexityResponse.data?.citations || [];
    if (citations.length > 0 && (!structuredResult.sources || structuredResult.sources.length === 0)) {
      structuredResult.sources = citations;
    }

    const rawScore = structuredResult.confidence_score || 0.5;
    const sourceCount = (structuredResult.sources || []).length;
    const factCount = (structuredResult.key_facts || []).length;
    let adjustedScore = rawScore;
    if (sourceCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.05);
    if (sourceCount === 0) adjustedScore = Math.max(0.1, adjustedScore - 0.15);
    if (factCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.03);
    adjustedScore = Math.round(adjustedScore * 100) / 100;
    const confidenceLevel = adjustedScore >= 0.85 ? "high" : adjustedScore >= 0.6 ? "medium" : "low";
    structuredResult.confidence_score = adjustedScore;

    const summaryText = (structuredResult.summary || "") + " " + (structuredResult.key_facts || []).join(" ");
    const currentYear = new Date().getFullYear();
    const hasRecentYear = summaryText.includes(String(currentYear)) || summaryText.includes(String(currentYear - 1));
    const timeWords = /today|yesterday|this week|this month|hours ago|minutes ago|just announced|breaking/i;
    const hasTimeWords = timeWords.test(summaryText);
    const freshness = hasTimeWords ? "real-time" : hasRecentYear ? "recent" : "historical";

    const responseTimeMs = Date.now() - requestStartTime;

    return res.json({
      query: query.trim(),
      tier: "standard",
      promo: {
        code: PROMO_CODE,
        query_number: queryNumber,
        queries_remaining: PROMO_MAX_QUERIES - queryNumber,
        message: queryNumber <= 10
          ? "Welcome! Enjoy your free research queries."
          : `${PROMO_MAX_QUERIES - queryNumber} free queries remaining. Upgrade to x402 paid queries for unlimited access.`,
      },
      result: structuredResult,
      confidence: {
        score: adjustedScore,
        level: confidenceLevel,
        sources_count: sourceCount,
        facts_count: factCount,
      },
      freshness,
      metadata: {
        model: perplexityResponse.data?.model || PERPLEXITY_MODEL,
        api_version: "1.3.0",
        response_time_ms: responseTimeMs,
        timestamp: new Date().toISOString(),
        network: "promo",
        price_paid: "$0.00 (free promo)",
      },
      usage: perplexityResponse.data?.usage || null,
    });
  } catch (err) {
    promoQueriesUsed--; // don't count failed queries
    console.error("[/free] Perplexity API error:", err.message);
    return res.status(502).json({
      error: "Query Failed",
      message: "Could not process query. Your free query was not consumed. Try again.",
    });
  }
});

// GET /free — promo status
app.get("/free", (_req, res) => {
  const remaining = Math.max(0, PROMO_MAX_QUERIES - promoQueriesUsed);
  res.json({
    promo: "First 100 Free Queries",
    code: PROMO_CODE,
    total: PROMO_MAX_QUERIES,
    used: promoQueriesUsed,
    remaining,
    active: remaining > 0,
    how_to_use: {
      method: "POST",
      url: "/free",
      body: { query: "your research question", promo_code: PROMO_CODE },
    },
    after_promo: {
      research: "POST /research — $0.02 USDC via x402",
      deep_research: "POST /deep-research — $0.10 USDC via x402",
    },
  });
});

// ═══════════════════════════════════════════════════════════════════
//  POST /defi — DeFi Vertical Research Endpoint (Promo: Free)
// ═══════════════════════════════════════════════════════════════════
//
//  Specialized DeFi research — optimized prompts for TVL, yields,
//  protocol analysis, token metrics, and market trends.
//  Currently free during beta. Will be $0.02 USDC after beta.

let defiQueriesCount = 0;
const DEFI_BETA_LIMIT = 50;

app.post("/defi", async (req, res) => {
  const { query, protocol, metric } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "query" string.',
      example: {
        query: "What are the current top yield opportunities on Base?",
        protocol: "aave",
        metric: "tvl",
      },
    });
  }

  if (query.length > 2000) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Query must be 2000 characters or fewer.",
    });
  }

  if (defiQueriesCount >= DEFI_BETA_LIMIT) {
    return res.status(410).json({
      error: "Beta Limit Reached",
      message: "DeFi beta queries exhausted. Use POST /research with x402 payment.",
    });
  }

  defiQueriesCount++;
  const requestStartTime = Date.now();

  // Build enhanced DeFi-specific prompt
  let enhancedQuery = query.trim();
  if (protocol) {
    enhancedQuery = `[Protocol: ${protocol}] ${enhancedQuery}`;
  }
  if (metric) {
    enhancedQuery = `[Metric focus: ${metric}] ${enhancedQuery}`;
  }

  try {
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
              'You are a DeFi research analyst. Respond only in clean JSON: { ' +
              '"summary": string (DeFi-focused analysis), ' +
              '"key_facts": array (specific numbers: TVL, APY, volume, price), ' +
              '"protocols_mentioned": array of protocol names, ' +
              '"risk_factors": array (risks and considerations), ' +
              '"sources": array, ' +
              '"confidence_score": number }. ' +
              "Focus on current data, specific metrics, and actionable insights. " +
              "Always include TVL, yields, and volume where relevant.",
          },
          { role: "user", content: enhancedQuery },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30000,
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
        protocols_mentioned: [],
        risk_factors: [],
        sources: [],
        confidence_score: 0.5,
      };
    }

    const citations = perplexityResponse.data?.citations || [];
    if (citations.length > 0 && (!structuredResult.sources || structuredResult.sources.length === 0)) {
      structuredResult.sources = citations;
    }

    const rawScore = structuredResult.confidence_score || 0.5;
    const sourceCount = (structuredResult.sources || []).length;
    const factCount = (structuredResult.key_facts || []).length;
    let adjustedScore = rawScore;
    if (sourceCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.05);
    if (sourceCount === 0) adjustedScore = Math.max(0.1, adjustedScore - 0.15);
    if (factCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.03);
    adjustedScore = Math.round(adjustedScore * 100) / 100;
    const confidenceLevel = adjustedScore >= 0.85 ? "high" : adjustedScore >= 0.6 ? "medium" : "low";

    const summaryText = (structuredResult.summary || "") + " " + (structuredResult.key_facts || []).join(" ");
    const currentYear = new Date().getFullYear();
    const hasRecentYear = summaryText.includes(String(currentYear)) || summaryText.includes(String(currentYear - 1));
    const timeWords = /today|yesterday|this week|this month|hours ago|minutes ago|just announced|breaking/i;
    const hasTimeWords = timeWords.test(summaryText);
    const freshness = hasTimeWords ? "real-time" : hasRecentYear ? "recent" : "historical";

    const responseTimeMs = Date.now() - requestStartTime;

    return res.json({
      query: query.trim(),
      vertical: "defi",
      beta: true,
      result: structuredResult,
      confidence: {
        score: adjustedScore,
        level: confidenceLevel,
        sources_count: sourceCount,
        facts_count: factCount,
      },
      freshness,
      metadata: {
        model: perplexityResponse.data?.model || PERPLEXITY_MODEL,
        api_version: "1.3.0",
        response_time_ms: responseTimeMs,
        timestamp: new Date().toISOString(),
        vertical: "defi",
        price_paid: "$0.00 (beta)",
      },
      defi_beta: {
        queries_used: defiQueriesCount,
        queries_remaining: DEFI_BETA_LIMIT - defiQueriesCount,
      },
      usage: perplexityResponse.data?.usage || null,
    });
  } catch (err) {
    defiQueriesCount--;
    console.error("[/defi] Error:", err.message);
    return res.status(502).json({
      error: "Query Failed",
      message: "Could not process DeFi query. Try again.",
    });
  }
});

// GET /defi — DeFi vertical info
app.get("/defi", (_req, res) => {
  res.json({
    vertical: "defi",
    status: "beta",
    description: "Specialized DeFi research — optimized for TVL, yields, protocol analysis, and market trends.",
    beta_queries_remaining: Math.max(0, DEFI_BETA_LIMIT - defiQueriesCount),
    endpoints: {
      "POST /defi": {
        price: "$0.00 (beta)",
        body: {
          query: "string (required) — your DeFi research question",
          protocol: "string (optional) — focus on a specific protocol",
          metric: "string (optional) — tvl, apy, volume, price",
        },
      },
    },
    example_queries: [
      "What are the top yield opportunities on Base right now?",
      "Compare Aave v3 TVL across all chains",
      "What's the risk profile of Ethena's sUSDe yield?",
      "Latest DEX volume rankings and trends",
    ],
    output_includes: [
      "summary", "key_facts", "protocols_mentioned",
      "risk_factors", "sources", "confidence_score", "freshness"
    ],
    after_beta: "POST /defi will be $0.02 USDC via x402 (same as /research)",
  });
});


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

  // ── Rate limiting ───────────────────────────────────────────────
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const rlEntry = consumeRateLimit(ip);
  setRateLimitHeaders(res, rlEntry);

  if (rlEntry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: "Rate Limited",
      message: `Maximum ${RATE_LIMIT_MAX} requests per hour. Try again later.`,
      retry_after_seconds: Math.ceil((rlEntry.windowStart + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000),
    });
  }

  const requestStartTime = Date.now();

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

    // ── Confidence scoring ───────────────────────────────────────
    const rawScore = structuredResult.confidence_score || 0.5;
    const sourceCount = (structuredResult.sources || []).length;
    const factCount = (structuredResult.key_facts || []).length;
    let adjustedScore = rawScore;
    if (sourceCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.05);
    if (sourceCount === 0) adjustedScore = Math.max(0.1, adjustedScore - 0.15);
    if (factCount >= 5) adjustedScore = Math.min(1, adjustedScore + 0.03);
    adjustedScore = Math.round(adjustedScore * 100) / 100;
    const confidenceLevel = adjustedScore >= 0.85 ? "high" : adjustedScore >= 0.6 ? "medium" : "low";
    structuredResult.confidence_score = adjustedScore;

    // ── Freshness detection ───────────────────────────────────
    const summaryText = (structuredResult.summary || "") + " " + (structuredResult.key_facts || []).join(" ");
    const currentYear = new Date().getFullYear();
    const hasRecentYear = summaryText.includes(String(currentYear)) || summaryText.includes(String(currentYear - 1));
    const timeWords = /today|yesterday|this week|this month|hours ago|minutes ago|just announced|breaking/i;
    const hasTimeWords = timeWords.test(summaryText);
    const freshness = hasTimeWords ? "real-time" : hasRecentYear ? "recent" : "historical";

    // ── Response time ─────────────────────────────────────────
    const responseTimeMs = Date.now() - requestStartTime;

    return res.json({
      query: query.trim(),
      tier: "deep",
      result: structuredResult,
      confidence: {
        score: adjustedScore,
        level: confidenceLevel,
        sources_count: sourceCount,
        facts_count: factCount,
      },
      freshness,
      metadata: {
        model: perplexityResponse.data?.model || PERPLEXITY_MODEL_PRO,
        api_version: "1.3.0",
        response_time_ms: responseTimeMs,
        timestamp: new Date().toISOString(),
        network: "base",
        price_paid: DEEP_PRICE,
      },
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

//  GET /skale — SKALE gasless integration info
// ═══════════════════════════════════════════════════════════════════

app.get("/skale", (_req, res) => {
  res.json({
    status: SKALE_FACILITATOR_READY
      ? (SKALE_IS_TESTNET ? "live_testnet" : "live")
      : "integration_ready",
    facilitator_active: SKALE_FACILITATOR_READY,
    message: SKALE_FACILITATOR_READY
      ? (SKALE_IS_TESTNET
          ? "SKALE gasless payments are live on testnet (Sepolia). " +
            "Mainnet facilitator pending."
          : "SKALE gasless payments are active on mainnet. " +
            "Agents can now pay with zero gas fees on SKALE Base.")
      : "SKALE gasless integration is coded and ready. " +
        "Set SKALE_FACILITATOR_READY=true to activate SKALE gasless payments via PayAI.",
    skale_network: {
      name: SKALE_IS_TESTNET ? "SKALE Base Sepolia" : "SKALE Base",
      chain_id: parseInt(SKALE_NETWORK.split(":")[1]),
      caip2: SKALE_NETWORK,
      testnet: SKALE_IS_TESTNET,
      rpc: "https://skale-base.skalenodes.com/v1/base",
      wss: "wss://skale-base.skalenodes.com/v1/ws/base",
      explorer: "https://skale-base-explorer.skalenodes.com/",
      portal: "https://base.skalenodes.com/chains/base",
      gas_fees: "zero",
      native_token: "CREDIT",
      instant_finality: true,
    },
    payment_token: {
      name: SKALE_USDC_NAME,
      address: SKALE_USDC_ADDRESS,
      decimals: 6,
    },
    facilitator: SKALE_FACILITATOR_URL,
    accepted_networks: {
      base: {
        network: NETWORK,
        research_price: PRICE,
        deep_research_price: DEEP_PRICE,
        gas: "~$0.001 per tx",
      },
      skale_base: {
        network: SKALE_NETWORK,
        research_price: PRICE,
        deep_research_price: DEEP_PRICE,
        gas: "zero",
        note: "Agents pay only the query price, no gas fees",
      },
    },
    how_to_pay: {
      step_1: "Bridge USDC from Base to SKALE Base via the native bridge at https://base.skalenodes.com/chains/base",
      step_2: "Send a POST request to /research or /deep-research",
      step_3: "Receive 402 response with payment requirements for both networks",
      step_4: "Pay with USDC on SKALE Base (zero gas) and resubmit",
    },
    docs: "https://docs.skale.space/cookbook/x402/accepting-payments",
    partnership: "Integration in collaboration with SKALE Labs (@SkaleNetwork)",
  });
});

// ═══════════════════════════════════════════════════════════════════
//  404 Catch-All
// ═══════════════════════════════════════════════════════════════════

app.use((_req, res) => {
  res.status(404).json({
    error: "Not Found",
    available_endpoints: {
      "POST /preview": "Free live preview (truncated results, 10/hr)",
      "POST /research": "Standard research ($0.02 USDC on Base or SKALE gasless)",
      "POST /deep-research": "Deep research with Sonar Pro ($0.10 USDC on Base or SKALE gasless)",
      "POST /free": "Promotional free queries (use code AGENT100)",
      "POST /defi": "DeFi vertical research (beta — free)",
      "GET /health": "Service health check",
      "GET /skale": "SKALE gasless payments info (live — zero gas fees)",
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
  console.log("  x402 Research API v1.3.0 — Live");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Endpoint:     http://localhost:${PORT}/research`);
  console.log(`  Health:       http://localhost:${PORT}/health`);
  console.log(`  Discovery:    http://localhost:${PORT}/.well-known/x402`);
  console.log(`  Manifest:     http://localhost:${PORT}/.well-known/x402.json`);
  console.log(`  Chain:        Base mainnet (${NETWORK})`);
  console.log(`  SKALE:        ${SKALE_NETWORK} ${SKALE_FACILITATOR_READY ? '✔ LIVE' : '⏳ READY (set SKALE_FACILITATOR_READY=true)'}`);
  console.log(`  SKALE Facil:  ${SKALE_FACILITATOR_URL}`);
  console.log(`  Price:        ${PRICE} USDC per query`);
  console.log(`  Pay to:       ${PAY_TO}`);
  console.log(`  Facilitator:  ${FACILITATOR_URL}`);
  console.log(`  Model:        ${PERPLEXITY_MODEL}`);
  console.log("═══════════════════════════════════════════════════");
});
