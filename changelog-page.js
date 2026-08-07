// changelog-page.js — /changelog route (new). Export CHANGELOG_HTML.
// PERPLEXITY: (1) add `import { CHANGELOG_HTML } from './changelog-page.js'` to index.js
//             (2) register: app.get('/changelog', (req,res)=>res.send(CHANGELOG_HTML));
//             (3) TRANSPLANT the 9 dated ticker items VERBATIM from landing-page-v6-preview.js
//                 (the whatsNewTrack content) into the <ol> below, newest first,
//                 replacing the two marked placeholder <li> examples. Keep the same li structure.

export const CHANGELOG_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Changelog — AgentOracle</title>
<meta name="description" content="What shipped, dated and verifiable — the AgentOracle changelog.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/ao-logo-v8.png">
<style>
:root{--ink:#070706;--ink2:#121110;--paper:#f4eee0;--gold:#d4a94a;--gline:rgba(212,169,74,.16);--mut:#a49a82}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Satoshi',sans-serif;background:var(--ink);color:var(--paper);line-height:1.65}
.mono{font-family:'JetBrains Mono',monospace}
a{color:inherit}
nav{border-bottom:1px solid var(--gline);background:rgba(7,7,6,.85)}
.nav-in{max-width:820px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{font-weight:700;text-decoration:none}
.logo span{color:var(--gold)}
.back{font-size:.85rem;color:var(--mut);text-decoration:none}
.back:hover{color:var(--paper)}
main{max-width:820px;margin:0 auto;padding:70px 24px 100px}
h1{font-size:2.1rem;letter-spacing:-.01em}
.sub{color:var(--mut);margin:10px 0 50px}
ol{list-style:none}
li{border-left:1px solid var(--gline);padding:2px 0 34px 26px;position:relative}
li::before{content:"";position:absolute;left:-6px;top:8px;width:10px;height:10px;border-radius:50%;background:var(--gold)}
time{font-family:'JetBrains Mono',monospace;font-size:.75rem;letter-spacing:.12em;color:var(--mut)}
li h2{font-size:1.08rem;margin:6px 0 4px}
li p{font-size:.93rem;color:var(--mut);max-width:620px}
</style>
</head>
<body>
<nav><div class="nav-in">
  <a class="logo" href="/">agent<span>oracle</span></a>
  <a class="back" href="/">← Back to the site</a>
</div></nav>
<main>
  <h1>Changelog</h1>
  <p class="sub">What shipped, dated. Each entry corresponds to a public, verifiable artifact — that's the house style.</p>
  <ol>
    <li>
      <time>2026-08-07</time>
      <h2>Deterministic mode — <code>POST /v1/verify-facts</code>: six check types, no LLM in the trust chain, <code>check_mode</code> recorded inside the signed payload</h2>
      <p><a href="https://agentoracle.co/docs/deterministic-mode">/docs/deterministic-mode ↗</a></p>
    </li>
    <li>
      <time>2026-08-06</time>
      <h2>v0.4 draft rev-2 — per-layer provenance design (layer_trace, mode ∈ {recomputable, signed}, three-state absence semantics) folded in from public design collaboration</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-receipt-spec/commit/cad750d" target="_blank" rel="noopener noreferrer">commit ↗</a></p>
    </li>
    <li>
      <time>2026-08-05</time>
      <h2>Routine credential rotation completed — all previously issued receipts verify unchanged against the published JWKS</h2>
      <p><a href="https://agentoracle.co/.well-known/jwks.json" target="_blank" rel="noopener noreferrer">jwks ↗</a></p>
    </li>
    <li>
      <time>2026-08-03</time>
      <h2>/pricing page + MCP homepage block live</h2>
      <p><a href="https://agentoracle.co/pricing" target="_blank" rel="noopener noreferrer">/pricing ↗</a></p>
    </li>
    <li>
      <time>2026-08-02</time>
      <h2>Self-serve open — card → API key → signed receipts, live</h2>
      <p><a href="https://agentoracle.co/#pricing" target="_blank" rel="noopener noreferrer">get a key ↗</a></p>
    </li>
    <li>
      <time>2026-08-01</time>
      <h2>v0.4 conformance suite complete — 1 accept, 3 reject, 3 status vectors; two independent implementations; every envelope and wrapper hash recomputed byte-identical on both sides</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-receipt-spec/tree/v0.4-rfc-sealed-evidence-multi-clock/examples/v0.4" target="_blank" rel="noopener noreferrer">suite ↗</a></p>
    </li>
    <li>
      <time>2026-07-30</time>
      <h2>First v0.4 conformance vector shipped — v04-accept-001, two-party signed (AgentOracle + AgentTrust legs), byte-identical across three independent canonicalizations</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-receipt-spec/blob/v0.4-rfc-sealed-evidence-multi-clock/examples/v0.4/v04-accept-001.json" target="_blank" rel="noopener noreferrer">vector ↗</a></p>
    </li>
    <li>
      <time>2026-07-30</time>
      <h2>Sequence-integrity example merged into the community pre-action governance conformance suite — N artifacts over time, Merkle inclusion + tamper demos</h2>
      <p><a href="https://github.com/babyblueviper1/preaction-governance-conformance/commit/2e069ae" target="_blank" rel="noopener noreferrer">merge ↗</a></p>
    </li>
    <li>
      <time>2026-07-29</time>
      <h2>Canonical verdict→gate mapping published, content-addressed — sha256-addressed immutable doc</h2>
      <p><a href="https://agentoracle.co/mappings/agentoracle-v0.3-2026-05-30.json" target="_blank" rel="noopener noreferrer">mapping ↗</a></p>
    </li>
    <li>
      <time>2026-07-28</time>
      <h2>Third cross-citing draft filed in the receipt family — draft-msebenzi-evidence-action-00 cites draft-krausz-verification-state</h2>
      <p><a href="https://datatracker.ietf.org/doc/draft-msebenzi-evidence-action/" target="_blank" rel="noopener noreferrer">datatracker ↗</a></p>
    </li>
    <li>
      <time>2026-07-25</time>
      <h2>Composed multi-issuer envelope example merged into the community conformance suite — N signers, one artifact</h2>
      <p><a href="https://github.com/babyblueviper1/preaction-governance-conformance/pull/4" target="_blank" rel="noopener noreferrer">PR #4 ↗</a></p>
    </li>
    <li>
      <time>2026-07-16</time>
      <h2>Independent byte-identical second implementation merged — AgentTrust rebuilt the format from spec text alone</h2>
      <p><a href="https://github.com/giskard09/argentum-core/pull/33" target="_blank" rel="noopener noreferrer">PR #33 ↗</a></p>
    </li>
    <li>
      <time>2026-06-23</time>
      <h2>First registered profile in the receipt-format registry — verification.v0.3 entered as the first profile in the ERC-8210 Receipt Profile Registry</h2>
      <p><a href="https://github.com/wangbin9953/erc8210-aap/pull/4" target="_blank" rel="noopener noreferrer">registry ↗</a></p>
    </li>
    <li>
      <time>2026-06-06</time>
      <h2>IETF Internet-Draft FILED — draft-krausz-verification-state-01</h2>
      <p><a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/" target="_blank" rel="noopener noreferrer">datatracker ↗</a></p>
    </li>
    <li>
      <time>2026-06-01</time>
      <h2>Open-source receipt verifier published — offline JWS verification, MIT licensed</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-receipt-verify" target="_blank" rel="noopener noreferrer">github ↗</a></p>
    </li>
    <li>
      <time>2026-06-01</time>
      <h2>Cross-operator benchmark live — open methodology, open submissions</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-benchmark" target="_blank" rel="noopener noreferrer">github ↗</a></p>
    </li>
    <li>
      <time>2026-05-30</time>
      <h2>Receipt spec v0.3 — binary-halt gate + canonical/derived/version-bound mapping</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-receipt-spec/tree/v0.3-binary-halt" target="_blank" rel="noopener noreferrer">spec ↗</a></p>
    </li>
    <li>
      <time>2026-05-28</time>
      <h2>AVeriTeC 2024 dev published — 57.6% overall, held-out 57.7%, MIT licensed</h2>
      <p><a href="https://github.com/TKCollective/agentoracle-eval-harness" target="_blank" rel="noopener noreferrer">repo ↗</a></p>
    </li>
    <li>
      <time>2026-05-27</time>
      <h2>Pinned in x402trace v0.3.3 — first operator-contributed fixture in the harness</h2>
      <p><a href="https://github.com/fardinvahdat/x402trace/releases/tag/v0.3.3" target="_blank" rel="noopener noreferrer">release ↗</a></p>
    </li>
    <li>
      <time>2026-05-26</time>
      <h2>Live on SKALE Base — first paid settlement gasless on SKALE</h2>
      <p><a href="https://skale-base-explorer.skalenodes.com/tx/0x809361edad3ea6aebfacea978c6d6acf8cb32f7f03e4b5d13ee070e00c9f8e42" target="_blank" rel="noopener noreferrer">explorer ↗</a></p>
    </li>
    <li>
      <time>2026-05-11</time>
      <h2>Tutorial #4 — claim verification in AI content approval workflows</h2>
      <p><a href="https://dev.to/agentoracle/how-to-add-claim-verification-to-your-ai-content-approval-workflow-3797" target="_blank" rel="noopener noreferrer">dev.to ↗</a></p>
    </li>
    <li>
      <time>2026-05-08</time>
      <h2>Indexed in Coinbase Bazaar — 8 settlements verified</h2>
      <p><a href="https://api.cdp.coinbase.com/platform/v2/x402/discovery/merchant?payTo=0xdF90200B0031051BbF7a66BB9387d2Ecf599e109" target="_blank" rel="noopener noreferrer">discovery ↗</a></p>
    </li>
  </ol>
</main>
</body>
</html>`;
