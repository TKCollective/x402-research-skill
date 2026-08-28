// pricing-page.js — /pricing route. Detailed four-tier page.
// PERPLEXITY: (1) `import { PRICING_PAGE_HTML } from './pricing-page.js'` in index.js
//             (2) `app.get('/pricing', (_req,res)=>{ res.setHeader(...); res.send(PRICING_PAGE_HTML); });`
//             (3) Add <url><loc>https://agentoracle.co/pricing</loc>...</url> to sitemap.xml

export const PRICING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pricing — AgentOracle</title>
<meta name="description" content="Signed receipts for autonomous agent actions. Verify offline forever, free. Issue receipts through a live production rail from $99/month, x402 pay-per-call, or Enterprise.">
<link rel="canonical" href="https://agentoracle.co/pricing">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AgentOracle">
<meta property="og:url" content="https://agentoracle.co/pricing">
<meta property="og:title" content="AgentOracle Pricing — Verify free forever. Issue from $99/month.">
<meta property="og:description" content="Four tiers. Every receipt on every tier is offline-verifiable, byte-recomputable, IETF-filed, independently implemented, and multi-issuer-capable.">
<meta property="og:image" content="https://agentoracle.co/og-image.png?v=20260803">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/ao-logo-v8.png">
<style>
:root{
  --ink:#070706; --ink-2:#121110; --ink-3:#1a1813;
  --paper:#f4eee0; --paper-2:#fbf7ec;
  --gold:#d4a94a; --gold-2:#e8c476;
  --gline:rgba(212,169,74,.16); --gline-hi:rgba(212,169,74,.45);
  --mut-l:#6b5f47; --mut-d:#a49a82;
  --ok:#22c55e; --err:#ef4444;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Satoshi',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:var(--ink);color:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;letter-spacing:-.005em}
.mono{font-family:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace}
.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
@media(max-width:720px){.wrap{padding:0 22px}}

/* nav */
nav{border-bottom:1px solid var(--gline);background:var(--ink);position:sticky;top:0;z-index:50}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-brand{font-family:'JetBrains Mono',monospace;font-size:.94rem;letter-spacing:.06em;color:var(--paper)}
.nav-brand a{color:var(--paper)}
.nav-brand span{color:var(--gold)}
.nav-links{display:flex;gap:26px;align-items:center;font-size:.92rem}
.nav-links a{color:var(--mut-d);transition:color .2s}
.nav-links a:hover{color:var(--paper)}
.nav-links a.current{color:var(--paper)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:2px;font-family:'JetBrains Mono',monospace;font-size:.9rem;letter-spacing:.02em;transition:all .2s;border:1px solid transparent;cursor:pointer;text-decoration:none}
.btn-gold{background:var(--gold);color:var(--ink);font-weight:500}
.btn-gold:hover{background:var(--gold-2)}
.btn-ghost{background:transparent;color:var(--paper);border-color:var(--gline)}
.btn-ghost:hover{border-color:var(--gline-hi);color:var(--gold-2);box-shadow:0 0 18px rgba(212,169,74,.12)}
.nav-cta{padding:9px 16px;font-size:.88rem}
@media(max-width:820px){.nav-links a:not(.btn){display:none}}

/* hero */
.hero{padding:80px 0 40px}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.22em;color:var(--gold);margin-bottom:18px;display:block;text-transform:uppercase}
.hero h1{font-size:clamp(2.1rem,5vw,3.4rem);line-height:1.08;letter-spacing:-.02em;margin-bottom:20px;font-weight:500}
.hero h1 span{color:var(--gold)}
.hero .sub{color:var(--mut-d);max-width:680px;font-size:1.08rem}

/* tiers */
.tiers{padding:44px 0 32px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:1024px){.tiers{grid-template-columns:repeat(2,1fr)}}
@media(max-width:620px){.tiers{grid-template-columns:1fr}}
.tier{background:linear-gradient(180deg,#161512,#111009);border:1px solid var(--gline);border-radius:4px;padding:26px 24px;display:flex;flex-direction:column;position:relative}
.tier.feature{border-color:var(--gline-hi);box-shadow:0 0 60px rgba(212,169,74,.10)}
.tier .badge{position:absolute;top:-12px;right:20px;background:var(--gold);color:var(--ink);font-family:'JetBrains Mono',monospace;font-size:.68rem;letter-spacing:.14em;padding:4px 10px;border-radius:2px;text-transform:uppercase}
.tier h2{font-size:1.1rem;font-weight:600;color:var(--paper);margin-bottom:6px;letter-spacing:-.005em}
.tier .price{font-family:'JetBrains Mono',monospace;font-size:1.6rem;color:var(--gold);margin:12px 0 4px;line-height:1.1}
.tier .price small{font-size:.9rem;color:var(--mut-d);font-weight:400}
.tier .pitch{color:var(--mut-d);font-size:.94rem;margin:8px 0 18px;min-height:56px}
.tier ul{list-style:none;padding:0;margin:0 0 20px;font-size:.9rem;line-height:1.7;color:var(--paper);flex:1}
.tier li{padding-left:20px;position:relative;margin-bottom:6px}
.tier li::before{content:"·";color:var(--gold);position:absolute;left:8px;top:0;font-weight:700}
.tier li code{font-family:'JetBrains Mono',monospace;font-size:.82rem;background:rgba(212,169,74,.08);padding:1px 5px;border-radius:2px;color:var(--gold-2)}
.tier .use-for{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:var(--mut-l);letter-spacing:.06em;margin-bottom:16px;text-transform:uppercase}
.tier .use-body{font-size:.86rem;color:var(--mut-d);margin-bottom:20px;line-height:1.55}
.tier .cta{margin-top:auto}
.tier .cta .btn{width:100%;justify-content:center}

/* provable claims */
.claims{padding:64px 0 32px}
.claims h2{font-size:1.5rem;margin-bottom:6px;color:var(--paper);letter-spacing:-.01em}
.claims .sub{color:var(--mut-d);margin-bottom:24px;font-size:.98rem}
.claims table{width:100%;border-collapse:collapse;font-size:.92rem}
.claims table th,.claims table td{text-align:left;padding:14px 16px;border-bottom:1px solid var(--gline);vertical-align:top}
.claims table th{background:linear-gradient(180deg,#161512,#111009);color:var(--gold);font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500}
.claims table tr:last-child td{border-bottom:none}
.claims table td strong{color:var(--paper);font-weight:600}
.claims table td:first-child{width:32%;color:var(--paper);font-weight:500}
.claims table a{color:var(--gold);text-decoration:none;border-bottom:1px solid rgba(212,169,74,.3)}
.claims table a:hover{color:var(--gold-2);border-color:var(--gold-2)}

/* deterministic mode */
.detmode{padding:8px 0 4px}
.detmode h2{font-size:1.24rem;margin-bottom:10px;color:var(--paper);letter-spacing:-.01em;font-weight:500}
.detmode p{color:var(--mut-d);font-size:.95rem;line-height:1.7;max-width:900px}
.detmode p code{font-family:'JetBrains Mono',monospace;font-size:.84rem;background:rgba(212,169,74,.08);padding:1px 5px;border-radius:2px;color:var(--gold-2)}
.detmode p a{color:var(--gold);border-bottom:1px solid rgba(212,169,74,.3);white-space:nowrap}
.detmode p a:hover{color:var(--gold-2)}

/* faq */
.faq{padding:48px 0}
.faq h2{font-size:1.5rem;margin-bottom:24px;color:var(--paper);letter-spacing:-.01em}
.faq .q{margin-bottom:26px;border-bottom:1px solid var(--gline);padding-bottom:22px}
.faq .q:last-child{border-bottom:none}
.faq .q h3{font-size:1.02rem;color:var(--paper);font-weight:500;margin-bottom:8px;letter-spacing:-.005em}
.faq .q p{color:var(--mut-d);font-size:.94rem;line-height:1.65}
.faq .q p code{font-family:'JetBrains Mono',monospace;font-size:.86rem;background:rgba(212,169,74,.08);padding:1px 5px;border-radius:2px;color:var(--gold-2)}
.faq .q p a{color:var(--gold);border-bottom:1px solid rgba(212,169,74,.3)}

/* footer cta */
.footcta{padding:56px 0;text-align:center;border-top:1px solid var(--gline);margin-top:32px}
.footcta p{color:var(--mut-d);font-size:1.02rem;margin-bottom:22px}
.footcta .btn-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

/* footer */
footer{border-top:1px solid var(--gline);padding:44px 0 32px;background:var(--ink)}
footer .foot-in{display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;font-size:.86rem;color:var(--mut-d);font-family:'JetBrains Mono',monospace;letter-spacing:.02em}
footer a{color:var(--mut-d);text-decoration:none;transition:color .2s}
footer a:hover{color:var(--gold-2)}
.foot-links{display:flex;gap:22px;flex-wrap:wrap}
</style>
</head>
<body>

<nav>
  <div class="wrap nav-in">
    <div class="nav-brand"><a href="/">agent<span>oracle</span></a></div>
    <div class="nav-links">
      <a href="/whitepaper">Whitepaper</a>
      <a href="/pricing" class="current">Pricing</a>
      <a href="/changelog">Changelog</a>
      <a class="btn btn-gold nav-cta" href="https://buy.stripe.com/6oU9ATdcggwJgUB7Zr3ZK02">Get a key</a>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">Pricing</span>
    <h1>Signed receipts for<br>autonomous <span>agent actions</span>.</h1>
    <p class="sub">Verify any receipt offline, forever. Issue receipts through a live production rail. Pay monthly, pay per call, or run the verifier for free.</p>
  </div>
</section>

<section>
  <div class="wrap tiers">

    <!-- Tier 1 — Verify (Free) -->
    <div class="tier">
      <h2>Verify</h2>
      <div class="price">Free</div>
      <p class="pitch">Offline verification of any receipt against the published JWKS. No account required.</p>
      <ul>
        <li><code>pip install agentoracle-receipt-verify</code></li>
        <li>Node reference verifier in the spec repo</li>
        <li>MCP server for Cursor, Claude Desktop, Codex</li>
        <li>Zero network dependency after first JWKS fetch</li>
        <li>Cross-language conformance vectors</li>
        <li>Apache-2.0 across all reference code</li>
      </ul>
      <div class="use-for">Use it for</div>
      <div class="use-body">Dispute resolution, audit trail verification, third-party settlement checks, embedding "verified by AgentOracle" in your own product.</div>
      <div class="cta"><a class="btn btn-ghost" href="https://pypi.org/project/agentoracle-receipt-verify/" target="_blank" rel="noopener">Get started ↗</a></div>
    </div>

    <!-- Tier 2 — Self-Serve $99 -->
    <div class="tier feature">
      <div class="badge">Popular</div>
      <h2>Self-Serve</h2>
      <div class="price">$99<small> /month</small></div>
      <p class="pitch">Live production issuance. Sign your team's v_gate results into a JWS composed envelope.</p>
      <ul>
        <li><code>POST /v1/compose</code></li>
        <li><code>POST /evaluate</code> — end-to-end</li>
        <li>100 requests/hour per key</li>
        <li>Key retrievable from the dashboard</li>
        <li>Signed with the live issuer key, JWKS-tracked</li>
        <li>Cancel any time</li>
      </ul>
      <div class="use-for">Use it for</div>
      <div class="use-body">Production agent workflows where the transaction outcome needs to be settlement-grade — dispute resolution, audit trail, cross-party attestation.</div>
      <div class="cta"><a class="btn btn-gold" href="https://buy.stripe.com/6oU9ATdcggwJgUB7Zr3ZK02">Start $99/month →</a></div>
    </div>

    <!-- Tier 3 — Pay-per-Call -->
    <div class="tier">
      <h2>Pay-per-Call</h2>
      <div class="price">$0.09<small> /verification</small></div>
      <p class="pitch">High-frequency agent loops. At GA: attach a payment header, receive a signed receipt, no subscription. During beta the endpoint is open and unmetered.</p>
      <ul>
        <li><code>POST /evaluate</code> — free during beta</li>
        <li>$0.09 USDC per call, settled on Base, at GA</li>
        <li>Per-call metering, no floor</li>
        <li>Same envelope as Self-Serve tier</li>
        <li>Zero credential setup</li>
      </ul>
      <div class="use-for">Use it for</div>
      <div class="use-body">High-frequency agent loops that would exceed self-serve limits; bursty workloads; usage where per-call accounting is a first-class requirement.</div>
      <div class="cta"><a class="btn btn-ghost" href="mailto:joe@agentoracle.co?subject=x402%20pay-per-call%20early%20access">Request early access →</a></div>
    </div>

    <!-- Tier 4 — Enterprise -->
    <div class="tier">
      <h2>Enterprise</h2>
      <div class="price">Custom</div>
      <p class="pitch">Volume, SLA, custom mapping, co-issuer coordination, private issuer keys.</p>
      <ul>
        <li>Volume pricing</li>
        <li>SLA — uptime, response, escalation</li>
        <li>Custom conformance mapping docs</li>
        <li>Co-issuer coordination</li>
        <li>Private issuer keys where required</li>
        <li>Direct engineering contact</li>
      </ul>
      <div class="use-for">Use it for</div>
      <div class="use-body">Regulated workflows requiring durable action records; multi-party settlement flows; audit-shop and compliance body deployments.</div>
      <div class="cta"><a class="btn btn-ghost" href="mailto:joe@agentoracle.co?subject=AgentOracle%20Enterprise">Contact →</a></div>
    </div>

  </div>
</section>

<section class="detmode">
  <div class="wrap">
    <h2>Deterministic mode — included on Self-Serve and Pay-per-Call</h2>
    <p>For claims that are lookups, not judgments — signature verification, hash comparison, registry checks, regex matching, timestamp validation, JSON schema conformance — <code>POST /v1/verify-facts</code> skips LLM judgment entirely. The receipt records <code>check_mode: "deterministic"</code> and <code>check_types_applied[]</code> inside the signed payload, so a verifier can prove no model was in the trust chain rather than take our word for it. Same envelope, same verifier, same published JWKS, no change to your credentials. If a claim cannot be resolved by a shipped check type the endpoint returns <code>422 claim_not_deterministic</code> — there is no fallback to the judgment path, because a silent escalation would make the mode meaningless. <a href="/docs/deterministic-mode">Read the docs →</a></p>
  </div>
</section>

<section class="claims">
  <div class="wrap">
    <h2>Every receipt, on every tier, is:</h2>
    <p class="sub">Not a marketing tag. Each property is a link to the artifact that proves it.</p>
    <table>
      <thead>
        <tr><th>Property</th><th>How to verify</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Offline-verifiable</strong></td>
          <td>Fetch the JWKS once, cache it, verify forever without touching our infrastructure. Sample: <a href="https://agentoracle.co/.well-known/jwks.json">jwks.json</a>.</td>
        </tr>
        <tr>
          <td><strong>Byte-recomputable</strong></td>
          <td>RFC 8785 JCS canonicalization + Ed25519 (RFC 8032). Two reference verifiers ship the same bytes.</td>
        </tr>
        <tr>
          <td><strong>Independently implemented</strong></td>
          <td>AgentTrust's byte-identical second implementation of the verification envelope, landed as vectors and fixtures in <a href="https://github.com/giskard09/argentum-core/tree/main/examples/conformance/agenttrust-v1" target="_blank" rel="noopener">argentum-core/examples/conformance/agenttrust-v1</a> (<a href="https://github.com/giskard09/argentum-core/pull/33" target="_blank" rel="noopener">PR #33, merged 2026-07-16</a>).</td>
        </tr>
        <tr>
          <td><strong>IETF-filed</strong></td>
          <td>Format specified in <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state" target="_blank" rel="noopener">draft-krausz-verification-state</a>.</td>
        </tr>
        <tr>
          <td><strong>Conformance-vector-tested</strong></td>
          <td>Published cross-language reference verifiers in the <a href="https://github.com/TKCollective/agentoracle-receipt-spec" target="_blank" rel="noopener">spec repo</a>.</td>
        </tr>
        <tr>
          <td><strong>Multi-issuer-capable</strong></td>
          <td>Composed envelope grammar — sibling signers append, never overwrite.</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<section class="faq">
  <div class="wrap">
    <h2>Questions</h2>

    <div class="q">
      <h3>How is a receipt verified?</h3>
      <p>Fetch the receipt bytes. Canonicalize per RFC 8785 JCS. Verify the Ed25519 signature against the JWK identified by <code>kid</code> in the protected header, resolvable from the published JWKS. Any of the reference verifiers does all three in one call.</p>
    </div>

    <div class="q">
      <h3>What does "offline" mean?</h3>
      <p>Once the JWKS is cached, verification requires zero network access to AgentOracle. Your side.</p>
    </div>

    <div class="q">
      <h3>Can I issue receipts my team signs?</h3>
      <p>Enterprise tier only. The Self-Serve and Pay-per-Call tiers issue AgentOracle-signed receipts against your <code>v_gate</code> result.</p>
    </div>

    <div class="q">
      <h3>What happens if the signing key rotates?</h3>
      <p>Rotated keys remain in the JWKS for at least twelve months post-rotation. Receipts signed by the retired key stay verifiable.</p>
    </div>

    <div class="q">
      <h3>Is this the receipt format used by any standard body?</h3>
      <p>The receipt format is filed as an IETF Internet-Draft. An open draft revision covering sealed evidence and multi-clock anchors is in review as <a href="https://github.com/TKCollective/agentoracle-receipt-spec/pull/5" target="_blank" rel="noopener">PR #5 on the spec repo</a> — pointed at, not part of the shipped envelope.</p>
    </div>

  </div>
</section>

<div class="footcta">
  <div class="wrap">
    <p>Verifying is free forever. Issuance starts at $99/month. Enterprise on request.</p>
    <div class="btn-row">
      <a class="btn btn-gold" href="https://buy.stripe.com/6oU9ATdcggwJgUB7Zr3ZK02">Get a key</a>
      <a class="btn btn-ghost" href="/whitepaper">Read the spec</a>
      <a class="btn btn-ghost" href="mailto:joe@agentoracle.co">Contact</a>
    </div>
  </div>
</div>

<footer>
  <div class="wrap foot-in">
    <div>AgentOracle · TK Collective LLC</div>
    <div class="foot-links">
      <a href="/">Home</a>
      <a href="/whitepaper">Whitepaper</a>
      <a href="/changelog">Changelog</a>
      <a href="/receipt-registry">Receipt registry</a>
      <a href="/benchmarks">Benchmarks</a>
      <a href="/business">Business</a>
    </div>
  </div>
</footer>

</body>
</html>`;
