// ═══════════════════════════════════════════════════════════════════
//  /benchmarks — AgentOracle public benchmarks page
//  Two sections: AVeriTeC accuracy by category, /v1 endpoint latency.
//  Every number is reproducible. Methodology + dataset + harness public.
// ═══════════════════════════════════════════════════════════════════

const BENCHMARKS_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Benchmarks — AgentOracle</title>
<meta name="description" content="AgentOracle benchmarks: public AVeriTeC 2024 accuracy by claim category and reproducible /v1 endpoint latency. Methodology, dataset, and harness all MIT-licensed." />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<style>
  :root {
    --bg: #0b0b0c;
    --surface: #141416;
    --surface-2: #1c1c1f;
    --border: #2a2a2f;
    --text: #e9e9eb;
    --text-muted: #9a9a9f;
    --text-faint: #6a6a6f;
    --accent: #d4af37;
    --accent-soft: #d4af3722;
    --success: #6daa45;
    --warn: #bb653b;
    --mono: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
    --sans: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { background: var(--bg); color: var(--text); font-family: var(--sans); margin: 0; line-height: 1.55; }
  a { color: var(--accent); text-decoration: none; border-bottom: 1px solid transparent; }
  a:hover { border-bottom-color: var(--accent); }
  .wrap { max-width: 980px; margin: 0 auto; padding: 64px 24px 96px; }
  header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 48px; }
  header .brand { font-weight: 700; letter-spacing: -0.01em; }
  header .brand a { color: var(--text); border: none; }
  header nav a { color: var(--text-muted); margin-left: 20px; font-size: 14px; border: none; }
  header nav a:hover { color: var(--accent); }
  h1 { font-size: 38px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 8px; line-height: 1.15; }
  h1 + .lede { color: var(--text-muted); font-size: 17px; margin-bottom: 56px; max-width: 720px; }
  h2 { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin: 56px 0 8px; }
  h2 .pill { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); background: var(--accent-soft); padding: 3px 8px; border-radius: 4px; margin-left: 10px; vertical-align: middle; }
  h3 { font-size: 16px; font-weight: 600; margin: 28px 0 8px; }
  p { margin: 0 0 14px; }
  .sub { color: var(--text-muted); font-size: 14px; margin-bottom: 28px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 24px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; margin: 12px 0; }
  th { font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; }
  td { padding: 12px; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
  td.num { font-family: var(--mono); text-align: right; }
  td.strong { font-weight: 600; color: var(--accent); }
  .meta { font-family: var(--mono); font-size: 12px; color: var(--text-faint); margin-top: 8px; }
  pre { background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 14px 18px; font-family: var(--mono); font-size: 13px; overflow-x: auto; line-height: 1.6; color: var(--text); margin: 14px 0; }
  .note { background: var(--surface-2); border-left: 3px solid var(--accent); padding: 14px 18px; border-radius: 0 6px 6px 0; margin: 18px 0; color: var(--text); font-size: 14px; }
  .note strong { color: var(--accent); }
  ul.caveats { padding-left: 18px; margin: 8px 0; }
  ul.caveats li { margin-bottom: 8px; color: var(--text-muted); font-size: 14px; }
  ul.caveats li strong { color: var(--text); }
  footer { margin-top: 80px; border-top: 1px solid var(--border); padding-top: 24px; color: var(--text-faint); font-size: 13px; }
</style>
</head>
<body>
<div class="wrap">

<header>
  <div class="brand"><a href="/">AgentOracle</a></div>
  <nav>
    <a href="/">Home</a>
    <a href="/business">Enterprise</a>
    <a href="/demo">Demo</a>
    <a href="/benchmarks">Benchmarks</a>
  </nav>
</header>

<h1>Benchmarks</h1>
<p class="lede">Every number on this page is reproducible. Dataset is public, harness is MIT-licensed, latency is raw curl wall-clock against the live production endpoints. Methodology beats marketing — if you can't re-run it, it isn't a benchmark.</p>

<!-- ═══════════════════════ AVeriTeC ═══════════════════════ -->

<h2>Accuracy — AVeriTeC 2024 <span class="pill">Reproducible</span></h2>
<p class="sub">Public academic fact-checking benchmark from <a href="https://aclanthology.org/2024.emnlp-main.999/">Schlichtkrull et al., EMNLP 2024</a>. 500-claim dev set with 4-label space: Supported / Refuted / Not Enough Evidence / Conflicting Evidence. AgentOracle's <code>/evaluate</code> pipeline was run end-to-end against the live API, identical inference path to paid x402 settles. Calibration / held-out split is 250/250 by deterministic dataset index.</p>

<div class="card">
<h3>Headline</h3>
<table>
<thead><tr><th>Split</th><th class="num">N</th><th class="num">Overall accuracy</th></tr></thead>
<tbody>
<tr><td>Full dev set</td><td class="num">498</td><td class="num strong">57.6%</td></tr>
<tr><td>Calibration half</td><td class="num">250</td><td class="num">57.6%</td></tr>
<tr><td>Held-out half</td><td class="num">248</td><td class="num strong">57.7%</td></tr>
</tbody>
</table>
<p class="meta">Held-out matches calibration → verdict mapping is not overfit. Selected via inspection on the calibration half; held-out is untouched during selection.</p>
</div>

<div class="card">
<h3>Per-category accuracy (held-out half)</h3>
<table>
<thead><tr><th>Claim category</th><th class="num">Accuracy</th></tr></thead>
<tbody>
<tr><td>Supported</td><td class="num strong">70.6%</td></tr>
<tr><td>Refuted</td><td class="num">61.6%</td></tr>
<tr><td>Not Enough Evidence</td><td class="num">27.3%</td></tr>
<tr><td>Conflicting Evidence / Cherrypicking</td><td class="num">13.6%</td></tr>
</tbody>
</table>
<p class="meta">Reported as the verdict mapping was selected on the calibration half. Conflicting / NEE recall is honest-low because the AgentOracle adversarial layer leans skeptical-by-default — most miscategorised Conflicting claims received Refuted verdicts. Calibration choice, not a model failure, and not hidden.</p>
</div>

<div class="card">
<h3>Context — published AVeriTeC baselines</h3>
<table>
<thead><tr><th>System</th><th class="num">Accuracy on dev</th></tr></thead>
<tbody>
<tr><td>BERT-base classifier (paper)</td><td class="num">~25%</td></tr>
<tr><td>T5 (paper)</td><td class="num">~30–35%</td></tr>
<tr><td>Best paper-provided baseline</td><td class="num">~30%</td></tr>
<tr><td>AgentOracle <code>/evaluate</code></td><td class="num strong">57.6%</td></tr>
</tbody>
</table>
</div>

<h3>Reproduce</h3>
<pre>git clone https://github.com/TKCollective/agentoracle-eval-harness
cd agentoracle-eval-harness
curl -sL https://raw.githubusercontent.com/MichSchli/AVeriTeC/main/data/dev.json -o dev.json
python3 scripts/run_dev_eval.py
python3 scripts/score.py results/2026-05-28-dev/results.jsonl</pre>
<p class="meta">Run completes in ~25 minutes at 3 concurrent workers against the live <code>/evaluate</code> endpoint. Submission registered at <a href="https://github.com/TKCollective/agentoracle-benchmark">TKCollective/agentoracle-benchmark</a>. MIT-licensed. Open submissions — see <a href="https://github.com/TKCollective/agentoracle-benchmark/blob/main/methodology/submission-format.md">submission-format.md</a>.</p>

<h3>Honest caveats</h3>
<ul class="caveats">
<li><strong>Conflicting Evidence recall is weak (13.6%).</strong> The label is the fuzziest in AVeriTeC. Most miscategorized true-Conflicting claims received Refuted verdicts. Calibration choice, not a model failure — published as-is.</li>
<li><strong>Not Enough Evidence recall is moderate (27.3%).</strong> Some true-NEE claims receive a confident Supported or Refuted verdict when one source produces an answer the adversarial layer doesn't catch.</li>
<li><strong>Free-tier inference path.</strong> The harness uses the unauthenticated <code>/evaluate</code> tier. Inference path is identical to paid x402 settles; payment gates the response, not the model.</li>
</ul>

<div class="note">
<strong>Why we publish this honestly:</strong> the value of a benchmark is that anyone can re-run it and check. If we picked numbers that flatter and hid the rest, the benchmark would be marketing. The point is the opposite — falsifiability is the moat. Run it yourself.
</div>

<!-- ═══════════════════════ LATENCY ═══════════════════════ -->

<h2>Latency — <code>/v1</code> endpoints <span class="pill">Live production</span></h2>
<p class="sub">Raw <code>curl</code> wall-clock from a single sandbox client against the live production hosts. Includes TCP + TLS + HTTP + handler + crypto + response. Sequential, single-connection-per-request. Measured 2026-06-25T22:14:00Z. Re-run yourself with the commands shown below — these numbers are what you will see.</p>

<div class="card">
<h3><code>POST /v1/sign</code> — single Ed25519 signature</h3>
<p class="sub">Takes one <code>canonical_bytes_b64u</code>, returns one JWS signature entry. The primitive every composed envelope leg uses.</p>
<table>
<thead><tr><th>Statistic</th><th class="num">ms</th></tr></thead>
<tbody>
<tr><td>min</td><td class="num">120.8</td></tr>
<tr><td>p50</td><td class="num strong">136.2</td></tr>
<tr><td>p90</td><td class="num">156.2</td></tr>
<tr><td>p99</td><td class="num">400.8</td></tr>
<tr><td>max</td><td class="num">400.8</td></tr>
<tr><td>mean</td><td class="num">146.1</td></tr>
</tbody>
</table>
<p class="meta">n=50 sequential calls. Host: https://agentoracle.co (Vercel edge). Dominated by network round-trip and TLS, not crypto — the Ed25519 sign itself is sub-millisecond.</p>
<pre>curl -w "\\n%{time_total}s\\n" -X POST https://agentoracle.co/v1/sign \\
  -H "Content-Type: application/json" \\
  -d '{"canonical_bytes_b64u":"eyJ0ZXN0IjoidHJ1ZSJ9"}'</pre>
</div>

<div class="card">
<h3><code>POST /v1/compose</code> — full 2-signer composed envelope</h3>
<p class="sub">Single HTTP call. Orchestrates AT <code>/v1/compose</code> → v_gate_skill, AO computes v_gate, builds canonical bytes once, AT <code>/v1/sign</code> for AT's signature, AO signs locally, assembles JWS general serialization. Returns full 2-signer envelope verifiable against both published JWKS.</p>
<table>
<thead><tr><th>Statistic</th><th class="num">ms</th></tr></thead>
<tbody>
<tr><td>min</td><td class="num">380.2</td></tr>
<tr><td>p50</td><td class="num strong">401.8</td></tr>
<tr><td>p90</td><td class="num">417.6</td></tr>
<tr><td>p99</td><td class="num">745.0</td></tr>
<tr><td>mean</td><td class="num">417.3</td></tr>
</tbody>
</table>
<p class="meta">n=20 sequential calls. Includes one round-trip to AT <code>/v1/compose</code> + one to AT <code>/v1/sign</code> over the public internet from the AO origin region to the AT origin region. Co-location would cut this further; published as-is.</p>
<pre>curl -w "\\n%{time_total}s\\n" -X POST https://agentoracle.co/v1/compose \\
  -H "Content-Type: application/json" \\
  -d '{"claim_hash":"sha256-yourclaim","mcp_content":{"tool":"web.search"}}'</pre>
</div>

<div class="card">
<h3><code>POST /v1/sign/batch</code> — N canonical bytes, N signatures</h3>
<p class="sub">Bulk signing primitive for high-frequency agent loops. Max 100 items per request. Returns one signature entry per input; all entries share the same kid (issuer is constant). Useful when an agent needs to anchor many envelopes in one network round-trip.</p>
<pre>curl -X POST https://agentoracle.co/v1/sign/batch \\
  -H "Content-Type: application/json" \\
  -d '{"canonical_bytes_b64u":["...","...","..."]}'</pre>
<p class="meta">Latency is dominated by HTTP round-trip, not crypto. Batched cost-per-item drops linearly with N for any N ≥ 2.</p>
</div>

<div class="note">
<strong>What this is and isn't:</strong> these are <em>wall-clock</em> numbers from one sandbox client against the live production endpoints. They include network and TLS overhead. They are <em>not</em> the verification accuracy (see AVeriTeC above), they are not isolated crypto benchmarks (Ed25519 sign is &lt;1ms on any modern CPU), and they are not the latency you would see from a co-located client. They are what an off-network caller sees today. Re-run them yourself — your numbers should land in the same ballpark.
</div>

<!-- ═══════════════════════ CONFORMANCE ═══════════════════════ -->

<h2>Conformance — composed envelope <span class="pill">11/11 vectors</span></h2>
<p class="sub">Parallel Node + Python verifiers, both <strong>byte-identical</strong> on Phase 1 (4 accept + 3 reject) and Phase 2 (3 accept + 1 reject). Independently verified end-to-end on 2026-06-24 by <a href="https://github.com/giskard09">@giskard09</a> (IETF action-ref maintainer at argentum-core).</p>
<table>
<thead><tr><th>Vector</th><th>What it covers</th><th>Result</th></tr></thead>
<tbody>
<tr><td>comp-001…004</td><td>2-signer accept (both-act, AT-halt, AO-halt, trail-resolved)</td><td class="strong">PASS</td></tr>
<tr><td>comp-r01…r03</td><td>2-signer reject (tampered sig, null mycelium_trail_id, AND_PRESENT mismatch)</td><td class="strong">PASS</td></tr>
<tr><td>comp-005…007</td><td>3-signer accept (with Presidio screen_ref, comp-006 = PII_BLOCKED halts a payment both gates approved)</td><td class="strong">PASS</td></tr>
<tr><td>comp-r-screen</td><td>screen_ref recompute mismatch</td><td class="strong">PASS</td></tr>
</tbody>
</table>
<p class="meta">Full suite + verifiers at <a href="https://github.com/TKCollective/agentoracle-receipt-spec">TKCollective/agentoracle-receipt-spec</a>. Spec anchor: <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/">draft-krausz-verification-state-01</a> (IETF Internet-Draft).</p>

<footer>
<p>Reproducibility is the moat. Numbers without a re-run script are claims, not benchmarks. Methodology and harness MIT-licensed at <a href="https://github.com/TKCollective/agentoracle-benchmark">TKCollective/agentoracle-benchmark</a> and <a href="https://github.com/TKCollective/agentoracle-eval-harness">TKCollective/agentoracle-eval-harness</a>.</p>
<p>© 2026 TK Collective LLC · AgentOracle</p>
</footer>

</div>
</body>
</html>`;

export { BENCHMARKS_HTML };
