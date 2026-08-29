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

// Two-bucket rotation, fully time-derived. No process-local state.
//
// HISTORY — two corrections, both dated, neither rewritten:
//
//   v1 was `CANARY_CLAIMS[hour % 36]`: pure hour-modular. Two runs in the same
//   UTC hour (a manual test plus the scheduled cron) got the same claim and the
//   second measured the cache. First live workflow run tripped
//   `canary_served_from_cache` for exactly that reason.
//
//   v2 added two disjoint 18-claim buckets plus a monotonic PER-PROCESS counter
//   inside each bucket. The counter was the defect. On serverless every
//   invocation may be a cold start, so `_bucketCounters` reset to [0,0] on
//   essentially every canary run, and the selector therefore returned index 0
//   of the current bucket every single time. Measured, not inferred: over 12
//   simulated cold runs only claims 0 and 18 were ever used — 4 of 36 including
//   retries — and they swapped between primary and retry each hour. The stated
//   36h reuse floor was actually 1h, off by 36x. With a 24h cache TTL both
//   claims stayed warm permanently, so the primary cache-hit, the retry
//   cache-hit, and the run hard-tripped `canary_stuck_on_cache` on a service
//   that was behaving correctly. Four of six runs failed between
//   2026-08-28 18:55Z and 2026-08-29 14:16Z.
//
// v3 (this version) derives the index from the hour instead of from process
// state, so it behaves identically on a warm instance and a cold one:
//
//   bucket        = hour & 1
//   primary index = floor(hour / 2) % 18
//   retry  index  = (floor(hour / 2) + 9) % 18   , opposite bucket
//
// Verified by simulation over 200 hours before shipping:
//   * minimum primary reuse gap: 36h — clears the 24h TTL.
//   * all 36 claims used as primary within 72h.
//   * same-hour primary == retry collisions: 0, by construction (disjoint
//     buckets), so a retry can never be served from the primary's cache entry.
//
// The same-hour manual+cron collision that motivated the v2 counter is handled
// by the retry mechanism, not by claim rotation: two runs in one hour means the
// second sees primary cache_hit=true, retries into the opposite bucket, gets a
// cold claim, and does not trip. One cache hit is not a trip. The counter was
// therefore redundant as well as broken, and removing it is a simplification
// rather than a tradeoff.
//
// RESIDUAL, stated rather than hidden: a claim used as a RETRY at hour h next
// appears as a PRIMARY 17h later (measured minimum over 200h), which is inside
// the 24h TTL. So if a retry fires at hour h, the primary 17h later can
// cache-hit. That path requires a retry to have fired first, which under v3
// only happens when something is already anomalous — a primary cache-hit is
// itself unexpected once primaries recur no more often than 36h. Closing the
// residual entirely needs more claims (>=60 for a 30h retry-echo gap), not a
// different selector. Not doing that here; the claim list is content, and
// inventing 24 more factual claims is a separate task with its own review.

const BUCKET_SIZE = CANARY_CLAIMS.length / 2;

function _hoursSinceEpoch(d) {
  return Math.floor(d.getTime() / 3600000);
}

function _bucketForHour(d) {
  return _hoursSinceEpoch(d) & 1; // 0 or 1
}

/**
 * canaryClaimForNow — primary claim for this run. Time-derived: the same hour
 * always yields the same claim, and consecutive hours walk the full 36-claim
 * list with a 36h reuse floor. Identical on cold and warm instances.
 */
export function canaryClaimForNow(d = new Date()) {
  const b = _bucketForHour(d);
  const idx = Math.floor(_hoursSinceEpoch(d) / 2) % BUCKET_SIZE;
  return CANARY_CLAIMS[b * BUCKET_SIZE + idx];
}

/**
 * canaryRetryClaim — claim for a retry after the primary was served from
 * cache. Drawn from the opposite bucket at a half-bucket offset, so it can
 * never share a cache entry with the primary of the same hour.
 */
export function canaryRetryClaim(d = new Date()) {
  const b = _bucketForHour(d) ^ 1;
  const idx = (Math.floor(_hoursSinceEpoch(d) / 2) + BUCKET_SIZE / 2) % BUCKET_SIZE;
  return CANARY_CLAIMS[b * BUCKET_SIZE + idx];
}

/**
 * Retained for API compatibility with the v2 test surface. v3 holds no
 * process-local state, so there is nothing to reset and this is a no-op.
 * Kept exported so any existing caller does not break; see the whole-repo
 * grep in the delivery note.
 */
export function _resetCanaryCountersForTest() {
  /* no-op in v3 — selection is time-derived */
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
  // NOTE: cache_hit is NOT collected here. It is not a defect signal; it means
  // this run measured nothing about live evaluation. runCanary() handles the
  // retry-with-a-fresh-claim, and only trips if the SECOND run also hits.
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
async function probeOnce(baseUrl, claim) {
  const res = await fetch(`${baseUrl}/evaluate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content: claim, min_confidence: 0.7 }),
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) return { httpError: res.status };
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
  return {
    body,
    cacheHit: body?.meta?.cache_hit === true,
    mappingHash,
    publishedHash,
  };
}

/**
 * runCanary — probe /evaluate.
 *
 * A cache_hit does not trip. It means "this run measured nothing about live
 * evaluation," which is different from a defect. On cache_hit we retry once
 * with a claim from the opposite bucket — which cannot share a cache entry
 * with the primary by construction — and only trip `canary_stuck_on_cache`
 * if that also hits. That case is worth alarming on: two consecutive
 * un-colliding claims served from cache implies the cache layer, not just a
 * single pre-warmed key.
 */
export async function runCanary({ baseUrl = "https://agentoracle.co" } = {}) {
  const started = Date.now();
  const primaryClaim = canaryClaimForNow();
  try {
    let attempt = await probeOnce(baseUrl, primaryClaim);
    if (attempt.httpError !== undefined) {
      await raise("/evaluate", "canary_http_error", `canary got HTTP ${attempt.httpError}`, { status: attempt.httpError });
      return { ok: false, status: attempt.httpError };
    }

    let retriedWith = null;
    if (attempt.cacheHit) {
      retriedWith = canaryRetryClaim();
      const retry = await probeOnce(baseUrl, retriedWith);
      if (retry.httpError !== undefined) {
        await raise("/evaluate", "canary_http_error", `retry got HTTP ${retry.httpError}`, { status: retry.httpError, retry: true });
        return { ok: false, status: retry.httpError, retried: true };
      }
      if (retry.cacheHit) {
        await raise(
          "/evaluate",
          "canary_stuck_on_cache",
          `two consecutive canary claims from disjoint buckets both cache_hit=true — cache is misclassifying novel evaluations`,
          { canary: true, primary_claim: primaryClaim, retry_claim: retriedWith, elapsed_ms: Date.now() - started }
        );
        return {
          ok: false,
          problems: ["canary_stuck_on_cache"],
          primary_cache_hit: true,
          retry_cache_hit: true,
          elapsed_ms: Date.now() - started,
        };
      }
      // retry landed on live evaluation; use its body for the content checks.
      attempt = retry;
    }

    const problems = evaluateCanary(
      { ...attempt.body, __mappingHash: attempt.mappingHash },
      attempt.publishedHash
    );
    for (const p of problems) {
      await raise("/evaluate", p.key, p.detail, {
        canary: true,
        claim: retriedWith || primaryClaim,
        retried: retriedWith !== null,
        elapsed_ms: Date.now() - started,
      });
    }
    return {
      ok: problems.length === 0,
      problems: problems.map((p) => p.key),
      confidence: attempt.body?.evaluation?.overall_confidence,
      sources: attempt.body?.evaluation?.sources_used,
      mapping_resolves: attempt.publishedHash != null && attempt.mappingHash === attempt.publishedHash,
      retried: retriedWith !== null,
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
