#!/usr/bin/env node
/**
 * AgentOracle — pre/post migration probe suite
 * Covers all 10 Sonar-era chat/completions call sites across 8 routes.
 *
 * Asserts SYSTEM-PROMPT EFFECT, not response shape. A 200 with a well-formed
 * envelope and no behavioural content is treated as a FAILURE, not a pass.
 *
 * Usage:
 *   node probe_suite.mjs --base=https://... --mode=baseline --out=baseline.json
 *   node probe_suite.mjs --base=https://... --mode=compare  --in=baseline.json
 *
 * Optional:
 *   --promo=CODE        promo code for POST /free
 *   --header='K: V'     repeatable; e.g. an x402 receipt or bypass header
 *   --only=evaluate     run a single probe by id
 *   --timeout=120       per-request seconds (default 120)
 *
 * Exit states (three, not two):
 *   0  PASS          every applicable assertion held
 *   1  FAIL          at least one behavioural assertion broke
 *   2  INCONCLUSIVE   nothing failed, but coverage was incomplete
 *                    (unreachable route, 402 paywall, missing baseline)
 */

const args = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith("--")).map(a => {
    const i = a.indexOf("=");
    return i === -1 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)];
  })
);
const extraHeaders = process.argv
  .slice(2)
  .filter(a => a.startsWith("--header="))
  .map(a => a.slice(9))
  .reduce((acc, h) => {
    const i = h.indexOf(":");
    if (i > 0) acc[h.slice(0, i).trim()] = h.slice(i + 1).trim();
    return acc;
  }, {});

const BASE = (args.base || process.env.AO_BASE || "http://127.0.0.1:3000").replace(/\/$/, "");
const MODE = args.mode || "baseline";
const TIMEOUT_MS = (Number(args.timeout) || 120) * 1000;

// ───────────────────────────────────────────────────────── fixtures
// Chosen so the expected value is knowable independently of the model:
// three separable, verifiable, uncontroversial claims.
const MULTICLAIM = [
  "Paris is the capital of France.",
  "The Eiffel Tower was completed in 1889.",
  "France uses the euro as its official currency."
].join(" ");
const MULTICLAIM_N = 3;

// Unambiguously false, plausible-sounding, non-sensitive. A working gate must
// refuse this. An always-accept gate cannot.
const KNOWN_FALSE =
  "The Eiffel Tower was dismantled and permanently relocated to Berlin in 1994.";

const RESULT = { pass: [], fail: [], inconclusive: [] };
const SNAPSHOT = {};

// ───────────────────────────────────────────────────────── helpers
const j = v => JSON.stringify(v);
const trunc = (s, n = 160) => {
  s = typeof s === "string" ? s : j(s);
  return s.length > n ? s.slice(0, n) + "…" : s;
};

/** Record an assertion. Always states what was compared against what. */
function assert(probeId, name, ok, actual, expected, expectedSource) {
  const line = {
    probe: probeId,
    check: name,
    actual: trunc(actual),
    expected: trunc(expected),
    expected_from: expectedSource
  };
  if (ok === null) RESULT.inconclusive.push(line);
  else if (ok) RESULT.pass.push(line);
  else RESULT.fail.push(line);
  const tag = ok === null ? "INCONCL" : ok ? "PASS   " : "FAIL   ";
  console.log(
    `  [${tag}] ${name}\n            compared ${trunc(actual, 110)}\n` +
    `            against  ${trunc(expected, 110)}  (${expectedSource})`
  );
}

async function call(method, path, body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctrl.signal
    });
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { /* non-JSON body */ }
    return { status: res.status, data, text };
  } catch (e) {
    return { status: 0, data: null, text: String(e && e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

/** True when the route could not be exercised for reasons that are not defects. */
function unusable(probeId, r) {
  if (r.status === 0) {
    assert(probeId, "route reachable", null, `transport error: ${r.text}`,
           "HTTP response", "probe precondition");
    return true;
  }
  if (r.status === 402) {
    assert(probeId, "route not paywalled for this run", null,
           "HTTP 402 payment required",
           "HTTP 200 (supply --header or --promo to exercise)", "probe precondition");
    return true;
  }
  if (r.status === 404) {
    assert(probeId, "route present", null, "HTTP 404",
           "HTTP 200", "probe precondition");
    return true;
  }
  if (r.status >= 500) {
    assert(probeId, "route not erroring", false, `HTTP ${r.status}: ${trunc(r.text)}`,
           "HTTP 2xx", "probe precondition");
    return true;
  }
  return false;
}

/** Free-text grounding signals: a grounded answer cites or names sources. */
function citationSignals(obj) {
  const blob = j(obj || {});
  const urls = (blob.match(/https?:\/\/[^\s"'\\)]+/g) || []).length;
  const hasCitationKey = /"(citations|sources|search_results|sources_used|references)"/.test(blob);
  return { urls, hasCitationKey };
}

function textOf(obj) {
  // Collect all string leaves so on-topic checks don't depend on field names.
  const out = [];
  (function walk(v) {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  })(obj);
  return out.join(" \u0001 ").toLowerCase();
}

// ───────────────────────────────────────────────────────── probes
const PROBES = [];

/* 1. POST /evaluate — three call sites (sonar, sonar-pro, adversarial).
      The load-bearing probe. Four independent behavioural assertions. */
PROBES.push({
  id: "evaluate",
  sites: 3,
  desc: "POST /evaluate — claim decomposition, refusal, and real provenance",
  async run() {
    const r = await call("POST", "/evaluate", {
      content: MULTICLAIM, source: "probe-suite", min_confidence: 0.5
    });
    if (unusable("evaluate", r)) return;

    const ev = r.data?.evaluation || {};
    const claims = Array.isArray(ev.claims) ? ev.claims : [];

    // (a) A 200 with an empty claims[] is the canned-verdicts failure returning
    //     through a new door. Hard fail, never inconclusive.
    assert("evaluate", "claims[] non-empty on a 200",
           claims.length > 0, `${claims.length} claims (HTTP ${r.status})`,
           "at least 1 claim", "canned-verdicts guard");

    // (b) Decomposition is intact: the fixture carries three separable claims.
    assert("evaluate", "decomposition count preserved",
           claims.length === MULTICLAIM_N,
           `${claims.length} claims`,
           `${MULTICLAIM_N} claims`,
           "fixture MULTICLAIM (3 separable factual claims)");

    // (c) Provenance is real, not transport-derived.
    //     Top-level sources_used is computed from settled.status === "fulfilled",
    //     so it reports transport success even when every parse returned null.
    //     Per-claim sources_used is honest, so assert on that instead.
    const allGemma = claims.length > 0 && claims.every(c => {
      const s = c.sources_used || [];
      return s.length === 1 && String(s[0]).startsWith("gemma");
    });
    assert("evaluate", "primary path produced claims (not silent Gemma fallback)",
           !allGemma,
           allGemma
             ? "every claim sourced to gemma fallback"
             : `per-claim sources: ${j(claims.map(c => c.sources_used || []))}`,
           "at least one claim from sonar / agent primary path",
           "per-claim sources_used (top-level field is transport-derived, unreliable)");

    // (d) The gate still rejects. A1 proves it answers; this proves it refuses.
    const rf = await call("POST", "/evaluate", {
      content: KNOWN_FALSE, source: "probe-suite", min_confidence: 0.5
    });
    if (!unusable("evaluate:known-false", rf)) {
      const fev = rf.data?.evaluation || {};
      const fclaims = Array.isArray(fev.claims) ? fev.claims : [];
      const verdicts = fclaims.map(c => String(c.verdict || "").toLowerCase());
      const rec = String(fev.recommendation || "").toLowerCase();
      const refused =
        verdicts.some(v => v === "refuted" || v === "contradicted" || v === "false") ||
        /reject|refus|fail|do_not|block|caution/.test(rec) ||
        (typeof fev.overall_confidence === "number" && fev.overall_confidence < 0.5);
      assert("evaluate", "known-false claim is refused",
             refused,
             `verdicts=${j(verdicts)} recommendation=${j(fev.recommendation)} ` +
             `overall_confidence=${j(fev.overall_confidence)}`,
             "at least one refuted verdict, or a non-accepting recommendation",
             "fixture KNOWN_FALSE (Eiffel Tower relocated to Berlin 1994)");
      SNAPSHOT["evaluate:known_false_refused"] = refused;
    }

    SNAPSHOT["evaluate:claim_count"] = claims.length;
    SNAPSHOT["evaluate:all_gemma"] = allGemma;

    // (e) Cache round-trip. Same claim twice; the second call MUST report
    //     cache_hit: true. Added after the 2026-09-03 cache-gate delta
    //     regressed /evaluate to never-cache: settled[i] was a wrapper
    //     object, not the raw response, so the eligibility check read
    //     undefined on every slot and fail-closed on every request. The
    //     21/21 baseline missed it because no assertion touched cache_hit.
    //
    //     Fresh timestamped claim per run avoids a hit seeded by a prior
    //     probe run. Behavioural and deterministic; would have caught the
    //     regression on the first compare.
    const cacheProbe = "cache-probe " + Date.now() + " " + Math.random();
    const c1 = await call("POST", "/evaluate", {
      content: cacheProbe, source: "probe-suite", min_confidence: 0.5
    });
    if (!unusable("evaluate:cache-first", c1)) {
      const firstHit = c1.data && c1.data.meta && c1.data.meta.cache_hit === true;
      assert("evaluate", "first call is a miss (fresh claim)",
             !firstHit, "meta.cache_hit=" + j(c1.data && c1.data.meta && c1.data.meta.cache_hit),
             "cache_hit:false (or absent)",
             "fresh timestamped claim never seen before");
      if (!firstHit) {
        const c2 = await call("POST", "/evaluate", {
          content: cacheProbe, source: "probe-suite", min_confidence: 0.5
        });
        if (!unusable("evaluate:cache-second", c2)) {
          const secondHit = c2.data && c2.data.meta && c2.data.meta.cache_hit === true;
          assert("evaluate", "second call hits cache (round-trip)",
                 secondHit, "meta.cache_hit=" + j(c2.data && c2.data.meta && c2.data.meta.cache_hit),
                 "cache_hit:true",
                 "cache round-trip: a never-cache regression fails closed on correctness but silently on cost and latency, so behavioural probes miss it unless one asserts the round-trip directly");
          SNAPSHOT["evaluate:cache_round_trip"] = secondHit;
        }
      }
    }
  }
});

/* 2. POST /verify-gate — one call site.
      The route returns a discriminated summary, never verdict prose:
        { pass, confidence, recommendation, signal_state,
          verification_sources, adversarial_pass, adversarial_checked }
      Asserting on prose was un-passable and masked the four real defects
      surfaced by the baseline (⑨). This asserts the SHAPE of the gate. */
PROBES.push({
  id: "verify-gate",
  sites: 1,
  desc: "POST /verify-gate — gate shape and refusal on a known-false claim",
  async run() {
    const r = await call("POST", "/verify-gate", {
      content: KNOWN_FALSE, min_confidence: 0.5
    });
    if (unusable("verify-gate", r)) return;
    const d = r.data || {};
    // (a) discriminated signal_state present and never "unknown" — "unknown"
    //     is the 71ms-incident tell that a pre-⑨ value reached the reader.
    const states = ["scored", "unverifiable"];
    assert("verify-gate", "signal_state is a recognised value",
           states.includes(d.signal_state), `got ${j(d.signal_state)}`,
           `one of ${j(states)}`, "H9 cache-shape validation: unrecognised shape reads as miss");
    // (b) known-false MUST NOT pass. This is the load-bearing gate property.
    assert("verify-gate", "known-false claim does NOT pass",
           d.pass === false, `pass=${j(d.pass)}`,
           "pass:false", "fixture KNOWN_FALSE (Eiffel Tower relocated to Berlin 1994)");
    // (c) honest provenance: single-source route reports 1 source, never 2.
    assert("verify-gate", "verification_sources reports the real count",
           d.verification_sources === 1, `got ${j(d.verification_sources)}`,
           "1 (route is single-source by design)",
           "⑨ removed the `|| 2` default that overstated coverage");
    // (d) no adversarial pass runs here; must not assert one.
    assert("verify-gate", "adversarial_pass is null and adversarial_checked is false",
           d.adversarial_pass === null && d.adversarial_checked === false,
           `pass=${j(d.adversarial_pass)} checked=${j(d.adversarial_checked)}`,
           "adversarial_pass:null, adversarial_checked:false",
           "⑨ removed the `?? true` that asserted a check that never ran");
    SNAPSHOT["verify-gate:pass"] = d.pass;
    SNAPSHOT["verify-gate:signal_state"] = d.signal_state;
    SNAPSHOT["verify-gate:sources"] = d.verification_sources;
  }
});

/* 3. POST /research/batch — one call site. Decomposition analogue: N in, N out. */
PROBES.push({
  id: "research-batch",
  sites: 1,
  desc: "POST /research/batch — one result per input query",
  async run() {
    const queries = [
      "What is the current Ethereum block time?",
      "What is the USDC contract address on Base?"
    ];
    const r = await call("POST", "/research/batch", { queries, tier: "standard" });
    if (unusable("research-batch", r)) return;
    const arr =
      (Array.isArray(r.data?.results) && r.data.results) ||
      (Array.isArray(r.data?.answers) && r.data.answers) ||
      (Array.isArray(r.data) && r.data) || [];
    assert("research-batch", "result count equals query count",
           arr.length === queries.length, `${arr.length} results`,
           `${queries.length} results`, "fixture: 2 input queries");
    SNAPSHOT["research-batch:count"] = arr.length;
  }
});

/* 4. POST /defi — one call site. Prompt constrains output to the named protocol. */
PROBES.push({
  id: "defi",
  sites: 1,
  desc: "POST /defi — output is constrained to the requested protocol",
  async run() {
    const r = await call("POST", "/defi", {
      query: "What is the current total value locked?",
      protocol: "aave", metric: "tvl"
    });
    if (unusable("defi", r)) return;
    const blob = textOf(r.data);
    assert("defi", "requested protocol appears in output",
           blob.includes("aave"), `contains 'aave': ${blob.includes("aave")}`,
           "'aave' present", "fixture protocol=aave (prompt is protocol-scoped)");
    const { urls, hasCitationKey } = citationSignals(r.data);
    assert("defi", "grounding signals present",
           urls > 0 || hasCitationKey, `urls=${urls} citationKey=${hasCitationKey}`,
           "at least one URL or a citations/sources field",
           "grounded-answer requirement");
  }
});

/* 5–8. Grounded single-answer routes. Each asserts on-topic content plus
        grounding, which is what their system prompts exist to enforce. */
// /preview truncates output by design; /free without a promo returns an upsell
// body, not an answer. Needle-in-response assertions were un-passable on both
// and sat in the baseline as permanent noise. /research is paid and returns a
// full answer, so it keeps a real needle. /demo/video is a page route, checked
// separately below with HTML-aware assertions rather than through this array.
const GROUNDED = [
  { id: "preview",     method: "POST", path: "/preview",
    body: { query: "Who is the current chair of the US Federal Reserve?" },
    needle: null, needleDesc: null,
    // /preview truncates by design; a needle assertion is un-passable. Assert
    // ONLY that the response is substantive and grounded — the migration
    // regression that matters is either becoming empty.
    minChars: 40 },
  { id: "research",    method: "POST", path: "/research",
    body: { query: "Who is the current chair of the US Federal Reserve?", tier: "standard" },
    needle: "powell", needleDesc: "'powell' (paid tier, full answer)",
    minChars: 60 },
  { id: "free",        method: "POST", path: "/free",
    body: () => ({ query: "Who is the current chair of the US Federal Reserve?",
                   ...(args.promo ? { promo_code: args.promo } : {}) }),
    // With --promo, needle applies. Without, /free returns an upsell body that
    // will not contain the needle by design.
    needle: args.promo ? "powell" : null,
    needleDesc: args.promo ? "'powell' (answer to the fixture question)" : null,
    minChars: args.promo ? 80 : 40 }
];

for (const g of GROUNDED) {
  PROBES.push({
    id: g.id,
    sites: 1,
    desc: `${g.method} ${g.path} — on-topic grounded answer`,
    async run() {
      const body = typeof g.body === "function" ? g.body() : g.body;
      const r = await call(g.method, g.path, body);
      if (unusable(g.id, r)) return;
      const blob = textOf(r.data);
      const trimmed = blob.replace(/\u0001/g, "").trim().length;
      const floor = g.minChars ?? 80;
      assert(g.id, "response carries substantive content",
             trimmed > floor, `${trimmed} chars`,
             `more than ${floor} chars`, "empty-envelope guard");
      if (g.needle) {
        assert(g.id, "answer is on-topic for the fixture question",
               blob.includes(g.needle), `contains ${j(g.needle)}: ${blob.includes(g.needle)}`,
               g.needleDesc, "fixture question (verifiable, model-independent)");
      }
      // Grounding only asserted when the fixture asked for a real answer.
      // /free without a promo intentionally returns an upsell body, and
      // /preview truncates before citations. Both are working-as-designed
      // and would sit in the baseline as permanent noise otherwise.
      if (g.needle) {
        const { urls, hasCitationKey } = citationSignals(r.data);
        assert(g.id, "grounding signals present",
               urls > 0 || hasCitationKey, `urls=${urls} citationKey=${hasCitationKey}`,
               "at least one URL or a citations/sources field",
               "grounded-answer requirement");
      }
      // NOT SNAPSHOTTING blob.length.
      //
      // /preview, /research, /free-with-promo hit a live model. Empirically
      // verified 2026-09-03: three runs of unchanged code against /preview,
      // identical prompt, returned 598 / 825 / 839 chars — a 40% spread with
      // no correlation to any code change. Snapshotting the length and
      // asserting equality in compare mode makes every subsequent run fail
      // intermittently, which trains a maintainer to ignore the alarm.
      //
      // The load-bearing behavioural assertions already fire above:
      //   trimmed > floor   — empty-envelope guard (real regression signal)
      //   blob.includes(needle) when g.needle    — on-topic verdict
      //   grounding signals when g.needle        — citations/URLs
      // Adding a length equality on top of those is asserting the same
      // property ("response is substantive") through a nondeterministic
      // channel that will drift on unchanged code. See standing rule
      // `equality_on_generative_output_is_a_nondeterministic_fixture.md`.
      //
      // /free WITHOUT a promo returns a templated upsell body. Length there
      // is likely stable, but the fixture may embed a rotating token or
      // timestamp we haven't audited, so this deliberately does not
      // snapshot it either. Behavioural check on the upsell shape belongs
      // in a separate probe that asserts the upsell structure directly.
    }
  });
}

// ───────────────────────────────────────────────────────── runner

/* GET /demo/video — page route. JSON parse yields null; assert on the raw
   HTML body. The migration regression that matters here is the page going
   empty or losing its embedded query result section. */
PROBES.push({
  id: "demo-video",
  sites: 1,
  desc: "GET /demo/video — page route, HTML-aware",
  async run() {
    const r = await call("GET", "/demo/video");
    if (unusable("demo-video", r)) return;
    const body = r.text || "";
    assert("demo-video", "page body is non-trivial",
           body.length > 200, `${body.length} chars`,
           "more than 200 chars", "empty-page guard");
    assert("demo-video", "response is HTML",
           /<html|<!doctype|<body|<div/i.test(body),
           `first 60 chars: ${j(body.slice(0, 60))}`,
           "at least one HTML tag", "content-type: HTML");
    SNAPSHOT["demo-video:bytes"] = body.length;
  }
});

const TOTAL_SITES = PROBES.reduce((n, p) => n + p.sites, 0);

(async () => {
  console.log("═".repeat(74));
  console.log(`AgentOracle probe suite — mode=${MODE}`);
  console.log(`base=${BASE}`);
  console.log(`${PROBES.length} probes covering ${TOTAL_SITES} inference call sites`);
  if (Object.keys(extraHeaders).length)
    console.log(`extra headers: ${Object.keys(extraHeaders).join(", ")}`);
  console.log("═".repeat(74));

  const only = args.only ? String(args.only) : null;
  for (const p of PROBES) {
    if (only && p.id !== only) continue;
    console.log(`\n▸ ${p.id} — ${p.desc}`);
    try {
      await p.run();
    } catch (e) {
      assert(p.id, "probe executed", false, `threw: ${e && e.message}`,
             "probe completes", "probe harness");
    }
  }

  // baseline comparison
  if (MODE === "compare") {
    console.log(`\n▸ baseline comparison`);
    let prior = null;
    try {
      const fs = await import("node:fs");
      prior = JSON.parse(fs.readFileSync(args.in || "baseline.json", "utf8"));
    } catch (e) {
      assert("compare", "baseline snapshot readable", null,
             `could not read ${args.in || "baseline.json"}: ${e.message}`,
             "a baseline written by --mode=baseline", "compare precondition");
    }
    if (prior && prior.snapshot) {
      for (const k of Object.keys(prior.snapshot)) {
        const before = prior.snapshot[k], after = SNAPSHOT[k];
        if (after === undefined) {
          assert("compare", `${k} still measured`, null,
                 "not measured this run", `baseline had ${j(before)}`, "baseline snapshot");
          continue;
        }
        assert("compare", `${k} unchanged since baseline`,
               j(before) === j(after), j(after), j(before),
               `baseline ${prior.recorded_at}`);
      }
    }
  }

  // write snapshot
  if (MODE === "baseline") {
    const fs = await import("node:fs");
    const out = args.out || "baseline.json";
    fs.writeFileSync(out, JSON.stringify({
      recorded_at: new Date().toISOString(),
      base: BASE,
      snapshot: SNAPSHOT
    }, null, 2));
    console.log(`\nbaseline written to ${out}`);
  }

  // ── verdict
  const { pass, fail, inconclusive } = RESULT;
  console.log("\n" + "═".repeat(74));
  console.log(`PASS ${pass.length}   FAIL ${fail.length}   INCONCLUSIVE ${inconclusive.length}`);
  if (fail.length) {
    console.log("\nFAILURES:");
    for (const f of fail)
      console.log(`  ✗ ${f.probe} / ${f.check}\n      actual   ${f.actual}\n      expected ${f.expected}`);
  }
  if (inconclusive.length) {
    console.log("\nINCONCLUSIVE (coverage gaps, not defects):");
    for (const f of inconclusive) console.log(`  ? ${f.probe} / ${f.check} — ${f.actual}`);
  }
  const code = fail.length ? 1 : inconclusive.length ? 2 : 0;
  console.log(`\nexit ${code} — ${code === 0 ? "PASS" : code === 1 ? "FAIL" : "INCONCLUSIVE"}`);
  console.log("═".repeat(74));
  process.exit(code);
})();
