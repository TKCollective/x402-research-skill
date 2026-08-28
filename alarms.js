// alarms.js — makes the existing [ALARM] console lines actionable, and adds
// the A1 hourly canary.
//
// Two `[ALARM][/evaluate][*]` console.error lines existed in index.js before
// this module (no_members_evaluated at ~4531, receipt_signing_failed at ~4701).
// On a hosting tier with ~1h log retention, an alarm that nobody reads is
// indistinguishable from no alarm — which is how the 2026-08-21 window stayed
// invisible for five days.
//
// Scope kept small: no vendor SDK, no new dependency, no persistent store.
//   (a) raise() tees the existing lines to an optional webhook, kept
//       byte-identical so existing greps still match on the console line.
//   (b) an in-process ring buffer for /internal/alarms so a human can curl it.
//   (c) runCanary() and registerAlarmRoutes() for A1 — asserting on the
//       CONTENTS of an evaluation, not its status, because the incident's
//       signature was a 200 with a signed receipt and nothing behind it.
//
// Env:
//   ALARM_WEBHOOK_URL      POST target for alarm payloads. Unset = log only.
//   ALARM_CANARY_TOKEN     bearer token guarding POST /internal/alarms/canary.
//   ALARM_MIN_INTERVAL_MS  per-key debounce, default 900000 (15 min).

import { createHash } from "node:crypto";

const RING_MAX = 200;
const ring = [];
const lastSent = new Map();

function nowIso() { return new Date().toISOString(); }

function record(entry) {
  ring.push(entry);
  if (ring.length > RING_MAX) ring.shift();
}

async function deliver(entry) {
  const url = process.env.ALARM_WEBHOOK_URL;
  if (!url) return { delivered: false, reason: "no_webhook_configured" };
  const minInterval = Number(process.env.ALARM_MIN_INTERVAL_MS || 900000);
  const prev = lastSent.get(entry.key) || 0;
  if (Date.now() - prev < minInterval) {
    return { delivered: false, reason: "debounced" };
  }
  lastSent.set(entry.key, Date.now());
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(5000),
    });
    return { delivered: r.ok, status: r.status };
  } catch (e) {
    // An alarm path must never throw into the caller.
    console.log(`[ALARM][delivery_failed] ${e.message}`);
    return { delivered: false, reason: e.message };
  }
}

/**
 * raise — single entry point. Fire-and-forget. Emits nothing to the console
 * itself (the caller has already logged its own [ALARM] line, byte-identical
 * to the pre-existing format), records to the ring, and tees to the webhook.
 */
export async function raise(route, key, detail, extra = {}) {
  const entry = { at: nowIso(), route, key, detail, ...extra };
  record(entry);
  const res = await deliver(entry);
  return { ...entry, delivery: res };
}

// ─── A1 canary ──────────────────────────────────────────────────────────────
//
// Cache collision hazard: evaluation verdicts are cached for 24h
// (index.js eval:* TTL = 86400s). A single fixed canary claim would be served
// from cache on every run after the first, proving nothing about live
// evaluation. A nonce trips the adversarial layer's contains_nonce flag and
// depresses confidence, so the canary would alarm on its own cache-buster.
//
// Answer: 36 stable claims rotated hourly. Any given claim recurs every 36h,
// past the 24h TTL, so every run is a cold evaluation with clean text.
export const CANARY_CLAIMS = [
  "The Louvre Museum is located in Paris, France.",
  "Mount Everest is the highest mountain above sea level on Earth.",
  "The Pacific Ocean is the largest ocean on Earth.",
  "Water freezes at zero degrees Celsius at standard atmospheric pressure.",
  "The Amazon River is located in South America.",
  "Tokyo is the capital city of Japan.",
  "The Great Barrier Reef lies off the coast of Australia.",
  "The Sahara is the largest hot desert in the world.",
  "Mercury is the closest planet to the Sun.",
  "The Nile flows through Egypt.",
  "Canberra is the capital city of Australia.",
  "The Danube flows through Vienna.",
  "Iceland is an island nation in the North Atlantic.",
  "The Andes mountain range runs along the western edge of South America.",
  "Lake Baikal is the deepest freshwater lake in the world.",
  "The Colosseum is located in Rome, Italy.",
  "Greenland is the world's largest island.",
  "The Strait of Gibraltar separates Europe from Africa.",
  "Mount Kilimanjaro is located in Tanzania.",
  "The Dead Sea lies below global sea level.",
  "Ottawa is the capital city of Canada.",
  "The Thames flows through London.",
  "Antarctica is the coldest continent on Earth.",
  "The Volga is the longest river in Europe.",
  "Madagascar lies off the southeastern coast of Africa.",
  "The Panama Canal connects the Atlantic and Pacific Oceans.",
  "Helium is lighter than air at standard conditions.",
  "The Alps span several countries in central Europe.",
  "Brasilia is the capital city of Brazil.",
  "The Ganges flows through India.",
  "New Zealand consists of two main islands.",
  "The Caspian Sea is the largest inland body of water on Earth.",
  "Mount Fuji is located in Japan.",
  "The Rhine flows through Germany.",
  "Cuba is an island in the Caribbean Sea.",
  "The Yangtze is the longest river in Asia.",
];

export function canaryClaimForNow(d = new Date()) {
  const hours = Math.floor(d.getTime() / 3600000);
  return CANARY_CLAIMS[hours % CANARY_CLAIMS.length];
}

/**
 * evaluateCanary — pure. Given an /evaluate response body and (optionally) a
 * digest of the currently published mapping document, return the list of trip
 * conditions. Each maps to something the incident actually did.
 */
export function evaluateCanary(body, publishedMappingHash) {
  const problems = [];
  const ev = body?.evaluation || {};
  const meta = body?.meta || {};
  const sources = Array.isArray(ev.sources_used) ? ev.sources_used : [];
  const conf = ev.overall_confidence;

  if (sources.length === 0) {
    problems.push({ key: "sources_empty",
                    detail: "sources_used is empty — no source produced a parseable claim set" });
  }
  if (conf === 0.5) {
    problems.push({ key: "confidence_exactly_half",
                    detail: "overall_confidence is exactly 0.50 — the unevaluated seed value" });
  }
  if (!sources.includes("adversarial")) {
    problems.push({ key: "adversarial_not_live",
                    detail: `adversarial pass absent from sources_used=${JSON.stringify(sources)} — act is unreachable` });
  }
  if (meta.cache_hit === true) {
    problems.push({ key: "canary_served_from_cache",
                    detail: "canary answered from cache — it proves nothing about live evaluation" });
  }
  if (publishedMappingHash && body?.__mappingHash && body.__mappingHash !== publishedMappingHash) {
    problems.push({
      key: "mapping_hash_unresolvable",
      detail: `receipt mapping_hash ${body.__mappingHash} does not match published mapping ${publishedMappingHash}`,
    });
  }
  return problems;
}

/**
 * runCanary — probe /evaluate, resolve and hash the mapping the receipt binds
 * to, and raise on every trip. Never throws.
 */
export async function runCanary({ baseUrl = "https://agentoracle.co" } = {}) {
  const started = Date.now();
  const claim = canaryClaimForNow();
  try {
    const res = await fetch(`${baseUrl}/evaluate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: claim, min_confidence: 0.7 }),
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) {
      await raise("/evaluate", "canary_http_error", `canary got HTTP ${res.status}`, { status: res.status });
      return { ok: false, status: res.status };
    }
    const body = await res.json();

    let mappingHash = null, publishedHash = null;
    try {
      const payload = JSON.parse(
        Buffer.from(body.receipt.jws.payload, "base64url").toString("utf8")
      );
      mappingHash = payload?.v_gate?.mapping_hash || null;
      const mid = payload?.v_gate?.mapping_id;
      if (mid) {
        const m = await fetch(`${baseUrl}/mappings/${mid}.json`, {
          signal: AbortSignal.timeout(10000),
        });
        if (m.ok) {
          const raw = Buffer.from(await m.arrayBuffer());
          publishedHash = "sha256-" + createHash("sha256").update(raw).digest("hex");
        }
      }
    } catch { /* mapping check is best-effort */ }

    const problems = evaluateCanary({ ...body, __mappingHash: mappingHash }, publishedHash);
    for (const p of problems) {
      await raise("/evaluate", p.key, p.detail, { canary: true, claim, elapsed_ms: Date.now() - started });
    }
    return {
      ok: problems.length === 0,
      problems: problems.map((p) => p.key),
      confidence: body?.evaluation?.overall_confidence,
      sources: body?.evaluation?.sources_used,
      mapping_resolves: publishedHash != null && mappingHash === publishedHash,
      elapsed_ms: Date.now() - started,
    };
  } catch (e) {
    await raise("/evaluate", "canary_unreachable", `canary could not complete: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

/**
 * registerAlarmRoutes — read-only inspection plus a token-guarded trigger for
 * the canary.
 */
export function registerAlarmRoutes(app) {
  app.get("/internal/alarms", (_req, res) => {
    res.setHeader("cache-control", "no-store");
    res.json({
      count: ring.length,
      webhook_configured: Boolean(process.env.ALARM_WEBHOOK_URL),
      canary_configured: Boolean(process.env.ALARM_CANARY_TOKEN),
      debounce_ms: Number(process.env.ALARM_MIN_INTERVAL_MS || 900000),
      recent: ring.slice(-50).reverse(),
    });
  });

  app.post("/internal/alarms/canary", async (req, res) => {
    const token = process.env.ALARM_CANARY_TOKEN;
    if (!token) {
      return res.status(503).json({
        status: "not_configured",
        reason: "ALARM_CANARY_TOKEN not set",
      });
    }
    const got = (req.get && req.get("authorization")) || "";
    if (got !== `Bearer ${token}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const out = await runCanary({});
    res.status(out.ok ? 200 : 503).json(out);
  });
}
