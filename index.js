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
    console.error("[/preview] Perplexity API error:", err.message);
    return res.status(502).json({
      error: "Preview Unavailable",
      message: "Could not generate preview. Try again shortly.",
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
    version: "1.1.0",
    service: "x402-research-api",
    chain: "base",
    network: NETWORK,
    endpoints: {
      "POST /preview": { price: "free", model: PERPLEXITY_MODEL, note: "Live truncated preview, 10/hr" },
      "POST /research": { price: PRICE, model: PERPLEXITY_MODEL, tier_selector: true },
      "POST /deep-research": { price: DEEP_PRICE, model: PERPLEXITY_MODEL_PRO },
    },
    features: {
      live_preview: true,
      confidence_scoring: true,
      rate_limit_headers: true,
      tier_selector: true,
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

    // ── Return structured result ────────────────────────────────
    return res.json({
      query: query.trim(),
      tier: selectedTier,
      result: structuredResult,
      confidence: {
        score: adjustedScore,
        level: confidenceLevel,
        sources_found: sourceCount,
        facts_extracted: factCount,
      },
      model: perplexityResponse.data?.model || selectedModel,
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

    return res.json({
      query: query.trim(),
      tier: "deep",
      result: structuredResult,
      confidence: {
        score: adjustedScore,
        level: confidenceLevel,
        sources_found: sourceCount,
        facts_extracted: factCount,
      },
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

//  404 Catch-All
// ═══════════════════════════════════════════════════════════════════

app.use((_req, res) => {
  res.status(404).json({
    error: "Not Found",
    available_endpoints: {
      "POST /preview": "Free live preview (truncated results, 10/hr)",
      "POST /research": "Standard research ($0.02 USDC on Base, tier selector available)",
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
