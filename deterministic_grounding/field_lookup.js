// ═══════════════════════════════════════════════════════════════════
//  field_lookup.js — Phase 1 deterministic field-lookup check
//
//  Resolution algorithm (no LLM in the loop):
//    1. Fetch the cited source URI.
//    2. Hash the fetched bytes — sha256, hex prefixed `sha256-`.
//    3. Parse the response as JSON.
//    4. Resolve the field_path against the parsed structure.
//    5. Coerce observed and expected values to comparable form.
//    6. Return { match, observed, source_hash, fetched_at, status }.
//
//  Acceptance bar: this check MUST be provably right. A deterministic
//  path that's subtly wrong is worse than no deterministic path
//  because it resolves confidently-incorrectly. Test vectors at
//  /test_vectors/ cover positive, negative, edge cases, and failures
//  that must NOT produce a verdict (must escalate to probabilistic).
//
//  Spec: /docs/deterministic-first-grounding.md
// ═══════════════════════════════════════════════════════════════════

import crypto from "node:crypto";

const DEFAULT_FETCH_TIMEOUT_MS = 5000;
const MAX_RESPONSE_BYTES = 1_000_000; // 1MB ceiling — anything larger routes probabilistic

/**
 * Resolve a dotted / JSONPath-lite selector against a parsed JSON object.
 *
 * Supports:
 *   - $.foo.bar.baz            — root-anchored dotted path
 *   - foo.bar.baz              — same, root-implicit
 *   - $.foo[0].bar             — numeric array index
 *   - $.foo["a key"].bar       — quoted key (handles dots/spaces in keys)
 *
 * Does NOT support filters, wildcards, recursion (..). Those route
 * probabilistic — this is intentionally a minimal, predictable selector.
 *
 * Returns { found: true, value } or { found: false, reason }.
 */
function resolvePath(root, path) {
  if (typeof path !== "string" || path.length === 0) {
    return { found: false, reason: "empty_path" };
  }
  // Tokenize: $ -> root, . -> dot, [...] -> indexer
  let p = path.trim();
  if (p.startsWith("$")) p = p.slice(1);
  if (p.startsWith(".")) p = p.slice(1);

  const tokens = [];
  let i = 0;
  while (i < p.length) {
    const ch = p[i];
    if (ch === ".") {
      i++;
      continue;
    }
    if (ch === "[") {
      const close = p.indexOf("]", i);
      if (close === -1) return { found: false, reason: "unclosed_bracket" };
      let inner = p.slice(i + 1, close).trim();
      // Strip surrounding quotes if present.
      if (
        (inner.startsWith('"') && inner.endsWith('"')) ||
        (inner.startsWith("'") && inner.endsWith("'"))
      ) {
        inner = inner.slice(1, -1);
        tokens.push({ kind: "key", value: inner });
      } else if (/^-?\d+$/.test(inner)) {
        tokens.push({ kind: "index", value: Number(inner) });
      } else {
        return { found: false, reason: "unparseable_indexer" };
      }
      i = close + 1;
      continue;
    }
    // Bare identifier — read up to next . or [
    let end = i;
    while (end < p.length && p[end] !== "." && p[end] !== "[") end++;
    tokens.push({ kind: "key", value: p.slice(i, end) });
    i = end;
  }

  let cur = root;
  for (const t of tokens) {
    if (cur === null || cur === undefined) {
      return { found: false, reason: "null_intermediate" };
    }
    if (t.kind === "key") {
      if (typeof cur !== "object" || Array.isArray(cur)) {
        return { found: false, reason: "expected_object_at_key" };
      }
      if (!Object.prototype.hasOwnProperty.call(cur, t.value)) {
        return { found: false, reason: "missing_key" };
      }
      cur = cur[t.value];
    } else {
      // index
      if (!Array.isArray(cur)) {
        return { found: false, reason: "expected_array_at_index" };
      }
      const idx = t.value < 0 ? cur.length + t.value : t.value;
      if (idx < 0 || idx >= cur.length) {
        return { found: false, reason: "index_out_of_bounds" };
      }
      cur = cur[idx];
    }
  }
  return { found: true, value: cur };
}

/**
 * Compare observed and expected. Both may be strings, numbers, or booleans.
 *
 * Coercion rules (intentionally tight):
 *   - same type: strict equality
 *   - one number, one numeric-string: parse string, strict equality
 *   - one boolean, one string "true"/"false" (case-insensitive): parse string, strict
 *   - otherwise: NOT a match. We do not silently coerce across unrelated types.
 *
 * Returns boolean.
 */
function valuesEqual(observed, expected) {
  if (typeof observed === typeof expected) {
    return observed === expected;
  }
  // number ↔ numeric string
  if (typeof observed === "number" && typeof expected === "string") {
    if (/^-?\d+(\.\d+)?$/.test(expected.trim())) {
      return observed === Number(expected.trim());
    }
    return false;
  }
  if (typeof expected === "number" && typeof observed === "string") {
    if (/^-?\d+(\.\d+)?$/.test(observed.trim())) {
      return Number(observed.trim()) === expected;
    }
    return false;
  }
  // boolean ↔ "true"/"false" string
  if (typeof observed === "boolean" && typeof expected === "string") {
    const s = expected.trim().toLowerCase();
    if (s === "true") return observed === true;
    if (s === "false") return observed === false;
  }
  if (typeof expected === "boolean" && typeof observed === "string") {
    const s = observed.trim().toLowerCase();
    if (s === "true") return expected === true;
    if (s === "false") return expected === false;
  }
  return false;
}

/**
 * fieldLookup(claim, opts?) → resolution result
 *
 * Inputs:
 *   claim: { source_uri, field_path, expected_value }
 *   opts:  { fetchTimeoutMs?, fetchImpl?, maxBytes? }    fetchImpl injectable for tests
 *
 * Output shape (kept stable for receipt embedding):
 *   {
 *     status: "resolved" | "escalate",
 *     match: true | false,                      // present iff status==="resolved"
 *     observed_value: any,                      // present iff resolved
 *     source_hash: "sha256-...",                // present iff resolved
 *     fetched_at: ISO-8601,                     // present iff resolved
 *     reason: string                            // always present
 *   }
 *
 * If status === "escalate", the caller MUST route to the probabilistic
 * tier. This module never returns a verdict when there's ambiguity.
 */
async function fieldLookup(claim, opts = {}) {
  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  const timeoutMs = opts.fetchTimeoutMs ?? DEFAULT_FETCH_TIMEOUT_MS;
  const maxBytes = opts.maxBytes ?? MAX_RESPONSE_BYTES;

  // 1. Fetch.
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  let respBuf;
  try {
    const resp = await fetchImpl(claim.source_uri, { signal: ac.signal });
    if (!resp.ok) {
      return { status: "escalate", reason: `fetch_http_${resp.status}` };
    }
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

  // 2. Hash.
  const source_hash = "sha256-" + crypto.createHash("sha256").update(respBuf).digest("hex");

  // 3. Parse JSON.
  let parsed;
  try {
    parsed = JSON.parse(respBuf.toString("utf-8"));
  } catch (e) {
    return { status: "escalate", reason: "non_json_response", source_hash };
  }

  // 4. Resolve path.
  const r = resolvePath(parsed, claim.field_path);
  if (!r.found) {
    return { status: "escalate", reason: "path_unresolved:" + r.reason, source_hash };
  }

  // 5. Reject compound observed values (object / array). Comparable only at scalar.
  if (
    r.value !== null &&
    (typeof r.value === "object")
  ) {
    return { status: "escalate", reason: "observed_value_not_scalar", source_hash };
  }

  // 6. Compare.
  const match = valuesEqual(r.value, claim.expected_value);

  return {
    status: "resolved",
    match,
    observed_value: r.value,
    source_hash,
    fetched_at: new Date().toISOString(),
    reason: match ? "match" : "no_match",
  };
}

export { fieldLookup, resolvePath, valuesEqual };
