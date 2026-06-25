// ═══════════════════════════════════════════════════════════════════
//  run_tests.mjs — Phase 1 deterministic-grounding test suite runner
//
//  Hermetic: no real network. Source fixtures are served by an in-process
//  mock `fetch` that maps MOCK://<fixture_id> -> the fixture body.
//
//  Acceptance bar: every vector either passes or the suite fails. Same
//  rigor as the composed envelope conformance suite.
//
//  Usage:
//    node deterministic_grounding/run_tests.mjs
//
//  Exit code: 0 on full pass, 1 on any failure.
// ═══════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { classify } from "./classifier.js";
import { fieldLookup } from "./field_lookup.js";
import { comparison } from "./comparison.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const suite = JSON.parse(
  fs.readFileSync(path.join(__dirname, "test_vectors", "vectors.json"), "utf-8")
);

// ── Mock fetch implementation ───────────────────────────────────────
function mockFetch(uri) {
  const m = /^MOCK:\/\/(.+)$/.exec(uri);
  if (!m) {
    return Promise.resolve({
      ok: false,
      status: 0,
      arrayBuffer: async () => new Uint8Array(0).buffer,
    });
  }
  const fx = suite.fixtures[m[1]];
  if (!fx) {
    return Promise.resolve({
      ok: false,
      status: 404,
      arrayBuffer: async () => new Uint8Array(0).buffer,
    });
  }
  const body =
    fx.raw_body !== undefined
      ? fx.raw_body
      : JSON.stringify(fx.body);
  const buf = Buffer.from(body, "utf-8");
  return Promise.resolve({
    ok: fx.status >= 200 && fx.status < 300,
    status: fx.status,
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  });
}

// ── Test runners ────────────────────────────────────────────────────
const failures = [];
let pass = 0;
let fail = 0;

function check(id, label, ok, detail) {
  if (ok) {
    pass++;
  } else {
    fail++;
    failures.push(`${id} (${label}): ${detail}`);
  }
}

console.log("=== Classifier vectors ===");
for (const v of suite.classifier_vectors) {
  const result = classify(v.input);
  const okKind = result.kind === v.expected.kind;
  const okReason =
    v.expected.reason === undefined ||
    result.reason === v.expected.reason ||
    (v.expected.reason_prefix &&
      typeof result.reason === "string" &&
      result.reason.startsWith(v.expected.reason_prefix));
  check(
    v.id,
    "classifier",
    okKind && okReason,
    `expected kind=${v.expected.kind} reason=${v.expected.reason ?? v.expected.reason_prefix ?? "-"}, got kind=${result.kind} reason=${result.reason}`
  );
}

console.log("=== Field-lookup vectors ===");
for (const v of suite.field_lookup_vectors) {
  const result = await fieldLookup(v.input, { fetchImpl: mockFetch, fetchTimeoutMs: 1000 });
  const okStatus = result.status === v.expected.status;
  const okMatch =
    v.expected.match === undefined || result.match === v.expected.match;
  const okObserved =
    v.expected.observed_value === undefined ||
    JSON.stringify(result.observed_value) === JSON.stringify(v.expected.observed_value);
  const okReason =
    v.expected.reason === undefined
      ? (v.expected.reason_prefix === undefined ||
        (typeof result.reason === "string" && result.reason.startsWith(v.expected.reason_prefix)))
      : result.reason === v.expected.reason;
  const ok = okStatus && okMatch && okObserved && okReason;
  check(
    v.id,
    "field_lookup",
    ok,
    `expected ${JSON.stringify(v.expected)}, got status=${result.status} match=${result.match} observed=${JSON.stringify(result.observed_value)} reason=${result.reason}`
  );
}

console.log("=== Comparison vectors ===");
for (const v of suite.comparison_vectors) {
  const result = await comparison(v.input, { fetchImpl: mockFetch, fetchTimeoutMs: 1000 });
  const okStatus = result.status === v.expected.status;
  const okMatch =
    v.expected.match === undefined || result.match === v.expected.match;
  const okLeft =
    v.expected.left_value === undefined || result.left_value === v.expected.left_value;
  const okRight =
    v.expected.right_value === undefined || result.right_value === v.expected.right_value;
  const okReason =
    v.expected.reason === undefined || result.reason === v.expected.reason;
  const ok = okStatus && okMatch && okLeft && okRight && okReason;
  check(
    v.id,
    "comparison",
    ok,
    `expected ${JSON.stringify(v.expected)}, got ${JSON.stringify(result)}`
  );
}

const total = pass + fail;
console.log("");
console.log(
  fail === 0
    ? `PASS: ${total} vectors (${suite.classifier_vectors.length} classifier, ${suite.field_lookup_vectors.length} field_lookup, ${suite.comparison_vectors.length} comparison)`
    : `FAIL: ${fail}/${total} vectors`
);
if (fail) {
  for (const f of failures) console.log("  - " + f);
  process.exit(1);
}
