// cdp-fetch-tap.js
//
// Server-to-server fetch tap for the CDP → merchant /settle response hop.
//
// Why this file is needed:
// EXTENSION-RESPONSES is a *response* header that CDP's facilitator returns to
// us when our @coinbase/x402 facilitator client POSTs to its /settle endpoint.
// It never reaches the paying agent — it is consumed (or not) inside the
// facilitator client. Express request/response hooks like res.on('finish')
// can't see it because that hook fires on the merchant → agent hop, which is
// the wrong direction. The only way to observe what CDP is actually sending
// back to us is to instrument the underlying fetch surface that the
// @coinbase/x402 SDK uses internally — which is the runtime globalThis.fetch.
//
// Credit: the pattern (globalThis.fetch monkey-patch at app boot) is from
// @0xdespot's commit ba1a07e2 on the x402#2207 thread, 2026-05-17. Install
// order matters: this file MUST be the first import in index.js, before any
// module that captures a reference to globalThis.fetch (notably @x402/core
// and @coinbase/x402, both of which read fetch on import).
//
// What it does:
//   1. Wraps globalThis.fetch
//   2. Lets non-CDP traffic through transparently (no overhead)
//   3. For CDP /settle and /verify hops, captures the response headers and
//      a small JSON snippet of the body, classifies the EXTENSION-RESPONSES
//      header into a named bucket (0_none / 1_rejected / 2_processing /
//      3_success / 4_absent), and pushes the event into a 256-entry ring
//      buffer that's exposed at /health/cdp/fetch-tap-buffer.
//   4. Returns the response untouched to the caller — zero behavior change
//      on the SDK side.
//
// Buckets (CDP-side, real):
//   2_processing  — EXTENSION-RESPONSES present, bazaar.status="processing"
//                   (transient for TF/hyperD, terminal for AsaiShota/us)
//   3_success     — EXTENSION-RESPONSES present, bazaar.status="success"
//                   (resource attributed in the catalog)
//   1_rejected    — EXTENSION-RESPONSES present, bazaar.status="rejected"
//                   (extension hit indexer, indexer refused it)
//   4_absent      — EXTENSION-RESPONSES header is missing from CDP's response
//                   (the failure mode @0xdespot flagged: header never sent)
//   0_none        — endpoint not a CDP /settle or /verify call (no decision)
//
// Read the ring buffer:
//   curl https://agentoracle.co/health/cdp/fetch-tap-buffer

const CDP_HOST = "api.cdp.coinbase.com";
const RING_MAX = 256;
const ring = []; // newest at end
let installed = false;
let installError = null;
let totalCalls = 0;
let cdpCalls = 0;

function push(event) {
  ring.push(event);
  if (ring.length > RING_MAX) ring.shift();
}

function classifyBucket(extResponsesHeader, parsedBody) {
  if (extResponsesHeader == null) return "4_absent";
  // CDP sometimes echoes the extension status into the body too; check both.
  // Header itself can be a JSON-string or a plain status word — accept either.
  let status = null;
  try {
    const decoded = decodeURIComponent(extResponsesHeader.trim());
    // Try JSON first
    if (decoded.startsWith("{") || decoded.startsWith("[")) {
      const obj = JSON.parse(decoded);
      // Look for bazaar.status anywhere reasonable
      status =
        obj?.bazaar?.status ??
        obj?.discovery?.status ??
        (Array.isArray(obj) ? obj[0]?.bazaar?.status : null);
    } else {
      // Bare-word header
      status = decoded.toLowerCase();
    }
  } catch (_) {
    // Fall through; treat as bare word
    status = String(extResponsesHeader).toLowerCase();
  }
  if (status === "processing") return "2_processing";
  if (status === "success" || status === "ok") return "3_success";
  if (status === "rejected" || status === "failed" || status === "error")
    return "1_rejected";
  // Header is present but value is unrecognized — still record, but flag
  return `2_processing_unknown(${String(status).slice(0, 32)})`;
}

function shortHeaders(headersObj) {
  // Pick only the headers that matter for the bucket decision; keep payload small.
  const keep = [
    "extension-responses",
    "x402-extension-responses",
    "payment-response",
    "x-payment-response",
    "x-cdp-request-id",
    "content-type",
  ];
  const out = {};
  for (const k of keep) {
    const v = headersObj.get ? headersObj.get(k) : headersObj[k];
    if (v != null) out[k] = v;
  }
  return out;
}

function installFetchTap() {
  if (installed) return { ok: true, alreadyInstalled: true };
  if (typeof globalThis.fetch !== "function") {
    installError = "globalThis.fetch is not a function";
    return { ok: false, reason: installError };
  }
  const originalFetch = globalThis.fetch;
  // Stash a backreference so an emergency restore is possible without restart.
  globalThis.__cdp_fetch_tap_original = originalFetch;

  globalThis.fetch = async function tappedFetch(input, init) {
    totalCalls++;
    const url =
      typeof input === "string"
        ? input
        : input?.url || (input && input.href) || String(input);
    const isCdp = typeof url === "string" && url.includes(CDP_HOST);
    if (!isCdp) {
      return originalFetch(input, init);
    }
    cdpCalls++;
    const t0 = Date.now();
    let res;
    let err;
    try {
      res = await originalFetch(input, init);
    } catch (e) {
      err = e;
    }
    const tookMs = Date.now() - t0;
    if (err) {
      push({
        t: new Date().toISOString(),
        url,
        method: (init && init.method) || "GET",
        status: null,
        ok: false,
        took_ms: tookMs,
        bucket: "0_fetch_error",
        error: String(err).slice(0, 200),
      });
      throw err;
    }
    // Path filter — only /settle and /verify are the hops that carry the
    // bazaar extension response. Other CDP calls (discovery reads, key
    // rotation, etc.) get a lightweight record without bucketing.
    const isSettleOrVerify =
      url.includes("/settle") || url.includes("/verify");
    // We must NOT consume the body — clone the response first.
    let bodyPreview = null;
    let parsedBody = null;
    try {
      const cloned = res.clone();
      const text = await cloned.text();
      bodyPreview = text.slice(0, 1024);
      try {
        parsedBody = JSON.parse(text);
      } catch (_) {
        /* not JSON */
      }
    } catch (_) {
      /* body unreadable — keep going */
    }
    const ext =
      res.headers.get("extension-responses") ||
      res.headers.get("x402-extension-responses") ||
      null;
    const bucket = isSettleOrVerify
      ? classifyBucket(ext, parsedBody)
      : "0_not_settle_or_verify";
    push({
      t: new Date().toISOString(),
      url,
      method: (init && init.method) || "GET",
      status: res.status,
      ok: res.ok,
      took_ms: tookMs,
      ext_responses_header: ext,
      bucket,
      headers: shortHeaders(res.headers),
      body_preview: bodyPreview,
    });
    return res;
  };

  installed = true;
  // eslint-disable-next-line no-console
  console.log(
    "[cdp-fetch-tap] installed — globalThis.fetch wrapped at " +
      new Date().toISOString()
  );
  return { ok: true };
}

// Install immediately on import. This MUST run before any SDK module captures
// a reference to globalThis.fetch — that's why this file is imported first.
const installResult = installFetchTap();

export function getCdpFetchTapState() {
  return {
    installed,
    installError,
    totalFetchCalls: totalCalls,
    cdpFetchCalls: cdpCalls,
    ringSize: ring.length,
    ringMax: RING_MAX,
    installedAt: installed ? new Date(0).toISOString() : null, // approx
  };
}

export function getCdpFetchTapBuffer({ limit = 50, bucket = null } = {}) {
  let events = ring.slice();
  if (bucket) {
    events = events.filter((e) => e.bucket === bucket);
  }
  events = events.slice(-Math.min(limit, RING_MAX)).reverse(); // newest first
  // Histogram across the *full* ring, not the filtered slice
  const histogram = ring.reduce((acc, e) => {
    acc[e.bucket] = (acc[e.bucket] || 0) + 1;
    return acc;
  }, {});
  return {
    state: getCdpFetchTapState(),
    histogram,
    events,
    note:
      "CDP-side fetch tap (globalThis.fetch wrap). Captures EXTENSION-RESPONSES " +
      "on the CDP → merchant /settle and /verify hops. See cdp-fetch-tap.js " +
      "for bucket definitions. Buffer keeps the most recent " +
      RING_MAX +
      " events.",
  };
}

export const __cdpFetchTapInstallResult = installResult;
