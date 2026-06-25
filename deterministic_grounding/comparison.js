// ═══════════════════════════════════════════════════════════════════
//  comparison.js — Phase 1 deterministic comparison check
//
//  Resolves a claim of the shape:
//    "[value at field_paths[0]] [operator] [value at field_paths[1]]"
//  e.g. Q3 revenue >  Q2 revenue
//        lab.hba1c <= 6.5
//        count_2026 == count_2025
//
//  Fetches the cited source once, resolves both field_paths against it,
//  applies the numeric operator, returns match/no_match. If either path
//  doesn't resolve to a numeric scalar, the result escalates to the
//  probabilistic tier.
//
//  Same correctness bar as field_lookup: any ambiguity escalates rather
//  than producing a confident verdict.
//
//  Spec: /docs/deterministic-first-grounding.md
// ═══════════════════════════════════════════════════════════════════

import crypto from "node:crypto";
import { resolvePath } from "./field_lookup.js";

const DEFAULT_FETCH_TIMEOUT_MS = 5000;
const MAX_RESPONSE_BYTES = 1_000_000;

const NUMERIC_OPS = {
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  "<":  (a, b) => a <  b,
  "<=": (a, b) => a <= b,
  ">":  (a, b) => a >  b,
  ">=": (a, b) => a >= b,
};

function toNumber(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v.trim())) {
    return Number(v.trim());
  }
  return null;
}

/**
 * comparison(claim, opts?) → resolution result
 *
 * Input:
 *   claim: { source_uri, field_paths: [left, right], operator }
 *
 * Output (stable for receipt embedding):
 *   {
 *     status: "resolved" | "escalate",
 *     match: boolean,                 // when resolved
 *     left_value, right_value,        // numeric scalars when resolved
 *     operator,
 *     source_hash,
 *     fetched_at,
 *     reason
 *   }
 */
async function comparison(claim, opts = {}) {
  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  const timeoutMs = opts.fetchTimeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS;
  const maxBytes = opts.maxBytes ?? MAX_RESPONSE_BYTES;

  if (!NUMERIC_OPS[claim.operator]) {
    return { status: "escalate", reason: "unsupported_operator" };
  }

  // Fetch + hash.
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  let respBuf;
  try {
    const resp = await fetchImpl(claim.source_uri, { signal: ac.signal });
    if (!resp.ok) return { status: "escalate", reason: `fetch_http_${resp.status}` };
    const ab = await resp.arrayBuffer();
    if (ab.byteLength > maxBytes) {
      return { status: "escalate", reason: "response_exceeds_max_bytes" };
    }
    respBuf = Buffer.from(ab);
  } catch (e) {
    return { status: "escalate", reason: "fetch_failed:" + (e?.name || e?.message || "unknown") };
  } finally {
    clearTimeout(t);
  }
  const source_hash = "sha256-" + crypto.createHash("sha256").update(respBuf).digest("hex");

  // Parse.
  let parsed;
  try {
    parsed = JSON.parse(respBuf.toString("utf-8"));
  } catch (e) {
    return { status: "escalate", reason: "non_json_response", source_hash };
  }

  // Resolve both paths.
  const [lpath, rpath] = claim.field_paths;
  const lr = resolvePath(parsed, lpath);
  const rr = resolvePath(parsed, rpath);
  if (!lr.found) return { status: "escalate", reason: "left_path_unresolved:" + lr.reason, source_hash };
  if (!rr.found) return { status: "escalate", reason: "right_path_unresolved:" + rr.reason, source_hash };

  // Coerce to numbers.
  const ln = toNumber(lr.value);
  const rn = toNumber(rr.value);
  if (ln === null) return { status: "escalate", reason: "left_value_not_numeric", source_hash };
  if (rn === null) return { status: "escalate", reason: "right_value_not_numeric", source_hash };

  const match = NUMERIC_OPS[claim.operator](ln, rn);

  return {
    status: "resolved",
    match,
    left_value: ln,
    right_value: rn,
    operator: claim.operator,
    source_hash,
    fetched_at: new Date().toISOString(),
    reason: match ? "comparison_holds" : "comparison_fails",
  };
}

export { comparison, NUMERIC_OPS };
