// landing-page-v7.js — AgentOracle homepage rebuild (launch week, Aug 2 2026)
// Exported as LANDING_PAGE_V7_HTML. Route: GET / (swap from LANDING_PAGE_V6_HTML in index.js)
// Preserved anchor IDs: #how-it-works #features #playground #pricing (+ pg-input pg-btn pg-result pg-spinner, platformTierTalkBtn)
// PERPLEXITY DEPLOY NOTES — search for "PERPLEXITY:" comments (2 transplant points: playground handler, Stripe link).

export const LANDING_PAGE_V7_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AgentOracle — signed receipts for AI agent actions</title>
<meta name="description" content="Pre-action verification for AI agents. Every checked claim gets a cryptographically signed receipt anyone can verify — offline, against published keys, forever.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/ao-logo-v8.png">
<style>
:root{
  --ink:#070706; --ink-2:#121110; --ink-3:#1a1813;
  --paper:#f4eee0; --paper-2:#fbf7ec;
  --gold:#d4a94a; --gold-2:#e8c476;
  --gline:rgba(212,169,74,.16); --gline-hi:rgba(212,169,74,.45);
  --ok:#4ade80; --ok-deep:#3f9e5f;
  --line-l:#ddd3bc; --line-d:#26231b;
  --mut-l:#6b5f47; --mut-d:#a49a82;
  --rad:14px; --max:1120px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Satoshi',sans-serif;background:var(--ink);color:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E")}
.mono{font-family:'JetBrains Mono',monospace}
a{color:inherit;text-decoration:none}
.wrap{max-width:var(--max);margin:0 auto;padding:0 24px}
section{padding:128px 0;position:relative}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.22em;color:var(--gold);margin-bottom:18px;display:block}
h2{font-size:clamp(1.7rem,3.4vw,2.5rem);font-weight:700;line-height:1.15;letter-spacing:-.01em;margin-bottom:14px}
.sub{color:var(--mut-d);max-width:640px;font-size:1.06rem}
.band-light{background:#0b0a09;color:var(--paper)}
.band-light .sub{color:var(--mut-d)}
.band-light .eyebrow{color:var(--gold)}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .65s cubic-bezier(.22,.7,.3,1),transform .65s cubic-bezier(.22,.7,.3,1)}
.reveal.in{opacity:1;transform:none}
.grid6 .pcard,.plans .plan,.who .wcard,.loop .loop-step{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.22,.7,.3,1),transform .6s cubic-bezier(.22,.7,.3,1)}
.grid6.in .pcard,.plans.in .plan,.who.in .wcard,.loop.in .loop-step{opacity:1;transform:none}
.grid6.in .pcard:nth-child(2),.plans.in .plan:nth-child(2),.who.in .wcard:nth-child(2){transition-delay:.1s}
.grid6.in .pcard:nth-child(3),.plans.in .plan:nth-child(3),.who.in .wcard:nth-child(3){transition-delay:.2s}
.grid6.in .pcard:nth-child(4){transition-delay:.3s}
.grid6.in .pcard:nth-child(5){transition-delay:.4s}
.grid6.in .pcard:nth-child(6){transition-delay:.5s}
.loop.in .loop-step:nth-of-type(2){transition-delay:.12s}
.loop.in .loop-step:nth-of-type(3){transition-delay:.24s}
.loop.in .loop-step:nth-of-type(4){transition-delay:.36s}
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  .reveal{opacity:1;transform:none;transition:none}
  .receipt{transition:none}
}

/* ---------- nav ---------- */
nav{position:sticky;top:0;z-index:50;background:rgba(7,7,6,.8);backdrop-filter:blur(12px);border-bottom:1px solid var(--line-d)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-weight:700;font-size:1.06rem;letter-spacing:.01em}
.logo .dot{color:var(--gold)}
.nav-links{display:flex;gap:26px;align-items:center;font-size:.92rem}
.nav-links a{color:var(--mut-d);transition:color .2s}
.nav-links a:hover{color:var(--paper)}
.btn{display:inline-block;padding:12px 22px;border-radius:10px;font-weight:500;font-size:.95rem;transition:transform .18s ease,box-shadow .18s ease;cursor:pointer;border:0}
.btn:focus-visible,a:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.btn-gold{background:linear-gradient(120deg,var(--gold),var(--gold-2));color:var(--ink)}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 0 24px rgba(212,169,74,.35),0 8px 26px rgba(212,169,74,.25)}
.btn-ghost{border:1px solid var(--line-d);color:var(--paper)}
.btn-ghost:hover{border-color:var(--gline-hi);color:var(--gold-2);box-shadow:0 0 18px rgba(212,169,74,.12)}
.band-light .btn-ghost{border-color:var(--gline);color:var(--paper)}
.band-light .btn-ghost:hover{border-color:var(--gline-hi);color:var(--gold-2)}
.nav-cta{padding:9px 16px;font-size:.88rem}
@media(max-width:820px){.nav-links a:not(.btn){display:none}}

/* ---------- hero ---------- */
.hero{padding:110px 0 100px;position:relative;overflow:hidden}
#claimfield{position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:.55}
.hero-grid{position:relative;z-index:2}

.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center;position:relative}
h1{font-size:clamp(2.1rem,4.6vw,3.4rem);font-weight:700;line-height:1.08;letter-spacing:-.02em}
h1 .g{background:linear-gradient(110deg,var(--gold),var(--gold-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hl{display:block;opacity:0;transform:translateY(18px);animation:lineup .8s cubic-bezier(.22,.7,.3,1) forwards}
h1 .hl:nth-child(3){animation-delay:.15s}
h1 .g{transition:none}
.hero-sub,.hero-ctas,.proof-strip{opacity:0;transform:translateY(14px);animation:lineup .8s cubic-bezier(.22,.7,.3,1) forwards}
.hero-sub{animation-delay:.3s}.hero-ctas{animation-delay:.45s}.proof-strip{animation-delay:.6s}
@keyframes lineup{to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.hl,.hero-sub,.hero-ctas,.proof-strip{opacity:1;transform:none;animation:none}}
.hero-sub{margin:22px 0 34px;font-size:1.15rem;color:var(--mut-d);max-width:520px}
.hero-ctas{display:flex;gap:14px;flex-wrap:wrap}
.proof-strip{margin-top:44px;font-family:'JetBrains Mono',monospace;font-size:.8rem;letter-spacing:.06em;color:var(--mut-d);display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.proof-strip .sep{color:var(--gold);opacity:.8}

/* the signature: a receipt that types itself */
.receipt{background:linear-gradient(180deg,#161512,#111009);color:var(--paper);border:1px solid var(--gline-hi);border-radius:4px;padding:30px 28px 26px;position:relative;box-shadow:0 0 90px rgba(212,169,74,.14),0 30px 80px rgba(0,0,0,.65);max-width:430px;justify-self:end;width:100%}
.r-head{display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.14em;color:var(--gold);border-bottom:1px dashed var(--gline-hi);padding-bottom:12px;margin-bottom:14px}
.r-body{font-family:'JetBrains Mono',monospace;font-size:.8rem;line-height:1.85;min-height:216px;color:#e6ddc6}
.r-body .k{color:#9a8b66}
.r-body .ok{color:var(--ok);font-weight:700}
.r-body .sig{color:var(--gold-2)}
.chk{color:#a3731f;opacity:.75;font-style:italic}
.receipt{transition:box-shadow .9s ease}
.receipt.sealed{box-shadow:0 0 110px rgba(212,169,74,.28),0 30px 80px rgba(0,0,0,.6)}

.receipt.sealed .r-foot{color:var(--gold-2)}
.r-foot{border-top:1px dashed var(--gline-hi);margin-top:14px;padding-top:12px;font-family:'JetBrains Mono',monospace;font-size:.7rem;color:#9a8b66;display:flex;justify-content:space-between}
@media(max-width:900px){.hero-grid{grid-template-columns:1fr}.receipt{justify-self:start;max-width:460px}}
</style>
</head>
<body>

<nav>
  <div class="wrap nav-in">
    <a class="logo" href="/">agent<span class="dot">oracle</span></a>
    <div class="nav-links">
      <a href="#how-it-works">The loop</a>
      <a href="#verify">Verify it yourself</a>
      <a href="#proof">Proof</a>
      <a href="#pricing">Pricing</a>
      <a href="#faq">FAQ</a>
      <a class="btn btn-gold nav-cta" href="#pricing">Get a key</a>
    </div>
  </div>
</nav>

<header class="hero">
  <canvas id="claimfield" aria-hidden="true"></canvas>
  <div class="wrap hero-grid">
    <div>
      <h1><span class="hl">AI agents act on claims.</span><br><span class="hl">We make the claims <span class="g">prove themselves.</span></span></h1>
      <p class="hero-sub">Before your agent acts, AgentOracle checks the claim and issues a signed receipt — evidence anyone can verify offline, against published keys, without trusting us or you.</p>
      <div class="hero-ctas">
        <a class="btn btn-gold" href="#pricing">Get a key</a>
        <a class="btn btn-ghost" href="#verify">Verify a receipt</a>
      </div>
      <div class="proof-strip">
        <span>IETF draft</span><span class="sep">·</span>
        <span>first registered profile</span><span class="sep">·</span>
        <span>independently implemented, byte-identical</span>
      </div>
    </div>
    <div class="receipt" aria-label="Sample AgentOracle receipt">
      <div class="r-head"><span>RECEIPT · PRE-ACTION</span><span>AGENTORACLE</span></div>
      <div class="r-body" id="heroType"></div>
      <div class="r-foot"><span>ed25519 · rfc 8785</span><span>verifies offline</span></div>
    </div>
  </div>
</header>

<div class="tape" aria-hidden="true">
  <div class="tape-track mono">
    <span>✓ act · conf 0.91 · sha256-f6f257a3…</span><i>·</i><span>logs assert — receipts prove</span><i>·</i><span>✕ do_not_act · contradicted by 2 of 3 sources</span><i>·</i><span>verifies offline · anyone · forever</span><i>·</i><span>✓ act · conf 0.87 · 2 sources sealed</span><i>·</i><span>byte-identical across implementations</span><i>·</i><span>IETF draft-krausz-verification-state</span><i>·</i><span>✓ act · adversarial: resilient</span><i>·</i><span>the "no" is evidence too</span><i>·</i><span>ed25519 · rfc 8785 · sealed at issue</span><i>·</i>
    <span>✓ act · conf 0.91 · sha256-f6f257a3…</span><i>·</i><span>logs assert — receipts prove</span><i>·</i><span>✕ do_not_act · contradicted by 2 of 3 sources</span><i>·</i><span>verifies offline · anyone · forever</span><i>·</i><span>✓ act · conf 0.87 · 2 sources sealed</span><i>·</i><span>byte-identical across implementations</span><i>·</i><span>IETF draft-krausz-verification-state</span><i>·</i><span>✓ act · adversarial: resilient</span><i>·</i><span>the "no" is evidence too</span><i>·</i><span>ed25519 · rfc 8785 · sealed at issue</span><i>·</i>
  </div>
</div>

<!-- ========== 02 · THE LOOP (merged how-it-works + capabilities + demo + receipts) ========== -->
<section id="how-it-works" class="band-light">
  <div class="wrap">
    <span class="eyebrow reveal">[01] THE LOOP</span>
    <h2 class="reveal">Claim in. Checked. Receipt out.<br>Anyone verifies.</h2>
    <p class="sub reveal">One API call sits between your agent and its consequential actions. Here is the whole product:</p>

    <div class="loop-wrap" style="position:relative;margin-top:48px">
    <div class="loop-line" aria-hidden="true"><i></i></div>
    <div class="loop reveal" id="features">
      <div class="loop-step"><div class="ln mono">1</div><h3>Your agent makes a claim</h3><p>"This invoice is unpaid." "This drug interaction is safe." "This customer is eligible." The claim that justifies the action.</p></div>
      <div class="loop-step"><div class="ln mono">2</div><h3>We check it first</h3><p>Independent sources, adversarial re-checks, a published rule table — before the action runs, not after it goes wrong.</p></div>
      <div class="loop-step"><div class="ln mono">3</div><h3>A signed receipt is issued</h3><p>Canonical bytes (RFC 8785), Ed25519 signature, the verdict, the sources, and the exact rules used — sealed at issue.</p></div>
      <div class="loop-step"><div class="ln mono">4</div><h3>Anyone verifies. Forever.</h3><p>Offline, against published keys. Auditors, counterparties, courts — no account needed, no trust in us required.</p></div>
    </div>
    </div>

    <!-- live demo (single demo surface for the whole page) -->
    <div class="pg reveal" id="playground">
      <div class="pg-head">
        <span class="mono pg-title">TRY IT · LIVE</span>
        <span class="mono pg-hint">runs against the real engine</span>
      </div>
      <div class="pg-chips mono">
        <button class="chip" data-claim="The Eiffel Tower is 330 metres tall">Eiffel Tower height</button>
        <button class="chip" data-claim="Aspirin and ibuprofen are safe to take together">Drug interaction</button>
        <button class="chip" data-claim="The EU AI Act applies to US companies">EU AI Act scope</button>
      </div>
      <div class="pg-row">
        <input id="pg-input" class="mono" type="text" value="The Eiffel Tower is 330 metres tall" aria-label="Claim to verify">
        <button id="pg-btn" class="btn btn-gold">Check the claim</button>
      </div>
      <div id="pg-spinner" class="pg-spin mono" hidden>checking sources…</div>
      <pre id="pg-result" class="mono pg-out" aria-live="polite"></pre>
    </div>

    <!-- receipts wall, trimmed to two -->
    <div class="rwall reveal">
      <div class="rcard mono">
        <div class="rc-top"><span>verdict: <b class="okc">act</b></span><span>conf 0.87</span></div>
        <div class="rc-mid">claim_hash sha256-f6f257a3…<br>mapping agentoracle-v0.3 · 2 sources sealed</div>
        <div class="rc-bot"><span class="okc">✓ VALID</span><span>verified offline</span></div>
      </div>
      <div class="rcard mono">
        <div class="rc-top"><span>verdict: <b class="noc">do_not_act</b></span><span>conf 0.31</span></div>
        <div class="rc-mid">claim_hash sha256-9c04e1d2…<br>contradicted by 2 of 3 sources</div>
        <div class="rc-bot"><span class="okc">✓ VALID</span><span>the "no" is evidence too</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ========== 03 · VERIFY IT YOURSELF ========== -->
<section id="verify">
  <div class="wrap">
    <span class="eyebrow reveal">[02] VERIFY IT YOURSELF</span>
    <h2 class="reveal">"Trust us" is a sentence.<br>"Run it yourself" is three commands.</h2>
    <p class="sub reveal">Don't take the homepage's word for anything. Pull a real receipt off this site and verify it on your own machine, offline.</p>
    <div class="term reveal mono" aria-label="Three verification commands">
      <div class="t-dots"><i></i><i></i><i></i></div>
      <div class="t-line"><span class="t-p">$</span> pip install agentoracle-receipt-verify</div>
      <div class="t-line"><span class="t-p">$</span> curl -s https://agentoracle.co/receipts/latest.json -o receipt.json</div>
      <div class="t-line"><span class="t-p">$</span> agentoracle-verify receipt.json</div>
      <div class="t-line t-ok">✓ VALID — signature verifies against published JWKS (offline)</div>
    </div>
    <p class="sub reveal" style="margin-top:22px">The verifier is MIT-licensed, ~600 lines, no dependencies on us. Read it before you trust it — that's the point.</p>
  </div>
</section>

<!-- ========== 04 · PROOF (six contrasts + quiet standards row) ========== -->
<section id="proof" class="band-light">
  <div class="wrap">
    <span class="eyebrow reveal">[03] WHY RECEIPTS BEAT LOGS</span>
    <h2 class="reveal">Records that prove beat records that assert.</h2>
    <div class="grid6 reveal">
      <div class="pcard reveal"><h3>Logs assert.<br><span class="gld">Receipts prove.</span></h3><p>A log is the operator's story. A receipt carries its own evidence — verdict, sources, rules, signature.</p></div>
      <div class="pcard reveal"><h3>Logs trust the operator.<br><span class="gld">Receipts trust no one.</span></h3><p>Letting the operator keep the record is letting the suspect write the police report.</p></div>
      <div class="pcard reveal"><h3>Logs can be edited.<br><span class="gld">Receipts are sealed.</span></h3><p>Change one byte and the signature fails. Backdating fails the same way — timestamps are bound in.</p></div>
      <div class="pcard reveal"><h3>Logs verify by asking us.<br><span class="gld">Receipts verify offline.</span></h3><p>Published keys, canonical bytes. If we disappeared tomorrow, every receipt still verifies.</p></div>
      <div class="pcard reveal"><h3>One implementation is a product.<br><span class="gld">Two, byte-identical, is a standard.</span></h3><p>An independent team rebuilt the format from the spec text alone — matching to the last byte.</p></div>
      <div class="pcard reveal"><h3>Proprietary dies with the vendor.<br><span class="gld">Open formats outlive everyone.</span></h3><p>IETF-filed, MIT reference code, published conformance vectors in two languages.</p></div>
    </div>
    <div class="stdrow mono reveal">
      <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state" target="_blank" rel="noopener">IETF draft ↗</a>
      <a href="https://github.com/TKCollective/agentoracle-receipt-spec" target="_blank" rel="noopener">Spec + vectors ↗</a>
      <a href="https://pypi.org/project/agentoracle-receipt-verify" target="_blank" rel="noopener">PyPI verifier ↗</a>
      <a href="/whitepaper">Whitepaper</a>
      <a href="/changelog">Changelog</a>
    </div>
  </div>
</section>

<!-- ========== 05 · WHO IT'S FOR ========== -->
<section id="who-uses">
  <div class="wrap">
    <span class="eyebrow reveal">[04] WHO IT'S FOR</span>
    <h2 class="reveal">For the decisions you can't afford to be wrong about.</h2>
    <div class="who reveal">
      <div class="wcard"><h3>Compliance & audit teams</h3><p>The EU AI Act's record-keeping obligations (Article 12) bite December 2027. Receipts are records an external examiner can verify without trusting you — built for exactly that clause.</p></div>
      <div class="wcard"><h3>Agent platform builders</h3><p>Give every consequential agent action an evidence trail. One API call in the loop; a receipt in every audit bundle, ready for whatever governance stack sits above you.</p></div>
      <div class="wcard"><h3>Regulated operators</h3><p>Finance, health, legal — anywhere "the AI said so" isn't a defense. When something is questioned, hand over proof instead of promises.</p></div>
    </div>
  </div>
</section>

<!-- ========== 06 · PRICING ($99 self-serve FIRST) ========== -->
<section id="pricing" class="band-light">
  <div class="wrap">
    <span class="eyebrow reveal">[05] PRICING</span>
    <h2 class="reveal">Card in. Key out. Receipts in minutes.</h2>
    <div class="plans reveal">
      <div class="plan plan-lead reveal">
        <div class="pl-tag mono">SELF-SERVE</div>
        <div class="pl-price">$99<span>/mo</span></div>
        <p class="pl-desc">Checkout with a card, get an API key instantly. 2,000 verifications a month, full signed receipts, the works.</p>
        <ul class="pl-list">
          <li>API key issued at checkout — live in minutes</li>
          <li>Signed receipts, offline-verifiable, yours forever</li>
          <li>Public JWKS + conformance suite access</li>
          <li>Cancel anytime</li>
        </ul>
        <!-- PERPLEXITY: wire href to the live Stripe Payment Link at Saturday's live-mode swap -->
        <a class="btn btn-gold pl-btn" href="/register">Get your key</a>
        <div class="pl-note mono">No wallet. No sales call. A card.</div>
      </div>
      <div class="plan reveal">
        <div class="pl-tag mono">AGENTS · PAY PER CALL</div>
        <div class="pl-price">$0.09<span>/verification</span></div>
        <p class="pl-desc">For autonomous agents paying their own way: x402 pay-per-call with USDC, gasless via SKALE. No subscription, no account — the agent pays, the receipt returns.</p>
        <ul class="pl-list">
          <li>x402 protocol, per-request settlement</li>
          <li>Gasless USDC (SKALE) — no gas management</li>
          <li>Same signed receipts, same verification</li>
        </ul>
        <a class="btn btn-ghost pl-btn" href="/docs/x402">Read the x402 docs</a>
      </div>
      <div class="plan reveal">
        <div class="pl-tag mono">PLATFORM</div>
        <div class="pl-price">Custom</div>
        <p class="pl-desc">Volume, SLAs, custom mapping tables, composed multi-issuer receipts, co-signing with your own keys.</p>
        <ul class="pl-list">
          <li>Volume pricing + priority lanes</li>
          <li>Custom rule tables, versioned + published</li>
          <li>Multi-issuer composed envelopes</li>
        </ul>
        <a class="btn btn-ghost pl-btn" id="platformTierTalkBtn" href="mailto:joe@agentoracle.co?subject=Platform%20tier">Talk to us</a>
      </div>
    </div>
  </div>
</section>

<!-- ========== 07 · FAQ ========== -->
<section id="faq">
  <div class="wrap">
    <span class="eyebrow reveal">[06] QUESTIONS</span>
    <h2 class="reveal">Asked and answered.</h2>
    <div class="faq reveal">
      <details><summary>Do I need a wallet or crypto?</summary><p>No — card checkout gets you an API key. Wallets are optional, and only for the x402 pay-per-call path used by autonomous agents.</p></details>
      <details><summary>What exactly does a receipt prove?</summary><p>That a specific claim was checked at a specific time, against named sources, under a published rule table, producing a specific verdict — and that none of it has been altered since. It proves what was checked and what the answer was. It doesn't prove things it can't: our whitepaper publishes the limits next to the strengths.</p></details>
      <details><summary>How do I verify a receipt without trusting you?</summary><p>Install the MIT-licensed verifier (or write your own from the IETF draft — a team already has, byte-identically). Verification runs offline against our published public keys. You never need our permission, our API, or our continued existence.</p></details>
      <details><summary>Does this help with the EU AI Act?</summary><p>Article 12 requires records of high-risk AI operation, applicable December 2027. Receipts are records that verify independently — the property plain logs can't offer an examiner. We publish a free Article 12 mapping in the whitepaper.</p></details>
      <details><summary>What happens when a claim fails the check?</summary><p>You get the same signed receipt with verdict "do_not_act" and the contradicting sources sealed in. The "no" is evidence too — often the more valuable kind.</p></details>
      <details><summary>Can my agent pay per call without an account?</summary><p>Yes — that's the x402 path: the agent pays per verification in USDC (gasless via SKALE) and gets the receipt in the response. Built for agent-to-agent commerce.</p></details>
    </div>
  </div>
</section>

<footer>
  <div class="wrap f-grid">
    <div>
      <a class="logo" href="/">agent<span class="dot">oracle</span></a>
      <p class="f-tag">Logs say what the operator claims happened.<br>Receipts prove it. We make receipts.</p>
      <p class="f-co mono">© 2026 TK Collective LLC</p>
    </div>
    <div class="f-col mono">
      <b>Trust</b>
      <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state" target="_blank" rel="noopener">IETF draft</a>
      <a href="https://github.com/TKCollective/agentoracle-receipt-spec" target="_blank" rel="noopener">Spec + conformance vectors</a>
      <a href="https://agentoracle.co/.well-known/jwks.json">Published keys (JWKS)</a>
      <a href="https://pypi.org/project/agentoracle-receipt-verify" target="_blank" rel="noopener">Offline verifier (PyPI)</a>
      <a href="/whitepaper">Whitepaper</a>
    </div>
    <div class="f-col mono">
      <b>Product</b>
      <a href="#how-it-works">The loop</a>
      <a href="#playground">Live demo</a>
      <a href="#pricing">Pricing</a>
      <a href="/changelog">Changelog</a>
      <a href="/business">For business</a>
    </div>
  </div>
</footer>

<style>
/* ---------- receipt-tape marquee ---------- */
.tape{position:relative;background:#0c0b09;border-top:1px solid var(--gline);border-bottom:1px solid var(--gline);overflow:hidden;padding:16px 0}
.tape::before,.tape::after{content:"";position:absolute;left:0;right:0;height:8px;background-image:radial-gradient(circle at 8px 4px,var(--ink) 3px,transparent 3.5px);background-size:18px 8px;z-index:2}
.tape::before{top:2px}.tape::after{bottom:2px}
.tape-track{display:flex;gap:34px;white-space:nowrap;font-size:.74rem;letter-spacing:.06em;color:#8d8368;width:max-content;animation:tapeflow 42s linear infinite}
.tape-track span{display:inline-block}
.tape-track i{color:var(--gold);font-style:normal;opacity:.6}
.tape-track span:nth-child(4n+1){color:#b9ac8a}
.tape:hover .tape-track{animation-play-state:paused}
@keyframes tapeflow{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion: reduce){.tape-track{animation:none}}

/* ---------- loop ---------- */
.loop{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;align-items:stretch}
.loop-step{background:var(--ink-2);border:1px solid var(--gline);border-radius:var(--rad);padding:24px 22px;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:border-color .25s,transform .25s}
.loop-step:hover{border-color:var(--gline-hi);transform:translateY(-3px)}
.loop-step h3{font-size:1.02rem;margin:10px 0 8px}
.loop-step p{font-size:.9rem;color:var(--mut-d)}
.ln{width:30px;height:30px;border-radius:50%;background:rgba(212,169,74,.12);border:1px solid var(--gline-hi);color:var(--gold-2);display:flex;align-items:center;justify-content:center;font-size:.85rem}
.loop-line{position:absolute;left:0;right:0;top:50%;height:2px;z-index:0;pointer-events:none;overflow:hidden}
.loop-line i{display:block;height:100%;width:0;background:linear-gradient(90deg,transparent,rgba(212,169,74,.55) 15%,rgba(212,169,74,.55) 85%,transparent);transition:width 1.6s cubic-bezier(.22,.7,.3,1) .2s}
.loop-wrap.drawn .loop-line i{width:100%}
.loop{position:relative;z-index:1}
@media(max-width:980px){.loop{grid-template-columns:1fr}
.loop-line{left:14px;right:auto;top:0;bottom:0;height:100%;width:2px}
.loop-line i{width:100%;height:0;background:linear-gradient(180deg,transparent,rgba(212,169,74,.55) 12%,rgba(212,169,74,.55) 88%,transparent);transition:height 1.8s cubic-bezier(.22,.7,.3,1) .2s}
.loop-wrap.drawn .loop-line i{height:100%;width:100%}
.loop-step{margin-left:34px}
}
@media (prefers-reduced-motion: reduce){.loop-line i{width:100%;height:100%;transition:none}}

/* ---------- playground ---------- */
.pg{margin-top:56px;background:var(--ink-2);color:var(--paper);border:1px solid transparent;border-radius:var(--rad);padding:26px;box-shadow:0 0 60px rgba(212,169,74,.07),0 18px 50px rgba(0,0,0,.5);position:relative;background-clip:padding-box}
.pg::before{content:"";position:absolute;inset:-1px;border-radius:var(--rad);padding:1px;background:linear-gradient(120deg,rgba(212,169,74,.12),rgba(212,169,74,.5),rgba(212,169,74,.12));background-size:250% 250%;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:borderflow 7s ease-in-out infinite;pointer-events:none}
@keyframes borderflow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@media (prefers-reduced-motion: reduce){.pg::before{animation:none}}
.pg-head{display:flex;justify-content:space-between;margin-bottom:16px}
.pg-title{font-size:.75rem;letter-spacing:.2em;color:var(--gold)}
.pg-hint{font-size:.72rem;color:var(--mut-d)}
.pg-chips{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.chip{font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.03em;color:var(--mut-d);background:transparent;border:1px solid var(--gline);border-radius:999px;padding:7px 14px;cursor:pointer;transition:border-color .2s,color .2s,box-shadow .2s}
.chip:hover{border-color:var(--gline-hi);color:var(--gold-2);box-shadow:0 0 14px rgba(212,169,74,.12)}
.pg-row{display:flex;gap:12px;flex-wrap:wrap}
#pg-input{flex:1;min-width:240px;background:var(--ink);border:1px solid var(--line-d);border-radius:10px;color:var(--paper);padding:13px 16px;font-size:.9rem}
#pg-input:focus{outline:2px solid var(--gold);outline-offset:2px}
.pg-spin{margin-top:14px;color:var(--gold-2);font-size:.82rem}
.pg-out{margin-top:16px;background:var(--ink);border:1px solid var(--line-d);border-radius:10px;padding:16px;font-size:.8rem;line-height:1.7;white-space:pre-wrap;min-height:20px;color:#cfc4a6}
.pg-out:empty{display:none}
.pg-out .ok{color:var(--ok)}

/* ---------- receipts wall (trimmed) ---------- */
.rwall{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px}
.rcard{background:linear-gradient(180deg,#161512,#111009);border:1px solid var(--gline);border-radius:6px;padding:18px 20px;font-size:.78rem;line-height:1.8;color:#d8d0bd;box-shadow:0 14px 44px rgba(0,0,0,.5);transition:border-color .25s}
.rcard:hover{border-color:var(--gline-hi)}
.rc-top,.rc-bot{display:flex;justify-content:space-between}
.rc-mid{color:var(--mut-d);margin:8px 0;border-top:1px dashed var(--gline);border-bottom:1px dashed var(--gline);padding:8px 0}
.okc{color:var(--ok);font-weight:700}
.noc{color:#e0714a;font-weight:700}
@keyframes vpulse{0%{text-shadow:0 0 0 rgba(74,222,128,0)}45%{text-shadow:0 0 14px rgba(74,222,128,.65)}100%{text-shadow:0 0 0 rgba(74,222,128,0)}}
@keyframes vpulseR{0%{text-shadow:0 0 0 rgba(177,80,46,0)}45%{text-shadow:0 0 14px rgba(177,80,46,.6)}100%{text-shadow:0 0 0 rgba(177,80,46,0)}}
.rwall.in .okc{animation:vpulse 1.1s ease .5s 1}
.rwall.in .noc{animation:vpulseR 1.1s ease .7s 1}
@media (prefers-reduced-motion: reduce){.rwall.in .okc,.rwall.in .noc{animation:none}}
@media(max-width:760px){.rwall{grid-template-columns:1fr}}

/* ---------- terminal ---------- */
.term{margin-top:44px;background:var(--ink-2);border:1px solid var(--line-d);border-radius:var(--rad);padding:24px 26px;font-size:.9rem;line-height:2.1;box-shadow:0 18px 50px rgba(0,0,0,.35)}
.t-dots{display:flex;gap:7px;margin-bottom:14px}
.t-dots i{width:11px;height:11px;border-radius:50%;background:var(--line-d)}
.t-dots i:first-child{background:#b1502e}.t-dots i:nth-child(2){background:var(--gold)}.t-dots i:last-child{background:var(--ok-deep)}
.t-p{color:var(--gold);margin-right:10px}
.t-ok{color:var(--ok);margin-top:6px}
.t-line{overflow-x:auto;white-space:nowrap}
@media(max-width:640px){.term{font-size:.74rem}}

/* ---------- proof grid ---------- */
.grid6{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.pcard{background:var(--ink-2);border:1px solid var(--gline);border-radius:var(--rad);padding:26px 24px;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
.pcard:hover{transform:translateY(-6px);border-color:var(--gline-hi);box-shadow:0 0 40px rgba(212,169,74,.10),0 18px 44px rgba(0,0,0,.5)}
.pcard h3{font-size:1.05rem;line-height:1.35;margin-bottom:10px}
.pcard p{font-size:.88rem;color:var(--mut-d)}
.gld{color:var(--gold-2)}
.stdrow{margin-top:40px;display:flex;gap:26px;flex-wrap:wrap;font-size:.8rem;letter-spacing:.04em;color:var(--mut-d);border-top:1px solid var(--gline);padding-top:22px}
.stdrow a:hover{color:var(--gold-2)}
@media(max-width:900px){.grid6{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.grid6{grid-template-columns:1fr}}

/* ---------- who ---------- */
.who{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px}
.wcard{border:1px solid var(--gline);border-radius:var(--rad);padding:26px 24px;background:var(--ink-2);transition:border-color .25s,transform .25s}
.wcard:hover{border-color:var(--gline-hi);transform:translateY(-3px)}
.wcard h3{font-size:1.04rem;margin-bottom:10px;color:var(--gold-2)}
.wcard p{font-size:.9rem;color:var(--mut-d)}
@media(max-width:900px){.who{grid-template-columns:1fr}}

/* ---------- pricing ---------- */
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px;align-items:stretch}
.plan{background:var(--ink-2);border:1px solid var(--gline);border-radius:var(--rad);padding:30px 26px;display:flex;flex-direction:column;transition:border-color .25s,transform .25s}
.plan:hover{border-color:var(--gline-hi);transform:translateY(-4px)}
.plan-lead{border:1px solid var(--gold);box-shadow:0 0 70px rgba(212,169,74,.14),0 24px 60px rgba(0,0,0,.5);position:relative}
.pl-tag{font-size:.7rem;letter-spacing:.2em;color:var(--gold);margin-bottom:14px}
.pl-price{font-size:2.3rem;font-weight:700}
.pl-price span{font-size:1rem;font-weight:400;color:var(--mut-d)}
.pl-desc{font-size:.92rem;color:var(--mut-d);margin:12px 0 16px}
.pl-list{list-style:none;margin-bottom:22px;flex:1}
.pl-list li{font-size:.87rem;padding:6px 0 6px 24px;position:relative;color:#d8d0bd}
.pl-list li::before{content:"✓";position:absolute;left:0;color:var(--ok-deep);font-weight:700}
.pl-btn{text-align:center}
.pl-note{margin-top:12px;font-size:.72rem;color:var(--mut-d);text-align:center;letter-spacing:.04em}
@media(max-width:900px){.plans{grid-template-columns:1fr}}

/* ---------- faq ---------- */
.faq{margin-top:40px;max-width:760px}
.faq details{border-bottom:1px solid var(--line-d);padding:20px 0}
.faq summary{cursor:pointer;font-weight:500;font-size:1.02rem;list-style:none;display:flex;justify-content:space-between;align-items:center}
.faq summary::after{content:"+";color:var(--gold);font-size:1.3rem;transition:transform .2s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{margin-top:12px;color:var(--mut-d);font-size:.93rem;max-width:640px}

/* ---------- footer ---------- */
footer{border-top:1px solid var(--gline);padding:64px 0 48px;background:var(--ink)}
.f-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px}
.f-tag{margin:16px 0;color:var(--mut-d);font-size:.92rem;line-height:1.7}
.f-co{font-size:.75rem;color:var(--mut-d)}
.f-col{display:flex;flex-direction:column;gap:10px;font-size:.82rem}
.f-col b{color:var(--gold-2);letter-spacing:.12em;font-size:.72rem;margin-bottom:6px}
.f-col a{color:var(--mut-d)}
.f-col a:hover{color:var(--paper)}
@media(max-width:760px){.f-grid{grid-template-columns:1fr}}
</style>

<div id="cursorGlow" aria-hidden="true"></div>
<style>
#cursorGlow{position:fixed;width:520px;height:520px;border-radius:50%;pointer-events:none;z-index:1;left:0;top:0;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(212,169,74,.07),transparent 60%);opacity:0;transition:opacity .5s}
@media (pointer:fine){#cursorGlow{opacity:1}}
.receipt{transform-style:preserve-3d;will-change:transform}
</style>
<script>
// ---------- canvas claim-field ----------
(function(){
  var cv=document.getElementById('claimfield'); if(!cv) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ cv.remove(); return; }
  var cx=cv.getContext('2d'), W,H,dots=[];
  function size(){ W=cv.width=cv.offsetWidth*devicePixelRatio; H=cv.height=cv.offsetHeight*devicePixelRatio; }
  size(); addEventListener('resize', size);
  var N = innerWidth<700?26:54;
  for(var i=0;i<N;i++) dots.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00022,vy:(Math.random()-.5)*.00016,r:Math.random()*1.6+.6,p:0});
  var last=0;
  function tick(t){
    cx.clearRect(0,0,W,H);
    if(t-last>2600){ var d=dots[Math.floor(Math.random()*dots.length)]; d.p=1; last=t; }
    dots.forEach(function(d){
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0||d.x>1) d.vx*=-1; if(d.y<0||d.y>1) d.vy*=-1;
      var X=d.x*W, Y=d.y*H;
      if(d.p>0){
        cx.beginPath(); cx.arc(X,Y,(1-d.p)*26*devicePixelRatio+4,0,7);
        cx.strokeStyle='rgba(74,222,128,'+(d.p*.5)+')'; cx.lineWidth=1.2*devicePixelRatio; cx.stroke();
        d.p-=.012;
      }
      cx.beginPath(); cx.arc(X,Y,d.r*devicePixelRatio,0,7);
      cx.fillStyle = d.p>0 ? 'rgba(74,222,128,.8)' : 'rgba(212,169,74,.5)';
      cx.fill();
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ---------- cursor glow + receipt tilt (desktop) ----------
(function(){
  if(!window.matchMedia('(pointer:fine)').matches) return;
  var g=document.getElementById('cursorGlow');
  addEventListener('mousemove', function(e){ if(g){ g.style.left=e.clientX+'px'; g.style.top=e.clientY+'px'; } });
  var r=document.querySelector('.receipt');
  if(r && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    r.addEventListener('mousemove', function(e){
      var b=r.getBoundingClientRect(), x=(e.clientX-b.left)/b.width-.5, y=(e.clientY-b.top)/b.height-.5;
      r.style.transform='perspective(900px) rotateY('+(x*7)+'deg) rotateX('+(-y*7)+'deg)';
    });
    r.addEventListener('mouseleave', function(){ r.style.transform='perspective(900px) rotateY(0) rotateX(0)'; r.style.transition='transform .5s cubic-bezier(.22,.7,.3,1)'; setTimeout(function(){r.style.transition='';},520); });
  }
})();

// ---------- scroll reveals ----------
(function(){
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in');
      var w=e.target.closest('.loop-wrap'); if(w) w.classList.add('drawn');
      io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  var rw=document.querySelector('.rwall'); if(rw) io.observe(rw);
})();

// ---------- hero receipt: live pipeline ----------
(function(){
  var el = document.getElementById('heroType');
  if(!el) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s){return s}
  var finalHTML =
    '<span class="k">claim:</span> "Invoice #4417 is unpaid"<br>' +
    '<span class="k">source:</span> ledger.acme.co <span class="ok">\u2713</span><br>' +
    '<span class="k">source:</span> stripe.com/invoices <span class="ok">\u2713</span><br>' +
    '<span class="k">adversarial:</span> resilient <span class="ok">\u2713</span><br>' +
    '<span class="k">confidence:</span> 0.91 \u00b7 <span class="k">verdict:</span> <span class="ok">act</span><br>' +
    '<span class="sig">signed \u2014 verify me yourself.</span>';
  if(reduce){ el.innerHTML = finalHTML; el.classList.add('sealed'); return; }
  var steps = [
    {h:'<span class="k">claim:</span> "Invoice #4417 is unpaid"', d:600},
    {h:'<span class="k">source:</span> ledger.acme.co <span class="chk">checking\u2026</span>', d:700},
    {r:'<span class="chk">checking\u2026</span>', w:'<span class="ok">\u2713</span>', d:250},
    {h:'<span class="k">source:</span> stripe.com/invoices <span class="chk">checking\u2026</span>', d:700},
    {r:'<span class="chk">checking\u2026</span>', w:'<span class="ok">\u2713</span>', d:250},
    {h:'<span class="k">adversarial:</span> re-checking under pressure\u2026', d:800},
    {r:'re-checking under pressure\u2026', w:'resilient <span class="ok">\u2713</span>', d:300},
    {conf:true, d:900},
    {h:'<span class="sig">signed \u2014 verify me yourself.</span>', seal:true, d:0}
  ];
  var html=[], i=0;
  function run(){
    if(i>=steps.length) return;
    var s=steps[i]; i++;
    if(s.h){ html.push(s.h); el.innerHTML = html.join('<br>'); }
    else if(s.r){ html[html.length-1] = html[html.length-1].replace(s.r, s.w); el.innerHTML = html.join('<br>'); }
    else if(s.conf){
      html.push('<span class="k">confidence:</span> <span id="confN">0.00</span> \u00b7 <span class="k">verdict:</span> <span id="verd"></span>');
      el.innerHTML = html.join('<br>');
      var n=0, t=setInterval(function(){
        n+=0.07; if(n>=0.91){n=0.91; clearInterval(t);
          var v=document.getElementById('verd'); if(v) v.innerHTML='<span class="ok" style="animation:vpulse 1.1s ease 1">act</span>';
          html[html.length-1]='<span class="k">confidence:</span> 0.91 \u00b7 <span class="k">verdict:</span> <span class="ok">act</span>';
        }
        var c=document.getElementById('confN'); if(c) c.textContent=n.toFixed(2);
      }, 55);
    }
    if(s.seal){ el.closest('.receipt').classList.add('sealed'); }
    setTimeout(run, s.d);
  }
  setTimeout(run, 500);
  // replay when receipt re-enters view after completion
  var rec=document.querySelector('.receipt');
  if(rec && 'IntersectionObserver' in window){
    var seen=false;
    new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ if(seen && i>=steps.length){ html=[];i=0;el.innerHTML='';rec.classList.remove('sealed');setTimeout(run,300);} seen=true; }
      });
    },{threshold:.4}).observe(rec);
  }
})();

// ---------- playground ----------
// PERPLEXITY: transplant the working fetch handler from landing-page-v6-preview.js here VERBATIM
// (element IDs are unchanged: pg-input, pg-btn, pg-spinner, pg-result — the v6 handler ports 1:1).
// ---------- playground ----------
// v6 handler transplanted verbatim (per Claude 2026-07-30 deploy notes).
// Sets window.__AO_PG_WIRED__ = true so the fallback IIFE below stands down.
window.__AO_PG_WIRED__ = true;

// Playground
function loadExample(type) {
  var input = document.getElementById('pg-input');
  var examples = {
    'ai': 'OpenAI acquired Anthropic in 2026. Bitcoin was created by Satoshi Nakamoto. LangGraph leads agent frameworks.',
    'crypto': 'Bitcoin was created by Satoshi Nakamoto in 2009. Ethereum processes over 1 million transactions per day. Solana reached a market cap of $500 billion in 2026.',
    'health': 'Vitamin D deficiency is linked to increased risk of respiratory infections. Drinking 8 glasses of water daily is required for proper hydration. CRISPR gene therapy cured Type 1 diabetes in 2025.',
    'mixed': 'The x402 protocol was created by Coinbase for agent micropayments. AgentOracle was founded in 2019 in New York. Base network processes 75% of all x402 transactions. Exa raised $85 million in their Series B.'
  };
  if (input) input.value = examples[type] || '';
}

// Silent warmup — ping /health on page load to wake the edge function
fetch('https://agentoracle.co/health', { mode: 'cors' }).catch(function(){});

async function runEvaluation() {
  var input = document.getElementById('pg-input');
  var btn = document.getElementById('pg-btn');
  var spinner = document.getElementById('pg-spinner');
  var result = document.getElementById('pg-result');
  var text = input ? input.value.trim() : '';
  if (!text) return;
  btn.disabled = true;
  if (spinner) { spinner.hidden = false; spinner.style.display = 'block'; }
  var btnText = btn.querySelector('.playground__run-text');
  if (btnText) btnText.style.display = 'none';
  result.className = 'playground__result active mono pg-out';
  var startTime = Date.now();

  // Staged pipeline progress
  var stages = [
    { name: 'Decompose', start: 0, end: 2500 },
    { name: 'Model A', start: 2500, end: 6000 },
    { name: 'Model B', start: 2700, end: 7000 },
    { name: 'Adversarial', start: 2900, end: 8500 },
    { name: 'Cross-check', start: 8500, end: 11000 }
  ];
  function renderPipeline() {
    var elapsed = Date.now() - startTime;
    var html = '<div style="font-family:var(--font-mono);font-size:12px;padding:16px;background:var(--surface,#1a1712);border-radius:10px;border:1px solid var(--border,#2a251c);">';
    html += '<div style="margin-bottom:10px;color:var(--text-muted,#9c8f74);font-size:10px;letter-spacing:0.1em;">VERIFICATION PIPELINE</div>';
    stages.forEach(function(s) {
      var dot, color, label;
      if (elapsed < s.start) { dot = '\u25CB'; color = 'var(--text-faint,#6b5f47)'; label = 'waiting'; }
      else if (elapsed < s.end) { dot = '\u25CF'; color = 'var(--gold,#d4a94a)'; label = 'running'; }
      else { dot = '\u2713'; color = 'var(--green,#4ADE80)'; label = 'done'; }
      html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;color:' + color + ';">';
      html += '<span style="font-size:14px;width:18px;text-align:center;">' + dot + '</span>';
      html += '<span style="flex:1;">' + s.name + '</span>';
      html += '<span style="font-size:10px;opacity:0.6;">' + label + '</span>';
      html += '</div>';
    });
    var secs = (elapsed / 1000).toFixed(1);
    html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border,#2a251c);color:var(--gold,#d4a94a);font-size:11px;">' + secs + 's elapsed</div>';
    html += '</div>';
    result.innerHTML = html;
  }
  renderPipeline();
  var timerInterval = setInterval(renderPipeline, 80);
  try {
    var resp = await fetch('https://agentoracle.co/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, source: 'playground', min_confidence: 0.8 })
    });
    clearInterval(timerInterval);
    var totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    var data = await resp.json();
    var ev = data.evaluation;
    if (!ev) { result.innerHTML = '<div style="color:var(--red,#EF4444);font-family:var(--font-mono);font-size:13px;padding:1rem;">Error: ' + (data.error || 'Unknown error') + '</div>'; btn.disabled=false; if(spinner){spinner.hidden=true;spinner.style.display='none';} return; }
    var scoreColor = ev.overall_confidence >= 0.8 ? 'var(--green,#4ADE80)' : ev.overall_confidence >= 0.5 ? 'var(--amber,#F59E0B)' : 'var(--red,#EF4444)';
    var recClass = ev.recommendation === 'act' ? 'act' : ev.recommendation === 'reject' ? 'reject' : 'verify';
    var html = '<div class="playground__overall" style="display:flex;gap:16px;align-items:center;padding:12px;background:rgba(212,169,74,0.06);border:1px solid rgba(212,169,74,0.18);border-radius:10px;margin-bottom:10px;"><div class="playground__score" style="color:' + scoreColor + ';font-size:32px;font-weight:700;">' + ev.overall_confidence + '</div><div><span class="playground__rec playground__rec--' + recClass + '" style="font-family:var(--font-mono);font-size:12px;font-weight:700;letter-spacing:0.1em;color:' + scoreColor + ';">' + ev.recommendation.toUpperCase() + '</span><div style="font-size:12px;color:var(--text-muted,#9c8f74);margin-top:6px;font-family:var(--font-mono);">' + ev.total_claims + ' claims &middot; ' + ev.verified_claims + ' supported &middot; ' + ev.refuted_claims + ' refuted &middot; ' + totalTime + 's</div></div></div>';
    (ev.claims || []).forEach(function(c) {
      var vColor = c.verdict === 'supported' ? 'var(--green,#4ADE80)' : c.verdict === 'refuted' ? 'var(--red,#EF4444)' : 'var(--amber,#F59E0B)';
      var vIcon = c.verdict === 'supported' ? '&#10003;' : c.verdict === 'refuted' ? '&#10007;' : '?';
      html += '<div class="playground__claim playground__claim--' + c.verdict + '" style="padding:10px;margin:6px 0;background:rgba(255,255,255,0.02);border-radius:8px;border-left:2px solid ' + vColor + ';">';
      html += '<div class="playground__verdict" style="color:' + vColor + ';font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.08em;">' + vIcon + ' ' + c.verdict.toUpperCase() + ' (' + c.confidence + ')</div>';
      html += '<div class="playground__claim-text" style="margin-top:6px;font-size:13px;line-height:1.4;">' + c.claim + '</div>';
      if (c.evidence) html += '<div style="font-size:12px;color:var(--text-muted,#9c8f74);margin-top:6px;padding:8px;background:rgba(255,255,255,0.02);border-radius:6px;line-height:1.5;">' + c.evidence + '</div>';
      if (c.correction) html += '<div style="font-size:12px;color:var(--amber,#F59E0B);margin-top:4px;padding:8px;background:rgba(245,158,11,0.05);border-radius:6px;border-left:2px solid var(--amber,#F59E0B);">Correction: ' + c.correction + '</div>';
      if (c.sources_used) html += '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">' + c.sources_used.map(function(s) { return '<span style="font-family:var(--font-mono);font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(212,169,74,0.08);border:1px solid rgba(212,169,74,0.15);color:var(--gold,#d4a94a);">' + s + '</span>'; }).join('') + '</div>';
      html += '</div>';
    });
    html += '<div style="text-align:center;margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border,#2a251c);font-family:var(--font-mono);font-size:10px;color:var(--text-faint,#6b5f47);line-height:1.8;">Verified in ' + totalTime + 's &middot; ID: ' + data.evaluation_id + '<br>0.00\u20130.49 <span style="color:#EF4444;">REJECT</span> &middot; 0.50\u20130.79 <span style="color:#F59E0B;">VERIFY</span> &middot; 0.80\u20131.00 <span style="color:#4ADE80;">ACT</span></div>';
    result.innerHTML = html;
  } catch(err) {
    clearInterval(timerInterval);
    result.innerHTML = '<div style="color:var(--red,#EF4444);font-family:var(--font-mono);font-size:13px;padding:1rem;">Request failed: ' + err.message + '</div>';
  }
  btn.disabled = false;
  if (spinner) { spinner.hidden = true; spinner.style.display = 'none'; }
  if (btnText) btnText.style.display = '';
}

// v7 button has no inline onclick — wire the click listener explicitly
document.getElementById('pg-btn') && document.getElementById('pg-btn').addEventListener('click', runEvaluation);

// The block below is a safe fallback so the page never renders broken if the transplant is missed.
(function(){
  document.querySelectorAll('.chip').forEach(function(c){
    c.addEventListener('click', function(){
      var i=document.getElementById('pg-input'); if(i){ i.value=c.getAttribute('data-claim'); }
      var b=document.getElementById('pg-btn'); if(b){ b.click(); }
    });
  });
})();
(function(){
  var btn=document.getElementById('pg-btn'), inp=document.getElementById('pg-input'),
      out=document.getElementById('pg-result'), spin=document.getElementById('pg-spinner');
  if(!btn) return;
  if(window.__AO_PG_WIRED__) return; // v6 handler sets this flag if transplanted above
  btn.addEventListener('click', function(){
    spin.hidden=false; out.textContent='';
    setTimeout(function(){
      spin.hidden=true;
      out.innerHTML='<span class="ok">✓ demo receipt</span>\\n' +
        'claim:    "'+ (inp.value||'').replace(/[<>&]/g,'') + '"\\n' +
        'verdict:  act · confidence 0.89\\n' +
        'sources:  2 checked, 2 sealed\\n' +
        'signed:   ed25519 · verifies offline against /.well-known/jwks.json\\n' +
        '\\nGet a key to run this against the live engine →';
    }, 900);
  });
})();
</script>
</body>
</html>`;
