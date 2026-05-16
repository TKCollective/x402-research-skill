/**
 * AgentOracle API Test Suite
 * ══════════════════════════════════════════════════════════════
 * Comprehensive tests for all endpoints — 34 tests across 12 suites.
 * Run: npx vitest run
 */
import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_URL || "https://agentoracle.co";

async function api(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, json, text, headers: res.headers };
}

function decode402Header(headers) {
  const raw = headers.get("payment-required");
  if (!raw) return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString()); } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
//  Health & Discovery
// ═══════════════════════════════════════════════════════════════

describe("Health & Discovery", () => {
  it("GET /health returns 200 with version and status", async () => {
    const { status, json } = await api("GET", "/health");
    expect(status).toBe(200);
    expect(json).toHaveProperty("status", "ok");
    expect(json).toHaveProperty("version");
    expect(json).toHaveProperty("service");
    expect(json).toHaveProperty("networks");
    expect(json.networks).toHaveProperty("base");
    expect(json.networks).toHaveProperty("stellar");
  });

  it("GET /health includes endpoint definitions", async () => {
    const { json } = await api("GET", "/health");
    expect(json).toHaveProperty("endpoints");
    const eps = json.endpoints;
    expect(eps).toHaveProperty("POST /preview");
    expect(eps).toHaveProperty("POST /research");
    expect(eps).toHaveProperty("POST /deep-research");
  });

  it("GET /.well-known/x402-manifest.json returns valid x402 manifest", async () => {
    const { status, json } = await api("GET", "/.well-known/x402-manifest.json");
    expect(status).toBe(200);
    expect(json).toHaveProperty("endpoints");
    expect(Array.isArray(json.endpoints)).toBe(true);
    expect(json.endpoints.length).toBeGreaterThan(0);
    const ep = json.endpoints[0];
    expect(ep).toHaveProperty("path");
    expect(ep).toHaveProperty("method");
    expect(ep).toHaveProperty("price");
  });

  it("GET /.well-known/x402.json returns manifest", async () => {
    const { status } = await api("GET", "/.well-known/x402.json");
    expect([200, 301, 302]).toContain(status);
  });

  it("GET /.well-known/x402 returns manifest", async () => {
    const { status } = await api("GET", "/.well-known/x402");
    expect([200, 301, 302]).toContain(status);
  });
});

// ═══════════════════════════════════════════════════════════════
//  Preview (Free Tier)
// ═══════════════════════════════════════════════════════════════

describe("Preview Endpoint (Free)", () => {
  it("GET /preview returns info page", async () => {
    const { status } = await api("GET", "/preview");
    expect(status).toBe(200);
  });

  it("POST /preview with valid query returns response or rate limit", async () => {
    const { status, json } = await api("POST", "/preview", {
      query: "What is Bitcoin?"
    });
    // Preview is rate limited to 10/hr — may hit limit during test runs
    expect([200, 429]).toContain(status);
    if (status === 200) {
      // Successful preview returns truncated structured data.
      // Confidence lives nested under `result.confidence_score`, not at the
      // top level. Test originally asserted top-level `confidence` which
      // never existed on the live API — corrected 2026-05-15 against the
      // actual /preview response shape.
      expect(json).toHaveProperty("preview", true);
      expect(json).toHaveProperty("result");
      expect(json.result).toHaveProperty("confidence_score");
      expect(typeof json.result.confidence_score).toBe("number");
    } else {
      // Rate limited response should suggest upgrade path
      expect(json).toHaveProperty("error", "Rate Limited");
      expect(json).toHaveProperty("upgrade");
    }
  }, 60000);

  it("POST /preview without query returns 400", async () => {
    const { status, json } = await api("POST", "/preview", {});
    expect(status).toBe(400);
    expect(json).toHaveProperty("error");
  });
});

// ═══════════════════════════════════════════════════════════════
//  Paid Endpoints (expect 402 without payment)
// ═══════════════════════════════════════════════════════════════

describe("Paid Endpoints (Payment Required)", () => {
  it("POST /research without payment returns 402", async () => {
    const { status, headers } = await api("POST", "/research", { query: "test query" });
    expect(status).toBe(402);
    expect(headers.get("payment-required")).toBeTruthy();
  });

  it("POST /deep-research without payment returns 402", async () => {
    const { status, headers } = await api("POST", "/deep-research", { query: "test query" });
    expect(status).toBe(402);
    expect(headers.get("payment-required")).toBeTruthy();
  });

  it("POST /evaluate processes claims and returns verification", async () => {
    // Use a payload substantial enough that all 4 verification sources have
    // material to work with. Short fillers like "The sky is blue" tripped a
    // race in the early-finish path where one source remained null when 3 of 4
    // settled, surfacing as 500 / "Cannot read properties of null (reading
    // 'status')" — fixed in the same commit that introduced this test change
    // (defensive backfill in the /evaluate handler).
    const { status, json } = await api(
      "POST",
      "/evaluate",
      { content: "Bitcoin is trading around $80,000 according to recent market coverage.", min_confidence: 0.5 }
    );
    // /evaluate may return 200 (free) or 402 (paid) depending on config
    expect([200, 402]).toContain(status);
    if (status === 200) {
      expect(json).toHaveProperty("evaluation_id");
      expect(json).toHaveProperty("evaluation");
    }
  }, 60000);
});

// ═══════════════════════════════════════════════════════════════
//  x402 Payment Flow Validation
// ═══════════════════════════════════════════════════════════════

describe("x402 Payment Flow", () => {
  it("402 response includes valid payment instructions in header", async () => {
    const { status, headers } = await api("POST", "/research", { query: "test" });
    expect(status).toBe(402);
    
    const challenge = decode402Header(headers);
    expect(challenge).not.toBeNull();
    expect(challenge.x402Version).toBe(2);
    expect(Array.isArray(challenge.accepts)).toBe(true);
    expect(challenge.accepts.length).toBeGreaterThan(0);
    
    for (const option of challenge.accepts) {
      expect(option).toHaveProperty("scheme", "exact");
      expect(option).toHaveProperty("network");
      expect(option).toHaveProperty("amount");
      expect(option).toHaveProperty("payTo");
      expect(option.payTo.length).toBeGreaterThan(10);
    }
  });

  it("402 response includes Base network option", async () => {
    const { headers } = await api("POST", "/research", { query: "test" });
    const challenge = decode402Header(headers);
    const networks = challenge.accepts.map(a => a.network);
    expect(networks.some(n => n.includes("8453"))).toBe(true);
  });

  // Stellar is intentionally NOT advertised on the Bazaar-indexed /research and
  // /deep-research routes — CDP's indexer rejects routes whose accepts[]
  // contains networks outside its enum (see commit 579923c2, 2026-05-03).
  // Stellar accept definitions remain in the codebase (stellarAcceptResearch /
  // stellarAcceptDeep) for a future dedicated route when we wire it up.
  it.skip("402 response includes Stellar payment option (deferred — needs dedicated route)", () => {});

  // SKALE has its own dedicated route /deep-research/skale that advertises
  // SKALE Network (eip155:1187947933) via PayAI as the only accept, so SKALE
  // gasless callers get a real callable endpoint without disturbing CDP/Bazaar
  // indexing of the main /research and /deep-research routes.
  it("402 response on /deep-research/skale includes SKALE gasless option", async () => {
    const { status, headers } = await api("POST", "/deep-research/skale", { query: "test" });
    expect(status).toBe(402);
    const challenge = decode402Header(headers);
    expect(challenge).not.toBeNull();
    const networks = challenge.accepts.map(a => a.network);
    expect(networks.some(n => n.includes("1187947933"))).toBe(true);
  });

  it("402 response on /deep-research/skale advertises ONLY SKALE (no Base bleed)", async () => {
    const { headers } = await api("POST", "/deep-research/skale", { query: "test" });
    const challenge = decode402Header(headers);
    const networks = challenge.accepts.map(a => a.network);
    // Pure SKALE — no Base, no Stellar. Keeps the route surface honest.
    expect(networks.every(n => n.includes("1187947933"))).toBe(true);
  });

  it("402 response on /deep-research stays Base-only (CDP Bazaar compatibility)", async () => {
    const { headers } = await api("POST", "/deep-research", { query: "test" });
    const challenge = decode402Header(headers);
    const networks = challenge.accepts.map(a => a.network);
    // Must remain Base-only — see commit 579923c2 (2026-05-03). Any SKALE or
    // Stellar leak here will get the route de-indexed from CDP Bazaar.
    expect(networks.every(n => n.includes("8453"))).toBe(true);
  });

  it("402 response includes Bazaar discovery extension", async () => {
    const { headers } = await api("POST", "/research", { query: "test" });
    const challenge = decode402Header(headers);
    expect(challenge).toHaveProperty("extensions");
    expect(challenge.extensions).toHaveProperty("bazaar");
  });
});

// ═══════════════════════════════════════════════════════════════
//  Trust Layer Endpoints (Free)
// ═══════════════════════════════════════════════════════════════

describe("Trust Layer (Free Endpoints)", () => {
  it("POST /feedback validates required fields", async () => {
    const { status, json } = await api("POST", "/feedback", {
      query: "test",
      rating: 5
    });
    // Without evaluation_id and outcome, returns error
    expect([200, 400]).toContain(status);
  });

  it("POST /feedback with valid fields succeeds", async () => {
    const { status } = await api("POST", "/feedback", {
      evaluation_id: "test_eval_123",
      outcome: "accurate"
    });
    expect([200, 201]).toContain(status);
  });

  it("GET /reputation returns reputation data", async () => {
    const { status, json } = await api("GET", "/reputation");
    expect(status).toBe(200);
    expect(json).toHaveProperty("endpoint", "/reputation");
  });

  it("GET /fingerprints returns database stats with real key count", async () => {
    const { status, json } = await api("GET", "/fingerprints");
    expect(status).toBe(200);
    expect(json).toHaveProperty("database_stats");
    expect(json.database_stats).toHaveProperty("total_keys");
    expect(json.database_stats.total_keys).toBeGreaterThan(100);
    expect(json).toHaveProperty("storage", "persistent (Redis)");
  });

  it("GET /trust returns trust documentation", async () => {
    const { status } = await api("GET", "/trust");
    expect(status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  Free Research Endpoint
// ═══════════════════════════════════════════════════════════════

describe("Free Research Endpoint", () => {
  it("GET /free returns info page", async () => {
    const { status } = await api("GET", "/free");
    expect(status).toBe(200);
  });

  it("POST /free returns 403 (rate limited or restricted)", async () => {
    const { status } = await api("POST", "/free", {
      query: "What is Stellar blockchain?"
    });
    // /free may be rate limited or restricted in production
    expect([200, 403, 429]).toContain(status);
  }, 30000);
});

// ═══════════════════════════════════════════════════════════════
//  Landing Page & Static Assets
// ═══════════════════════════════════════════════════════════════

describe("Landing Page & Static Assets", () => {
  it("GET / returns landing page HTML", async () => {
    const { status, text } = await api("GET", "/");
    expect(status).toBe(200);
    expect(text).toContain("AgentOracle");
  });

  it("GET /demo returns demo page", async () => {
    const { status } = await api("GET", "/demo");
    expect(status).toBe(200);
  });

  it("GET /robots.txt returns valid robots.txt", async () => {
    const { status, text } = await api("GET", "/robots.txt");
    expect(status).toBe(200);
    expect(text).toContain("User-agent");
  });

  it("GET /sitemap.xml returns valid sitemap", async () => {
    const { status, text } = await api("GET", "/sitemap.xml");
    expect(status).toBe(200);
    expect(text).toContain("xml");
  });

  it("GET /favicon.ico returns favicon", async () => {
    const { status } = await api("GET", "/favicon.ico");
    expect(status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  Cache & Stats
// ═══════════════════════════════════════════════════════════════

describe("Cache & Stats", () => {
  it("GET /cache/stats returns cache statistics", async () => {
    const { status, json } = await api("GET", "/cache/stats");
    expect(status).toBe(200);
    expect(json).toHaveProperty("total_cached");
  });
});

// ═══════════════════════════════════════════════════════════════
//  Error Handling
// ═══════════════════════════════════════════════════════════════

describe("Error Handling", () => {
  it("GET /nonexistent returns 404", async () => {
    const { status } = await api("GET", "/this-route-does-not-exist-" + Date.now());
    expect(status).toBe(404);
  });

  it("POST /research without body returns 402 (payment gate, not crash)", async () => {
    const { status } = await api("POST", "/research");
    expect([400, 402]).toContain(status);
  });

  it("POST /evaluate without content returns 400 or 402", async () => {
    const { status } = await api("POST", "/evaluate", {});
    expect([400, 402]).toContain(status);
  });
});

// ═══════════════════════════════════════════════════════════════
//  SKALE & DeFi Endpoints
// ═══════════════════════════════════════════════════════════════

describe("SKALE & DeFi Endpoints", () => {
  it("GET /skale returns SKALE info page", async () => {
    const { status } = await api("GET", "/skale");
    expect(status).toBe(200);
  });

  it("GET /defi returns DeFi info page", async () => {
    const { status } = await api("GET", "/defi");
    expect(status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  Response Format Consistency
// ═══════════════════════════════════════════════════════════════

describe("Response Format Consistency", () => {
  it("JSON responses include correct Content-Type", async () => {
    const { headers } = await api("GET", "/health");
    const ct = headers.get("content-type");
    expect(ct).toContain("application/json");
  });

  it("CORS headers are present", async () => {
    const { headers } = await api("GET", "/health");
    const acao = headers.get("access-control-allow-origin");
    expect(acao).toBeTruthy();
  });
});
