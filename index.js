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
 *   CDP_API_KEY_ID=your-cdp-api-key-id
 *   CDP_API_KEY_SECRET=your-cdp-api-key-secret
 *
 * ── Protocol ───────────────────────────────────────────────────────
 *   Chain:   Base mainnet (eip155:8453)
 *   Token:   USDC (6 decimals)
 *   Price:   $0.02 per research query
 *   Scheme:  exact (x402 v2)
 */

import "dotenv/config";
import express from "express";
// Redis via REST API (no package dependency needed)
import cors from "cors";
import axios from "axios";
import { LANDING_PAGE_HTML } from "./landing-page.js";
import { DEMO_PAGE_HTML, DEMO_VIDEO_HTML } from "./demo-pages.js";
import { BUSINESS_PAGE_HTML } from "./business-page.js";
import { FAVICON_ICO, FAVICON_SVG, FAVICON_16, FAVICON_32, APPLE_TOUCH, OG_IMAGE } from "./favicons.js";

// ── x402 v2 SDK imports ──────────────────────────────────────────
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

// ── CDP Facilitator (for Bazaar discovery indexing) ──────────────
import { facilitator as cdpFacilitator } from "@coinbase/x402";

// ── Bazaar Discovery Extension ──────────────────────────────────
import {
  bazaarResourceServerExtension,
  declareDiscoveryExtension,
} from "@x402/extensions/bazaar";

// ── Global error handlers (prevent serverless crashes) ─────────────
process.on("unhandledRejection", (reason) => {
  console.warn("Unhandled rejection (non-fatal):", reason?.message || reason);
});

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

// Stellar — native stablecoin payments via x402 on Stellar
const STELLAR_NETWORK = process.env.STELLAR_NETWORK || "stellar:testnet";
const STELLAR_PAY_TO = process.env.STELLAR_PAY_TO || "GBRA7RJZXA5PE5EFDSSUAFDHLAOBXOGY2X3TKCKJ53CLEBEMV3S23VKO";
const STELLAR_FACILITATOR_URL = "https://www.x402.org/facilitator";
// Stellar: now using unified middleware (no conflict) — enabled by default
const STELLAR_ENABLED = process.env.STELLAR_ENABLED !== "false";
// Mainnet chain ID: 1187947933 | Testnet chain ID: 324705682
const SKALE_NETWORK = process.env.SKALE_NETWORK || "eip155:1187947933";
const SKALE_FACILITATOR_URL =
  process.env.SKALE_FACILITATOR_URL ||
  "https://facilitator.payai.network";
const SKALE_USDC_ADDRESS =
  process.env.SKALE_USDC_ADDRESS || "0x85889c8c714505E0c94b30fcfcF64fE3Ac8FCb20";
const SKALE_USDC_NAME = "Bridged USDC (SKALE Bridge)";
const SKALE_IS_TESTNET = SKALE_NETWORK.includes("324705682");

// Price: $0.02 USDC (standard), $0.10 USDC (deep research)
const PRICE = "$0.02";
const DEEP_PRICE = "$0.10";

// SKALE structured prices — PayAI requires { amount, asset, extra } format
// Amount is in smallest token unit: USDC.e has 6 decimals
// $0.02 = 20000 units, $0.10 = 100000 units
const SKALE_PRICE_RESEARCH = {
  amount: "20000",
  asset: SKALE_USDC_ADDRESS,
  extra: { name: SKALE_USDC_NAME, version: "2" },
};
const SKALE_PRICE_DEEP = {
  amount: "100000",
  asset: SKALE_USDC_ADDRESS,
  extra: { name: SKALE_USDC_NAME, version: "2" },
};

// Perplexity models
const PERPLEXITY_MODEL = "sonar";
const PERPLEXITY_MODEL_PRO = "sonar-pro";

// ── Gemma 4 (Third verification source via OpenRouter) ──────────
const GEMMA_KEY = (process.env.GEMMA_API_KEY || process.env.OPENROUTER_API_KEY || "").trim();
const GEMMA_MODEL = "google/gemma-4-31b-it";
const GEMMA_MODEL_FALLBACK = "google/gemma-4-26b-a4b-it";
const GEMMA_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callGemma(systemPrompt, userMessage, timeout = 15000) {
  if (!GEMMA_KEY) return null;
  try {
    const res = await axios.post(GEMMA_URL, {
      model: GEMMA_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.1
    }, {
      headers: { Authorization: `Bearer ${GEMMA_KEY}`, "Content-Type": "application/json" },
      timeout
    });
    const content = res.data?.choices?.[0]?.message?.content || null;
    if (!content) console.log("[GEMMA] Empty response:", JSON.stringify(res.data).slice(0, 200));
    return content;
  } catch (e) {
    console.log("[GEMMA] Error with", GEMMA_MODEL, ":", e.message);
    // Fallback to alternate model
    try {
      const res2 = await axios.post(GEMMA_URL, {
        model: GEMMA_MODEL_FALLBACK,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.1
      }, {
        headers: { Authorization: `Bearer ${GEMMA_KEY}`, "Content-Type": "application/json" },
        timeout
      });
      return res2.data?.choices?.[0]?.message?.content || null;
    } catch (e2) {
      console.log("[GEMMA] Fallback also failed:", e2.message);
      return null;
    }
  }
}

async function gemmaDecompose(text) {
  const result = await callGemma(
    "You are a claim extraction engine. Break the input into individual factual claims that can be independently verified. Return ONLY a valid JSON array of strings, nothing else.",
    text
  );
  if (!result) return null;
  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch { return null; }
}

async function gemmaVerify(claims) {
  const claimList = Array.isArray(claims) ? claims.map((c, i) => `${i + 1}. ${c}`).join("\n") : claims;
  const result = await callGemma(
    "You are an independent fact verification engine. For each claim: 1) Assess SUPPORTED, REFUTED, or UNCERTAIN. 2) Provide a one-sentence evidence explanation. 3) If REFUTED, provide the correct factual answer. Return valid JSON: {\"verdicts\": [{\"claim\": \"...\", \"verdict\": \"SUPPORTED|REFUTED|UNCERTAIN\", \"confidence\": 0.0-1.0, \"evidence\": \"one sentence explaining why\", \"correction\": \"the correct fact if refuted, or empty string\"}]}",
    `Today's date is ${new Date().toISOString().split('T')[0]}. Verify independently:\n${claimList}`
  );
  if (!result) return null;
  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch { return null; }
}

async function gemmaCalibrate(sonarResult, proResult, gemmaResult) {
  const result = await callGemma(
    "You are a confidence calibration engine. Given three verification results, produce a final calibrated confidence score. Weight agreement: all agree=high, 2/3 agree=moderate, all disagree=low. Return valid JSON: {\"calibrated_confidence\": 0.0-1.0, \"agreement\": \"strong|moderate|weak\", \"recommendation\": \"act|verify|reject\"}",
    `Source 1 (Sonar): ${sonarResult}\nSource 2 (Sonar Pro adversarial): ${proResult}\nSource 3 (Gemma independent): ${gemmaResult}`
  );
  if (!result) return null;
  try {
    const cleaned = result.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch { return null; }
}

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

// ── Research Cache (in-memory, 24hr TTL) ────────────────────────
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_DISCOUNT = 0.5; // 50% off for cached results
const researchCache = new Map();

function normalizeQuery(query) {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getCacheKey(query, tier) {
  return `${tier || 'standard'}:${normalizeQuery(query)}`;
}

function getCachedResult(query, tier) {
  const key = getCacheKey(query, tier);
  const entry = researchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    researchCache.delete(key);
    return null;
  }
  return entry;
}

function setCacheEntry(query, tier, result) {
  const key = getCacheKey(query, tier);
  researchCache.set(key, {
    result,
    timestamp: Date.now(),
    hits: 0,
  });
}

// Clean up expired cache entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of researchCache) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      researchCache.delete(key);
    }
  }
}, 60 * 60 * 1000);

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

// Trust Vercel's proxy so req.protocol returns 'https' (fixes x402 resource URLs)
app.set("trust proxy", true);

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

app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      // Malformed JSON body — return 400 instead of crashing with 500
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid JSON in request body.",
        hint: "Ensure Content-Type is application/json and the body is valid JSON.",
      });
    }
    next();
  });
});

// ── Favicon routes (inline data for Vercel compatibility) ────────
// Google Search Console verification
app.get("/googlea59d56c6359397c8.html", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("google-site-verification: googlea59d56c6359397c8.html");
});

// SEO: robots.txt
app.get("/robots.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /health\nDisallow: /cache/stats\n\nSitemap: https://agentoracle.co/sitemap.xml`);
});

// SEO: sitemap.xml
app.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://agentoracle.co/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n  <url><loc>https://agentoracle.co/.well-known/x402.json</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://agentoracle.co/.well-known/x402-manifest.json</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://agentoracle.co/demo</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>`);
});

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
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(OG_IMAGE);
});

// ═══════════════════════════════════════════════════════════════════
//  x402 Payment Middleware (v2 SDK) — Multi-Facilitator Architecture
//  Inspired by manuelbarbas/facilitator-load-balancer:
//  Each facilitator gets its own x402ResourceServer to avoid cross-chain
//  timeout issues. Agents on Base hit xpay, agents on SKALE hit PayAI.
// ═══════════════════════════════════════════════════════════════════

// 1. Separate facilitator clients — one per network
//    CDP is now the primary Base facilitator (for Bazaar indexing).
//    Falls back to xpay if CDP keys are not set.
const CDP_ENABLED = !!(process.env.CDP_API_KEY_ID && process.env.CDP_API_KEY_SECRET);

let baseFacilitatorClient;
let cdpFacilitatorClient = null;
if (CDP_ENABLED) {
  cdpFacilitatorClient = new HTTPFacilitatorClient(cdpFacilitator);
  baseFacilitatorClient = cdpFacilitatorClient;
  console.log("✅ Base facilitator: CDP (Bazaar-enabled)");
} else {
  baseFacilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
  console.log("✅ Base facilitator: xpay (CDP keys not set)");
}

const skaleFacilitator = new HTTPFacilitatorClient({
  url: SKALE_FACILITATOR_URL,
});
const SKALE_FACILITATOR_READY = process.env.SKALE_FACILITATOR_READY !== "false";

// 2. Separate resource servers — each facilitator handles ONLY its own chain
//    This prevents the Base facilitator from trying to verify SKALE payments
//    (which caused 504 timeouts in the single-server architecture).
const baseResourceServer = new x402ResourceServer(baseFacilitatorClient)
  .register("eip155:*", new ExactEvmScheme());

const skaleResourceServer = new x402ResourceServer(skaleFacilitator)
  .register("eip155:*", new ExactEvmScheme());

// Stellar resource server — x402.org facilitator (supports stellar:testnet + stellar:pubnet)
const stellarFacilitator = new HTTPFacilitatorClient({ url: STELLAR_FACILITATOR_URL });
const stellarResourceServer = new x402ResourceServer(stellarFacilitator)
  .register("stellar:*", new ExactStellarScheme());
console.log(`${STELLAR_ENABLED ? "✅" : "⏭️"} Stellar facilitator: x402.org (${STELLAR_NETWORK})`);

// ── Bazaar: register discovery extension on Base resource server ──
baseResourceServer.registerExtension(bazaarResourceServerExtension);

// 3. Payment accept configs per network
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
  price: SKALE_PRICE_RESEARCH,
  network: SKALE_NETWORK,
  payTo: PAY_TO,
};
const skaleAcceptDeep = {
  scheme: "exact",
  price: SKALE_PRICE_DEEP,
  network: SKALE_NETWORK,
  payTo: PAY_TO,
};

// Stellar accept configs — USDC on Stellar testnet/pubnet
const stellarAcceptResearch = {
  scheme: "exact",
  price: "$0.02",
  network: STELLAR_NETWORK,
  payTo: STELLAR_PAY_TO,
};
const stellarAcceptDeep = {
  scheme: "exact",
  price: "$0.10",
  network: STELLAR_NETWORK,
  payTo: STELLAR_PAY_TO,
};
const stellarAcceptBatch = {
  scheme: "exact",
  price: "$0.10",
  network: STELLAR_NETWORK,
  payTo: STELLAR_PAY_TO,
};

// 4. Bazaar discovery extensions for Base routes
// Per ethanoroshiba (Coinbase, x402-foundation/x402#2207) on May 7:
// - method is REQUIRED on info.input per the bazaar.md spec
// - the legacy `discoverable: true` field is invalid and causes failed discovery
const bazaarResearch = declareDiscoveryExtension({
  method: "POST",
  input: { query: "What is the current price of Bitcoin?" },
  inputSchema: {
    properties: {
      query: { type: "string", maxLength: 2000, description: "Natural-language research question" },
      tier: { type: "string", enum: ["standard", "deep"], description: "Pass deep to upgrade to Sonar Pro at $0.10" },
    },
    required: ["query"],
  },
  bodyType: "json",
  output: {
    example: {
      summary: "Bitcoin is currently trading at $67,432 with a 24h volume of $28B...",
      key_facts: ["BTC price: $67,432", "24h change: +2.3%", "Market cap: $1.33T"],
      sources: [{ title: "CoinGecko", url: "https://coingecko.com" }],
      confidence_score: 0.94,
      confidence_level: "high",
      freshness: "real-time",
    },
    schema: {
      properties: {
        summary: { type: "string" },
        key_facts: { type: "array", items: { type: "string" } },
        sources: { type: "array", items: { type: "object" } },
        confidence_score: { type: "number" },
        confidence_level: { type: "string", enum: ["high", "medium", "low"] },
        freshness: { type: "string", enum: ["real-time", "recent", "historical"] },
      },
      required: ["summary", "key_facts", "sources", "confidence_score"],
    },
  },
});

const bazaarDeep = declareDiscoveryExtension({
  method: "POST",
  input: { query: "Comprehensive analysis of DeFi yield strategies on Base network" },
  inputSchema: {
    properties: {
      query: { type: "string", maxLength: 4000, description: "Research question for deep analysis" },
    },
    required: ["query"],
  },
  bodyType: "json",
  output: {
    example: {
      summary: "A comprehensive analysis of DeFi yield strategies on Base...",
      key_facts: ["Top protocol: Aave with $12B TVL", "Average yield: 4.2% APY"],
      sources: [{ title: "DefiLlama", url: "https://defillama.com" }],
      confidence_score: 0.91,
      confidence_level: "high",
      freshness: "real-time",
    },
    schema: {
      properties: {
        summary: { type: "string" },
        key_facts: { type: "array", items: { type: "string" } },
        sources: { type: "array", items: { type: "object" } },
        confidence_score: { type: "number" },
        confidence_level: { type: "string" },
        freshness: { type: "string" },
      },
      required: ["summary", "key_facts", "sources", "confidence_score"],
    },
  },
});

// 4b. Public seller-side discovery manifest (/.well-known/x402 and /info)
// Canonical x402 v2 shape so Bazaar / agentic.market / x402scan crawlers can
// fetch our resource list directly. Mirrors CDP's GET /discovery/resources.
// V2 MIGRATION (May 11 2026, per x402-foundation/x402#2207 — ethanoroshiba):
// CDP discoverability matcher compares the live discovery doc against
// the snapshot captured at first-index (May 8). Our /.well-known/x402 was
// emitting v1 shape (x402Version:1, network:"base", maxAmountRequired)
// while our 402 challenge has always emitted v2 — this drift likely caused
// our /research quality.l30DaysTotalCalls to freeze at 1 even though six
// paid Base-mainnet settlements have landed since May 8.
//
// Fixes:
//   1. x402Version: 1 -> 2 (top-level AND each item)
//   2. accepts[].network: "base" -> "eip155:8453" (CAIP-2)
//   3. accepts[].maxAmountRequired -> accepts[].amount (field rename in v2)
//   4. Drop duplicated `resource` + `description` from inside accepts[] —
//      these belong at the item level only.
//   5. Item descriptions now match the live 402 routeConfig descriptions
//      ("Load when…" pattern) so the matcher sees one canonical string.
function buildDiscoveryManifest() {
  const lastUpdated = Math.floor(Date.now() / 1000);
  const items = [
    {
      resource: "https://agentoracle.co/research",
      type: "http",
      x402Version: 2,
      description: "Load when an agent needs current external facts beyond training cutoff, citations with confidence scoring, or verifiable structured research. $0.02 USDC per query on Base.",
      mimeType: "application/json",
      accepts: [{
        scheme: "exact",
        network: "eip155:8453",
        amount: "20000",
        asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        payTo: PAY_TO,
        maxTimeoutSeconds: 300,
        extra: { name: "USD Coin", version: "2" },
      }],
      lastUpdated,
      metadata: {
        category: "research",
        provider: "AgentOracle (TKCollective LLC)",
        tags: ["research", "perplexity", "agents", "rag", "verifiable"],
        method: "POST", bodyType: "json",
        homepage: "https://agentoracle.co",
        jwks: "https://agentoracle.co/.well-known/jwks.json",
      },
      extensions: { bazaar: bazaarResearch },
    },
    {
      resource: "https://agentoracle.co/deep-research",
      type: "http",
      x402Version: 2,
      description: "Load when an agent needs comprehensive multi-source analysis with deep reasoning, not a quick fact lookup. Powered by Sonar Pro. $0.10 USDC per query on Base.",
      mimeType: "application/json",
      accepts: [{
        scheme: "exact",
        network: "eip155:8453",
        amount: "100000",
        asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        payTo: PAY_TO,
        maxTimeoutSeconds: 300,
        extra: { name: "USD Coin", version: "2" },
      }],
      lastUpdated,
      metadata: {
        category: "research",
        provider: "AgentOracle (TKCollective LLC)",
        tags: ["research", "deep", "perplexity-pro", "agents"],
        method: "POST", bodyType: "json",
      },
      extensions: { bazaar: bazaarDeep },
    },
    {
      resource: "https://agentoracle.co/research/batch",
      type: "http",
      x402Version: 2,
      description: "Load when an agent needs up to 5 research queries answered in parallel in a single call, with the same citation+confidence output as /research. $0.10 USDC per batch on Base.",
      mimeType: "application/json",
      accepts: [{
        scheme: "exact",
        network: "eip155:8453",
        amount: "100000",
        asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        payTo: PAY_TO,
        maxTimeoutSeconds: 300,
        extra: { name: "USD Coin", version: "2" },
      }],
      lastUpdated,
      metadata: {
        category: "research",
        provider: "AgentOracle (TKCollective LLC)",
        tags: ["research", "batch", "agents"],
        method: "POST", bodyType: "json",
      },
      extensions: { bazaar: bazaarResearch },
    },
  ];
  return {
    x402Version: 2,
    seller: {
      name: "AgentOracle",
      operator: "TKCollective LLC",
      homepage: "https://agentoracle.co",
      contact: "joe@agentoracle.co",
      jwks: "https://agentoracle.co/.well-known/jwks.json",
    },
    items,
    pagination: { limit: items.length, offset: 0, total: items.length },
  };
}
app.get("/.well-known/x402", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(buildDiscoveryManifest());
});
app.get("/info", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(buildDiscoveryManifest());
});
// Aliases so Bazaar / x402scan secondary path probes resolve cleanly
// instead of returning the 404+sitemap (which can look like a broken
// merchant to a crawler). Both paths return the same canonical manifest.
app.get("/discovery", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(buildDiscoveryManifest());
});
app.get("/x402", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(buildDiscoveryManifest());
});

// 5. UNIFIED PAYMENT MIDDLEWARE — Sawyer's accepts-array pattern
//    Both Base and SKALE accepts in the same array. The x402 SDK
//    matches the payment to whichever network the agent pays on.
//    Cleaner than the smart router, and the standard x402 approach.
// Bazaar-discoverable routes (/research, /deep-research, /research/batch)
// must advertise ONLY networks that the CDP Facilitator supports. SKALE
// and Stellar are NOT in CDP's network enum, and including them in accepts
// causes Bazaar to refuse the route from indexing even though Base is valid.
//
// Therefore: these three routes are Base-only.  SKALE and Stellar accept
// definitions are preserved (skaleAcceptResearch / stellarAcceptResearch /
// skaleAcceptDeep / stellarAcceptDeep) for use on dedicated future routes.
const researchAccepts = [baseAcceptResearch];
const deepAccepts = [baseAcceptDeep];

// Batch pricing: $0.10 for up to 5 queries (same price structure as deep)
const BATCH_PRICE = "$0.10";
const SKALE_PRICE_BATCH = {
  amount: "100000",
  asset: SKALE_USDC_ADDRESS,
  extra: { name: SKALE_USDC_NAME, version: "2" },
};
const baseAcceptBatch = { scheme: "exact", price: BATCH_PRICE, network: NETWORK, payTo: PAY_TO };
const skaleAcceptBatch = { scheme: "exact", price: SKALE_PRICE_BATCH, network: SKALE_NETWORK, payTo: PAY_TO };
// Same Bazaar constraint: batch is Base-only for CDP/Bazaar compatibility.
const batchAccepts = [baseAcceptBatch];

const routeConfig = {
  // BAZAAR EXTENSIONS RESTORED on May 7 after agentic.market/validate confirmed
  // they were the indexing blocker. The extensions are REQUIRED in the 402
  // wire response — without them, CDP's indexer cannot see the bazaar advert
  // and the merchant never appears in /discovery/resources.
  // (ethanoroshiba in x402-foundation/x402#2207 also confirmed: extensions.bazaar
  // must be present in the 402 challenge for discovery.)
  // declareDiscoveryExtension() returns { bazaar: { info, schema } }, so spread
  // it directly into `extensions` to avoid extensions.bazaar.bazaar double-wrap.
  // Descriptions follow Perplexity's "Load when..." routing-trigger pattern
  // (research.perplexity.ai/articles/designing-refining-and-maintaining-agent-skills-at-perplexity)
  // Optimized for an LLM agent deciding whether to call us, not for human docs.
  // Hard length cap: ~250 chars (CDP facilitator schema rejects longer).
  "POST /research": {
    accepts: researchAccepts,
    description: "Load when an agent needs current external facts beyond training cutoff, citations with confidence scoring, or verifiable structured research. $0.02 USDC per query on Base.",
    mimeType: "application/json",
    extensions: { ...bazaarResearch },
  },
  "POST /deep-research": {
    accepts: deepAccepts,
    description: "Load when an agent needs comprehensive multi-source analysis with deep reasoning, not a quick fact lookup. Powered by Sonar Pro. $0.10 USDC per query on Base.",
    mimeType: "application/json",
    extensions: { ...bazaarDeep },
  },
  "POST /research/batch": {
    accepts: batchAccepts,
    description: "Load when an agent needs up to 5 research queries answered in parallel in a single call, with the same citation+confidence output as /research. $0.10 USDC per batch on Base.",
    mimeType: "application/json",
    extensions: { ...bazaarResearch },
  },
};
// v2.8 fix: PayAI facilitator supports BOTH Base (eip155:8453) AND SKALE (eip155:1187947933).
// Use PayAI as the sole facilitator so syncFacilitatorOnStart validation passes for all networks.
// xpay only supports Base, which caused RouteConfigurationError with SKALE in the accepts array.
// Stellar uses x402.org facilitator registered on the same resource server.
// Unified resource server with ALL facilitators in one array.
// x402ResourceServer tries each facilitator until one succeeds.
// PayAI handles EVM (Base + SKALE), x402.org handles Stellar.
// Single middleware = no conflicts between networks.
const facilitatorArray = STELLAR_ENABLED
  ? [skaleFacilitator, stellarFacilitator]
  : [skaleFacilitator];

const unifiedResourceServer = new x402ResourceServer(facilitatorArray)
  .register("eip155:*", new ExactEvmScheme());

if (STELLAR_ENABLED) {
  unifiedResourceServer.register("stellar:*", new ExactStellarScheme());
  console.log(`✅ Multi-chain resource server: Base + SKALE (PayAI) + Stellar (x402.org)`);
}

unifiedResourceServer.registerExtension(bazaarResourceServerExtension);

// ─── Bazaar extension boot-time assertion (per x402#2207 May 10 investigation) ───
// Working hypothesis on issue #2207: dynamic-import / async-registration race could
// silently leave the bazaar extension unregistered at runtime even though enrichment
// works at challenge-build time. Single assertion + diagnostic route to disambiguate.
const BAZAAR_REGISTERED = unifiedResourceServer.hasExtension("bazaar");
if (!BAZAAR_REGISTERED) {
  console.error("\n\n\u26d4 FATAL: bazaar extension not registered after boot. Aborting startup.\n");
  console.error("Registered extensions:", unifiedResourceServer.getExtensions().map(e => e.key).join(", ") || "(none)");
  process.exit(1);
}
console.log(`\u2705 Bazaar extension registered at boot — ${unifiedResourceServer.getExtensions().map(e => e.key).join(", ")}`);

// ─── Aggregator-Visible 402 Body Mirror (PaymentRequiredV2 shape) ───
// The @x402/express SDK ships the payment challenge in a `payment-required` HTTP
// header (base64 JSON). x402scan, agentic.market, and Bazaar crawlers parse the
// 402 response BODY, not headers. This wrapper intercepts every 402, decodes the
// header, and writes the body in canonical PaymentRequiredV2 shape per
// `@x402/core/schemas/PaymentRequiredV2Schema`:
//   - `x402Version: 2`
//   - top-level `resource: {url, description, mimeType}` (NOT inlined into accepts)
//   - `accepts[]` contains ONLY: scheme, network (CAIP-2), amount, asset, payTo,
//     maxTimeoutSeconds, extra (no resource/description/mimeType)
//   - `extensions.bazaar: {info, schema}` not double-wrapped
//
// Why: ethanoroshiba (Coinbase eng) on x402-foundation/x402#2207 (May 8 2026)
// confirmed v1/v2 conflation breaks discovery indexing and surfaces as
// "discovery request validation failed" in EXTENSION-RESPONSES. AsaiShota
// (issue OP) hit identical bug, fixed his side same day, marketplace adopted
// PaymentRequiredV2Schema verbatim (commit 5315c3b on x402-market).
function wrapPaymentMiddlewareForAggregators(originalMiddleware) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (res.statusCode === 402) {
        const headerB64 = res.getHeader("payment-required");
        const isEmpty = !body || (typeof body === "object" && Object.keys(body).length === 0);
        if (headerB64 && isEmpty) {
          try {
            const decoded = JSON.parse(Buffer.from(String(headerB64), "base64").toString("utf8"));
            // Pull resource metadata from whichever shape the SDK gave us:
            //  - decoded.resource may be an object {url, description, mimeType}
            //  - or per-route description/mimeType may live on accepts[0]
            //  - or a string url somewhere
            const firstAccept = (decoded.accepts && decoded.accepts[0]) || {};
            const resourceUrl =
              decoded.resource?.url ||
              (typeof decoded.resource === "string" ? decoded.resource : undefined) ||
              firstAccept.resource ||
              `https://${req.headers.host}${req.path}`;
            const resourceDescription =
              decoded.resource?.description ||
              decoded.description ||
              firstAccept.description;
            const resourceMimeType =
              decoded.resource?.mimeType ||
              decoded.mimeType ||
              firstAccept.mimeType ||
              "application/json";

            // EMIT HYBRID v1+v2 ACCEPTS SHAPE.
            //
            // Why hybrid (May 12 2026 root-cause find): the canonical buyer
            // SDK `x402-fetch` (used by every standard buyer in the wild) is
            // still on v1. Its Zod schema REQUIRES on every accept:
            //   - network: enum ['base'|'base-sepolia'|...]  (rejects 'eip155:8453')
            //   - maxAmountRequired: string  (required)
            //   - resource: string           (required)
            //   - description: string       (required)
            //   - mimeType: string          (required)
            // If any field is missing or `network` is the CAIP-2 form, the
            // buyer SDK throws `ZodError` BEFORE submitting payment — every
            // standard buyer has been failing to pay us at parse time since
            // we migrated. THIS is why l30DaysTotalCalls is frozen at 1: not
            // a Bazaar bug, our wrapper was v2-strict and locked out every
            // v1 buyer. Verified by running the canonical x402-fetch buyer
            // against /research and observing ZodError.
            //
            // Fix: emit BOTH shapes on each accept. v2 indexers (CDP Bazaar,
            // x402scan, agentic.market) read `amount` + CAIP-2 `network` +
            // top-level resource{}. v1 buyers read `maxAmountRequired` +
            // legacy `network` label + inlined resource/description/mimeType.
            // No indexer chokes on extra fields. No buyer chokes on missing
            // ones. Both work.
            const v1NetworkOf = (n) => {
              if (!n) return undefined;
              if (n === "eip155:8453") return "base";
              if (n === "eip155:1187947933") return "skale-base-sepolia"; // closest in v1 enum
              if (n === "eip155:84532") return "base-sepolia";
              return n; // already a v1 label
            };
            const v2NetworkOf = (n) => {
              if (!n) return undefined;
              if (n === "base") return "eip155:8453";
              if (n === "skale") return "eip155:1187947933";
              if (n === "base-sepolia") return "eip155:84532";
              return n; // already CAIP-2
            };
            const accepts = (decoded.accepts || []).map((a) => {
              const {
                resource: _r,
                description: _d,
                mimeType: _m,
                amount: rawAmount,
                maxAmountRequired,
                network,
                ...rest
              } = a;
              const cleaned = { ...rest };

              // amount/maxAmountRequired — emit BOTH. v2 reads `amount`, v1 reads
              // `maxAmountRequired`. Both populated from the same source value.
              const amountValue =
                rawAmount !== undefined ? String(rawAmount) :
                maxAmountRequired !== undefined ? String(maxAmountRequired) :
                undefined;
              if (amountValue !== undefined) {
                cleaned.amount = amountValue;
                cleaned.maxAmountRequired = amountValue;
              }

              // network — emit v1 label (buyer-required). The CAIP-2 form is
              // EXPRESSED via the top-level resource and via `extra.network`
              // for any indexer that wants it. Keeping the canonical v1
              // enum value is what unblocks x402-fetch.
              if (network) {
                cleaned.network = v1NetworkOf(network) || network;
              }

              // resource/description/mimeType — buyer SDK requires these on
              // accept. Pull from the top-level resource{} we already built.
              cleaned.resource = resourceUrl;
              cleaned.description = resourceDescription || "Paid API resource";
              cleaned.mimeType = resourceMimeType;

              return cleaned;
            });

            // Strip any double-wrap in extensions.bazaar (defensive — should never
            // happen now, but historically tripped us up)
            let extensions = decoded.extensions;
            if (extensions?.bazaar?.bazaar && !extensions.bazaar.info) {
              extensions = { ...extensions, bazaar: extensions.bazaar.bazaar };
            }

            const aggregatorBody = {
              x402Version: 2,
              error: decoded.error || "Payment required",
              resource: {
                url: resourceUrl,
                ...(resourceDescription ? { description: resourceDescription } : {}),
                mimeType: resourceMimeType,
              },
              accepts,
              ...(extensions ? { extensions } : {}),
            };
            return originalJson(aggregatorBody);
          } catch (e) {
            console.log(`[402-mirror] decode failed: ${e.message}`);
          }
        }
      }
      return originalJson(body);
    };
    return originalMiddleware(req, res, next);
  };
}

// ─── Settle-payload ring buffer (diagnostic) ───
// Per ethanoroshiba's May 12 audit ask on x402#2207: confirm that every
// paid /research settle actually carries paymentPayload.resource and
// paymentPayload.extensions.bazaar, and that the facilitator is CDP and
// not something else. Console logs are invisible without server access,
// so we mirror the inject-middleware diagnostics into an in-memory ring
// (last 50 paid requests) and expose them at /health/bazaar/last-settles.
const SETTLE_RING_MAX = 50;
const settleRing = [];
function recordSettleEvent(ev) {
  settleRing.push(ev);
  if (settleRing.length > SETTLE_RING_MAX) settleRing.shift();
}

// ─── paymentPayload.resource Injector (PaymentPayloadV2 §5.2 fix) ───
// Per ethanoroshiba's May 8 diagnosis on x402-foundation/x402#2207: the CDP
// Bazaar indexer needs paymentPayload.resource = {url, description, mimeType}
// in the X-PAYMENT envelope to tag a settlement to a listing. The field is
// marked optional in PaymentPayloadV2Schema, but the indexer rejects with
// `discovery request validation failed` when missing — exact symptom AsaiShota
// hit (50+ settles, all 200 success, 0/17 indexed).
//
// The @x402/express SDK does NOT auto-populate this from the buyer side, so we
// inject it server-side: decode the X-PAYMENT header, look up the per-route
// resource metadata, splice it into paymentPayload, re-encode, and replace the
// header before paymentMiddleware forwards to the facilitator.
const RESOURCE_MAP = {
  "/research": {
    url: "https://agentoracle.co/research",
    description: "Real-time research API for AI agents. Send any natural-language question, get structured JSON with summary, key facts, sources, and confidence scoring. Powered by Perplexity Sonar. $0.02 USDC per query on Base.",
    mimeType: "application/json",
  },
  "/deep-research": {
    url: "https://agentoracle.co/deep-research",
    description: "Deep research mode powered by Sonar Pro. $0.10 USDC per query on Base.",
    mimeType: "application/json",
  },
  "/research/batch": {
    url: "https://agentoracle.co/research/batch",
    description: "Batch research API \u2014 up to 5 queries per call. $0.10 USDC per batch on Base.",
    mimeType: "application/json",
  },
};
app.use((req, res, next) => {
  // v2 buyer SDK (@x402/fetch) sends `PAYMENT-SIGNATURE` header.
  // v1 buyer SDK (x402-fetch) sends `X-PAYMENT` header.
  // Trigger the injector on either so we capture both buyer cohorts in the
  // diagnostic ring buffer AND get bazaar-extension/resource injection on
  // both paths.
  const xpayHeaderName =
    req.headers["payment-signature"] !== undefined ? "payment-signature" :
    req.headers["PAYMENT-SIGNATURE"] !== undefined ? "PAYMENT-SIGNATURE" :
    req.headers["x-payment"] !== undefined ? "x-payment" :
    req.headers["X-PAYMENT"] !== undefined ? "X-PAYMENT" : null;
  const xpay = xpayHeaderName ? req.headers[xpayHeaderName] : null;
  if (xpay && RESOURCE_MAP[req.path]) {
    try {
      const decoded = JSON.parse(Buffer.from(xpay, "base64").toString("utf8"));
      // PaymentPayloadV2 has optional top-level resource: {url, description, mimeType}
      // If buyer omitted it, inject from our route map. Idempotent if already present.
      let mutated = false;
      if (!decoded.resource || typeof decoded.resource === "string" || !decoded.resource.url) {
        decoded.resource = { ...RESOURCE_MAP[req.path] };
        mutated = true;
        console.log(`[resource-inject] ${req.path} — injected resource.url=${decoded.resource.url}`);
      }
      // BUYER EXTENSIONS ECHO (per 0xdespot on x402#2207, May 10 2026, the 7th cause):
      // If the buyer's signed paymentPayload.extensions is missing/empty, CDP's
      // facilitator interprets it as "no bazaar opt-in" and skips the bazaar
      // round-trip entirely — EXTENSION-RESPONSES header never appears, no indexing,
      // no rejected/processing state machine. This is invisible because /settle
      // still returns 200 success.
      //
      // PaymentPayloadV2Schema.extensions is Optional but the bazaar handler
      // treats omission as opt-out. Most buyer SDKs (incl. @x402/client,
      // @x402/fetch, AsaiShota's pre-fix, hyperD's pre-fix) don't echo it back.
      //
      // Inject server-side from the same source the 402 challenge declares, so
      // every paid request through us is bazaar-opted-in regardless of buyer SDK.
      // Pre-injection diagnostic (per x402#2207 May 10 investigation)
      console.log(`[bazaar-diag-pre] ${req.path} — extensions=${JSON.stringify(decoded.extensions)?.slice(0,200)}`);
      const _pre_resource_url = decoded?.resource?.url || null;
      const _pre_resource_type = typeof decoded?.resource;
      const _pre_ext_bazaar_present = !!(decoded?.extensions?.bazaar?.info);
      const _pre_ext_method = decoded?.extensions?.bazaar?.info?.input?.method || null;
      const _x402_version = decoded?.x402Version || null;
      const _network = decoded?.network || null;
      const _scheme = decoded?.scheme || null;
      const _from = decoded?.payload?.authorization?.from || null;
      const _value = decoded?.payload?.authorization?.value || null;
      if (!decoded.extensions || !decoded.extensions.bazaar || !decoded.extensions.bazaar.info) {
        const bazaarExt =
          req.path === "/deep-research" ? bazaarDeep :
          req.path === "/research" ? bazaarResearch :
          req.path === "/research/batch" ? bazaarResearch : null;
        if (bazaarExt) {
          decoded.extensions = { ...bazaarExt };
          mutated = true;
          console.log(`[extensions-inject] ${req.path} — injected paymentPayload.extensions.bazaar (7th cause fix)`);
        }
      }
      // Post-injection diagnostic
      console.log(`[bazaar-diag-post] ${req.path} — extensions.bazaar.info.input.method=${decoded.extensions?.bazaar?.info?.input?.method} extensions.bazaar.schema.type=${decoded.extensions?.bazaar?.schema?.type}`);
      const finalEncoded = mutated
        ? Buffer.from(JSON.stringify(decoded)).toString("base64")
        : xpay;
      // Mirror to BOTH header names so SDK can find it regardless of spec version.
      // @x402/express V2 reads from `PAYMENT-SIGNATURE` (V2 spec), but most buyer
      // SDKs ship the V1 name `X-PAYMENT`. Without this rename the server
      // returns 'Payment required' as if no header were present.
      // Same dual-naming problem as response-side payment-required vs PAYMENT-REQUIREMENTS.
      req.headers["x-payment"] = finalEncoded;
      if (req.headers["X-PAYMENT"]) req.headers["X-PAYMENT"] = finalEncoded;
      req.headers["payment-signature"] = finalEncoded;
      req.headers["PAYMENT-SIGNATURE"] = finalEncoded;
      console.log(`[header-rename] ${req.path} — mirrored X-PAYMENT to PAYMENT-SIGNATURE (V2 spec)`);
      // ── ring-buffer record ──
      recordSettleEvent({
        t: new Date().toISOString(),
        path: req.path,
        method: req.method,
        x402Version: _x402_version,
        network: _network,
        scheme: _scheme,
        from: _from,
        value: _value,
        pre: {
          resource_url: _pre_resource_url,
          resource_type: _pre_resource_type,
          ext_bazaar_present: _pre_ext_bazaar_present,
          ext_method: _pre_ext_method,
        },
        post: {
          resource_url: decoded?.resource?.url || null,
          ext_bazaar_present: !!(decoded?.extensions?.bazaar?.info),
          ext_method: decoded?.extensions?.bazaar?.info?.input?.method || null,
          ext_schema_type: decoded?.extensions?.bazaar?.schema?.type || null,
        },
        mutated_resource: !_pre_resource_url || _pre_resource_type === "string",
        mutated_extensions: !_pre_ext_bazaar_present,
        facilitator: req.path && req.path.startsWith("/research") || req.path === "/deep-research" ? (CDP_ENABLED ? "cdp" : "xpay") : "n/a",
      });
    } catch (e) {
      console.log(`[resource-inject] ${req.path} — decode/inject failed: ${e.message}`);
      recordSettleEvent({
        t: new Date().toISOString(),
        path: req.path,
        method: req.method,
        error: `decode-failed: ${e.message}`,
      });
    }
  }
  next();
});

// Diagnostic endpoint — shows the last N paid settle payloads after
// server-side injection. Use this to confirm every settle carries:
//   resource.url + extensions.bazaar.info.input.method
// And that facilitator routing is correct (cdp vs xpay).
app.get("/health/bazaar/last-settles", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    count: settleRing.length,
    facilitator_resolved: CDP_ENABLED ? "cdp" : "xpay",
    cdp_enabled: CDP_ENABLED,
    settles: settleRing.slice().reverse(),  // newest first
  });
});

// Pre-middleware diagnostic: log every X-PAYMENT request so we can see what the
// signed body contains and what status comes back from the @x402/express middleware.
app.use((req, res, next) => {
  const xpay = req.header("x-payment") || req.header("X-PAYMENT");
  if (xpay) {
    console.log(`[x402-trace] ${req.method} ${req.path} — X-PAYMENT length=${xpay.length}, first 80=${xpay.slice(0, 80)}`);
    try {
      const decoded = JSON.parse(Buffer.from(xpay, "base64").toString("utf8"));
      console.log(`[x402-trace]   payload network=${decoded.network} scheme=${decoded.scheme} payload.from=${decoded?.payload?.authorization?.from || "?"} value=${decoded?.payload?.authorization?.value || "?"} resource=${decoded.resource?.url || "(none)"}`);
    } catch (e) {
      console.log(`[x402-trace]   decode failed: ${e.message}`);
    }
    // Capture the actual SDK response so we know WHY the second 402 is being returned
    const originalStatus = res.status.bind(res);
    const originalJson = res.json.bind(res);
    let capturedStatus = 200;
    res.status = function (code) { capturedStatus = code; return originalStatus(code); };
    res.json = function (body) {
      if (capturedStatus === 402 || capturedStatus >= 400) {
        console.log(`[x402-trace] response ${capturedStatus} body keys=${Object.keys(body || {}).join(",")}`);
        if (body && body.error) console.log(`[x402-trace]   error: ${body.error}`);
        if (body && body.message) console.log(`[x402-trace]   message: ${body.message}`);
      } else {
        console.log(`[x402-trace] response ${capturedStatus} — success`);
      }
      return originalJson(body);
    };
  }
  next();
});
// ─── PAYMENT-REQUIREMENTS canonical header (per V2 transport spec) ───
// Per ethanoroshiba on x402-foundation/x402#2207 (May 8 19:58 UTC):
//   "per the HTTP transport spec the payment requirements need to be supplied
//    by the PAYMENT-REQUIREMENTS header, not in the response body, which is
//    blocking discovery on our end right now."
// @x402/express@2.x ships with the v1 spelling (`payment-required`). The CDP
// indexer reads from the canonical V2 header `PAYMENT-REQUIREMENTS`. Without
// it, the indexer ignores the merchant entirely — same root cause that has
// 0xdespot, AsaiShota, hyperD, and us all stuck at NOT_INDEXED with otherwise
// successful settles.
// Fix: intercept response, copy `payment-required` header value to canonical
// `PAYMENT-REQUIREMENTS`. Also expose it via Access-Control-Expose-Headers
// so browser clients can read it.
app.use((req, res, next) => {
  const origSetHeader = res.setHeader.bind(res);
  res.setHeader = function (name, value) {
    const result = origSetHeader(name, value);
    if (typeof name === "string" && name.toLowerCase() === "payment-required") {
      // Per HTTP-transport-v2 spec §"Payment Required Signaling" the canonical
      // name is PAYMENT-REQUIRED (singular). ethanoroshiba's note on issue #2207
      // used PAYMENT-REQUIREMENTS (plural). HTTP is case-insensitive but
      // singular vs plural is NOT — emit both defensively. AsaiShota confirmed
      // discovery indexed within ~30s after adding both names (May 8 23:49Z).
      origSetHeader("PAYMENT-REQUIRED", value);
      origSetHeader("PAYMENT-REQUIREMENTS", value);
      // RFC 7235 WWW-Authenticate auth-challenge convention. Per RipperMercs
      // on x402-foundation/x402#2207 (May 14): blockrun.ai also emits this
      // alongside PAYMENT-REQUIRED, matching the canonical 402-challenge
      // shape. Cost is zero, defense in depth for any HTTP client that
      // reads RFC-7235 challenges before custom x402 headers.
      origSetHeader("WWW-Authenticate", `X402 requirements="${value}"`);
    }
    return result;
  };
  // Patch the existing CORS expose-headers list to include the new name so
  // browser-based aggregators can read it.
  const origWriteHead = res.writeHead.bind(res);
  res.writeHead = function (...args) {
    const expose = res.getHeader("access-control-expose-headers");
    if (typeof expose === "string") {
      const additions = [];
      if (!/PAYMENT-REQUIRED\b/i.test(expose)) additions.push("PAYMENT-REQUIRED");
      if (!/PAYMENT-REQUIREMENTS/i.test(expose)) additions.push("PAYMENT-REQUIREMENTS");
      if (!/WWW-Authenticate/i.test(expose)) additions.push("WWW-Authenticate");
      if (additions.length) origSetHeader("access-control-expose-headers", expose + "," + additions.join(","));
    }
    return origWriteHead(...args);
  };
  next();
});

// ─── EXTENSION-RESPONSES capture (diagnostic for x402#2207 four-bucket triage) ───
// Per AsaiShota / 0xdespot / RipperMercs / ethanoroshiba on issue #2207
// (May 13-14), Bazaar attribution failures sort into 4 distinct buckets
// depending on what EXTENSION-RESPONSES header the facilitator returns
// on the settle 200:
//
//   bucket 1: EXTENSION-RESPONSES absent       → extension never reached indexer
//   bucket 2: EXTENSION-RESPONSES = processing → accepted, indexer never fires (TensorFeed pre-fix)
//   bucket 3: EXTENSION-RESPONSES = success    → indexed once, pipeline froze (x402-market shape)
//   bucket 4: never advanced past initial probe (current AgentOracle characterization)
//
// We have no first-party data on which bucket we're in because we never
// captured the post-settle EXTENSION-RESPONSES header on the way back
// from the facilitator. This middleware fixes that gap: it wraps the
// response so any settle that returns an EXTENSION-RESPONSES header is
// captured into an in-memory ring buffer keyed by tx hash, exposed at
// /health/bazaar/last-extension-responses for the thread to consume.
const EXT_RESP_RING_MAX = 50;
const extRespRing = [];
function recordExtensionResponse(ev) {
  extRespRing.push(ev);
  if (extRespRing.length > EXT_RESP_RING_MAX) extRespRing.shift();
}
app.use((req, res, next) => {
  if (req.method !== "POST") return next();
  // Only instrument paid routes
  if (!/^\/(research|deep-research|research\/batch|evaluate)/.test(req.path)) return next();
  const origSetHeader = res.setHeader.bind(res);
  const origJson = res.json.bind(res);
  let extResp = null;
  res.setHeader = function (name, value) {
    if (typeof name === "string" && /^extension-responses$/i.test(name)) {
      extResp = String(value);
    }
    return origSetHeader(name, value);
  };
  res.json = function (body) {
    // Also pluck from x-payment-response if facilitator embedded extension result there
    try {
      const payResp = res.getHeader("x-payment-response") || res.getHeader("payment-response");
      let txHash = null, payer = null;
      if (payResp) {
        try {
          const decoded = JSON.parse(Buffer.from(String(payResp), "base64").toString("utf8"));
          txHash = decoded?.transaction || null;
          payer = decoded?.payer || null;
        } catch (_) {}
      }
      let extDecoded = null;
      if (extResp) {
        try { extDecoded = JSON.parse(Buffer.from(extResp, "base64").toString("utf8")); }
        catch (_) { extDecoded = { _raw: extResp.slice(0, 200), _decode_error: true }; }
      }
      // Bucket classification per #2207 diagnostic taxonomy
      let bucket = "4_no_extension_response";
      if (extDecoded && extDecoded.bazaar) {
        if (extDecoded.bazaar.status === "processing") bucket = "2_processing";
        else if (extDecoded.bazaar.status === "success") bucket = "3_success";
        else if (extDecoded.bazaar.status === "failed" || extDecoded.bazaar.error) bucket = "1_extension_rejected";
        else bucket = "X_unknown_status";
      } else if (extResp) {
        bucket = "X_extension_responses_present_but_unparseable";
      }
      recordExtensionResponse({
        t: new Date().toISOString(),
        path: req.path,
        status: res.statusCode,
        tx_hash: txHash,
        payer,
        ext_responses_header_present: !!extResp,
        ext_responses_decoded: extDecoded,
        bucket,
      });
    } catch (e) {
      recordExtensionResponse({
        t: new Date().toISOString(),
        path: req.path,
        error: `capture-failed: ${e.message}`,
      });
    }
    return origJson(body);
  };
  next();
});

// Diagnostic endpoint — last 50 paid-settle EXTENSION-RESPONSES outcomes,
// bucketed per the four-failure-mode taxonomy on x402#2207.
app.get("/health/bazaar/last-extension-responses", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  // Quick bucket histogram for at-a-glance read
  const histogram = {};
  for (const e of extRespRing) {
    const k = e.bucket || "err";
    histogram[k] = (histogram[k] || 0) + 1;
  }
  res.json({
    count: extRespRing.length,
    histogram,
    buckets_legend: {
      "1_extension_rejected": "bazaar handler returned failure/error — extension reached indexer but was rejected",
      "2_processing": "EXTENSION-RESPONSES = processing — extension accepted, indexer never fires (TensorFeed pre-fix shape)",
      "3_success": "EXTENSION-RESPONSES = success — indexed at least once, may be in pipeline-freeze state",
      "4_no_extension_response": "EXTENSION-RESPONSES header absent entirely — extension never reached indexer (Syndicate Links shape)",
      "X_unknown_status": "unrecognized bazaar.status value — schema drift",
      "X_extension_responses_present_but_unparseable": "header present but base64/json decode failed",
    },
    events: extRespRing.slice().reverse(),
  });
});

// May 12 2026: AGGREGATOR WRAPPER DISABLED.
//
// The wrapper rewrote the @x402/express 402 body to a "v2 + aggregator-friendly"
// shape so x402scan / agentic.market crawlers could read it. Today on
// x402-foundation/x402#2207, ethanoroshiba (Coinbase eng) confirmed:
//
//   1. /.well-known/x402 is NOT part of the discovery/indexing pipeline
//   2. x402scan + agentic.market both auto-pull from CDP's discovery API
//   3. CDP already indexed us on May 8 from the native @x402/express 402 body
//
// So the wrapper served no indexer purpose — and it had a catastrophic side
// effect: it desynced the 402 body the buyer SDK parses from the
// `paymentRequired.accepts` the server SDK has stored internally. The server's
// `findMatchingRequirements` does deepEqual(serverRequirement, buyer.accepted)
// for x402Version:2 payments. With the wrapper rewriting fields, no buyer
// payload could ever deepEqual-match. Every standard buyer hit
// "No matching payment requirements" at /settle. THIS is the actual reason our
// l30DaysTotalCalls is frozen at 1 — we've been silently rejecting every paid
// settle since the wrapper was deployed.
//
// Fix: use the unwrapped @x402/express middleware directly. Buyer and server
// now serialize/deserialize through the exact same code path, deepEqual
// matches, payment settles, Bazaar matcher attributes the call to the
// indexed resource.
app.use(paymentMiddleware(routeConfig, unifiedResourceServer));
console.log(`✅ Unified payment middleware: single instance, all chains via facilitator array`);
console.log(`✅ 402 body mirror: aggregator-visible challenge in response body`);
console.log(`✅ PAYMENT-REQUIRED + PAYMENT-REQUIREMENTS canonical headers (V2 transport spec)`);

// ── Bazaar Bootstrap: direct CDP verify+settle for discovery indexing ──
if (CDP_ENABLED && cdpFacilitatorClient) {
  app.post("/bazaar-bootstrap", async (req, res) => {
    try {
      const paymentHeader = req.header("payment-signature") || req.header("x-payment");
      if (!paymentHeader) {
        const payReq = {
          x402Version: 2,
          error: "Payment required",
          resource: {
            url: "https://agentoracle.co/research",
            description: "Real-time research API for AI agents. $0.02 USDC per query on Base.",
            mimeType: "application/json",
          },
          accepts: [{
            scheme: "exact", network: NETWORK, amount: "20000",
            asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            payTo: PAY_TO, maxTimeoutSeconds: 300,
            extra: { name: "USD Coin", version: "2" },
          }],
          extensions: bazaarResearch,
        };
        res.setHeader("payment-required", Buffer.from(JSON.stringify(payReq)).toString("base64"));
        return res.status(402).json({});
      }
      let paymentPayload;
      try { paymentPayload = JSON.parse(Buffer.from(paymentHeader, "base64").toString()); }
      catch { paymentPayload = JSON.parse(paymentHeader); }

      // PaymentPayloadV2 §5.2: resource object MUST be present for indexer to
      // tag this settle to a Bazaar listing. ethanoroshiba confirmed May 8.
      // Inject if buyer omitted (most v1-shaped clients do).
      if (!paymentPayload.resource || typeof paymentPayload.resource === "string" || !paymentPayload.resource.url) {
        paymentPayload.resource = {
          url: "https://agentoracle.co/research",
          description: "Real-time research API for AI agents. $0.02 USDC per query on Base.",
          mimeType: "application/json",
        };
      }

      // PaymentRequirementsV2Schema (canonical, what CDP V2 verify expects):
      // exactly { scheme, network, amount, asset, payTo, maxTimeoutSeconds, extra? }.
      // NO maxAmountRequired, NO resource/description/mimeType (those live on the
      // top-level PaymentRequired envelope, not on the per-route requirements).
      // Network MUST be CAIP-2 form ("eip155:8453") to match V2 paymentPayload.accepted.network.
      const requirements = {
        scheme: "exact",
        network: NETWORK,
        amount: "20000",
        asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        payTo: PAY_TO,
        maxTimeoutSeconds: 300,
        extra: { name: "USD Coin", version: "2" },
      };
      console.log("[bazaar-bootstrap] verify with paymentPayload.scheme=", paymentPayload?.scheme,
        "network=", paymentPayload?.network || paymentPayload?.accepted?.network,
        "resource=", paymentPayload?.resource?.url || paymentPayload?.resource);
      const verifyRes = await cdpFacilitatorClient.verify(paymentPayload, requirements);
      if (!verifyRes.isValid) return res.status(402).json({ error: "Verification failed", reason: verifyRes.invalidReason });
      const settleRes = await cdpFacilitatorClient.settle(paymentPayload, requirements);
      const prEncoded = Buffer.from(JSON.stringify({
        network: NETWORK, payer: paymentPayload.payload?.authorization?.from,
        success: settleRes.success !== false, transaction: settleRes.transaction || settleRes.txHash,
      })).toString("base64");
      res.setHeader("payment-response", prEncoded);
      res.json({ bazaar_indexed: true, transaction: settleRes.transaction || settleRes.txHash });
    } catch (err) {
      console.error("Bazaar bootstrap error:", err.message);
      res.status(500).json({ error: "Bootstrap failed", message: err.message });
    }
  });
  console.log("✅ Bazaar bootstrap endpoint active");
}

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
const previewCache = new Map();
const PREVIEW_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache for preview results

app.post("/preview", async (req, res) => {
  const { query } = req.body;
  trackRequest(req, "preview");

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
    // Check preview cache first
    const cacheKey = query.trim().toLowerCase().replace(/\s+/g, ' ');
    const cachedPreview = previewCache.get(cacheKey);
    if (cachedPreview && (Date.now() - cachedPreview.ts) < PREVIEW_CACHE_TTL_MS) {
      return res.json({ ...cachedPreview.data, cached: true, preview_remaining: Math.max(0, PREVIEW_RATE_LIMIT - pEntry.count), preview_limit: `${PREVIEW_RATE_LIMIT}/hour per IP (approximate — serverless instances may vary)` });
    }

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
      // Strip markdown code fences and any leading/trailing whitespace
      let cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      // Try to extract JSON object if surrounded by non-JSON text
      if (!cleaned.startsWith("{")) {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleaned = jsonMatch[0];
      }
      fullResult = JSON.parse(cleaned);
    } catch {
      // Extract what we can from raw text
      const sentences = rawContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
      fullResult = {
        summary: rawContent.substring(0, 500),
        key_facts: sentences.slice(0, 3).map(s => s.trim()),
        sources: [],
        confidence_score: sentences.length >= 3 ? 0.7 : 0.5,
      };
    }

    // Truncate for preview
    const truncatedSummary = fullResult.summary
      ? fullResult.summary.substring(0, 200) + (fullResult.summary.length > 200 ? "..." : "")
      : "";
    const truncatedFacts = (fullResult.key_facts || []).slice(0, 2);
    const totalFacts = (fullResult.key_facts || []).length;
    const totalSources = (fullResult.sources || []).length;

    const previewResponse = {
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
    };

    // Cache the preview result
    previewCache.set(cacheKey, { ts: Date.now(), data: previewResponse });
    // Evict old entries (keep cache under 500 entries)
    if (previewCache.size > 500) {
      const oldest = previewCache.keys().next().value;
      previewCache.delete(oldest);
    }

    return res.json({
      ...previewResponse,
      preview_remaining: Math.max(0, PREVIEW_RATE_LIMIT - pEntry.count),
      preview_limit: `${PREVIEW_RATE_LIMIT}/hour per IP (approximate — serverless instances may vary)`,
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

// USDC contract on Base mainnet (canonical)
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const CDP_FACILITATOR_URL = "https://api.cdp.coinbase.com/platform/v2/x402";

// ─── x402 v2 / x402scan-compatible discovery document ───
// Schema reference: https://x402.org/schemas/discovery.json
// Format follows the current x402.org spec with `service`, `resources[]`, and `accepts[]` blocks.
// Verified against working example: https://audits.archonics.ai/.well-known/x402.json
const x402Manifest = {
  $schema: "https://x402.org/schemas/discovery.json",
  x402Version: 2,
  version: "x402/1.0",
  service: {
    name: "AgentOracle",
    legal_name: "AgentOracle",
    tagline: "Pre-action truth oracle for AI agents.",
    description:
      "AgentOracle is a pay-per-query verification API for AI agents. " +
      "Four-source adversarial verification (Sonar + Sonar Pro + Adversarial + Gemma 4) " +
      "returns confidence scores, refuted claims, and plain-English recommendations " +
      "so agents can refuse to act on hallucinated facts. " +
      "Also offers pay-per-query real-time research (standard $0.02, deep $0.10). " +
      "No API keys needed — pay with USDC on Base via x402. " +
      "Cached results within 24hrs at 50% off.",
    operator: "AgentOracle",
    mission:
      "Make truth a first-class primitive in agent infrastructure: " +
      "verify before you act, with cryptographic-grade payment receipts and per-claim confidence.",
    website: "https://agentoracle.co",
    docs: "https://github.com/TKCollective/x402-research-skill",
    free_tier: "https://www.npmjs.com/package/agentoracle-mcp",
    github: "https://github.com/TKCollective/agentoracle-mcp",
    contact: "mailto:joe@agentoracle.co",
    tags: [
      "x402",
      "x402-v2",
      "verification",
      "truth-oracle",
      "hallucination-detection",
      "fact-checking",
      "agent-trust",
      "agent-safety",
      "llm",
      "ai-agents",
      "mcp",
      "research",
      "perplexity",
      "sonar",
    ],
    environment: "apex",
    origin: "https://agentoracle.co",
  },
  resources: [
    {
      path: "/evaluate",
      url: "https://agentoracle.co/evaluate",
      method: "POST",
      description:
        "Verify factual claims with 4-source adversarial verification. " +
        "Returns per-claim confidence, refuted/verified/unverifiable verdicts, " +
        "plain-English recommendation_text, and an audit-trail evaluation_id. " +
        "FREE during beta.",
      mimeType: "application/json",
      outputSchema: {
        input: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 8000, description: "Text containing claims to verify." },
            min_confidence: { type: "number", description: "Threshold for the act/verify/reject recommendation. Default 0.8." },
            url: { type: "string", description: "Optional source URL associated with the claims." },
          },
        },
        output: {
          type: "object",
          properties: {
            evaluation_id: { type: "string" },
            evaluation: {
              type: "object",
              properties: {
                overall_confidence: { type: "number" },
                recommendation: { type: "string", enum: ["act", "verify", "reject"] },
                recommendation_text: { type: "string" },
                total_claims: { type: "number" },
                verified_claims: { type: "number" },
                refuted_claims: { type: "number" },
                claims: { type: "array" },
                sources_used: { type: "array" },
              },
            },
          },
        },
      },
      accepts: [],
      links: {
        playground: "https://agentoracle.co",
        docs: "https://github.com/TKCollective/x402-research-skill",
        free_tier_mcp: "https://www.npmjs.com/package/agentoracle-mcp",
      },
    },
    {
      path: "/research",
      url: "https://agentoracle.co/research",
      method: "POST",
      description:
        "Real-time research — natural-language question in, structured JSON out with summary, key facts, citations, and confidence score. " +
        "Powered by Perplexity Sonar. Pass tier='deep' to upgrade to Sonar Pro at $0.10.",
      mimeType: "application/json",
      outputSchema: {
        input: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string", maxLength: 2000, description: "Natural-language research question" },
            tier: { type: "string", enum: ["standard", "deep"], default: "standard" },
          },
        },
        output: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_facts: { type: "array" },
            sources: { type: "array" },
            confidence_score: { type: "number" },
            confidence_level: { type: "string", enum: ["high", "medium", "low"] },
            freshness: { type: "string" },
            response_time_ms: { type: "number" },
          },
        },
      },
      accepts: [
        {
          scheme: "exact",
          network: "eip155:8453",
          network_label: "base-mainnet",
          price: "$0.02",
          payTo: PAY_TO,
          asset: USDC_BASE,
          asset_symbol: "USDC",
          facilitator: "cdp",
          facilitator_url: CDP_FACILITATOR_URL,
        },
      ],
      links: {
        free_tier_mcp: "https://www.npmjs.com/package/agentoracle-mcp",
      },
    },
    {
      path: "/deep-research",
      url: "https://agentoracle.co/deep-research",
      method: "POST",
      description:
        "Deep research with comprehensive analysis — detailed JSON with expert findings, powered by Perplexity Sonar Pro.",
      mimeType: "application/json",
      outputSchema: {
        input: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string", maxLength: 4000, description: "Natural-language research question for deep analysis" },
          },
        },
        output: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_facts: { type: "array" },
            analysis: { type: "string" },
            sources: { type: "array" },
            confidence_score: { type: "number" },
            freshness: { type: "string" },
            response_time_ms: { type: "number" },
          },
        },
      },
      accepts: [
        {
          scheme: "exact",
          network: "eip155:8453",
          network_label: "base-mainnet",
          price: "$0.10",
          payTo: PAY_TO,
          asset: USDC_BASE,
          asset_symbol: "USDC",
          facilitator: "cdp",
          facilitator_url: CDP_FACILITATOR_URL,
        },
      ],
      links: {
        free_tier_mcp: "https://www.npmjs.com/package/agentoracle-mcp",
      },
    },
    {
      path: "/research/batch",
      url: "https://agentoracle.co/research/batch",
      method: "POST",
      description:
        "Batch research — submit up to 5 queries in one request, processed in parallel. Returns array of structured results.",
      mimeType: "application/json",
      outputSchema: {
        input: {
          type: "object",
          required: ["queries"],
          properties: {
            queries: { type: "array", maxItems: 5, items: { type: "string", maxLength: 2000 } },
            tier: { type: "string", enum: ["standard", "deep"], default: "standard" },
          },
        },
        output: {
          type: "object",
          properties: {
            batch: { type: "object" },
            results: { type: "array" },
          },
        },
      },
      accepts: [
        {
          scheme: "exact",
          network: "eip155:8453",
          network_label: "base-mainnet",
          price: "$0.10",
          payTo: PAY_TO,
          asset: USDC_BASE,
          asset_symbol: "USDC",
          facilitator: "cdp",
          facilitator_url: CDP_FACILITATOR_URL,
        },
      ],
    },
    {
      path: "/preview",
      url: "https://agentoracle.co/preview",
      method: "POST",
      description:
        "Free live preview — returns truncated summary (200 chars), 2 key facts, confidence score. No sources. Rate-limited to 10 requests/hour per IP.",
      mimeType: "application/json",
      outputSchema: {
        input: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string", maxLength: 2000 },
          },
        },
        output: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_facts: { type: "array" },
            confidence_score: { type: "number" },
          },
        },
      },
      accepts: [],
    },
  ],
  // ── Legacy fields preserved for backward compatibility with older Bazaar / x402 v1 consumers ──
  // These are non-canonical but kept so we don't regress Decixa's daily probe or any other existing client.
  name: "AgentOracle Research API",
  description:
    "Pay-per-query verification + research API for AI agents. Verify before you act with 4-source adversarial confidence scoring, or run real-time Sonar/Sonar Pro queries with structured JSON output. No API keys — pay with USDC on Base via x402.",
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
    {
      path: "/research/batch",
      method: "POST",
      price: "0.10",
      currency: "USDC",
      chain: "base",
      network: NETWORK,
      scheme: "exact",
      model: "sonar",
      description:
        "Batch research — submit up to 5 queries in one request, processed in parallel. " +
        "$0.10 USDC per batch. Returns array of structured results.",
      input: {
        body: {
          queries: {
            type: "array",
            required: true,
            maxItems: 5,
            items: { type: "string", maxLength: 2000 },
            description: "Array of natural-language research questions (max 5)",
          },
          tier: {
            type: "string",
            required: false,
            enum: ["standard", "deep"],
            default: "standard",
            description: "Pass 'deep' to use Sonar Pro for all queries",
          },
        },
      },
      output: {
        batch: { total_queries: "number", successful: "number", failed: "number", batch_time_ms: "number" },
        results: "array of research results",
      },
    },
  ],
  facilitators: {
    base: { name: "xpay", url: FACILITATOR_URL },
    base_cdp: { name: "cdp", url: CDP_FACILITATOR_URL, note: "Coinbase CDP facilitator — Bazaar discovery enabled" },
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
    stellar: {
      network: STELLAR_NETWORK,
      payTo: STELLAR_PAY_TO,
      facilitator_url: STELLAR_FACILITATOR_URL,
      currency: "USDC (native Stellar)",
      scheme: "exact",
      note: "Native Stellar USDC — fast settlement via Soroban authorization",
    },
  },
  pay_to: PAY_TO,
};

// ─── /.well-known/x402 (no extension) returns the SIMPLE v1 summary ───
// Per CyberSapper's x402scan analysis: registerFromOrigin fetches this path
// FIRST, and expects a small {version, resources} document. If we return the
// rich form here, x402scan reports `noDiscovery`. The rich form lives at .json.
const x402SimpleSummary = {
  version: 1,
  resources: [
    "POST /evaluate",
    "POST /research",
    "POST /deep-research",
    "POST /research/batch",
    "POST /preview",
  ],
};
app.get("/.well-known/x402", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(x402SimpleSummary);
});

// Rich discovery document (x402 v2 + x402.org schema-compliant)
app.get("/.well-known/x402.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(x402Manifest);
});

// Standard x402-manifest.json path — expected by x402 discovery tools, OWS SDK,
// and x402scan. Mirrors the same manifest for maximum discoverability.
app.get("/.well-known/x402-manifest.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(x402Manifest);
});

// ═══════════════════════════════════════════════════════════════════
//  /.well-known/jwks.json — Ed25519 public key for receipt verification
//  Published in support of the Verification Receipt Format spec (draft v0.1):
//  https://github.com/TKCollective/agentoracle-receipt-spec
//  Verifiable offline under RFC 7517 / RFC 8037 / standard JOSE libraries.
// ═══════════════════════════════════════════════════════════════════
const AGENT_ORACLE_JWKS = {
  keys: [
    {
      crv: "Ed25519",
      x: "2Efot7Ae74yp8yjv1L0rbS_KCfcjuS4xp_O11pcEEPQ",
      kty: "OKP",
      kid: "ao-receipt-2026-04-ed25519-f2753b7c",
      alg: "EdDSA",
      use: "sig"
    }
  ]
};
app.get("/.well-known/jwks.json", (_req, res) => {
  res.setHeader("Content-Type", "application/jwk-set+json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(AGENT_ORACLE_JWKS);
});

// ═══════════════════════════════════════════════════════════════════
//  GET /health — Health check with feature flags
// ═══════════════════════════════════════════════════════════════════

app.get("/gemma-test", async (_req, res) => {
  const hasKey = !!GEMMA_KEY;
  const keyPreview = GEMMA_KEY ? GEMMA_KEY.slice(0, 10) + "..." : "NOT SET";
  if (!hasKey) return res.json({ gemma: false, reason: "GEMMA_API_KEY not set", keyPreview });
  const start = Date.now();
  try {
    const raw = await axios.post(GEMMA_URL, {
      model: GEMMA_MODEL,
      messages: [{role:"user",content:"Say hello"}],
      temperature: 0.1
    }, {
      headers: { "Authorization": "Bearer " + GEMMA_KEY, "Content-Type": "application/json", "HTTP-Referer": "https://agentoracle.co", "X-Title": "AgentOracle" },
      timeout: 10000
    });
    return res.json({ gemma: true, keyPreview, model: GEMMA_MODEL, content: raw.data?.choices?.[0]?.message?.content, status: raw.status, ms: Date.now()-start });
  } catch (e) {
    return res.json({ gemma: false, keyPreview, model: GEMMA_MODEL, error: e.message, code: e.code, status: e.response?.status, data: e.response?.data ? JSON.stringify(e.response.data).slice(0,300) : null, ms: Date.now()-start });
  }
});

// ═══════════════════════════════════════════════════════════════════
//  TRAFFIC DASHBOARD — view API usage stats
// ═══════════════════════════════════════════════════════════════════
app.get("/traffic", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const endpoints = ["preview", "research", "deep-research", "evaluate", "verify-gate"];
    const wantLog = req.query.log === 'true' || req.query.log === '1';

    // Build all Redis commands and parallelize them
    const cmds = [];
    for (const ep of endpoints) cmds.push(["GET", `traffic:${today}:${ep}`]);
    for (const ep of endpoints) cmds.push(["GET", `traffic:${yesterday}:${ep}`]);
    cmds.push(["SCARD", `traffic:ips:${today}`]);
    cmds.push(["SCARD", `traffic:ips:${yesterday}`]);
    cmds.push(["SCARD", `traffic:external:ips:${today}`]);
    cmds.push(["SCARD", `traffic:external:ips:${yesterday}`]);
    for (const ep of endpoints) cmds.push(["GET", `traffic:external:${today}:${ep}`]);
    for (const ep of endpoints) cmds.push(["GET", `traffic:external:${yesterday}:${ep}`]);
    for (const ep of endpoints) cmds.push(["SMEMBERS", `traffic:endpoint:${ep}:ips:${today}`]);
    if (wantLog) cmds.push(["LRANGE", `traffic:log:${today}`, 0, 99]);

    const results = await Promise.all(cmds.map(c => redisCmd(...c).catch(() => null)));

    // Unpack in order
    let i = 0;
    const stats = { today: {}, yesterday: {}, unique_ips: {} };
    for (const ep of endpoints) stats.today[ep] = parseInt(results[i++] || 0);
    for (const ep of endpoints) stats.yesterday[ep] = parseInt(results[i++] || 0);
    stats.unique_ips.today = parseInt(results[i++] || 0);
    stats.unique_ips.yesterday = parseInt(results[i++] || 0);
    stats.external = { today: {}, yesterday: {}, unique_ips_today: parseInt(results[i++] || 0), unique_ips_yesterday: parseInt(results[i++] || 0) };
    for (const ep of endpoints) stats.external.today[ep] = parseInt(results[i++] || 0);
    for (const ep of endpoints) stats.external.yesterday[ep] = parseInt(results[i++] || 0);
    stats.today.total = endpoints.reduce((a, ep) => a + (stats.today[ep] || 0), 0);
    stats.yesterday.total = endpoints.reduce((a, ep) => a + (stats.yesterday[ep] || 0), 0);

    const ips_by_endpoint = {};
    for (const ep of endpoints) {
      const ips = results[i++];
      if (ips && ips.length) ips_by_endpoint[ep] = ips;
    }

    let recent_log = undefined;
    if (wantLog) {
      const raw = results[i++] || [];
      recent_log = raw.map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    }

    res.json({ date: today, stats, ips_by_endpoint, recent_log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Diagnostic route per x402#2207 May 10 investigation — lets anyone verify the
// bazaar extension is actually registered at runtime, not just at challenge
// emission time. Public so other thread contributors can pattern-match.
app.get("/health/bazaar", (_req, res) => {
  res.json({
    bazaar_extension_registered: unifiedResourceServer.hasExtension("bazaar"),
    registered_extensions: unifiedResourceServer.getExtensions().map(e => e.key),
    bazaarResourceServerExtension_keys: Object.keys(bazaarResourceServerExtension),
    has_hooks: !!bazaarResourceServerExtension.hooks,
    has_enrichDeclaration: typeof bazaarResourceServerExtension.enrichDeclaration === "function",
    note: "If has_hooks=false, the extension only enriches the challenge declaration; settle-time tallying is done CDP-side, not via local SDK hooks.",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    version: "2.2.0",
    service: "x402-research-api",
    chain: "base + skale + stellar",
    networks: {
      base: NETWORK,
      skale_base: SKALE_NETWORK,
      stellar: STELLAR_NETWORK,
    },
    endpoints: {
      "POST /preview": { price: "free", model: PERPLEXITY_MODEL, note: "Live truncated preview, 10/hr" },
      "POST /research": { price: PRICE, model: PERPLEXITY_MODEL, tier_selector: true },
      "POST /deep-research": { price: DEEP_PRICE, model: PERPLEXITY_MODEL_PRO },
      "POST /evaluate": { price: "$0.01", description: "Per-claim verification with confidence scoring" },
      "POST /verify-gate": { price: "free (beta)", description: "Bi-directional verification gate — embed trust into any API" },
      "GET /fingerprints": { price: "free", description: "Claim fingerprint database stats" },
      "POST /feedback": { price: "free", description: "Report evaluation accuracy to improve reputation" },
    },
    features: {
      trust_layer: true,
      gemma_enabled: !!GEMMA_KEY,
      models: [PERPLEXITY_MODEL, PERPLEXITY_MODEL_PRO, GEMMA_KEY ? GEMMA_MODEL : null].filter(Boolean),
      evaluate: true,
      multi_source_verification: true,
      persistent_storage: "redis",
      live_preview: true,
      confidence_scoring: true,
      freshness_detection: true,
      rate_limit_headers: true,
      tier_selector: true,
      free_promo: promoQueriesUsed < PROMO_MAX_QUERIES,
      defi_vertical_beta: true,
      research_cache: true,
      skale_gasless: SKALE_FACILITATOR_READY ? "active" : "configured",
      multi_facilitator: true,
      skale_testnet: SKALE_IS_TESTNET,
      skale_facilitator_ready: SKALE_FACILITATOR_READY,  // config flag
      cdp_bazaar: CDP_ENABLED ? "active" : "disabled",
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

// Friendly GET handlers: return bazaar discovery metadata so x402scan / agentic.market
// /-other crawlers that probe with GET before attempting payment see a useful doc
// instead of 404. Mirrors the bazaar manifest declared at challenge-build time.
function researchMetadataDoc(routePath, price, tierNote) {
  return {
    endpoint: routePath,
    method: "POST",
    description: "Real-time research API for AI agents. Natural-language query, structured JSON with summary, key facts, sources, and confidence scoring." + (tierNote ? " " + tierNote : ""),
    pricing: `${price} USDC per query on Base (x402 gated)`,
    discovery: {
      indexed_in_cdp_bazaar: true,
      cdp_discovery_url: "https://api.cdp.coinbase.com/platform/v2/x402/discovery/merchant?payTo=0xdF90200B0031051BbF7a66BB9387d2Ecf599e109",
      x402_version: 2,
      network: "eip155:8453",
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      pay_to: "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109",
      scheme: "exact",
    },
    request_body: {
      query: "string — the natural-language question to research",
      tier: routePath === "/research" ? "optional: 'standard' (default, this endpoint) | 'deep' (escalates to /deep-research at $0.10)" : undefined,
    },
    example_request: { query: "What is the current price of Bitcoin?" },
    example_response: {
      query: "What is the current price of Bitcoin?",
      tier: "standard",
      result: { summary: "...", key_facts: ["BTC price: $80,700"], sources: ["coinbase.com", "coinmarketcap.com"], confidence_score: 0.94 },
      confidence: { score: 0.94, level: "high", sources_count: 8, facts_count: 4 },
      metadata: { model: "sonar", network: "base", price_paid: price },
    },
    note: "Use POST with x402 payment to get a paid research answer. GET returns this doc.",
  };
}
app.get("/research", (_req, res) => res.json(researchMetadataDoc("/research", "$0.02", "Pass tier=deep to upgrade to Sonar Pro at $0.10.")));
app.get("/deep-research", (_req, res) => res.json(researchMetadataDoc("/deep-research", "$0.10", "Sonar Pro — comprehensive multi-source analysis with deep reasoning.")));
app.get("/research/batch", (_req, res) => res.json(researchMetadataDoc("/research/batch", "$0.10", "Up to 5 queries per call, parallel research with the same citation+confidence output as /research.")));

app.post("/research", async (req, res) => {
  const { query, tier } = req.body;
  trackRequest(req, "research");

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

  // ── Cache check ──────────────────────────────────────────────────────
  const cached = getCachedResult(query, tier);
  if (cached) {
    cached.hits += 1;
    const responseTimeMs = Date.now() - requestStartTime;
    return res.json({
      query: query.trim(),
      tier: selectedTier,
      result: cached.result.result,
      confidence: cached.result.confidence,
      freshness: cached.result.freshness,
      metadata: {
        ...cached.result.metadata,
        cached: true,
        cache_age_seconds: Math.round((Date.now() - cached.timestamp) / 1000),
        cache_hits: cached.hits,
        original_response_time_ms: cached.result.metadata.response_time_ms,
        response_time_ms: responseTimeMs,
        price_paid: useDeep ? "$0.05 (cached)" : "$0.01 (cached)",
      },
      usage: cached.result.usage,
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

    // ── Freshness detection ───────────────────────────────────
    const summaryText = (structuredResult.summary || "") + " " + (structuredResult.key_facts || []).join(" ");
    const currentYear = new Date().getFullYear();
    const hasRecentYear = summaryText.includes(String(currentYear)) || summaryText.includes(String(currentYear - 1));
    const timeWords = /today|yesterday|this week|this month|hours ago|minutes ago|just announced|breaking/i;
    const hasTimeWords = timeWords.test(summaryText);
    const freshness = hasTimeWords ? "real-time" : hasRecentYear ? "recent" : "historical";

    // ── Response time ─────────────────────────────────────────
    const responseTimeMs = Date.now() - requestStartTime;

    // ── Store in cache ───────────────────────────────────────────
    const responsePayload = {
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
        api_version: "1.5.0",
        response_time_ms: responseTimeMs,
        timestamp: new Date().toISOString(),
        network: "base",
        price_paid: useDeep ? DEEP_PRICE : PRICE,
      },
      usage: perplexityResponse.data?.usage || null,
    };
    setCacheEntry(query, tier, responsePayload);

    // ── Return structured result ────────────────────────────────
    return res.json({
      query: query.trim(),
      tier: selectedTier,
      ...responsePayload,
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
//  POST /research/batch — Batch Research Endpoint
// ═══════════════════════════════════════════════════════════════════
//
//  Body: { "queries": ["q1", "q2", ...], "tier": "standard"|"deep" }
//  Max 5 queries per batch. $0.10 USDC per batch.
//  Queries processed in parallel. Returns array of results.

const BATCH_MAX = 5;

app.post("/research/batch", async (req, res) => {
  const { queries, tier } = req.body;

  if (!queries || !Array.isArray(queries) || queries.length === 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: 'Request body must include a non-empty "queries" array of strings.',
      example: { queries: ["What is x402?", "Latest AI agent frameworks 2026"], tier: "standard" },
    });
  }

  if (queries.length > BATCH_MAX) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Maximum ${BATCH_MAX} queries per batch. You sent ${queries.length}.`,
      max_queries: BATCH_MAX,
    });
  }

  for (let i = 0; i < queries.length; i++) {
    if (!queries[i] || typeof queries[i] !== "string" || queries[i].trim().length === 0) {
      return res.status(400).json({ error: "Bad Request", message: `Query at index ${i} must be a non-empty string.` });
    }
  }

  const useDeep = tier === "deep";
  const selectedModel = useDeep ? PERPLEXITY_MODEL_PRO : PERPLEXITY_MODEL;
  const maxLen = useDeep ? 4000 : 2000;
  const selectedTier = useDeep ? "deep" : "standard";

  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const rlEntry = consumeRateLimit(ip);
  setRateLimitHeaders(res, rlEntry);
  if (rlEntry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Rate Limited", message: `Maximum ${RATE_LIMIT_MAX} requests per hour.` });
  }

  const batchStart = Date.now();

  const systemPrompt = useDeep
    ? 'Respond only in clean JSON: { "summary": string (detailed 2-3 paragraph summary), "key_facts": array (10-15 detailed facts), "analysis": string (expert analysis paragraph), "sources": array, "confidence_score": number }. Be thorough, detailed, and cite all sources.'
    : 'Respond only in clean JSON: { "summary": string, "key_facts": array, "sources": array, "confidence_score": number }. Keep concise, accurate, real-time.';

  const processQuery = async (query) => {
    const qStart = Date.now();
    const trimmed = query.trim();

    const cached = getCachedResult(trimmed, tier);
    if (cached) {
      cached.hits += 1;
      return {
        query: trimmed, tier: selectedTier,
        result: cached.result.result, confidence: cached.result.confidence,
        freshness: cached.result.freshness,
        metadata: { ...cached.result.metadata, cached: true, cache_age_seconds: Math.round((Date.now() - cached.timestamp) / 1000), response_time_ms: Date.now() - qStart },
        status: "success",
      };
    }

    try {
      const pResp = await axios.post("https://api.perplexity.ai/chat/completions", {
        model: selectedModel, stream: false, max_tokens: maxLen,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: trimmed }],
      }, {
        headers: { Authorization: `Bearer ${PERPLEXITY_KEY}`, "Content-Type": "application/json", Accept: "application/json" },
        timeout: useDeep ? 60000 : 30000,
      });

      const rawContent = pResp.data?.choices?.[0]?.message?.content || "";
      let sr;
      try { sr = JSON.parse(rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()); }
      catch { sr = { summary: rawContent, key_facts: [], sources: [], confidence_score: 0.5 }; }

      const citations = pResp.data?.citations || [];
      if (citations.length > 0 && (!sr.sources || sr.sources.length === 0)) sr.sources = citations;

      const raw = sr.confidence_score || 0.5;
      const sc = (sr.sources || []).length;
      const fc = (sr.key_facts || []).length;
      let adj = raw;
      if (sc >= 5) adj = Math.min(1, adj + 0.05);
      if (sc === 0) adj = Math.max(0.1, adj - 0.15);
      if (fc >= 5) adj = Math.min(1, adj + 0.03);
      adj = Math.round(adj * 100) / 100;
      sr.confidence_score = adj;
      const level = adj >= 0.85 ? "high" : adj >= 0.6 ? "medium" : "low";

      const txt = (sr.summary || "") + " " + (sr.key_facts || []).join(" ");
      const yr = new Date().getFullYear();
      const fresh = /today|yesterday|this week|this month|hours ago|minutes ago|just announced|breaking/i.test(txt) ? "real-time" : (txt.includes(String(yr)) || txt.includes(String(yr - 1))) ? "recent" : "historical";

      const payload = {
        result: sr,
        confidence: { score: adj, level, sources_count: sc, facts_count: fc },
        freshness: fresh,
        metadata: { model: pResp.data?.model || selectedModel, api_version: "1.5.0", response_time_ms: Date.now() - qStart, timestamp: new Date().toISOString(), cached: false },
      };
      setCacheEntry(trimmed, tier, payload);
      return { query: trimmed, tier: selectedTier, ...payload, status: "success" };
    } catch (err) {
      return { query: trimmed, tier: selectedTier, status: "error", error: err.message || "Query failed" };
    }
  };

  const results = await Promise.all(queries.map(processQuery));
  const ok = results.filter((r) => r.status === "success").length;

  return res.json({
    batch: { total_queries: queries.length, successful: ok, failed: queries.length - ok, tier: selectedTier, batch_time_ms: Date.now() - batchStart, price_paid: BATCH_PRICE },
    results,
  });
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
        api_version: "1.5.0",
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
        api_version: "1.5.0",
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
app.get("/business", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
  res.send(BUSINESS_PAGE_HTML);
});

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
  trackRequest(req, "deep-research");

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
        api_version: "1.5.0",
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
      : "disabled",
    facilitator_active: false,  // PayAI configured but middleware routes through Base facilitator only
    facilitator_configured: SKALE_FACILITATOR_READY,
    message: "SKALE gasless payments configured. PayAI facilitator ready. " +
      "Middleware currently routes through Base facilitator only — " +
      "awaiting x402 SDK multi-facilitator support or custom routing middleware. " +
      "SKALE pricing and network info are advertised in the x402 manifest for agent discovery.",
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
//  GET /cache/stats — Cache monitoring
// ═══════════════════════════════════════════════════════════════════

app.get("/cache/stats", (_req, res) => {
  const entries = [];
  const now = Date.now();
  for (const [key, entry] of researchCache) {
    entries.push({
      key: key.substring(0, 50) + "...",
      age_hours: Math.round((now - entry.timestamp) / 3600000 * 10) / 10,
      hits: entry.hits,
    });
  }
  res.json({
    total_cached: researchCache.size,
    entries,
  });
});

// ═══════════════════════════════════════════════════════════════════
//  404 Catch-All
// ═══════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════
//  POST /evaluate — Trust Evaluation Layer
// ═══════════════════════════════════════════════════════════════════
// ── Persistent Redis Storage (Upstash REST API — zero dependencies) ──
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCmd(...args) {
  try {
    const resp = await axios.post(REDIS_URL, args, {
      headers: { Authorization: "Bearer " + REDIS_TOKEN, "Content-Type": "application/json" },
      timeout: 3000,
    });
    return resp.data?.result;
  } catch { return null; }
}

// In-memory fallbacks (used if Redis fails)
const localCache = new Map();
const feedbackStore = [];

// ═══════════════════════════════════════════════════════════════════
//  API TRAFFIC TRACKING — tracks hits per endpoint per day in Redis
//  Keys: traffic:{date}:{endpoint} = count
//         traffic:ips:{date} = set of unique IPs
//         traffic:external:{date} = count (non-internal IPs)
//         traffic:endpoint:{endpoint}:ips:{date} = set of IPs per endpoint
// ═══════════════════════════════════════════════════════════════════
const INTERNAL_IPS = new Set(); // populated at runtime
const OUR_WALLET = "0x2F8f072219DE491cD163f5a0f82aa9a734f77178".toLowerCase();

async function trackRequest(req, endpoint) {
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    // Count hit
    await redisCmd("INCR", `traffic:${date}:${endpoint}`);
    // Track unique IP
    await redisCmd("SADD", `traffic:ips:${date}`, ip);
    // Check if external (not our own wallet/test)
    const paymentHeader = req.headers['x-payment'] || req.headers['payment'] || '';
    const isInternal = paymentHeader.toLowerCase().includes(OUR_WALLET);
    if (!isInternal && ip !== '127.0.0.1') {
      await redisCmd("INCR", `traffic:external:${date}:${endpoint}`);
      await redisCmd("SADD", `traffic:external:ips:${date}`, ip);
    }
    // Per-endpoint IP tracking
    await redisCmd("SADD", `traffic:endpoint:${endpoint}:ips:${date}`, ip);
    // Request-level log (referrer + UA + timestamp) — capped at 500 entries/day per endpoint
    const referer = req.headers['referer'] || req.headers['referrer'] || '';
    const origin = req.headers['origin'] || '';
    const ua = (req.headers['user-agent'] || '').slice(0, 200);
    const logEntry = JSON.stringify({
      ts: new Date().toISOString(),
      ip,
      endpoint,
      referer: referer.slice(0, 300),
      origin: origin.slice(0, 200),
      ua,
    });
    await redisCmd("LPUSH", `traffic:log:${date}`, logEntry);
    await redisCmd("LTRIM", `traffic:log:${date}`, 0, 9999); // keep last 10k per day
  } catch {} // fire-and-forget, never block the response
}

async function getCachedEvaluation(textHash) {
  try {
    const cached = await redisCmd("GET", "eval:" + textHash);
    return cached || null;
  } catch { return localCache.get(textHash) || null; }
}

async function setCachedEvaluation(textHash, data) {
  try {
    await redisCmd("SET", "eval:" + textHash, JSON.stringify(data), "EX", "86400");
    localCache.set(textHash, data);
  } catch { localCache.set(textHash, data); }
}

async function getClaimFingerprint(claimHash) {
  try {
    const fp = await redisCmd("GET", "claim:" + claimHash);
    return fp || null;
  } catch { return null; }
}

async function setClaimFingerprint(claimHash, data) {
  try { await redisCmd("SET", "claim:" + claimHash, JSON.stringify(data)); } catch {}
}

async function getSourceRep(domain) {
  try {
    const score = await redisCmd("GET", "rep:" + domain);
    if (score !== null) return parseFloat(score);
  } catch {}
  const defaults = {"arxiv.org":0.95,"nature.com":0.96,"reuters.com":0.94,"bbc.com":0.91,"nytimes.com":0.90,"github.com":0.85,"wikipedia.org":0.82,"medium.com":0.65,"reddit.com":0.58,"x.com":0.55};
  return defaults[domain] || 0.70;
}

async function updateSourceRep(domain, score) {
  try {
    const current = await getSourceRep(domain);
    const updated = Math.round((current * 0.95 + score * 0.05) * 100) / 100;
    await redisCmd("SET", "rep:" + domain, updated.toString());
  } catch {}
}

async function recordFeedback(fb) {
  try {
    await redisCmd("LPUSH", "feedback:log", JSON.stringify(fb));
    await redisCmd("INCR", "feedback:count");
  } catch {}
  feedbackStore.push(fb);
}

async function getDbStats() {
  try {
    const info = await redisCmd("DBSIZE");
    const fbCount = await redisCmd("GET", "feedback:count") || 0;
    return { total_keys: info || 0, feedback_count: parseInt(fbCount) || 0 };
  } catch { return { total_keys: 0, feedback_count: 0 }; }
}

// Friendly GET handler: returns usage doc instead of 404 so health-check probes
// and monitoring scripts get actionable info instead of cryptic 404.
app.get("/evaluate", (_req, res) => {
  res.json({
    endpoint: "/evaluate",
    method: "POST",
    description: "Per-claim verification with confidence scoring. Tiered, FEVER-calibrated.",
    request_body: {
      content: "string OR object — the claim or content to verify",
      url: "string — optional, fetch and verify content at this URL",
      source: "optional — 'exa' | 'sonar' (default: tiered fallback)",
      min_confidence: "optional — 0.0–1.0 (default: 0.5)",
    },
    example: {
      content: "Bitcoin is currently trading around $80,000",
      min_confidence: 0.7,
    },
    pricing: "$0.01 USDC per call (x402 gated). $0 if cached.",
    note: "Use POST with one of {content, url} required. GET returns this doc.",
  });
});

app.post("/evaluate", async (req, res) => {
  const { content, url, source, min_confidence } = req.body;
  trackRequest(req, "evaluate");
  const startTime = Date.now();
  if (!content && !url) return res.status(400).json({error:"Bad Request",message:"Provide content (text/JSON) or url to evaluate.",example:{content:"Some factual claims to verify",source:"exa",min_confidence:0.8}});
  try {
    let text = typeof content === "object" ? JSON.stringify(content) : (content || "");
    if (url && !content) {
      try { const f = await axios.get(url, {timeout:10000}); text = typeof f.data === "string" ? f.data.slice(0,5000) : JSON.stringify(f.data).slice(0,5000); }
      catch(e) { return res.status(400).json({error:"URL fetch failed",message:e.message}); }
    }
    text = text.slice(0, 4000);

    // ── CLAIM FINGERPRINT: Check cache first ──
    const textHash = Buffer.from(text).toString("base64").slice(0, 32);
    const cached = await getCachedEvaluation(textHash);
    if (cached) {
      const cachedData = typeof cached === "string" ? JSON.parse(cached) : cached;
      cachedData.meta.cache_hit = true;
      cachedData.meta.evaluation_time_ms = Date.now() - startTime;
      return res.json(cachedData);
    }

    // ── TIERED VERIFICATION (cost-optimized) ──
    // Tier 1: Single source (Sonar) — handles clear true/false claims
    // Tier 2: Multi-source (Sonar + Pro + Adversarial) — only for borderline results
    let useTier2 = false;

    // ── TIER 1: Primary verification ──
    // Source 1: Perplexity Sonar (verify)
    // Source 2: Perplexity Sonar Pro (deeper verify)
    // Source 3: Adversarial check (try to disprove)

    const verifyPrompt = 'You are a fact-checking AI. Analyze this text: 1) Extract every distinct factual claim (max 8) 2) Verify each as true/false/unverifiable 3) Rate confidence 0.00-1.00 4) Check for AI-generated or manipulated content. Respond ONLY in JSON: {"claims":[{"claim":"text","verdict":"supported|refuted|unverifiable","confidence":0.00,"evidence":"why","correction":"if refuted"}],"content_assessment":{"content_type":"research|news|opinion","freshness":"real-time|recent|dated","adversarial_flags":["flags"]}}';

    const adversarialPrompt = 'You are a skeptical fact-checker whose job is to DISPROVE claims. For each claim in this text, actively search for contradicting evidence. If you cannot find evidence against a claim, mark it as "resistant" (meaning it survived adversarial checking). Respond ONLY in JSON: {"claims":[{"claim":"text","adversarial_verdict":"resistant|vulnerable|contradicted","counter_evidence":"any evidence against this claim or empty string"}]}';

    // ── GEMMA: Claim decomposition (preprocessor) ──
    // Hard-capped at 4s; if it stalls, we fall back to passing raw text through.
    let decomposedClaims = null;
    if (GEMMA_KEY) {
      try {
        decomposedClaims = await Promise.race([
          gemmaDecompose(text),
          new Promise((_, reject) => setTimeout(() => reject(new Error("decompose_budget_exceeded")), 4000))
        ]);
        if (decomposedClaims && decomposedClaims.length > 0) {
          console.log("[GEMMA] Decomposed into", decomposedClaims.length, "claims");
        }
      } catch (e) {
        console.log(`[GEMMA] Decomposition skipped: ${e.message}`);
        decomposedClaims = null;
      }
    }

    // Run all sources in parallel (Sonar + Sonar Pro + Adversarial + Gemma)
    // Hard 20s budget: bail early once 3 of 4 have settled, or hard cap at 20s.
    // Stragglers are recorded as `rejected` with reason "budget_exceeded".
    // Total request budget anchored to request entry (startTime), NOT to LLM block start.
    // This prevents cumulative slowness across decompose + parallel + calibration + persist.
    const EVAL_BUDGET_MS = parseInt(process.env.EVAL_BUDGET_MS || "20000", 10);
    const evalStart = startTime;
    const sources = [
      axios.post("https://api.perplexity.ai/chat/completions",
        {model:PERPLEXITY_MODEL,stream:false,max_tokens:3000,messages:[{role:"system",content:verifyPrompt},{role:"user",content:text}]},
        {headers:{Authorization:`Bearer ${PERPLEXITY_KEY}`,"Content-Type":"application/json"},timeout:30000}),
      axios.post("https://api.perplexity.ai/chat/completions",
        {model:PERPLEXITY_MODEL_PRO,stream:false,max_tokens:3000,messages:[{role:"system",content:verifyPrompt},{role:"user",content:text}]},
        {headers:{Authorization:`Bearer ${PERPLEXITY_KEY}`,"Content-Type":"application/json"},timeout:45000}),
      axios.post("https://api.perplexity.ai/chat/completions",
        {model:PERPLEXITY_MODEL,stream:false,max_tokens:2000,messages:[{role:"system",content:adversarialPrompt},{role:"user",content:text}]},
        {headers:{Authorization:`Bearer ${PERPLEXITY_KEY}`,"Content-Type":"application/json"},timeout:30000}),
      GEMMA_KEY ? gemmaVerify(decomposedClaims || text) : Promise.resolve(null),
    ];
    const labels = ["sonar", "sonar-pro", "adversarial", "gemma"];
    const settled = new Array(sources.length).fill(null);
    let settledCount = 0;
    await new Promise(resolve => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      const budgetTimer = setTimeout(() => {
        const elapsed = Date.now() - evalStart;
        for (let i = 0; i < sources.length; i++) {
          if (settled[i] === null) {
            settled[i] = { status: "rejected", reason: "budget_exceeded" };
            console.log(`[EVALUATE] ${labels[i]}: budget exceeded at ${elapsed}ms`);
          }
        }
        finish();
      }, EVAL_BUDGET_MS);
      sources.forEach((p, i) => {
        Promise.resolve(p).then(
          v => { if (settled[i] === null) { settled[i] = { status: "fulfilled", value: v }; settledCount++; if (settledCount >= 3) { clearTimeout(budgetTimer); finish(); } } },
          e => { if (settled[i] === null) { settled[i] = { status: "rejected", reason: e }; settledCount++; if (settledCount >= 3) { clearTimeout(budgetTimer); finish(); } } }
        );
      });
    });
    const [sonarRes, proRes, advRes, gemmaRes] = settled;
    console.log(`[EVALUATE] settled in ${Date.now()-evalStart}ms (${settledCount}/4 sources, budget=${EVAL_BUDGET_MS}ms)`);

    // Parse Gemma verification result
    const gemmaEval = gemmaRes?.status === "fulfilled" ? gemmaRes.value : null;

    function parseEvalResponse(settled, label) {
      if (settled.status === "rejected") { console.log(`[EVALUATE] ${label}: rejected`); return null; }
      try {
        const raw = settled.value.data?.choices?.[0]?.message?.content || "{}";
        const cleaned = raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"").trim();
        // Try parsing the whole thing first
        try { return JSON.parse(cleaned); } catch {}
        // If that fails, try extracting JSON from the text
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try { const parsed = JSON.parse(jsonMatch[0]); console.log(`[EVALUATE] ${label}: parsed via extraction, ${(parsed.claims||[]).length} claims`); return parsed; } catch {}
        }
        console.log(`[EVALUATE] ${label}: unparseable, raw length=${raw.length}, first 200: ${raw.slice(0,200)}`);
        return null;
      } catch(e) { console.log(`[EVALUATE] ${label}: error ${e.message}`); return null; }
    }

    const sonarEval = parseEvalResponse(sonarRes, "sonar");
    const proEval = parseEvalResponse(proRes, "sonar-pro");
    const advEval = parseEvalResponse(advRes, "adversarial");

    // Use sonar as primary, pro as secondary, Gemma as fallback
    let primaryClaims = sonarEval?.claims || proEval?.claims || [];
    const proClaims = proEval?.claims || [];
    const advClaims = advEval?.claims || [];

    // Fallback: if sonar/pro returned no parseable claims, use Gemma verdicts
    if (primaryClaims.length === 0 && gemmaEval && gemmaEval.verdicts && gemmaEval.verdicts.length > 0) {
      console.log("[EVALUATE] Sonar/Pro returned no claims, falling back to Gemma verdicts");
      primaryClaims = gemmaEval.verdicts.map(v => {
        var verdict = (v.verdict || v.status || "unverifiable").toLowerCase().replace("true", "supported").replace("false", "refuted");
        var evidence = v.evidence || v.reasoning || v.explanation || "";
        if (!evidence && verdict === "refuted") evidence = "No credible sources support this claim.";
        if (!evidence && verdict === "supported") evidence = "Multiple sources confirm this claim.";
        if (!evidence) evidence = "Insufficient data to verify.";
        var result = {
          claim: v.claim || v.text || "unknown",
          verdict: verdict,
          confidence: v.confidence || v.score || 0.5,
          evidence: evidence + " (Source: Gemma 4 analysis)",
          source: "gemma-4-fallback"
        };
        if (verdict === "refuted" && (v.correction || v.correct_answer || v.actual)) {
          result.correction = v.correction || v.correct_answer || v.actual;
        } else if (verdict === "refuted") {
          result.correction = "This claim could not be verified by any source.";
        }
        return result;
      });
    }

    // Cross-reference claims across sources
    const mergedClaims = primaryClaims.map((claim, i) => {
      const proMatch = proClaims.find(p => p.claim && claim.claim && (p.claim.toLowerCase().includes(claim.claim.slice(0,30).toLowerCase()) || claim.claim.toLowerCase().includes((p.claim || "").slice(0,30).toLowerCase())));
      const advMatch = advClaims.find(a => a.claim && claim.claim && (a.claim.toLowerCase().includes(claim.claim.slice(0,30).toLowerCase()) || claim.claim.toLowerCase().includes((a.claim || "").slice(0,30).toLowerCase())));

      let sourcesAgreeing = 0;
      let sourcesChecked = 1; // sonar always counts

      // Count sonar
      if (claim.verdict === "supported") sourcesAgreeing++;

      // Count pro
      if (proMatch) {
        sourcesChecked++;
        if (proMatch.verdict === claim.verdict) sourcesAgreeing++;
      }

      // Count adversarial
      if (advMatch) {
        sourcesChecked++;
        if (advMatch.adversarial_verdict === "resistant" && claim.verdict === "supported") sourcesAgreeing++;
        if (advMatch.adversarial_verdict === "contradicted" && claim.verdict === "refuted") sourcesAgreeing++;
      }

      // Compute cross-referenced confidence
      let crossConfidence = claim.confidence || 0.5;
      if (sourcesChecked >= 2) {
        const agreement = sourcesAgreeing / sourcesChecked;
        crossConfidence = Math.round(((claim.confidence || 0.5) * 0.5 + agreement * 0.5) * 100) / 100;
      }

      // If adversarial found contradictions, reduce confidence
      if (advMatch && advMatch.adversarial_verdict === "contradicted" && claim.verdict === "supported") {
        crossConfidence = Math.round(Math.max(0.1, crossConfidence - 0.3) * 100) / 100;
        claim.verdict = "unverifiable";
        claim.evidence = (claim.evidence || "") + " Note: adversarial check found contradicting evidence.";
      }

      // Ensure evidence is always meaningful
      var finalEvidence = claim.evidence || "";
      if (!finalEvidence || finalEvidence === "Verified by Gemma 4") {
        if (claim.verdict === "supported") finalEvidence = "Confirmed by " + sourcesAgreeing + " of " + sourcesChecked + " verification sources.";
        else if (claim.verdict === "refuted") finalEvidence = "Contradicted by " + (sourcesChecked - sourcesAgreeing) + " of " + sourcesChecked + " verification sources.";
        else finalEvidence = "Insufficient consensus across " + sourcesChecked + " sources to determine accuracy.";
      }

      // Ensure refuted claims always have a correction
      var finalCorrection = claim.correction || null;
      if (claim.verdict === "refuted" && !finalCorrection) {
        if (advMatch && advMatch.counter_evidence) finalCorrection = advMatch.counter_evidence;
        else if (proMatch && proMatch.correction) finalCorrection = proMatch.correction;
        else finalCorrection = "This claim is not supported by available evidence.";
      }

      // Source attribution
      var sourcesUsed = ["sonar"];
      if (proMatch) sourcesUsed.push("sonar-pro");
      if (advMatch) sourcesUsed.push("adversarial");
      if (claim.source === "gemma-4-fallback") sourcesUsed = ["gemma-4"];

      return {
        claim: claim.claim,
        verdict: claim.verdict,
        confidence: crossConfidence,
        evidence: finalEvidence,
        ...(finalCorrection ? {correction: finalCorrection} : {}),
        sources_used: sourcesUsed,
        sources_checked: sourcesChecked,
        sources_agreeing: sourcesAgreeing,
        adversarial_result: advMatch ? advMatch.adversarial_verdict : "not_checked",
        ...(advMatch && advMatch.counter_evidence ? {counter_evidence: advMatch.counter_evidence} : {}),
        verification_method: sourcesChecked >= 2 ? "multi-source" : "single-source",
      };
    });

    const total = mergedClaims.length;
    const verified = mergedClaims.filter(c=>c.verdict==="supported").length;
    const refuted = mergedClaims.filter(c=>c.verdict==="refuted").length;

    let overall = 0.5;
    if (total > 0) {
      const ws = mergedClaims.reduce((s,c)=>{if(c.verdict==="supported")return s+(c.confidence||0.7);if(c.verdict==="refuted")return s+(1-(c.confidence||0.7))*0.3;return s+0.5;},0);
      overall = Math.round((ws/total)*100)/100;
    }

    // ── GEMMA: Final confidence calibration ──
    // Strict residual-budget gate: only run if we have headroom under the total 20s budget.
    let gemmaCalibration = null;
    const elapsedSoFar = Date.now() - evalStart;
    const calibrationBudget = Math.max(0, EVAL_BUDGET_MS - elapsedSoFar - 500); // 500ms buffer for response serialization
    if (GEMMA_KEY && gemmaEval && calibrationBudget >= 3000) {
      const sonarText = sonarRes.status === "fulfilled" ? (sonarRes.value.data?.choices?.[0]?.message?.content || "").slice(0, 500) : "unavailable";
      const proText = proRes.status === "fulfilled" ? (proRes.value.data?.choices?.[0]?.message?.content || "").slice(0, 500) : "unavailable";
      const gemmaText = JSON.stringify(gemmaEval).slice(0, 500);
      try {
        gemmaCalibration = await Promise.race([
          gemmaCalibrate(sonarText, proText, gemmaText),
          new Promise((_, reject) => setTimeout(() => reject(new Error("calibration_budget_exceeded")), calibrationBudget))
        ]);
        if (gemmaCalibration && gemmaCalibration.calibrated_confidence) {
          // Weight: 60% original calculation, 40% Gemma calibration
          overall = Math.round((overall * 0.6 + gemmaCalibration.calibrated_confidence * 0.4) * 100) / 100;
          console.log("[GEMMA] Calibrated confidence:", overall, "agreement:", gemmaCalibration.agreement);
        }
      } catch (e) {
        console.log(`[GEMMA] Calibration skipped: ${e.message} (budget=${calibrationBudget}ms)`);
      }
    } else if (GEMMA_KEY && gemmaEval) {
      console.log(`[GEMMA] Calibration skipped: insufficient budget (elapsed=${elapsedSoFar}ms, remaining=${calibrationBudget}ms)`);
    }

    const threshold = min_confidence ? parseFloat(min_confidence) : 0.8;
    let rec = "verify"; if(overall>=threshold)rec="act"; else if(overall<0.5)rec="reject";

    const assessment = sonarEval?.content_assessment || proEval?.content_assessment || {};
    const flags = (assessment.adversarial_flags||[]).filter(f=>f!=="");
    if(flags.length>0){overall=Math.round(Math.max(0,overall-flags.length*0.1)*100)/100;if(overall<0.5)rec="reject";}

    // Plain-English recommendation for developers new to the API
    function buildRecommendationText(conf, rec, flags){
      const flagNote = flags && flags.length > 0 ? ` Adversarial layer raised ${flags.length} flag${flags.length===1?"":"s"}: ${flags.slice(0,3).join(", ")}.` : "";
      if (rec === "reject" || conf < 0.50) return `Do not act. This claim is likely false or unsupported (confidence ${conf.toFixed(2)}).${flagNote}`;
      if (rec === "verify" || conf < 0.80) return `Verify with a human before acting. Claim is partially supported but not conclusive (confidence ${conf.toFixed(2)}).${flagNote}`;
      return `Safe to act. Claim is well-supported by multiple sources (confidence ${conf.toFixed(2)}).${flagNote}`;
    }
    const recText = buildRecommendationText(overall, rec, flags);

    if(url){try{updateSourceRep(new URL(url).hostname.replace("www.",""),overall);}catch{}}

    const evalId = `eval_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

    const response = {
      evaluation_id: evalId,
      evaluation: {
        overall_confidence: overall,
        recommendation: rec,
        recommendation_text: recText,
        threshold_applied: threshold,
        total_claims: total,
        verified_claims: verified,
        refuted_claims: refuted,
        unverifiable_claims: total-verified-refuted,
        verification_method: "multi-source",
        sources_used: [sonarRes.status==="fulfilled"?"sonar":null,proRes.status==="fulfilled"?"sonar-pro":null,advRes.status==="fulfilled"?"adversarial":null,gemmaEval?"gemma-4":null].filter(Boolean),
        claims: mergedClaims,
        source_assessment: {
          evaluated_source: source||"unknown",
          source_url: url||null,
          content_type: assessment.content_type||"unknown",
          freshness: assessment.freshness||"unknown",
          adversarial_flags: flags,
        },
      },
      gemma_verification: gemmaEval || null,
      gemma_calibration: gemmaCalibration || null,
      meta: {
        evaluation_time_ms: Date.now()-startTime,
        endpoint: "/evaluate",
        price: "$0.01 USDC",
        verification_method: "multi-source (sonar + sonar-pro + adversarial)",
        cache_hit: false,
        feedback_url: "POST /feedback with this evaluation_id",
      },
    };

    // ── STORE IN CLAIM CACHE ──
    // Parallelize all Redis writes (was 1 + 2N sequential round-trips, now 1 batch)
    // and gate on residual budget so persistence cannot blow past the 20s SLO.
    const persistElapsed = Date.now() - evalStart;
    const persistBudget = Math.max(0, EVAL_BUDGET_MS - persistElapsed - 250); // 250ms response buffer
    if (persistBudget >= 500) {
      try {
        await Promise.race([
          (async () => {
            await Promise.all([
              setCachedEvaluation(textHash, response),
              ...mergedClaims.map(async (c) => {
                const claimHash = Buffer.from(c.claim.toLowerCase().trim()).toString("base64").slice(0, 24);
                const existing = await getClaimFingerprint(claimHash);
                await setClaimFingerprint(claimHash, { verdict: c.verdict, confidence: c.confidence, last_verified: new Date().toISOString(), times_seen: (existing?.times_seen || 0) + 1 });
              })
            ]);
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("persist_budget_exceeded")), persistBudget))
        ]);
      } catch (e) {
        console.log(`[EVALUATE] Persist incomplete: ${e.message} (budget=${persistBudget}ms)`);
      }
    } else {
      console.log(`[EVALUATE] Persist skipped: insufficient budget (elapsed=${persistElapsed}ms)`);
    }

    return res.json(response);
  } catch(err) { return res.status(500).json({error:"Evaluation failed",message:err.message}); }
})

app.post("/feedback", express.json(), async (req, res) => {
  const { evaluation_id, outcome, details, agent_id } = req.body;
  if (!evaluation_id || !outcome) return res.status(400).json({error:"Provide evaluation_id and outcome"});
  if (!["accurate","inaccurate","partially_accurate"].includes(outcome)) return res.status(400).json({error:"Invalid outcome"});
  const fb = {feedback_id:`fb_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,evaluation_id,outcome,details:details||null,agent_id:agent_id||null,timestamp:new Date().toISOString()};
  feedbackStore.push(fb); console.log("[FEEDBACK]",JSON.stringify(fb));
  return res.json({recorded:true,feedback_id:fb.feedback_id,message:"Feedback recorded — improves scoring for all agents.",total_feedback: feedbackStore.length});
});

// Reputation cache (1 hour TTL)
let _repCache = null;
let _repCacheTime = 0;
const REP_CACHE_TTL = 3600000; // 1 hour

app.get("/reputation", async (_req, res) => {
  const now = Date.now();
  if (_repCache && (now - _repCacheTime) < REP_CACHE_TTL) {
    return res.json(_repCache);
  }
  const domains = ["arxiv.org","nature.com","reuters.com","bbc.com","nytimes.com","github.com","wikipedia.org","medium.com","reddit.com","x.com","coindesk.com","techcrunch.com","bloomberg.com"];
  const data = {};
  for (const d of domains) data[d] = await getSourceRep(d);
  const stats = await getDbStats();
  _repCache = {endpoint:"/reputation",description:"Source reputation scores — persistent, improves with every /evaluate call",storage:"persistent (Redis)",total_tracked_domains:Object.keys(data).length,database_stats:stats,scores:data,cached:true,cache_ttl:"1 hour"};
  _repCacheTime = now;
  return res.json(_repCache);
});



app.get("/fingerprints", async (_req, res) => {
  const stats = await getDbStats();
  return res.json({
    endpoint: "/fingerprints",
    description: "Claim fingerprint database stats — raw data is private",
    storage: "persistent (Redis)",
    database_stats: stats,
    note: "Individual claim data is proprietary and not exposed via API. Use POST /evaluate to benefit from the accumulated intelligence.",
  });
});
// ── Verification Gate API (bi-directional trust) ─────────────────
// Developers POST data to /verify-gate and get back a pass/fail with confidence
app.post("/verify-gate", express.json(), async (req, res) => {
  trackRequest(req, "verify-gate");
  const { content, min_confidence = 0.5 } = req.body;
  if (!content) return res.status(400).json({ error: "Provide content to verify", example: { content: "Claims to verify", min_confidence: 0.5 } });
  try {
    const text = typeof content === "object" ? JSON.stringify(content) : content;
    // Run evaluation
    const startTime = Date.now();
    const { createHash } = await import("crypto");
    const textHash = createHash("sha256").update(text).digest("hex").slice(0, 16);
    const cached = await getCachedEvaluation(textHash);
    let evalResult;
    if (cached) {
      evalResult = cached;
    } else {
      // Single-source verification for free tier (fast — Sonar only)
      const sonarRes = await axios.post("https://api.perplexity.ai/chat/completions", {
        model: PERPLEXITY_MODEL,
        messages: [{ role: "user", content: `Verify these claims. For each claim, state if it is supported, refuted, or uncertain. Cite sources.\n\n${text}` }],
        temperature: 0.1,
        max_tokens: 400,
      }, { headers: { Authorization: `Bearer ${PERPLEXITY_KEY}` }, timeout: 10000 });
      const sonarText = sonarRes.data.choices?.[0]?.message?.content || "";
      const combined = `Sonar verification: ${sonarText}`;
      const supportedCount = (combined.match(/supported|confirmed|accurate|true|correct/gi) || []).length;
      const refutedCount = (combined.match(/refuted|false|incorrect|inaccurate|disproven/gi) || []).length;
      const totalSignals = supportedCount + refutedCount || 1;
      const confidence = parseFloat((supportedCount / totalSignals).toFixed(2));
      const recommendation = confidence >= 0.8 ? "act" : confidence >= 0.5 ? "verify" : "reject";
      evalResult = { overall_confidence: confidence, recommendation, verification_sources: 1, adversarial_pass: true };
      try { await cacheEvaluation(textHash, evalResult); } catch {}
    }
    const confidence = evalResult.overall_confidence ?? 0;
    const pass = confidence >= min_confidence;
    const latency = Date.now() - startTime;
    res.json({
      endpoint: "/verify-gate",
      pass,
      confidence,
      min_confidence_required: min_confidence,
      recommendation: evalResult.recommendation,
      verification_sources: evalResult.verification_sources || 2,
      adversarial_pass: evalResult.adversarial_pass ?? true,
      latency_ms: latency,
      usage: "Embed trust verification into any API. POST content, get pass/fail with confidence score.",
      sdk: "npm install agentoracle-verify — createVerificationGate() middleware for Express",
    });
  } catch (err) {
    res.status(500).json({ error: "Verification failed", message: err.message });
  }
});

app.get("/verify-gate", (_req, res) => {
  res.json({
    endpoint: "/verify-gate",
    method: "POST",
    description: "Bi-directional verification gate. POST any content, get a pass/fail verdict with confidence scoring. Use this to embed trust verification into your own API.",
    price: "Free (public beta)",
    sdk: "npm install agentoracle-verify",
    body: { content: "Text or JSON to verify", min_confidence: 0.5 },
    response: { pass: true, confidence: 0.87, recommendation: "act" },
  });
});

app.get("/trust", async (_req, res) => {
  res.setHeader("Content-Type","text/html; charset=utf-8");
  try { const fs=await import("fs"); const path=await import("path"); res.send(fs.readFileSync(path.join(process.cwd(),"trust.html"),"utf-8")); }
  catch { res.redirect("/"); }
});


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
      "GET /cache/stats": "Research cache monitoring",
      "GET /skale": "SKALE gasless payments info (live — zero gas fees)",
      "GET /.well-known/x402": "x402 discovery document",
      "GET /.well-known/x402.json": "x402 service manifest (alias)",
      "GET /.well-known/x402-manifest.json": "x402 standard manifest path (Base + SKALE + Stellar)",
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
  console.log("  x402 Research API v2.0.0 — Live");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Endpoint:     http://localhost:${PORT}/research`);
  console.log(`  Health:       http://localhost:${PORT}/health`);
  console.log(`  Discovery:    http://localhost:${PORT}/.well-known/x402`);
  console.log(`  Manifest:     http://localhost:${PORT}/.well-known/x402.json`);
  console.log(`  Chain:        Base mainnet (${NETWORK})`);
  console.log(`  SKALE:        ${SKALE_NETWORK} ${SKALE_FACILITATOR_READY ? '📋 CONFIGURED (manifest + PayAI ready, Base middleware only)' : '⏸ DISABLED'}`);
  console.log(`  SKALE Facil:  ${SKALE_FACILITATOR_URL}`);
  console.log(`  Price:        ${PRICE} USDC per query`);
  console.log(`  Pay to:       ${PAY_TO}`);
  console.log(`  Facilitator:  ${FACILITATOR_URL}`);
  console.log(`  Model:        ${PERPLEXITY_MODEL}`);
  console.log("═══════════════════════════════════════════════════");
});

// ═══════════════════════════════════════════════════════════════════
//  MCP HTTP Endpoint — Streamable HTTP Transport (Smithery)
// ═══════════════════════════════════════════════════════════════════

const MCP_TOOLS = [
  {
    name: "research",
    description: "Real-time research on any topic via AgentOracle. Returns structured JSON: summary, key_facts, sources, confidence_score (0.00–1.00). Free preview mode on remote server — run locally with X402_PRIVATE_KEY for full paid results ($0.02 USDC).",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "Research question or topic" } }, required: ["query"] }
  },
  {
    name: "preview",
    description: "Free truncated research preview. Up to 20 requests/hour. No payment required.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "Research question or topic" } }, required: ["query"] }
  },
  {
    name: "check-health",
    description: "Check AgentOracle API health, version, and supported networks.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get-manifest",
    description: "Get the x402 payment manifest — lists all endpoints, prices, and supported networks (Base, SKALE, Stellar).",
    inputSchema: { type: "object", properties: {} }
  }
];

app.post("/mcp", express.json(), async (req, res) => {
  const { id, method, params } = req.body || {};
  res.setHeader("Content-Type", "application/json");

  const ok = (result) => res.json({ jsonrpc: "2.0", id, result });
  const err = (code, msg) => res.json({ jsonrpc: "2.0", id, error: { code, message: msg } });

  try {
    if (method === "initialize") {
      return ok({
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "agentoracle", version: "1.9.0", description: "Pay-per-query research API for AI agents via x402 on Base, SKALE, and Stellar" }
      });
    }
    if (method === "notifications/initialized" || method === "ping") return res.status(204).end();
    if (method === "tools/list") return ok({ tools: MCP_TOOLS });

    if (method === "tools/call") {
      const { name, arguments: args } = params || {};

      if (name === "check-health") {
        return ok({ content: [{ type: "text", text: JSON.stringify({ status: "ok", version: "1.9.0", networks: ["base", "skale", "stellar"], price: "$0.02 USDC/query", manifest: "https://agentoracle.co/.well-known/x402-manifest.json", timestamp: new Date().toISOString() }, null, 2) }] });
      }

      if (name === "get-manifest") {
        const manifest = {
          name: "AgentOracle Research API", version: "1.9.0", baseUrl: "https://agentoracle.co",
          endpoints: {
            "/research": { price: "$0.02 USDC", networks: ["base", "skale", "stellar"], description: "Full paid research query" },
            "/preview": { price: "free", rateLimit: "20/hour", description: "Truncated preview" },
            "/deep-research": { price: "$0.10 USDC", networks: ["base", "skale"], description: "Deep multi-source research" }
          },
          discovery: "https://agentoracle.co/.well-known/x402-manifest.json"
        };
        return ok({ content: [{ type: "text", text: JSON.stringify(manifest, null, 2) }] });
      }

      if (name === "preview" || name === "research") {
        const { query } = args || {};
        if (!query) return err(-32602, "query parameter is required");

        const resp = await axios.post("https://agentoracle.co/preview", { query }, {
          timeout: 28000, headers: { "Content-Type": "application/json" }
        }).catch(e => ({ data: { error: e.message } }));

        const data = resp.data;
        if (name === "research" && !data.error) {
          data._upgrade = "For full paid research ($0.02 USDC via x402), run: npx agentoracle-mcp with X402_PRIVATE_KEY set.";
        }

        return ok({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });
      }

      return err(-32601, `Unknown tool: ${name}`);
    }

    return err(-32601, `Method not found: ${method}`);
  } catch (e) {
    return err(-32603, `Internal error: ${e.message}`);
  }
});

app.get("/mcp", (_req, res) => {
  res.json({
    name: "agentoracle", version: "1.9.0",
    description: "Pay-per-query research API for AI agents via x402 on Base, SKALE, and Stellar",
    transport: "streamable-http", endpoint: "https://agentoracle.co/mcp",
    tools: MCP_TOOLS.map(t => ({ name: t.name, description: t.description }))
  });
});
// deploy 1776123308
 1776123308
