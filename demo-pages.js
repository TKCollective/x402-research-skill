// Auto-generated demo page HTML — do not edit manually
export const DEMO_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<!--
   ______                            __
  / ____/___  ____ ___  ____  __  __/ /____  _____
 / /   / __ \\/ __ \`__ \\/ __ \\/ / / / __/ _ \\/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ / /_/  __/ /
\\____/\\____/_/ /_/ /_/ .___/\\__,_/\\__/\\___/_/
                    /_/
        Created with Perplexity Computer
        https://www.perplexity.ai/computer
-->

<!-- Perplexity Computer Attribution — SEO Meta Tags -->
<meta name="generator" content="Perplexity Computer">
<meta name="author" content="Perplexity Computer">
<meta property="og:see_also" content="https://www.perplexity.ai/computer">
<link rel="author" href="https://www.perplexity.ai/computer">

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgentOracle — Interactive Demo</title>
<meta name="description" content="See how AgentOracle's pay-per-query research API works. Step-by-step interactive walkthrough of the x402 payment flow.">

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<style>
/* ============================================
   AgentOracle Demo Site — Shared Styles
   Brand: Deep Black #0D0D0D, Gold #C9A96E, Ivory #F0ECE2
   ============================================ */

/* --- Reset & Base --- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --black: #0D0D0D;
  --black-light: #151515;
  --black-lighter: #1A1A1A;
  --gold: #C9A96E;
  --gold-dim: #A08550;
  --gold-glow: rgba(201, 169, 110, 0.3);
  --ivory: #F0ECE2;
  --ivory-dim: rgba(240, 236, 226, 0.6);
  --ivory-muted: rgba(240, 236, 226, 0.35);
  --green: #4ADE80;
  --red: #EF4444;
  --yellow: #FBBF24;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background: var(--black);
  color: var(--ivory);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

a {
  color: var(--gold);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--ivory);
}

/* --- Utility --- */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* --- Layout Container --- */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

/* --- Header / Logo --- */
.site-header {
  padding: 32px 0 0;
  text-align: center;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ivory);
  letter-spacing: -0.02em;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dim));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--black);
}

.tagline {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--ivory-dim);
  font-weight: 400;
}

/* --- Progress Bar --- */
.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 40px 0 32px;
}

.progress-step {
  width: 48px;
  height: 4px;
  border-radius: 2px;
  background: var(--black-lighter);
  transition: background 0.4s var(--ease-out);
}

.progress-step.active {
  background: var(--gold);
}

.progress-step.completed {
  background: var(--gold-dim);
}

.progress-label {
  margin-left: 12px;
  font-size: 0.8rem;
  color: var(--ivory-muted);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  min-width: 80px;
}

/* --- Step Cards --- */
.step-area {
  position: relative;
  min-height: 400px;
}

.step-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
  pointer-events: none;
}

.step-card.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  position: relative;
}

.step-number {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.step-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ivory);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.step-description {
  font-size: 0.9rem;
  color: var(--ivory-dim);
  margin-bottom: 20px;
  line-height: 1.6;
}

/* --- Code Blocks --- */
.code-block {
  background: var(--black-light);
  border: 1px solid rgba(240, 236, 226, 0.06);
  border-radius: 12px;
  overflow: hidden;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(240, 236, 226, 0.03);
  border-bottom: 1px solid rgba(240, 236, 226, 0.06);
}

.code-dots {
  display: flex;
  gap: 6px;
}

.code-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.code-dot.red { background: var(--red); }
.code-dot.yellow { background: var(--yellow); }
.code-dot.green { background: var(--green); }

.code-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ivory-muted);
}

.code-content {
  padding: 20px;
  overflow-x: auto;
}

.code-content pre {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--ivory);
  white-space: pre;
  margin: 0;
}

/* Syntax highlighting classes */
.syn-key { color: var(--gold); }
.syn-str { color: var(--ivory); }
.syn-num { color: #7DD3FC; }
.syn-bracket { color: var(--ivory-muted); }
.syn-method { color: #C084FC; }
.syn-url { color: var(--gold-dim); }
.syn-header { color: #67E8F9; }
.syn-comment { color: var(--ivory-muted); font-style: italic; }
.syn-status { color: var(--yellow); }
.syn-bool { color: #7DD3FC; }

/* --- Payment Animation --- */
.payment-animation {
  background: var(--black-light);
  border: 1px solid rgba(240, 236, 226, 0.06);
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.payment-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 300%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--gold-glow),
    transparent
  );
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-33%); }
  100% { transform: translateX(33%); }
}

.payment-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  background: var(--black);
}

.payment-icon svg {
  width: 28px;
  height: 28px;
}

.payment-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.payment-detail {
  font-size: 0.85rem;
  color: var(--ivory-dim);
  position: relative;
  z-index: 1;
}

.payment-chain {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.payment-chain .chain-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.2);
  font-size: 0.78rem;
  color: var(--gold);
  font-weight: 500;
}

.chain-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* --- Navigation Buttons --- */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-bottom: 20px;
}

.btn {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-ghost {
  background: transparent;
  color: var(--ivory-dim);
  border: 1px solid rgba(240, 236, 226, 0.1);
}

.btn-ghost:hover {
  color: var(--ivory);
  border-color: rgba(240, 236, 226, 0.2);
}

.btn-gold {
  background: var(--gold);
  color: var(--black);
}

.btn-gold:hover {
  background: var(--ivory);
  transform: translateY(-1px);
}

.btn-gold-outline {
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--gold);
}

.btn-gold-outline:hover {
  background: rgba(201, 169, 110, 0.1);
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* --- CTA Section (end of walkthrough) --- */
.cta-section {
  text-align: center;
  padding: 40px 0 20px;
}

.cta-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.cta-section p {
  font-size: 0.9rem;
  color: var(--ivory-dim);
  margin-bottom: 28px;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* --- Footer --- */
.site-footer {
  margin-top: 60px;
  padding: 24px 0;
  border-top: 1px solid rgba(240, 236, 226, 0.06);
  text-align: center;
}

.site-footer a {
  font-size: 0.75rem;
  color: var(--ivory-muted);
}

.site-footer a:hover {
  color: var(--ivory);
}

.footer-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* --- Terminal Page (video.html) --- */
.terminal-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.terminal-wrapper {
  width: 100%;
  max-width: 880px;
  position: relative;
}

.terminal {
  background: var(--black);
  border: 1px solid rgba(240, 236, 226, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(240, 236, 226, 0.04),
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(201, 169, 110, 0.05);
}

.terminal-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--black-lighter);
  border-bottom: 1px solid rgba(240, 236, 226, 0.06);
}

.terminal-dots {
  display: flex;
  gap: 7px;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dot.red { background: #FF5F57; }
.terminal-dot.yellow { background: #FEBC2E; }
.terminal-dot.green { background: #28C840; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ivory-muted);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.terminal-timer {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ivory-muted);
  min-width: 36px;
  text-align: right;
}

.terminal-body {
  padding: 24px;
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--ivory);
  position: relative;
}

.terminal-line {
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 1.7em;
}

.terminal-line.command { color: var(--ivory); }
.terminal-line.status { color: var(--yellow); }
.terminal-line.payment { color: var(--gold); }
.terminal-line.success { color: var(--green); }
.terminal-line.json { color: var(--ivory); }
.terminal-line.branding { color: var(--gold); font-weight: 600; }

.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--gold);
  animation: blink 1s step-end infinite;
  vertical-align: middle;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Spinner for payment */
.spinner {
  display: inline-block;
  color: var(--gold);
  animation: spin-text 0.6s linear infinite;
}

@keyframes spin-text {
  0% { content: '⠋'; }
  10% { content: '⠙'; }
  20% { content: '⠹'; }
  30% { content: '⠸'; }
  40% { content: '⠼'; }
  50% { content: '⠴'; }
  60% { content: '⠦'; }
  70% { content: '⠧'; }
  80% { content: '⠇'; }
  90% { content: '⠏'; }
}

/* Terminal controls */
.terminal-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.replay-btn {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--gold);
  background: transparent;
  color: var(--gold);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.replay-btn:hover {
  background: rgba(201, 169, 110, 0.1);
}

.back-link {
  font-size: 0.85rem;
  color: var(--ivory-dim);
}

.back-link:hover {
  color: var(--gold);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }

  .step-title {
    font-size: 1.15rem;
  }

  .code-content {
    padding: 14px;
  }

  .code-content pre {
    font-size: 0.7rem;
  }

  .progress-bar {
    margin: 28px 0 24px;
  }

  .progress-step {
    width: 36px;
  }

  .progress-label {
    font-size: 0.7rem;
  }

  .step-area {
    min-height: 380px;
  }

  .nav-buttons {
    margin-top: 28px;
  }

  .btn {
    padding: 10px 18px;
    font-size: 0.8rem;
  }

  .terminal-body {
    padding: 16px;
    min-height: 340px;
    font-size: 0.68rem;
    line-height: 1.65;
  }

  .terminal-dot {
    width: 10px;
    height: 10px;
  }

  .terminal-title {
    font-size: 0.65rem;
  }

  .payment-amount {
    font-size: 1.5rem;
  }

  .cta-section h2 {
    font-size: 1.25rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}

</style>
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container">
      <div class="logo">
        <div class="logo-mark">AO</div>
        <span>AgentOracle</span>
      </div>
      <p class="tagline">Pay-per-query research API for AI agents</p>
    </div>
  </header>

  <main class="container">

    <!-- Progress Bar -->
    <div class="progress-bar" id="progressBar">
      <div class="progress-step active" data-step="0"></div>
      <div class="progress-step" data-step="1"></div>
      <div class="progress-step" data-step="2"></div>
      <div class="progress-step" data-step="3"></div>
      <span class="progress-label" id="progressLabel">Step 1 of 4</span>
    </div>

    <!-- Step Cards -->
    <div class="step-area" id="stepArea">

      <!-- Step 1: Agent sends request -->
      <div class="step-card active" data-step="0">
        <div class="step-number">Step 1</div>
        <h2 class="step-title">Agent sends a research request</h2>
        <p class="step-description">Your AI agent hits the AgentOracle endpoint with a natural language query. No API key needed — just a simple POST request.</p>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots">
              <span class="code-dot red"></span>
              <span class="code-dot yellow"></span>
              <span class="code-dot green"></span>
            </div>
            <span class="code-title">request.sh</span>
          </div>
          <div class="code-content">
            <pre><span class="syn-method">POST</span> <span class="syn-url">https://agentoracle.co/research</span>
<span class="syn-header">Content-Type:</span> application/json

<span class="syn-bracket">{</span>
  <span class="syn-key">"query"</span>: <span class="syn-str">"What are the latest AI agent frameworks in 2026?"</span>
<span class="syn-bracket">}</span></pre>
          </div>
        </div>
      </div>

      <!-- Step 2: Server returns 402 -->
      <div class="step-card" data-step="1">
        <div class="step-number">Step 2</div>
        <h2 class="step-title">Server returns 402 Payment Required</h2>
        <p class="step-description">Instead of a traditional API key check, the server responds with x402 payment details. The agent knows exactly what to pay and where.</p>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots">
              <span class="code-dot red"></span>
              <span class="code-dot yellow"></span>
              <span class="code-dot green"></span>
            </div>
            <span class="code-title">response — 402</span>
          </div>
          <div class="code-content">
            <pre><span class="syn-status">HTTP/1.1 402 Payment Required</span>
<span class="syn-header">X-Payment:</span> x402

<span class="syn-bracket">{</span>
  <span class="syn-key">"price"</span>: <span class="syn-str">"$0.02 USDC"</span>,
  <span class="syn-key">"network"</span>: <span class="syn-str">"Base Mainnet"</span>,
  <span class="syn-key">"payTo"</span>: <span class="syn-str">"0xdF90...e109"</span>,
  <span class="syn-key">"facilitator"</span>: <span class="syn-str">"https://x402.org/facilitator"</span>
<span class="syn-bracket">}</span></pre>
          </div>
        </div>
      </div>

      <!-- Step 3: Agent pays via x402 -->
      <div class="step-card" data-step="2">
        <div class="step-number">Step 3</div>
        <h2 class="step-title">Agent pays $0.02 via x402</h2>
        <p class="step-description">The agent automatically sends a USDC micropayment on Base mainnet. Payment IS the authentication — no keys, no accounts, no friction.</p>
        <div class="payment-animation" id="paymentAnim">
          <div class="payment-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--gold);">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="payment-amount">$0.02</div>
          <div class="payment-detail">USDC via x402 protocol</div>
          <div class="payment-chain">
            <div class="chain-badge">
              <span class="dot"></span>
              Base Mainnet — Confirmed
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Research delivered -->
      <div class="step-card" data-step="3">
        <div class="step-number">Step 4</div>
        <h2 class="step-title">Structured research delivered</h2>
        <p class="step-description">The agent receives clean, structured JSON with a summary, key facts, sources, confidence score, and token count. Ready to use immediately.</p>
        <div class="code-block">
          <div class="code-header">
            <div class="code-dots">
              <span class="code-dot red"></span>
              <span class="code-dot yellow"></span>
              <span class="code-dot green"></span>
            </div>
            <span class="code-title">response — 200 OK</span>
          </div>
          <div class="code-content">
            <pre><span class="syn-bracket">{</span>
  <span class="syn-key">"summary"</span>: <span class="syn-str">"The AI agent framework landscape in 2026 is dominated by..."</span>,
  <span class="syn-key">"key_facts"</span>: <span class="syn-bracket">[</span>
    <span class="syn-str">"LangChain v0.4 introduced native x402 payment support"</span>,
    <span class="syn-str">"CrewAI reached 500k monthly active agents"</span>,
    <span class="syn-str">"AutoGPT 3.0 ships with built-in research primitives"</span>
  <span class="syn-bracket">]</span>,
  <span class="syn-key">"sources"</span>: <span class="syn-bracket">[</span>
    <span class="syn-bracket">{</span> <span class="syn-key">"title"</span>: <span class="syn-str">"State of AI Agents 2026"</span>, <span class="syn-key">"url"</span>: <span class="syn-str">"..."</span> <span class="syn-bracket">}</span>,
    <span class="syn-bracket">{</span> <span class="syn-key">"title"</span>: <span class="syn-str">"Agent Framework Benchmark"</span>, <span class="syn-key">"url"</span>: <span class="syn-str">"..."</span> <span class="syn-bracket">}</span>
  <span class="syn-bracket">]</span>,
  <span class="syn-key">"confidence"</span>: <span class="syn-num">0.94</span>,
  <span class="syn-key">"tokens_used"</span>: <span class="syn-num">847</span>
<span class="syn-bracket">}</span></pre>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <h2>That's it. Payment is the API key.</h2>
          <p>No signup. No rate limits. No API keys. Just pay $0.02 per query and get structured research data back.</p>
          <div class="cta-buttons">
            <a href="https://agentoracle.co" class="btn btn-gold" target="_blank" rel="noopener noreferrer">
              Try it yourself →
            </a>
            <a href="/demo/video" class="btn btn-gold-outline">
              Watch the 25-second demo →
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Navigation Buttons -->
    <div class="nav-buttons" id="navButtons">
      <button class="btn btn-ghost" id="prevBtn" disabled>
        ← Back
      </button>
      <button class="btn btn-gold" id="nextBtn">
        Next →
      </button>
    </div>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-links">
        <a href="/demo/video">Terminal Demo</a>
        <a href="https://agentoracle.co" target="_blank" rel="noopener noreferrer">agentoracle.co</a>
        <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer">Created with Perplexity Computer</a>
      </div>
    </div>
  </footer>

  <script>
    /* ============================================
       Interactive Demo Walkthrough Controller
       ============================================ */
    (function() {
      const steps = document.querySelectorAll('.step-card');
      const progressSteps = document.querySelectorAll('.progress-step');
      const progressLabel = document.getElementById('progressLabel');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const navButtons = document.getElementById('navButtons');
      let currentStep = 0;
      const totalSteps = steps.length;

      function updateView() {
        // Update step cards
        steps.forEach((card, i) => {
          card.classList.toggle('active', i === currentStep);
        });

        // Update progress bar
        progressSteps.forEach((dot, i) => {
          dot.classList.remove('active', 'completed');
          if (i === currentStep) {
            dot.classList.add('active');
          } else if (i < currentStep) {
            dot.classList.add('completed');
          }
        });

        // Update label
        progressLabel.textContent = \`Step \${currentStep + 1} of \${totalSteps}\`;

        // Update buttons
        prevBtn.disabled = currentStep === 0;

        // On last step, hide the nav (CTA is shown instead)
        if (currentStep === totalSteps - 1) {
          nextBtn.style.display = 'none';
        } else {
          nextBtn.style.display = '';
          nextBtn.textContent = 'Next →';
        }
      }

      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          updateView();
        }
      });

      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
          currentStep++;
          updateView();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentStep < totalSteps - 1) {
          currentStep++;
          updateView();
        } else if (e.key === 'ArrowLeft' && currentStep > 0) {
          currentStep--;
          updateView();
        }
      });

      // Initialize
      updateView();
    })();
  </script>

</body>
</html>
`;

export const DEMO_VIDEO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<!--
   ______                            __
  / ____/___  ____ ___  ____  __  __/ /____  _____
 / /   / __ \\/ __ \`__ \\/ __ \\/ / / / __/ _ \\/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ / /_/  __/ /
\\____/\\____/_/ /_/ /_/ .___/\\__,_/\\__/\\___/_/
                    /_/
        Created with Perplexity Computer
        https://www.perplexity.ai/computer
-->

<!-- Perplexity Computer Attribution — SEO Meta Tags -->
<meta name="generator" content="Perplexity Computer">
<meta name="author" content="Perplexity Computer">
<meta property="og:see_also" content="https://www.perplexity.ai/computer">
<link rel="author" href="https://www.perplexity.ai/computer">

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgentOracle — Terminal Demo</title>
<meta name="description" content="Watch a 25-second terminal animation showing the complete AgentOracle API flow — from request to payment to research delivery.">

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<style>
/* ============================================
   AgentOracle Demo Site — Shared Styles
   Brand: Deep Black #0D0D0D, Gold #C9A96E, Ivory #F0ECE2
   ============================================ */

/* --- Reset & Base --- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --black: #0D0D0D;
  --black-light: #151515;
  --black-lighter: #1A1A1A;
  --gold: #C9A96E;
  --gold-dim: #A08550;
  --gold-glow: rgba(201, 169, 110, 0.3);
  --ivory: #F0ECE2;
  --ivory-dim: rgba(240, 236, 226, 0.6);
  --ivory-muted: rgba(240, 236, 226, 0.35);
  --green: #4ADE80;
  --red: #EF4444;
  --yellow: #FBBF24;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background: var(--black);
  color: var(--ivory);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

a {
  color: var(--gold);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--ivory);
}

/* --- Utility --- */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* --- Layout Container --- */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

/* --- Header / Logo --- */
.site-header {
  padding: 32px 0 0;
  text-align: center;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ivory);
  letter-spacing: -0.02em;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dim));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--black);
}

.tagline {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--ivory-dim);
  font-weight: 400;
}

/* --- Progress Bar --- */
.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 40px 0 32px;
}

.progress-step {
  width: 48px;
  height: 4px;
  border-radius: 2px;
  background: var(--black-lighter);
  transition: background 0.4s var(--ease-out);
}

.progress-step.active {
  background: var(--gold);
}

.progress-step.completed {
  background: var(--gold-dim);
}

.progress-label {
  margin-left: 12px;
  font-size: 0.8rem;
  color: var(--ivory-muted);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  min-width: 80px;
}

/* --- Step Cards --- */
.step-area {
  position: relative;
  min-height: 400px;
}

.step-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
  pointer-events: none;
}

.step-card.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  position: relative;
}

.step-number {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.step-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ivory);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.step-description {
  font-size: 0.9rem;
  color: var(--ivory-dim);
  margin-bottom: 20px;
  line-height: 1.6;
}

/* --- Code Blocks --- */
.code-block {
  background: var(--black-light);
  border: 1px solid rgba(240, 236, 226, 0.06);
  border-radius: 12px;
  overflow: hidden;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(240, 236, 226, 0.03);
  border-bottom: 1px solid rgba(240, 236, 226, 0.06);
}

.code-dots {
  display: flex;
  gap: 6px;
}

.code-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.code-dot.red { background: var(--red); }
.code-dot.yellow { background: var(--yellow); }
.code-dot.green { background: var(--green); }

.code-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ivory-muted);
}

.code-content {
  padding: 20px;
  overflow-x: auto;
}

.code-content pre {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--ivory);
  white-space: pre;
  margin: 0;
}

/* Syntax highlighting classes */
.syn-key { color: var(--gold); }
.syn-str { color: var(--ivory); }
.syn-num { color: #7DD3FC; }
.syn-bracket { color: var(--ivory-muted); }
.syn-method { color: #C084FC; }
.syn-url { color: var(--gold-dim); }
.syn-header { color: #67E8F9; }
.syn-comment { color: var(--ivory-muted); font-style: italic; }
.syn-status { color: var(--yellow); }
.syn-bool { color: #7DD3FC; }

/* --- Payment Animation --- */
.payment-animation {
  background: var(--black-light);
  border: 1px solid rgba(240, 236, 226, 0.06);
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.payment-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 300%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--gold-glow),
    transparent
  );
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-33%); }
  100% { transform: translateX(33%); }
}

.payment-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  background: var(--black);
}

.payment-icon svg {
  width: 28px;
  height: 28px;
}

.payment-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.payment-detail {
  font-size: 0.85rem;
  color: var(--ivory-dim);
  position: relative;
  z-index: 1;
}

.payment-chain {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.payment-chain .chain-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.2);
  font-size: 0.78rem;
  color: var(--gold);
  font-weight: 500;
}

.chain-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* --- Navigation Buttons --- */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-bottom: 20px;
}

.btn {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-ghost {
  background: transparent;
  color: var(--ivory-dim);
  border: 1px solid rgba(240, 236, 226, 0.1);
}

.btn-ghost:hover {
  color: var(--ivory);
  border-color: rgba(240, 236, 226, 0.2);
}

.btn-gold {
  background: var(--gold);
  color: var(--black);
}

.btn-gold:hover {
  background: var(--ivory);
  transform: translateY(-1px);
}

.btn-gold-outline {
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--gold);
}

.btn-gold-outline:hover {
  background: rgba(201, 169, 110, 0.1);
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* --- CTA Section (end of walkthrough) --- */
.cta-section {
  text-align: center;
  padding: 40px 0 20px;
}

.cta-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.cta-section p {
  font-size: 0.9rem;
  color: var(--ivory-dim);
  margin-bottom: 28px;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* --- Footer --- */
.site-footer {
  margin-top: 60px;
  padding: 24px 0;
  border-top: 1px solid rgba(240, 236, 226, 0.06);
  text-align: center;
}

.site-footer a {
  font-size: 0.75rem;
  color: var(--ivory-muted);
}

.site-footer a:hover {
  color: var(--ivory);
}

.footer-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* --- Terminal Page (video.html) --- */
.terminal-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.terminal-wrapper {
  width: 100%;
  max-width: 880px;
  position: relative;
}

.terminal {
  background: var(--black);
  border: 1px solid rgba(240, 236, 226, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(240, 236, 226, 0.04),
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(201, 169, 110, 0.05);
}

.terminal-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--black-lighter);
  border-bottom: 1px solid rgba(240, 236, 226, 0.06);
}

.terminal-dots {
  display: flex;
  gap: 7px;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dot.red { background: #FF5F57; }
.terminal-dot.yellow { background: #FEBC2E; }
.terminal-dot.green { background: #28C840; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ivory-muted);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.terminal-timer {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ivory-muted);
  min-width: 36px;
  text-align: right;
}

.terminal-body {
  padding: 24px;
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--ivory);
  position: relative;
}

.terminal-line {
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 1.7em;
}

.terminal-line.command { color: var(--ivory); }
.terminal-line.status { color: var(--yellow); }
.terminal-line.payment { color: var(--gold); }
.terminal-line.success { color: var(--green); }
.terminal-line.json { color: var(--ivory); }
.terminal-line.branding { color: var(--gold); font-weight: 600; }

.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: var(--gold);
  animation: blink 1s step-end infinite;
  vertical-align: middle;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Spinner for payment */
.spinner {
  display: inline-block;
  color: var(--gold);
  animation: spin-text 0.6s linear infinite;
}

@keyframes spin-text {
  0% { content: '⠋'; }
  10% { content: '⠙'; }
  20% { content: '⠹'; }
  30% { content: '⠸'; }
  40% { content: '⠼'; }
  50% { content: '⠴'; }
  60% { content: '⠦'; }
  70% { content: '⠧'; }
  80% { content: '⠇'; }
  90% { content: '⠏'; }
}

/* Terminal controls */
.terminal-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.replay-btn {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--gold);
  background: transparent;
  color: var(--gold);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.replay-btn:hover {
  background: rgba(201, 169, 110, 0.1);
}

.back-link {
  font-size: 0.85rem;
  color: var(--ivory-dim);
}

.back-link:hover {
  color: var(--gold);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }

  .step-title {
    font-size: 1.15rem;
  }

  .code-content {
    padding: 14px;
  }

  .code-content pre {
    font-size: 0.7rem;
  }

  .progress-bar {
    margin: 28px 0 24px;
  }

  .progress-step {
    width: 36px;
  }

  .progress-label {
    font-size: 0.7rem;
  }

  .step-area {
    min-height: 380px;
  }

  .nav-buttons {
    margin-top: 28px;
  }

  .btn {
    padding: 10px 18px;
    font-size: 0.8rem;
  }

  .terminal-body {
    padding: 16px;
    min-height: 340px;
    font-size: 0.68rem;
    line-height: 1.65;
  }

  .terminal-dot {
    width: 10px;
    height: 10px;
  }

  .terminal-title {
    font-size: 0.65rem;
  }

  .payment-amount {
    font-size: 1.5rem;
  }

  .cta-section h2 {
    font-size: 1.25rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}

</style>
</head>
<body>

  <div class="terminal-page">

    <div class="terminal-wrapper">
      <div class="terminal">
        <!-- Terminal Chrome -->
        <div class="terminal-chrome">
          <div class="terminal-dots">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          <span class="terminal-title">agentoracle — bash</span>
          <span class="terminal-timer" id="timer">0s</span>
        </div>

        <!-- Terminal Body -->
        <div class="terminal-body" id="terminalBody">
          <span class="cursor" id="cursor"></span>
        </div>
      </div>

      <!-- Controls below terminal -->
      <div class="terminal-controls">
        <a href="/demo" class="back-link">← Back to interactive demo</a>
        <button class="replay-btn" id="replayBtn" style="display: none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Replay
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="site-footer" style="margin-top: 40px; border-top: none; width: 100%;">
      <div class="footer-links">
        <a href="/demo">Interactive Demo</a>
        <a href="https://agentoracle.co" target="_blank" rel="noopener noreferrer">agentoracle.co</a>
        <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer">Created with Perplexity Computer</a>
      </div>
    </footer>

  </div>

  <script>
    /* ============================================
       Terminal Animation Controller
       Auto-plays a typed terminal sequence in <25s
       ============================================ */
    (function() {
      const body = document.getElementById('terminalBody');
      const timerEl = document.getElementById('timer');
      const replayBtn = document.getElementById('replayBtn');

      // Mutable cursor reference
      let cursor = document.getElementById('cursor');
      let startTime = null;
      let timerRAF = null;
      let animationAborted = false;

      const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

      /* ---------- Timer ---------- */
      function startTimer() {
        startTime = performance.now();
        function tick() {
          if (animationAborted) return;
          const elapsed = Math.floor((performance.now() - startTime) / 1000);
          timerEl.textContent = elapsed + 's';
          timerRAF = requestAnimationFrame(tick);
        }
        tick();
      }

      function stopTimer() {
        if (timerRAF) cancelAnimationFrame(timerRAF);
      }

      /* ---------- Helpers ---------- */
      function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
      }

      function addLine(className) {
        const line = document.createElement('div');
        line.className = 'terminal-line ' + (className || '');
        body.insertBefore(line, cursor);
        return line;
      }

      async function typeText(el, text, speed) {
        const charDelay = speed || 22;
        for (let i = 0; i < text.length; i++) {
          if (animationAborted) return;
          el.textContent += text[i];
          body.scrollTop = body.scrollHeight;
          await sleep(charDelay);
        }
      }

      function showText(el, text) {
        el.textContent = text;
        body.scrollTop = body.scrollHeight;
      }

      async function showSpinner(el, prefix, durationMs) {
        let frame = 0;
        const intervalTime = 80;
        const totalFrames = Math.floor(durationMs / intervalTime);
        for (let i = 0; i < totalFrames; i++) {
          if (animationAborted) return;
          el.innerHTML = '<span style="color: var(--gold);">' + prefix + ' ' + spinnerFrames[frame % spinnerFrames.length] + '</span>';
          frame++;
          body.scrollTop = body.scrollHeight;
          await sleep(intervalTime);
        }
      }

      // Colorize a JSON line with syntax highlighting spans
      function colorizeJSON(text) {
        return text
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"([^"]+)":/g, '<span class="syn-key">"$1"</span>:')
          .replace(/: "([^"]*)"/g, ': <span class="syn-str">"$1"</span>')
          .replace(/: (\\d+\\.?\\d*)/g, ': <span class="syn-num">$1</span>')
          .replace(/(\\[|\\]|\\{|\\})/g, '<span class="syn-bracket">$1</span>');
      }

      // Type JSON line char by char, then apply full coloring
      async function typeJSONLine(className, text, charDelay) {
        if (animationAborted) return;
        const jLine = addLine(className);
        for (let i = 0; i < text.length; i++) {
          if (animationAborted) return;
          jLine.textContent += text[i];
          body.scrollTop = body.scrollHeight;
          await sleep(charDelay);
        }
        // Replace with colored version
        jLine.innerHTML = colorizeJSON(text);
        body.scrollTop = body.scrollHeight;
        await sleep(60);
      }

      /* ---------- Main Animation Sequence ---------- */
      async function runAnimation() {
        animationAborted = false;
        replayBtn.style.display = 'none';

        // Clear terminal and create fresh cursor
        body.innerHTML = '';
        cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.id = 'cursor';
        body.appendChild(cursor);

        startTimer();

        // -- (0-3s) Type curl command --
        const promptLine = addLine('command');
        showText(promptLine, '$ ');
        await typeText(promptLine, 'curl -X POST https://agentoracle.co/research \\\\', 16);

        const cmdLine2 = addLine('command');
        showText(cmdLine2, '  ');
        await typeText(cmdLine2, '-H "Content-Type: application/json" \\\\', 16);

        const cmdLine3 = addLine('command');
        showText(cmdLine3, '  ');
        await typeText(cmdLine3, '-d \\'{"query": "top AI agent tools 2026"}\\'', 16);

        await sleep(500);

        // -- (3-5s) 402 Response --
        addLine(); // blank line
        const statusLine = addLine('status');
        await typeText(statusLine, 'HTTP/1.1 402 — Payment Required via x402', 10);
        await sleep(350);

        // -- (5-8s) Payment spinner --
        addLine(); // blank line
        const payLine = addLine('payment');
        await showSpinner(payLine, '→ Paying $0.02 USDC on Base...', 2200);

        // -- (8-10s) Payment confirmed --
        payLine.innerHTML = '<span style="color: var(--gold);">→ Paying $0.02 USDC on Base... done</span>';
        const confirmLine = addLine('success');
        await typeText(confirmLine, '✓ Payment confirmed. Fetching research...', 18);
        await sleep(500);

        // -- (10-22s) JSON response --
        addLine(); // blank line

        const jsonLines = [
          '{',
          '  "summary": "The top AI agent tools in 2026 include...",',
          '  "key_facts": [',
          '    "LangChain v0.4 — native x402 payment support",',
          '    "CrewAI — 500k monthly active agents",',
          '    "AutoGPT 3.0 — built-in research primitives"',
          '  ],',
          '  "sources": 4,',
          '  "confidence": 0.94',
          '}'
        ];

        for (const line of jsonLines) {
          await typeJSONLine('json', line, 10);
        }

        await sleep(500);

        // -- (22-25s) Branding --
        addLine(); // blank line
        const brandLine = addLine('branding');
        await typeText(brandLine, 'agentoracle.co — Research API for AI Agents | $0.02/query', 22);

        // Done
        cursor.style.display = 'none';
        stopTimer();
        replayBtn.style.display = '';
      }

      /* ---------- Replay ---------- */
      replayBtn.addEventListener('click', () => {
        runAnimation();
      });

      /* ---------- Start on load ---------- */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => setTimeout(runAnimation, 300));
      } else {
        setTimeout(runAnimation, 500);
      }
    })();
  </script>

</body>
</html>
`;
