// cdp-fetch-tap.js
//
// CDP server-to-server response tap, v2 (2026-05-18).
//
// v1 monkey-patched globalThis.fetch. That did not work because the
// @coinbase/x402 SDK (via @x402/core) talks to api.cdp.coinbase.com using
// Node's built-in fetch, which in Node 20 is a thin wrapper over the
// internal undici dispatcher — and any module that bound a reference to
// `fetch` before our patch ran kept the original implementation. On Vercel
// serverless this manifested as totalFetchCalls=N, cdpFetchCalls=0: SDK
// traffic existed but never went through our wrapper.
//
// v2 hooks node:diagnostics_channel events that undici emits internally,
// regardless of which fetch reference was captured at import time:
//
//   'undici:request:create'   — fires when a request is created
//   'undici:request:headers'  — fires when response headers arrive
//                               (this is the channel that carries
//                               EXTENSION-RESPONSES from CDP /settle)
//   'undici:request:trailers' — fires at end-of-response
//
// This works because:
//   1. diagnostics_channel is registered globally and is checked on every
//      request, not at module-import time. There is no install-order race.
//   2. Both `fetch()` and `axios` (which @coinbase/cdp-sdk uses for the
//      JWT-signed auth path) ultimately dispatch through the same undici
//      core in Node 20+, so we capture all CDP traffic with one hook.
//   3. The hook only reads; it does not modify the request or response,
//      so there is zero risk of breaking SDK behavior.
//
// Limitation: response body is NOT directly exposed on diagnostics_channel.
// EXTENSION-RESPONSES lives in headers (confirmed against x402#2207 thread
// from @0xdespot and @evanatpizzarobot) so we capture the bucket signal
// without needing the body. If we ever need the body, we can layer
// `Dispatcher.compose` on top of `setGlobalDispatcher` as a second
// observation channel without removing this one.

import { subscribe } from "node:diagnostics_channel";

const CDP_HOST = "api.cdp.coinbase.com";
const CDP_PATH_PREFIX = "/platform/v2/x402";
const RING_MAX = 256;
// Short-circuit hosts that would otherwise feedback-loop the subscriber.
// Per @0xdespot's verification on hyperD (x402#2207 2026-05-19 12:27Z): any
// HTTP-backed store (Upstash Redis, axios with http adapter, etc.) called
// from inside the subscriber's bookkeeping is itself an undici request that
// re-fires the subscriber, drowning out CDP entries in the rolling sample.
const SHORTCIRCUIT_ORIGINS = [
  "upstash.io",
  "vercel.app",
  "sentry.io",
];
const ring = []; // newest pushed at end
const inflight = new Map(); // request -> { t0, url, method }
let totalRequests = 0;
let cdpRequests = 0;
let installedAt = null;

function push(event) {
  ring.push(event);
  if (ring.length > RING_MAX) ring.shift();
}

function rawHeadersToObject(raw) {
  // undici hands us [name, value, name, value, ...] as Buffers or strings
  if (!Array.isArray(raw)) return {};
  const out = {};
  for (let i = 0; i < raw.length; i += 2) {
    const k = String(raw[i]).toLowerCase();
    const v = String(raw[i + 1]);
    // collapse duplicate headers (e.g. set-cookie) into an array
    if (out[k] != null) {
      out[k] = Array.isArray(out[k]) ? [...out[k], v] : [out[k], v];
    } else {
      out[k] = v;
    }
  }
  return out;
}

function urlFromRequest(req) {
  // undici exposes either { origin, path } or { url }; normalize.
  if (req?.origin && req?.path) return req.origin + req.path;
  if (req?.url) return String(req.url);
  return "(unknown)";
}

function isCdp(originAndPath) {
  // Match BOTH the host AND the x402 path prefix (per 0xdespot pattern).
  // Catches CDP /verify and /settle, skips any other CDP traffic.
  return (
    typeof originAndPath === "string" &&
    originAndPath.includes(CDP_HOST) &&
    originAndPath.includes(CDP_PATH_PREFIX)
  );
}

function isShortCircuit(originAndPath) {
  if (typeof originAndPath !== "string") return false;
  for (const o of SHORTCIRCUIT_ORIGINS) {
    if (originAndPath.includes(o)) return true;
  }
  return false;
}

function isSettleOrVerify(url) {
  return (
    typeof url === "string" &&
    (url.includes("/settle") || url.includes("/verify"))
  );
}

function classifyBucket(headers) {
  // Look at every plausible header name; CDP has used variants over time.
  const candidates = [
    "extension-responses",
    "x402-extension-responses",
    "x-extension-responses",
  ];
  let raw = null;
  let usedHeader = null;
  for (const k of candidates) {
    if (headers[k] != null) {
      raw = headers[k];
      usedHeader = k;
      break;
    }
  }
  if (raw == null) return { bucket: "4_absent", header: null, value: null };
  // Per @0xdespot's hyperD verification (x402#2207 2026-05-19): CDP sends
  // EXTENSION-RESPONSES as base64-encoded JSON e.g.
  //   { bazaar: { status: 'processing' | 'indexed' | 'rejected', ... } }
  // Try that path first — it's what real-world CDP traffic looks like today.
  try {
    const decoded = Buffer.from(String(raw), "base64").toString("utf8");
    const obj = JSON.parse(decoded);
    const status =
      obj?.bazaar?.status ??
      obj?.discovery?.status ??
      (Array.isArray(obj) ? obj[0]?.bazaar?.status : null);
    if (status) {
      const s = String(status).toLowerCase();
      if (s === "processing") return { bucket: "2_processing", header: usedHeader, value: status, decoded: obj };
      if (s === "indexed" || s === "success" || s === "ok") return { bucket: "3_success", header: usedHeader, value: status, decoded: obj };
      if (s === "rejected" || s === "failed" || s === "error") return { bucket: "1_rejected", header: usedHeader, value: status, decoded: obj };
      return { bucket: `2_processing_unknown(${s.slice(0,32)})`, header: usedHeader, value: status, decoded: obj };
    }
  } catch (_) {
    /* fall through to legacy parse paths */
  }
  // Header can be a JSON-encoded object, a base64-encoded JSON, or a bare
  // status word like "processing". Try them in order.
  const tryStatus = (val) => {
    const s = String(val).trim().toLowerCase();
    if (s === "processing") return "2_processing";
    if (s === "success" || s === "ok" || s === "indexed") return "3_success";
    if (s === "rejected" || s === "failed" || s === "error") return "1_rejected";
    return null;
  };
  // JSON?
  try {
    const decoded = decodeURIComponent(String(raw));
    if (decoded.startsWith("{") || decoded.startsWith("[")) {
      const obj = JSON.parse(decoded);
      const status =
        obj?.bazaar?.status ??
        obj?.discovery?.status ??
        (Array.isArray(obj) ? obj[0]?.bazaar?.status : null);
      const b = status ? tryStatus(status) : null;
      if (b) return { bucket: b, header: usedHeader, value: status };
    }
  } catch (_) {
    /* try base64 next */
  }
  // base64-JSON?
  try {
    const decoded = Buffer.from(String(raw), "base64").toString("utf8");
    if (decoded.startsWith("{") || decoded.startsWith("[")) {
      const obj = JSON.parse(decoded);
      const status =
        obj?.bazaar?.status ??
        obj?.discovery?.status ??
        (Array.isArray(obj) ? obj[0]?.bazaar?.status : null);
      const b = status ? tryStatus(status) : null;
      if (b) return { bucket: b, header: usedHeader, value: status };
    }
  } catch (_) {
    /* bare word fall-through */
  }
  // Bare word
  const b = tryStatus(raw);
  if (b) return { bucket: b, header: usedHeader, value: String(raw) };
  return {
    bucket: `2_processing_unknown(${String(raw).slice(0, 32)})`,
    header: usedHeader,
    value: String(raw).slice(0, 200),
  };
}

function install() {
  if (installedAt) return false;

  // Track request -> { t0, url, method } so we can compute latency and
  // attribute the headers event back to the originating request.
  subscribe("undici:request:create", (m) => {
    totalRequests++;
    const url = urlFromRequest(m.request);
    // CRITICAL: skip bookkeeping hosts FIRST so they never consume sample
    // buffer slots. Per @0xdespot's verification, without this guard the
    // sample list fills with Redis/Vercel-internal traffic and CDP entries
    // are evicted before they're observed (x402#2207 2026-05-19).
    if (isShortCircuit(url)) return;
    if (!isCdp(url)) return;
    cdpRequests++;
    inflight.set(m.request, {
      t0: Date.now(),
      url,
      method: m.request?.method || "GET",
    });
  });

  subscribe("undici:request:headers", (m) => {
    const ctx = inflight.get(m.request);
    if (!ctx) return; // not a CDP request we're tracking
    const headers = rawHeadersToObject(m.response?.headers || []);
    const statusCode = m.response?.statusCode;
    const tookMs = Date.now() - ctx.t0;
    let bucketInfo = { bucket: "0_not_settle_or_verify", header: null, value: null };
    if (isSettleOrVerify(ctx.url)) {
      bucketInfo = classifyBucket(headers);
    }
    const event = {
      t: new Date().toISOString(),
      url: ctx.url,
      method: ctx.method,
      status: statusCode,
      took_ms: tookMs,
      bucket: bucketInfo.bucket,
      ext_responses_header: bucketInfo.header,
      ext_responses_value: bucketInfo.value,
      // Capture a handful of useful headers for triage; drop the rest to
      // keep the ring buffer payload small.
      headers: {
        "content-type": headers["content-type"],
        "x-cdp-request-id": headers["x-cdp-request-id"],
        "cf-ray": headers["cf-ray"],
        "trace-id": headers["trace-id"],
        ...(bucketInfo.header
          ? { [bucketInfo.header]: headers[bucketInfo.header] }
          : {}),
      },
    };
    push(event);
    // Vercel serverless distributes requests across ephemeral function
    // instances; an in-memory ring is unreliable for cross-request reads.
    // Log the event inline on the invocation that produced it so the data
    // is findable in Vercel logs regardless of which instance handled the
    // subsequent GET /health/cdp/fetch-tap-buffer call. The CDPTAP prefix
    // makes filtering trivial: `vercel logs <dep> | grep CDPTAP`.
    try {
      console.log("CDPTAP " + JSON.stringify(event));
    } catch (_) {
      /* never let logging break the request path */
    }
  });

  subscribe("undici:request:trailers", (m) => {
    // Cleanup
    inflight.delete(m.request);
  });

  subscribe("undici:request:error", (m) => {
    const ctx = inflight.get(m.request);
    if (!ctx) return;
    const event = {
      t: new Date().toISOString(),
      url: ctx.url,
      method: ctx.method,
      status: null,
      took_ms: Date.now() - ctx.t0,
      bucket: "0_fetch_error",
      error: String(m.error?.message || m.error || "unknown").slice(0, 200),
    };
    push(event);
    try {
      console.log("CDPTAP " + JSON.stringify(event));
    } catch (_) {}
    inflight.delete(m.request);
  });

  installedAt = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(
    "[cdp-fetch-tap v2] subscribed to undici diagnostics_channel at " +
      installedAt
  );
  return true;
}

// Install on import. Unlike v1, the diagnostics_channel subscription does
// not require any race against module-load order — undici checks the
// channel registrations per-request.
install();

export function getCdpFetchTapState() {
  return {
    version: "v2-diagnostics-channel",
    installed: !!installedAt,
    installedAt,
    totalRequests,
    cdpRequests,
    inflight: inflight.size,
    ringSize: ring.length,
    ringMax: RING_MAX,
  };
}

export function getCdpFetchTapBuffer({ limit = 50, bucket = null } = {}) {
  let events = ring.slice();
  if (bucket) events = events.filter((e) => e.bucket === bucket);
  events = events.slice(-Math.min(limit, RING_MAX)).reverse();
  const histogram = ring.reduce((acc, e) => {
    acc[e.bucket] = (acc[e.bucket] || 0) + 1;
    return acc;
  }, {});
  return {
    state: getCdpFetchTapState(),
    histogram,
    events,
    note:
      "CDP-side tap (undici diagnostics_channel hook). Captures " +
      "EXTENSION-RESPONSES on the CDP -> merchant /settle and /verify hops. " +
      "v2 swaps the v1 globalThis.fetch monkey-patch (broken: SDK captured " +
      "fetch ref at module-load, bypassing the wrap) for diagnostics_channel " +
      "events which are checked per-request and have no install-order race.",
  };
}
