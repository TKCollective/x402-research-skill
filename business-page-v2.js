// /business — pilot inquiry page for content teams, regulated industries, agencies
export const BUSINESS_PAGE_V2_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgentOracle for Business — Verification for AI-generated content</title>
<meta name="description" content="Pre-publication AI verification with cryptographic receipts. 60-day money-back pilots from $1,000 for content agencies, regulated industries, and brand teams.">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://agentoracle.co/business">
<meta property="og:title" content="AgentOracle for Business">
<meta property="og:description" content="Pre-publication AI verification with cryptographic receipts. 60-day money-back pilots from $1,000.">
<meta property="og:image" content="https://agentoracle.co/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AgentOracle_AI">
<meta name="twitter:creator" content="@AgentOracle_AI">

<link rel="icon" type="image/png" href="/assets/ao-logo-v8.png">
<link rel="apple-touch-icon" href="/assets/ao-logo-v8.png">
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="canonical" href="https://agentoracle.co/business">

<style>
:root {
  --bg: #0a0a08;
  --surface: #141310;
  --surface-alt: #17150f;
  --border: rgba(212,169,74,.16);
  --border-hover: rgba(212,169,74,.45);
  --text: #f4eee0;
  --text-muted: #a49a82;
  --text-faint: #6e6558;
  --gold: #D4A94A;
  --gold-bright: #E6BC55;
  --gold-dim: #B89230;
  --green: #22c55e;
  --font-sans: 'Satoshi', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans); background: var(--bg); color: var(--text);
  font-size: 16px; line-height: 1.65; min-height: 100vh; overflow-x: hidden;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  letter-spacing: -0.005em;
}
@media (max-width: 720px) { body { font-size: 15.5px; line-height: 1.6; } }
a { color: var(--gold); text-decoration: none; }
a:hover { color: var(--gold-bright); }

.container { max-width: 1080px; margin: 0 auto; padding: 0 32px; }
@media (max-width: 720px) { .container { padding: 0 20px; } }

/* Header */
.header { padding: 24px 0; border-bottom: 1px solid var(--border); }
.header__inner { display: flex; align-items: center; justify-content: space-between; }
.header__brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; color: var(--text); }
.header__brand-logo { width: 28px; height: 28px; }
.header__brand-mark { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: var(--gold); color: #0A0A08; font-weight: 800; font-size: 11px; border-radius: 6px; letter-spacing: 0.04em; }
.header__back { font-family: var(--font-mono); font-size: 13px; color: var(--text-muted); }
.header__back:hover { color: var(--gold); }

/* Hero */
.b-hero { padding: 112px 0 80px; }
@media (max-width: 720px) { .b-hero { padding: 72px 0 56px; } }
.b-hero__eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase;
  margin-bottom: 18px; padding: 4px 10px;
  background: rgba(201,169,110,.06); border: 1px solid rgba(201,169,110,.2); border-radius: 4px;
}
.b-hero__eyebrow::before { content:''; width:5px; height:5px; border-radius:50%; background: var(--gold); }
.b-hero__title { font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 24px; max-width: 880px; }
.b-hero__title-gold { color: var(--gold); }
.b-hero__sub { font-size: 19px; color: var(--text-muted); max-width: 700px; line-height: 1.65; margin-bottom: 40px; letter-spacing: -0.005em; }
@media (max-width: 720px) { .b-hero__sub { font-size: 17px; line-height: 1.6; } }
.b-hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 26px; border-radius: 8px;
  font-size: 15px; font-weight: 600;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid transparent;
}
.btn--primary { background: var(--gold); color: #0A0A08; }
.btn--primary:hover { background: var(--gold-bright); transform: translateY(-1px); color: #0A0A08; }
.btn--secondary { color: var(--text); border-color: var(--border); background: transparent; }
.btn--secondary:hover { border-color: var(--gold); color: var(--gold); }

/* Section base */
.section { padding: 96px 0; border-top: 1px solid var(--border); }
@media (max-width: 720px) { .section { padding: 72px 0; } }
.section__eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 14px; }
.section__title { font-size: clamp(1.7rem, 3.4vw, 2.4rem); font-weight: 800; letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 20px; max-width: 760px; }
.section__lead { font-size: 17px; color: var(--text-muted); line-height: 1.7; max-width: 680px; margin-bottom: 48px; letter-spacing: -0.005em; }

/* WHO / use cases */
.use-cases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 32px; }
@media (max-width: 920px) { .use-cases { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .use-cases { grid-template-columns: 1fr; } }
.use-card { padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; transition: border-color .2s, transform .2s, box-shadow .2s; }
.use-card:hover { border-color: var(--border-hover); transform: translateY(-3px); box-shadow: 0 8px 32px -12px rgba(212,169,74,.18); }
.use-card:hover { border-color: rgba(201,169,110,0.3); transform: translateY(-2px); }
.use-card__role { font-size: 16px; font-weight: 700; color: var(--gold); margin-bottom: 10px; letter-spacing: -0.01em; }
.use-card__pain { font-size: 12.5px; color: var(--text-faint); font-family: var(--font-mono); margin-bottom: 14px; letter-spacing: 0.02em; }
.use-card p { font-size: 15.5px; color: var(--text-muted); line-height: 1.65; }

/* Pricing / pilot tiers */
.tiers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px; }
@media (max-width: 1180px) { .tiers { grid-template-columns: 1fr 1fr; } }
@media (max-width: 720px)  { .tiers { grid-template-columns: 1fr; } }
.tier { padding: 22px; }
.tier__price { font-size: 24px; }
.tier { padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 16px; transition: border-color .2s, transform .2s, box-shadow .2s; }
.tier:hover { border-color: var(--border-hover); transform: translateY(-3px); box-shadow: 0 8px 32px -12px rgba(212,169,74,.18); }
.tier--featured { border-color: rgba(201,169,110,0.4); background: linear-gradient(180deg, rgba(201,169,110,0.04), rgba(201,169,110,0.01)); }
.tier__name { font-size: 13px; font-weight: 700; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; }
.tier__price { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
.tier__price-unit { font-size: 14px; font-weight: 500; color: var(--text-muted); }
.tier__desc { font-size: 14px; color: var(--text-muted); line-height: 1.55; }
.tier__features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.tier__features li { font-size: 14.5px; color: var(--text); padding-left: 22px; position: relative; line-height: 1.55; }
.tier__features li::before { content: '\u2713'; position: absolute; left: 0; top: 0; color: var(--gold); font-weight: 700; }
.tier__cta { margin-top: auto; padding-top: 12px; }

/* How it works */
.steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 32px; }
@media (max-width: 920px) { .steps { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .steps { grid-template-columns: 1fr; } }
.step { padding: 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; transition: border-color .2s, transform .2s; }
.step:hover { border-color: var(--border-hover); transform: translateY(-2px); }
.step__num { font-family: var(--font-mono); font-size: 11px; color: var(--gold); font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px; }
.step__title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -0.005em; }
.step p { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

/* Trust strip — proof of work (credentials grid) */
.proof { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
@media (max-width: 960px) { .proof { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .proof { grid-template-columns: 1fr; } }
.proof-card { padding: 22px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; display: flex; flex-direction: column; gap: 8px; text-decoration: none; color: inherit; transition: border-color 0.2s, transform 0.2s, box-shadow .2s; }
.proof-card:hover { border-color: var(--border-hover); transform: translateY(-3px); box-shadow: 0 8px 32px -12px rgba(212,169,74,.18); }
.proof-card:hover { border-color: rgba(201,169,110,0.5); transform: translateY(-2px); }
.proof-card__label { font-size: 10.5px; color: var(--gold); font-family: var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; }
.proof-card__title { font-size: 15px; color: var(--text); font-weight: 700; letter-spacing: -0.01em; line-height: 1.35; margin-top: 2px; }
.proof-card__desc { font-size: 13px; color: var(--text-muted); line-height: 1.55; margin-top: 4px; flex-grow: 1; }
.proof-card__arrow { font-size: 12px; color: var(--gold-dim); font-family: var(--font-mono); margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(201,169,110,0.12); letter-spacing: 0.01em; }
.proof-card:hover .proof-card__arrow { color: var(--gold); }

/* Compliance strip */
.compliance { background: var(--surface); padding: 48px 32px; border-radius: 12px; border: 1px solid var(--border); margin-top: 32px; }
.compliance h3 { font-size: 18px; font-weight: 700; color: var(--gold); margin-bottom: 16px; }
.compliance ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 720px) { .compliance ul { grid-template-columns: 1fr; } }
.compliance li { font-size: 14.5px; color: var(--text-muted); padding-left: 22px; position: relative; line-height: 1.6; }
.compliance li::before { content: '\u2192'; position: absolute; left: 0; color: var(--gold); }
.compliance li strong { color: var(--text); }

/* Contact */
.contact-cta { padding: 64px 32px; text-align: center; background: linear-gradient(180deg, rgba(201,169,110,0.06), rgba(201,169,110,0.02)); border: 1px solid rgba(201,169,110,0.2); border-radius: 16px; margin: 64px 0 80px; }
.contact-cta h2 { font-size: clamp(1.6rem, 3.4vw, 2rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 12px; }
.contact-cta p { font-size: 17px; color: var(--text-muted); max-width: 580px; margin: 0 auto 32px; line-height: 1.65; letter-spacing: -0.005em; }

/* Footer */
.footer { border-top: 1px solid var(--border); padding: 32px 0; font-family: var(--font-mono); font-size: 12px; color: var(--text-faint); }
.footer__inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.footer a { color: var(--text-muted); }
.footer a:hover { color: var(--gold); }

</style>
</head>
<body>

<header class="header">
  <div class="container header__inner">
    <a href="/" class="header__brand">
      <span class="header__brand-mark">AO</span>
      AgentOracle
    </a>
    <nav class="header__nav" style="display:flex;gap:22px;align-items:center;font-size:14px;">
      <a href="/#how-it-works" style="color:var(--text-muted);text-decoration:none;">The loop</a>
      <a href="/#proof" style="color:var(--text-muted);text-decoration:none;">Proof</a>
      <a href="/#pricing" style="color:var(--text-muted);text-decoration:none;">Pricing</a>
      <a href="/whitepaper" style="color:var(--text-muted);text-decoration:none;">Whitepaper</a>
      <a href="/changelog" style="color:var(--text-muted);text-decoration:none;">Changelog</a>
    </nav>
  </div>
</header>

<section class="b-hero">
  <div class="container">
    <span class="b-hero__eyebrow">For Business</span>
    <h1 class="b-hero__title">Content AI optimizes what agents <span class="b-hero__title-gold">read</span>. AgentOracle verifies what agents <span class="b-hero__title-gold">do</span>.</h1>
    <p class="b-hero__sub">Enterprise content platforms make your content easier for AI agents to consume. AgentOracle does the opposite: we verify the claims your AI agents are about to act on, before they act. Pre-action fact-checking with a cryptographic receipt your legal team can audit. Anyone can verify it offline in Node, Python, or the browser \u2014 no AgentOracle service required.</p>
    <div class="b-hero__ctas">
      <a data-email="joe@agentoracle.co" href="mailto:joe@agentoracle.co?subject=AgentOracle%20pilot%20inquiry&body=Hi%20\u2014%20I%E2%80%99m%20interested%20in%20a%20pilot.%0A%0AAbout%20us:%20%5Bcompany%5D%0AUse%20case:%20%5Bbrief%20description%5D%0AVolume:%20%5Bestimated%20queries%2Fmonth%5D" class="btn btn--primary cta-mail">Start a pilot conversation \u2192</a>
      <a href="/" class="btn btn--secondary">See the developer side</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__eyebrow">who buys this</div>
    <h2 class="section__title">Three teams already feel this pain.</h2>
    <p class="section__lead">If your team publishes AI-generated content at any scale, one wrong claim is a brand crisis or a compliance violation. AgentOracle is the pre-publication checkpoint with a signed audit trail.</p>
    <div class="use-cases">
      <div class="use-card">
        <div class="use-card__role">Content Agencies</div>
        <div class="use-card__pain">Pain: one bad campaign claim = client loss</div>
        <p>Generate at scale, verify before send. Hand the brand a signed audit trail proving every claim was checked. Pricing scales with your output, not their team size.</p>
      </div>
      <div class="use-card">
        <div class="use-card__role">Regulated Industries</div>
        <div class="use-card__pain">Pain: EU AI Act, NIST RMF, SEC, FDA disclosures</div>
        <p>Financial services, healthcare, insurance, pharma. AI-generated copy with regulatory implications needs a cryptographic record proving verification before publication. Receipts are tamper-evident and replayable for audit.</p>
      </div>
      <div class="use-card">
        <div class="use-card__role">Enterprise Brand Teams</div>
        <div class="use-card__pain">Pain: AI claim shows up in a press release</div>
        <p>Plug AgentOracle into your approval workflow. Marketing draft \u2192 verification check \u2192 receipt attached \u2192 legal sign-off. No manual fact-check team. No screenshot evidence. Just a signed JWS.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__eyebrow">how it works</div>
    <h2 class="section__title">Five steps from claim to signed audit trail.</h2>
    <div class="steps">
      <div class="step">
        <div class="step__num">01</div>
        <div class="step__title">Submit</div>
        <p>Send a claim or document to /evaluate via API or MCP.</p>
      </div>
      <div class="step">
        <div class="step__num">02</div>
        <div class="step__title">Verify</div>
        <p>Four independent sources check the claim in parallel.</p>
      </div>
      <div class="step">
        <div class="step__num">03</div>
        <div class="step__title">Score</div>
        <p>Per-claim confidence with sources and adversarial test result.</p>
      </div>
      <div class="step">
        <div class="step__num">04</div>
        <div class="step__title">Sign</div>
        <p>Response signed with our Ed25519 key. Public JWKS for verifiers.</p>
      </div>
      <div class="step">
        <div class="step__num">05</div>
        <div class="step__title">Audit</div>
        <p>Store the receipt. Replay the verification any time. Hand to legal.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__eyebrow">pricing</div>
    <h2 class="section__title">Four tiers. Plain.</h2>
    <p class="section__lead">No procurement gymnastics, no annual contracts, no per-seat counting. Pay for what you verify.</p>
    <div class="tiers">
      <div class="tier">
        <span class="tier__name">Developer</span>
        <div>
          <span class="tier__price">$99</span>
          <span class="tier__price-unit">/ month</span>
        </div>
        <p class="tier__desc">Self-serve API key at checkout. 2,000 verifications a month, signed receipts, cancel anytime. Priced for individual builders and small teams.</p>
        <ul class="tier__features">
          <li>2,000 verifications / month included</li>
          <li>API key issued at checkout \u2014 live in minutes</li>
          <li>Same signed receipts as enterprise tiers</li>
          <li>Verify offline: <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--gold);font-size:12.5px;">pip install agentoracle-receipt-verify</code></li>
          <li>Public JWKS, public spec, public benchmark</li>
        </ul>
        <div class="tier__cta">
          <a href="/#pricing" class="btn btn--secondary" style="font-size:14px;">See self-serve \u2192</a>
        </div>
      </div>
      <div class="tier">
        <span class="tier__name">Business Pilot</span>
        <div>
          <span class="tier__price">$1,000</span>
          <span class="tier__price-unit">/ 60 days, money-back</span>
        </div>
        <p class="tier__desc">60-day money-back pilot. Prove the audit trail on your real content before committing to a monthly line item.</p>
        <ul class="tier__features">
          <li>10,000 verifications total ($0.10 each)</li>
          <li>Custom dashboard with audit log export</li>
          <li>Async Slack/email support</li>
          <li>Receipt format customization</li>
          <li>Priority queue, &lt;5s p95 latency</li>
          <li>Money-back if you cancel before day 60</li>
        </ul>
        <div class="tier__cta">
          <a data-email="joe@agentoracle.co" href="mailto:joe@agentoracle.co?subject=AgentOracle%20Business%20Pilot" class="btn btn--secondary cta-mail" style="font-size:14px;">Start a pilot \u2192</a>
        </div>
      </div>
      <div class="tier tier--featured">
        <span class="tier__name">Continuation</span>
        <div>
          <span class="tier__price">$2,500</span>
          <span class="tier__price-unit">/ month</span>
        </div>
        <p class="tier__desc">Ongoing monthly plan after the pilot. Same $0.10 per verification, no annual lock-in, cancel any month.</p>
        <ul class="tier__features">
          <li>25,000 verifications / month included</li>
          <li>Overage at $0.10 / verification</li>
          <li>Custom dashboard + audit log export</li>
          <li>Async Slack/email support</li>
          <li>Priority queue, &lt;5s p95 latency</li>
          <li>Month-to-month, cancel any time</li>
        </ul>
        <div class="tier__cta">
          <a data-email="joe@agentoracle.co" href="mailto:joe@agentoracle.co?subject=AgentOracle%20Continuation%20Plan" class="btn btn--primary cta-mail" style="font-size:14px;">Talk to us \u2192</a>
        </div>
      </div>
      <div class="tier">
        <span class="tier__name">Enterprise</span>
        <div>
          <span class="tier__price">Custom</span>
        </div>
        <p class="tier__desc">High volume, custom SLA, dedicated signing key (kid) for receipts, on-prem deployment options.</p>
        <ul class="tier__features">
          <li>Unlimited verifications</li>
          <li>Dedicated signing key (your kid value in JWKS)</li>
          <li>SLA guarantees and 99.9%+ uptime</li>
          <li>Compliance review support (EU AI Act Article 12, NIST AI RMF, SOC 2 on roadmap)</li>
          <li>Annual contract, MSA, security review</li>
          <li>Engineering response time guarantees</li>
        </ul>
        <div class="tier__cta">
          <a data-email="joe@agentoracle.co" href="mailto:joe@agentoracle.co?subject=AgentOracle%20Enterprise" class="btn btn--secondary cta-mail" style="font-size:14px;">Talk to us \u2192</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__eyebrow">why we are different</div>
    <h2 class="section__title">Cryptographic proof, not vendor claims.</h2>
    <div class="proof">
      <a class="proof-card" href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/" target="_blank" rel="noopener">
        <span class="proof-card__label">IETF Internet-Draft \u2014 Filed</span>
        <span class="proof-card__title">draft-krausz-verification-state-01</span>
        <span class="proof-card__desc">Filed June 6, 2026 \u00b7 -01 published June 12, 2026 \u00b7 17 pages \u00b7 individual submission on the IETF datatracker \u00b7 8 RFC references \u00b7 sibling to environment-state family.</span>
        <span class="proof-card__arrow">View on datatracker \u2192</span>
      </a>
      <a class="proof-card" href="https://github.com/TKCollective/agentoracle-receipt-spec/tree/v0.3-binary-halt" target="_blank" rel="noopener">
        <span class="proof-card__label">Public Receipt Spec v0.3</span>
        <span class="proof-card__title">agentoracle-receipt-spec</span>
        <span class="proof-card__desc">Binary-halt gate \u00b7 canonical/derived/version-bound mapping \u00b7 2 ADRs \u00b7 content-addressed via v_gate_mapping_hash \u00b7 MIT licensed.</span>
        <span class="proof-card__arrow">View on GitHub \u2192</span>
      </a>
      <a class="proof-card" href="https://github.com/TKCollective/agentoracle-receipt-verify" target="_blank" rel="noopener">
        <span class="proof-card__label">Reference Verifier</span>
        <span class="proof-card__title">agentoracle-receipt-verify</span>
        <span class="proof-card__desc">TypeScript JWS verifier \u00b7 offline verification of any v0.3 receipt \u00b7 no facilitator dependency \u00b7 MIT licensed.</span>
        <span class="proof-card__arrow">View on GitHub \u2192</span>
      </a>
      <a class="proof-card" href="https://github.com/TKCollective/agentoracle-benchmark" target="_blank" rel="noopener">
        <span class="proof-card__label">AVeriTeC 2024 Benchmark</span>
        <span class="proof-card__title">agentoracle-benchmark v0.1</span>
        <span class="proof-card__desc">57.6% overall \u00b7 57.7% held-out (vs ~30% paper baseline) \u00b7 open methodology \u00b7 open submissions \u00b7 MIT licensed.</span>
        <span class="proof-card__arrow">View results \u2192</span>
      </a>
      <a class="proof-card" href="https://agenttrust.uk" target="_blank" rel="noopener">
        <span class="proof-card__label">Peer-Audited</span>
        <span class="proof-card__title">AgentTrust \u00b7 VERIFIED 100</span>
        <span class="proof-card__desc">Independent third-party audit \u00b7 listed in verified-providers section \u00b7 audited June 2026 \u00b7 gold badge.</span>
        <span class="proof-card__arrow">View at agenttrust.uk \u2192</span>
      </a>
      <a class="proof-card" href="https://agentic.market" target="_blank" rel="noopener">
        <span class="proof-card__label">Coinbase Bazaar \u2014 Indexed</span>
        <span class="proof-card__title">Live merchant since 2026-05-26</span>
        <span class="proof-card__desc">Listed on Coinbase Bazaar discovery \u00b7 public engagement on x402-foundation repo (issues #2207, #2549, #2557) \u00b7 our spec contributions on the public record.</span>
        <span class="proof-card__arrow">View on Bazaar \u2192</span>
      </a>
    </div>
    <div class="compliance">
      <h3>Built for the regulations coming next</h3>
      <ul>
        <li><strong>EU AI Act Article 12.</strong> Record-keeping for Annex III high-risk systems (applies from Dec 2, 2027 under the Digital Omnibus deferral). Cryptographic receipts are tamper-evident and replayable.</li>
        <li><strong>NIST AI RMF Measurement.</strong> Per-claim confidence + provenance + source attribution.</li>
        <li><strong>SOC 2 Type II.</strong> On roadmap, scoped with the Enterprise tier rollout.</li>
        <li><strong>Public JWKS.</strong> Any auditor can verify our receipts without trusting us. RFC 7515 / 7517 / 8037.</li>
      </ul>
    </div>
  </div>
</section>

<div class="container">
  <div class="contact-cta">
    <h2>Ready to talk?</h2>
    <p>Tell us your use case in 3 sentences. We\u2019ll come back same-day with a yes/no on fit, a sample receipt against your content, and a pilot scope.</p>
    <a data-email="joe@agentoracle.co" href="mailto:joe@agentoracle.co?subject=AgentOracle%20pilot%20inquiry&body=About%20us:%20%5Bcompany%5D%0AUse%20case:%20%5Bbrief%20description%5D%0AVolume:%20%5Bestimated%20queries%2Fmonth%5D" class="btn btn--primary cta-mail">joe@agentoracle.co</a>
  </div>
</div>

<footer class="footer">
  <div class="container footer__inner">
    <div>\u00a9 2026 TKCollective LLC \u00b7 AgentOracle</div>
    <div>
      <a href="/">Home</a> \u00b7 <a href="/#receipts">Verify our verifier \u2192</a> \u00b7 <a href="/privacy">Privacy</a> \u00b7 <a href="https://github.com/x402-foundation/x402/issues/2207" target="_blank" rel="noopener">x402 #2207</a> \u00b7 <a href="https://github.com/TKCollective/agentoracle-receipt-spec" target="_blank" rel="noopener">Receipt Spec</a>
    </div>
  </div>
</footer>

<script>
(function(){
  const ORIG = new WeakMap();
  function copy(text){
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    } catch(e){}
    return new Promise(function(r){ 
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch(e){}
      document.body.removeChild(ta); r();
    });
  }
  document.addEventListener("click", function(e){
    const a = e.target.closest("a.cta-mail");
    if (!a) return;
    const email = a.getAttribute("data-email") || "joe@agentoracle.co";
    // let default mailto fire; also copy in parallel
    copy(email);
    if (!ORIG.has(a)) ORIG.set(a, a.innerHTML);
    a.innerHTML = "\u2713 " + email + " copied";
    setTimeout(function(){
      const orig = ORIG.get(a); if (orig) a.innerHTML = orig;
    }, 2500);
  }, {passive:true});
})();
</script>
</body>
</html>`;
