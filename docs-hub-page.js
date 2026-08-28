// docs-hub-page.js — /docs route (the hub).
//
// WHY THIS EXISTS: /docs previously fell through to the API's 404 handler,
// which returned a JSON list of x402 endpoints. A visitor clicking "Docs"
// hit a dead end. This page is the hub ABOVE /docs/deterministic-mode —
// it does not replace it, and the deterministic-mode route keeps working.
//
// STRUCTURE: three-line Quickstart at the very top, before the section
// index. A visitor who pastes those three lines has verified a real
// production receipt in about sixty seconds. That is the best possible
// first experience of the docs, and it matches the Aug 13 X beat.
//
// DISCIPLINE HONORED HERE:
//   - verify.py always, never bare verify() — the disclosed entry point
//     supplies JWKS; a bare verify(envelope) returns valid=True with an
//     empty signers[] because jwks_by_issuer defaults to None.
//   - argentum-core described as "an independent implementation whose
//     conformance vectors matched ours byte-for-byte" — never "reference"
//     and never anything implying a full rebuilt verifier.
//   - "merged" used only for c08af80e7a12 (Virtuals PR #97).
//   - v0.3 is production; v0.4 is an open draft (PR #5), never conflated.
//   - No "the only" phrasing. No Article 12 dates. No HOL marks.
//   - One voice: TKCollective. No first-person, no founder bio.
//
// PERPLEXITY: (1) `import { DOCS_HUB_PAGE_HTML } from './docs-hub-page.js'`
//             (2) `app.get('/docs', (_req,res)=>res.send(DOCS_HUB_PAGE_HTML))`
//                 — MUST be registered before any catch-all 404 handler
//             (3) add https://agentoracle.co/docs to sitemap.xml

export const DOCS_HUB_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docs — AgentOracle</title>
<meta name="description" content="Verify a real production receipt in three lines. Then the receipt format, deterministic mode, the verifier, and every live surface — each one a link to something checkable.">
<link rel="canonical" href="https://agentoracle.co/docs">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AgentOracle">
<meta property="og:url" content="https://agentoracle.co/docs">
<meta property="og:title" content="Docs — AgentOracle">
<meta property="og:description" content="Three lines to a verified production receipt. Then the format, the checks, the verifier, and the live surfaces.">
<meta property="og:image" content="https://agentoracle.co/og-image.png?v=20260803">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/ao-logo-v8.png">
<style>
:root{--ink:#070706;--ink2:#121110;--ink3:#1a1813;--paper:#f4eee0;--gold:#d4a94a;--gold2:#e8c476;--gline:rgba(212,169,74,.16);--gline-hi:rgba(212,169,74,.45);--mut:#a49a82}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Satoshi',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:var(--ink);color:var(--paper);line-height:1.65;-webkit-font-smoothing:antialiased;letter-spacing:-.005em}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
a{color:inherit}
nav{border-bottom:1px solid var(--gline);background:var(--ink);position:sticky;top:0;z-index:10}
.nav-in{max-width:880px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{font-weight:700;text-decoration:none;font-size:1.05rem}
.logo span{color:var(--gold)}
.back{font-size:.85rem;color:var(--mut);text-decoration:none}
.back:hover{color:var(--paper)}
main{max-width:880px;margin:0 auto;padding:56px 24px 96px}
h1{font-size:2.6rem;font-weight:700;letter-spacing:-.03em;line-height:1.1}
.sub{color:var(--mut);margin-top:14px;font-size:1.05rem;max-width:62ch}

/* ── Quickstart: the first thing on the page ─────────────── */
.qs{margin-top:40px;border:1px solid var(--gline-hi);border-radius:14px;background:linear-gradient(180deg,var(--ink3),var(--ink2));padding:28px}
.qs-label{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:500}
.qs h2{font-size:1.3rem;font-weight:700;margin-top:10px;letter-spacing:-.02em}
.qs p.lede{color:var(--mut);margin-top:8px;font-size:.95rem;max-width:58ch}
pre{margin-top:18px;background:#0b0a09;border:1px solid var(--gline);border-radius:10px;padding:18px 20px;overflow-x:auto}
pre code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.86rem;line-height:1.9;color:var(--paper);white-space:pre}
.cmt{color:var(--mut)}
.out{color:var(--gold2)}
.qs-foot{margin-top:16px;font-size:.88rem;color:var(--mut)}
.qs-foot a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--gline-hi)}
.qs-foot a:hover{color:var(--gold2)}

/* ── Section index ───────────────────────────────────────── */
.ix{margin-top:64px}
.ix-h{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);font-weight:500;padding-bottom:14px;border-bottom:1px solid var(--gline)}
section{padding:30px 0;border-bottom:1px solid var(--gline)}
section h3{font-size:1.12rem;font-weight:700;letter-spacing:-.015em}
section p{color:var(--mut);margin-top:8px;font-size:.95rem;max-width:66ch}
.links{margin-top:14px;display:flex;flex-wrap:wrap;gap:10px}
.lk{display:inline-flex;align-items:center;gap:6px;font-size:.84rem;padding:7px 13px;border:1px solid var(--gline);border-radius:999px;text-decoration:none;color:var(--paper);transition:border-color .15s,color .15s}
.lk:hover{border-color:var(--gline-hi);color:var(--gold2)}
.lk .m{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.8rem}
footer{max-width:880px;margin:0 auto;padding:40px 24px 72px;color:var(--mut);font-size:.85rem}
footer a{color:var(--gold);text-decoration:none}
@media(max-width:640px){h1{font-size:2rem}main{padding:40px 20px 72px}.qs{padding:22px 18px}pre code{font-size:.78rem}}
</style>
</head>
<body>
<nav><div class="nav-in">
  <a class="logo" href="/">agent<span>oracle</span></a>
  <a class="back" href="/">← Back to the site</a>
</div></nav>

<main>
  <h1>Docs</h1>
  <p class="sub">Every section below points at something you can run, read, or recompute. Start with the three lines.</p>

  <div class="qs">
    <div class="qs-label">Quickstart · about sixty seconds</div>
    <h2>Verify a real production receipt</h2>
    <p class="lede">This is a signed receipt from production, committed in a third-party repository. Clone the showcase folder, then:</p>
<pre><code>pip install agentoracle-receipt-verify
python3 verify.py receipt.json

<span class="cmt"># →</span> <span class="out">status: valid</span>
<span class="cmt"># Ed25519 verified against the published JWKS.</span>
<span class="cmt"># Unchecked never reports valid.</span></code></pre>
    <p class="qs-foot">Folder, the receipt, and the exact expected output: <a href="https://github.com/Virtual-Protocol/acp-cli-demos/tree/c08af80e7a12/showcase/agentoracle-verifiable-delivery" target="_blank" rel="noopener noreferrer">acp-cli-demos showcase ↗</a> · Always run through <span class="mono">verify.py</span>, which supplies the key set.</p>
  </div>

  <div class="ix">
    <div class="ix-h">Reference</div>

    <section>
      <h3>The receipt format</h3>
      <p>A signed record of what was checked and what came back — small enough to email, structured enough to verify on a laptop with the network off. Version 0.3 is in production. Version 0.4 is an open draft and is not normative.</p>
      <div class="links">
        <a class="lk" href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/" target="_blank" rel="noopener noreferrer"><span class="m">IETF</span> draft-krausz-verification-state ↗</a>
        <a class="lk" href="https://github.com/TKCollective/agentoracle-receipt-spec" target="_blank" rel="noopener noreferrer">Specification repository ↗</a>
        <a class="lk" href="https://github.com/TKCollective/agentoracle-receipt-spec/pull/5" target="_blank" rel="noopener noreferrer">v0.4 open draft · PR #5 ↗</a>
      </div>
    </section>

    <section>
      <h3>Deterministic mode</h3>
      <p>For claims that are lookups rather than judgments. Six check types, no model in the trust chain, and <span class="mono">check_mode</span> recorded inside the signed payload so a verifier can prove it. The check-type catalog on that page is fetched live from the endpoint that serves the route, so the page cannot drift from what the endpoint does.</p>
      <div class="links">
        <a class="lk" href="/docs/deterministic-mode">Deterministic mode →</a>
        <a class="lk" href="https://agentoracle.co/v1/verify-facts" target="_blank" rel="noopener noreferrer"><span class="m">GET</span> /v1/verify-facts ↗</a>
      </div>
    </section>

    <section>
      <h3>The verifier</h3>
      <p>Under 250 lines of Python, MIT licensed, offline against the published key set. Three outcomes: <span class="mono">valid</span>, <span class="mono">invalid</span>, <span class="mono">indeterminate</span>. A receipt whose key material is absent resolves to invalid — it never reports valid by omission.</p>
      <div class="links">
        <a class="lk" href="https://pypi.org/project/agentoracle-receipt-verify/0.1.0/" target="_blank" rel="noopener noreferrer"><span class="m">PyPI</span> agentoracle-receipt-verify ↗</a>
        <a class="lk" href="https://agentoracle.co/.well-known/jwks.json" target="_blank" rel="noopener noreferrer">Published JWKS ↗</a>
      </div>
    </section>

    <section>
      <h3>Independent recomputation</h3>
      <p>argentum-core is an independent implementation whose conformance vectors matched ours byte-for-byte. Cross-language agreement is the property worth having: a single party's two code paths reproduce a misreading identically and the suite still passes.</p>
      <div class="links">
        <a class="lk" href="https://github.com/giskard09/argentum-core/pull/28" target="_blank" rel="noopener noreferrer">Conformance set · PR #28 ↗</a>
        <a class="lk" href="https://github.com/giskard09/argentum-core/pull/33" target="_blank" rel="noopener noreferrer">Strict-canonicalisation re-sign · PR #33 ↗</a>
      </div>
    </section>

    <section>
      <h3>How the evaluation runs</h3>
      <p>The gate, the confidence bands, and what happens on a failing verdict — written for someone deciding whether to put it in front of an agent.</p>
      <div class="links">
        <a class="lk" href="/trust">Trust and evaluation flow →</a>
        <a class="lk" href="/business">Product overview →</a>
      </div>
    </section>

    <section>
      <h3>Measurement</h3>
      <p>Experiment A pre-registered a citation-survival measurement under a fail-closed gate. The design, harness, and question set were published before any data was collected. Collection closed 25 August at 593 of 600, with 7 documented-unresolved. The pre-registered headline finding is withdrawn because the gated arm measured a degraded service. What publishes on 2 September is the null result, the service-integrity defect that caused it, and the raw JSONL.</p>
      <div class="links">
        <a class="lk" href="https://github.com/TKCollective/agentoracle-benchmark-a-b" target="_blank" rel="noopener noreferrer">Pre-registration and harness ↗</a>
      </div>
    </section>

    <section>
      <h3>Machine-readable surfaces</h3>
      <p>Discovery documents, the agent card, and the payment manifest — for integrators wiring this up without reading prose.</p>
      <div class="links">
        <a class="lk" href="/.well-known/x402"><span class="m">/.well-known/x402</span></a>
        <a class="lk" href="/.well-known/x402-manifest.json"><span class="m">x402-manifest.json</span></a>
        <a class="lk" href="/.well-known/agent-card.json"><span class="m">agent-card.json</span></a>
        <a class="lk" href="/llms.txt"><span class="m">llms.txt</span></a>
        <a class="lk" href="/skill.md"><span class="m">skill.md</span></a>
      </div>
    </section>

    <section>
      <h3>What shipped, dated</h3>
      <p>Each entry corresponds to a public, verifiable artifact. That is the house style.</p>
      <div class="links">
        <a class="lk" href="/changelog">Changelog →</a>
        <a class="lk" href="/whitepaper">Whitepaper (PDF) →</a>
      </div>
    </section>
  </div>
</main>

<footer>
  Something missing or a link that does not resolve? <a href="mailto:joe@agentoracle.co">joe@agentoracle.co</a>
</footer>
</body>
</html>`;
