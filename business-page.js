// /business — pilot inquiry page for content teams, regulated industries, agencies
export const BUSINESS_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgentOracle for Business — Verification for AI-generated content</title>
<meta name="description" content="Pre-publication AI verification with cryptographic receipts. Pilot pricing for content agencies, regulated industries, and brand teams. $2,500/month.">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://agentoracle.co/business">
<meta property="og:title" content="AgentOracle for Business">
<meta property="og:description" content="Pre-publication AI verification with cryptographic receipts. Pilot pricing $2,500/month.">
<meta property="og:image" content="https://agentoracle.co/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AgentOracle_AI">
<meta name="twitter:creator" content="@AgentOracle_AI">

<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="canonical" href="https://agentoracle.co/business">

<style>
:root {
  --bg: #050504;
  --surface: #0E0D0B;
  --border: #1E1B16;
  --text: #F4F1EA;
  --text-muted: #A8A496;
  --text-faint: #6E6A60;
  --gold: #D4A437;
  --gold-bright: #E6BC55;
  --gold-dim: #B89230;
  --green: #22c55e;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', system-ui, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
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
.use-card { padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; transition: border-color .2s, transform .2s; }
.use-card:hover { border-color: rgba(201,169,110,0.3); transform: translateY(-2px); }
.use-card__role { font-size: 16px; font-weight: 700; color: var(--gold); margin-bottom: 10px; letter-spacing: -0.01em; }
.use-card__pain { font-size: 12.5px; color: var(--text-faint); font-family: var(--font-mono); margin-bottom: 14px; letter-spacing: 0.02em; }
.use-card p { font-size: 15.5px; color: var(--text-muted); line-height: 1.65; }

/* Pricing / pilot tiers */
.tiers { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 32px; }
@media (max-width: 920px) { .tiers { grid-template-columns: 1fr; } }
.tier { padding: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 16px; }
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
.step { padding: 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; }
.step__num { font-family: var(--font-mono); font-size: 11px; color: var(--gold); font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px; }
.step__title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -0.005em; }
.step p { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

/* Trust strip — proof */
.proof { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px; }
@media (max-width: 720px) { .proof { grid-template-columns: 1fr; } }
.proof-card { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; }
.proof-card__quote { font-size: 17px; line-height: 1.65; color: var(--text); font-style: italic; margin-bottom: 16px; letter-spacing: -0.005em; }
.proof-card__cite { font-size: 14px; color: var(--text-muted); line-height: 1.55; }
.proof-card__cite strong { color: var(--gold); font-weight: 700; }

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
    <a href="/" class="header__back">\u2190 Back to main site</a>
  </div>
</header>

<section class="b-hero">
  <div class="container">
    <span class="b-hero__eyebrow">For Business</span>
    <h1 class="b-hero__title">Verify AI-generated content <span class="b-hero__title-gold">before</span> it ships.</h1>
    <p class="b-hero__sub">Pre-publication fact-checking for AI-generated copy, with a cryptographic receipt your legal team can audit. Built for content agencies, regulated industries, and brand teams who can\u2019t afford a hallucination in production.</p>
    <div class="b-hero__ctas">
      <a href="mailto:joe@agentoracle.co?subject=AgentOracle%20pilot%20inquiry&body=Hi%20\u2014%20I%E2%80%99m%20interested%20in%20a%20pilot.%0A%0AAbout%20us:%20%5Bcompany%5D%0AUse%20case:%20%5Bbrief%20description%5D%0AVolume:%20%5Bestimated%20queries%2Fmonth%5D" class="btn btn--primary">Start a pilot conversation \u2192</a>
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
    <div class="section__eyebrow">pilot pricing</div>
    <h2 class="section__title">Three tiers. Plain.</h2>
    <p class="section__lead">No procurement gymnastics, no annual contracts, no per-seat counting. Pay for what you verify.</p>
    <div class="tiers">
      <div class="tier">
        <span class="tier__name">Developer</span>
        <div>
          <span class="tier__price">$0.02</span>
          <span class="tier__price-unit">/ query</span>
        </div>
        <p class="tier__desc">Pay-per-call x402 API. No signup, no API key, no monthly minimum. Settle in USDC on Base.</p>
        <ul class="tier__features">
          <li>POST /research, /deep-research, /research/batch</li>
          <li>Same JWS receipt as enterprise tier</li>
          <li>Public JWKS, public spec, public benchmark</li>
          <li>MCP-native (npm + langchain-agentoracle)</li>
        </ul>
        <div class="tier__cta">
          <a href="/" class="btn btn--secondary" style="font-size:14px;">View dev docs \u2192</a>
        </div>
      </div>
      <div class="tier tier--featured">
        <span class="tier__name">Business Pilot</span>
        <div>
          <span class="tier__price">$2,500</span>
          <span class="tier__price-unit">/ month</span>
        </div>
        <p class="tier__desc">Up to 50K verifications/month, custom dashboard, async Slack channel, NET-30 invoicing. Most popular for content agencies and brand teams.</p>
        <ul class="tier__features">
          <li>50,000 verifications / month</li>
          <li>Custom dashboard with audit log export</li>
          <li>Async Slack/email support</li>
          <li>Receipt format customization (claim metadata fields)</li>
          <li>Priority queue, &lt;5s p95 latency</li>
          <li>Usage analytics + monthly summary report</li>
        </ul>
        <div class="tier__cta">
          <a href="mailto:joe@agentoracle.co?subject=AgentOracle%20Business%20Pilot" class="btn btn--primary" style="font-size:14px;">Start a pilot \u2192</a>
        </div>
      </div>
      <div class="tier">
        <span class="tier__name">Enterprise</span>
        <div>
          <span class="tier__price">Custom</span>
        </div>
        <p class="tier__desc">High volume, custom SLA, dedicated kid for receipt signing, on-prem deployment options.</p>
        <ul class="tier__features">
          <li>Unlimited verifications</li>
          <li>Dedicated signing key (your kid in JWKS)</li>
          <li>SLA guarantees and 99.9%+ uptime</li>
          <li>Compliance review support (EU AI Act, NIST RMF, SOC 2 in progress)</li>
          <li>Annual contract, MSA, security review</li>
          <li>Engineering response time guarantees</li>
        </ul>
        <div class="tier__cta">
          <a href="mailto:joe@agentoracle.co?subject=AgentOracle%20Enterprise" class="btn btn--secondary" style="font-size:14px;">Talk to us \u2192</a>
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
      <div class="proof-card">
        <p class="proof-card__quote">\u201cStrong work. Looking forward to the eval harness. The calibration.provisional field is the right discipline.\u201d</p>
        <p class="proof-card__cite"><strong>Beenz</strong> \u2014 Mastercard Verifiable Intent RFC contributor. Independently verified the receipt spec end-to-end (Node + Python). Tamper test failed closed.</p>
      </div>
      <div class="proof-card">
        <p class="proof-card__quote">\u201cThe Coinbase engineering team publicly engaged on the canonical x402 issue thread, diagnosed our implementation, and tagged TKCollective directly.\u201d</p>
        <p class="proof-card__cite"><strong>ethanoroshiba</strong> \u2014 Coinbase / x402 Foundation. <a href="https://github.com/x402-foundation/x402/issues/2207" target="_blank" rel="noopener">View thread \u2192</a></p>
      </div>
    </div>
    <div class="compliance">
      <h3>Built for the regulations coming next</h3>
      <ul>
        <li><strong>EU AI Act Article 26.</strong> Cryptographic record-keeping for AI system outputs. Receipts are tamper-evident and replayable.</li>
        <li><strong>NIST AI RMF Measurement.</strong> Per-claim confidence + provenance + source attribution.</li>
        <li><strong>SOC 2 Type II.</strong> In progress. Available with the Enterprise tier roadmap.</li>
        <li><strong>Public JWKS.</strong> Any auditor can verify our receipts without trusting us. RFC 7515 / 7517 / 8037.</li>
      </ul>
    </div>
  </div>
</section>

<div class="container">
  <div class="contact-cta">
    <h2>Ready to talk?</h2>
    <p>Tell us your use case in 3 sentences. We\u2019ll come back same-day with a yes/no on fit, a sample receipt against your content, and a pilot scope.</p>
    <a href="mailto:joe@agentoracle.co?subject=AgentOracle%20pilot%20inquiry&body=About%20us:%20%5Bcompany%5D%0AUse%20case:%20%5Bbrief%20description%5D%0AVolume:%20%5Bestimated%20queries%2Fmonth%5D" class="btn btn--primary">joe@agentoracle.co</a>
  </div>
</div>

<footer class="footer">
  <div class="container footer__inner">
    <div>\u00a9 2026 TKCollective LLC \u00b7 AgentOracle</div>
    <div>
      <a href="/">Home</a> \u00b7 <a href="/privacy">Privacy</a> \u00b7 <a href="https://github.com/x402-foundation/x402/issues/2207" target="_blank" rel="noopener">x402 #2207</a> \u00b7 <a href="https://github.com/TKCollective/agentoracle-receipt-spec" target="_blank" rel="noopener">Receipt Spec</a>
    </div>
  </div>
</footer>

</body>
</html>`;
