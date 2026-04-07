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
import cors from "cors";
import axios from "axios";
import { LANDING_PAGE_HTML } from "./landing-page.js";
import { DEMO_PAGE_HTML, DEMO_VIDEO_HTML } from "./demo-pages.js";
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
  res.setHeader("Content-Type", "image/jpeg");
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
//    xpay is the primary Base facilitator (proven reliable).
//    CDP is available for Bazaar bootstrapping via /bazaar-bootstrap endpoint.
const CDP_ENABLED = !!(process.env.CDP_API_KEY_ID && process.env.CDP_API_KEY_SECRET);

const baseFacilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
console.log("✅ Base facilitator: xpay");

let cdpFacilitatorClient = null;
let cdpResourceServer = null;
if (CDP_ENABLED) {
  cdpFacilitatorClient = new HTTPFacilitatorClient(cdpFacilitator);
  console.log("✅ CDP facilitator available (for Bazaar bootstrapping)");
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
const bazaarResearch = declareDiscoveryExtension({
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

// 5. UNIFIED PAYMENT MIDDLEWARE — Sawyer's accepts-array pattern
//    Both Base and SKALE accepts in the same array. The x402 SDK
//    matches the payment to whichever network the agent pays on.
//    Cleaner than the smart router, and the standard x402 approach.
// All networks in unified accepts: PayAI handles EVM, x402.org handles Stellar
const researchAccepts = [baseAcceptResearch];
const deepAccepts = [baseAcceptDeep];
if (SKALE_FACILITATOR_READY) {
  researchAccepts.push(skaleAcceptResearch);
  deepAccepts.push(skaleAcceptDeep);
}
if (STELLAR_ENABLED) {
  researchAccepts.push(stellarAcceptResearch);
  deepAccepts.push(stellarAcceptDeep);
}

// Batch pricing: $0.10 for up to 5 queries (same price structure as deep)
const BATCH_PRICE = "$0.10";
const SKALE_PRICE_BATCH = {
  amount: "100000",
  asset: SKALE_USDC_ADDRESS,
  extra: { name: SKALE_USDC_NAME, version: "2" },
};
const baseAcceptBatch = { scheme: "exact", price: BATCH_PRICE, network: NETWORK, payTo: PAY_TO };
const skaleAcceptBatch = { scheme: "exact", price: SKALE_PRICE_BATCH, network: SKALE_NETWORK, payTo: PAY_TO };
const batchAccepts = [baseAcceptBatch];
if (SKALE_FACILITATOR_READY) batchAccepts.push(skaleAcceptBatch);
if (STELLAR_ENABLED) batchAccepts.push(stellarAcceptBatch);

const routeConfig = {
  "POST /research": {
    accepts: researchAccepts,
    description:
      "Real-time research API for AI agents. Send any natural-language question, " +
      "get structured JSON with summary, key facts, sources, and confidence scoring. " +
      "Powered by Perplexity Sonar. $0.02 USDC per query. Base + SKALE (zero gas).",
    mimeType: "application/json",
    extensions: { ...bazaarResearch },
  },
  "POST /deep-research": {
    accepts: deepAccepts,
    description:
      "Deep research with comprehensive multi-step analysis. Returns detailed findings " +
      "with expert-level synthesis, powered by Perplexity Sonar Pro. $0.10 USDC per query. Base + SKALE.",
    mimeType: "application/json",
    extensions: { ...bazaarDeep },
  },
  "POST /research/batch": {
    accepts: batchAccepts,
    description:
      "Batch research endpoint. Submit up to 5 queries in a single request, processed in parallel. " +
      "$0.10 USDC per batch (up to 5 queries). Returns an array of structured results. Base + SKALE (zero gas).",
    mimeType: "application/json",
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

app.use(paymentMiddleware(routeConfig, unifiedResourceServer));
console.log(`✅ Unified payment middleware: single instance, all chains via facilitator array`);

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

      const requirements = {
        scheme: "exact", network: NETWORK, amount: "20000",
        asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        payTo: PAY_TO, maxTimeoutSeconds: 300,
        extra: { name: "USD Coin", version: "2" },
      };
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

const x402Manifest = {
  x402Version: 2,
  version: "x402/1.0",
  name: "AgentOracle Research API",
  description:
    "Pay-per-query real-time research powered by Perplexity Sonar. " +
    "Two tiers: standard ($0.02) and deep ($0.10). Structured JSON " +
    "with citations, key facts, and confidence scores. No API keys " +
    "needed — just pay with USDC on Base. Repeat queries within 24hrs served from cache at 50% off.",
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
    base_cdp: { name: "cdp", url: "https://api.cdp.coinbase.com/platform/v2/x402", note: "Coinbase CDP facilitator — Bazaar discovery enabled" },
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

// Standard x402-manifest.json path — expected by x402 discovery tools, OWS SDK,
// and x402scan. Mirrors the same manifest for maximum discoverability.
app.get("/.well-known/x402-manifest.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json(x402Manifest);
});

// ═══════════════════════════════════════════════════════════════════
//  GET /health — Health check with feature flags
// ═══════════════════════════════════════════════════════════════════

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    version: "1.8.0",
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
    },
    features: {
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
  console.log("  x402 Research API v1.5.0 — Live");
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
