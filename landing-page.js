// Auto-generated landing page HTML — do not edit manually
export const LANDING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
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
<title>AgentOracle — Research API for AI Agents</title>
<meta name="description" content="Pay-per-query research API for autonomous AI agents. From $0.02 per query via x402 protocol on Base mainnet. Structured JSON responses, zero API keys required. MCP server available.">

<!-- Favicon & Icons -->
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="AgentOracle — Research API for AI Agents">
<meta property="og:description" content="Pay-per-query research API for autonomous AI agents. From $0.02 per query via x402 protocol on Base mainnet.">
<meta property="og:url" content="https://agentoracle.co">
<meta property="og:image" content="https://agentoracle.co/og-image.png?v=2">
<meta name="twitter:card" content="summary_large_image">

<style>
/* === FONTS === */
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=general-sans@400,500,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

/* === DESIGN TOKENS === */
:root {
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
  --text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
  --text-3xl:  clamp(2.5rem,   1rem    + 4vw,    5rem);

  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.25rem;
  --radius-full: 9999px;

  --transition-interactive: 180ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);

  --content-narrow: 640px;
  --content-default: 960px;
  --content-wide: 1200px;

  --font-display: 'Cabinet Grotesk', 'Helvetica Neue', Arial, sans-serif;
  --font-body: 'General Sans', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

/* === DARK MODE (DEFAULT) === */
:root, [data-theme="dark"] {
  --color-bg:             #0D0D0D;
  --color-surface:        #131313;
  --color-surface-2:      #1A1A1A;
  --color-surface-3:      #222222;
  --color-border:         #2A2A2A;
  --color-border-subtle:  #1E1E1E;
  --color-text:           #F0ECE2;
  --color-text-muted:     #9A9590;
  --color-text-faint:     #5A5550;
  --color-primary:        #C9A96E;
  --color-primary-hover:  #D4A850;
  --color-primary-dim:    #A08850;
  --color-primary-highlight: rgba(201, 169, 110, 0.12);
  --color-primary-glow:   rgba(201, 169, 110, 0.06);
  --color-green: #4ADE80;
  --color-blue: #60A5FA;
  --color-purple: #A78BFA;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.15);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.2);
  --shadow-gold-glow: 0 0 30px rgba(201, 169, 110, 0.15), 0 0 60px rgba(201, 169, 110, 0.05);
}

/* === LIGHT MODE === */
[data-theme="light"] {
  --color-bg:             #FAFAF7;
  --color-surface:        #FFFFFF;
  --color-surface-2:      #F5F3EE;
  --color-surface-3:      #EDEAE5;
  --color-border:         #E0DDD6;
  --color-border-subtle:  #EBE8E2;
  --color-text:           #1A1A17;
  --color-text-muted:     #6B6860;
  --color-text-faint:     #A09D96;
  --color-primary:        #A08840;
  --color-primary-hover:  #8A7530;
  --color-primary-dim:    #8A7530;
  --color-primary-highlight: rgba(160, 136, 64, 0.1);
  --color-primary-glow:   rgba(160, 136, 64, 0.05);
  --color-green: #22C55E;
  --color-blue: #3B82F6;
  --color-purple: #8B5CF6;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08), 0 12px 48px rgba(0,0,0,0.1);
  --shadow-gold-glow: 0 0 30px rgba(160, 136, 64, 0.1), 0 0 60px rgba(160, 136, 64, 0.03);
}

/* === RESET === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
  hanging-punctuation: first last;
  scroll-padding-top: var(--space-20);
}

body {
  min-height: 100dvh;
  line-height: 1.6;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  overflow-x: hidden;
}

img, picture, video, canvas, svg { display: block; max-width: 100%; height: auto; }
ul[role="list"], ol[role="list"] { list-style: none; }
input, button, textarea, select { font: inherit; color: inherit; }

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
  line-height: 1.15;
  font-family: var(--font-display);
}

p, li, figcaption { text-wrap: pretty; max-width: 72ch; }

::selection {
  background: var(--color-primary-highlight);
  color: var(--color-text);
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

button { cursor: pointer; background: none; border: none; }
table { border-collapse: collapse; width: 100%; }

a, button, [role="button"], [role="link"], input, textarea, select {
  transition: color var(--transition-interactive),
              background var(--transition-interactive),
              border-color var(--transition-interactive),
              box-shadow var(--transition-interactive);
}

a { color: var(--color-primary); text-decoration: none; }
a:hover { color: var(--color-primary-hover); }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
}

/* === LAYOUT === */
.container {
  width: 100%;
  max-width: var(--content-wide);
  margin: 0 auto;
  padding-inline: var(--space-6);
}

@media (min-width: 768px) {
  .container { padding-inline: var(--space-8); }
}

/* === SECTION === */
.section {
  padding-block: clamp(var(--space-16), 8vw, var(--space-24));
  position: relative;
}

.section--alt {
  background: var(--color-surface);
}

.section-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 600px;
  margin-bottom: var(--space-10);
}

.section-center {
  text-align: center;
}
.section-center .section-subtitle {
  margin-inline: auto;
}

/* === HEADER === */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(13, 13, 13, 0.88);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: box-shadow var(--transition-slow);
}

[data-theme="light"] .header {
  background: rgba(250, 250, 247, 0.9);
}

.header--scrolled {
  box-shadow: var(--shadow-sm);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-text);
}

.header__logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.header__wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.02em;
  color: var(--color-primary);
}

.header__nav {
  display: none;
  align-items: center;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .header__nav { display: flex; }
}

.header__nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  letter-spacing: 0.01em;
  position: relative;
}

.header__nav-link:hover {
  color: var(--color-text);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  border: 1px solid transparent;
}

.theme-toggle:hover {
  color: var(--color-text);
  background: var(--color-primary-highlight);
  border-color: var(--color-border);
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-muted);
}

@media (min-width: 768px) {
  .mobile-menu-btn { display: none; }
}

.mobile-menu-btn:hover { color: var(--color-text); }

.mobile-nav {
  display: none;
  position: fixed;
  inset: 64px 0 0 0;
  background: var(--color-bg);
  z-index: 99;
  padding: var(--space-8) var(--space-6);
  flex-direction: column;
  gap: var(--space-6);
}

.mobile-nav.is-open { display: flex; }

.mobile-nav__link {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.mobile-nav__link:hover { color: var(--color-primary); }

/* === BUTTONS === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border: none;
}

.btn--primary {
  background: var(--color-primary);
  color: #0D0D0D;
}

.btn--primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-gold-glow);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn--ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-highlight);
}

.btn--small {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
}

/* === HERO === */
.hero {
  position: relative;
  padding-top: clamp(var(--space-16), 10vw, var(--space-32));
  padding-bottom: clamp(var(--space-16), 8vw, var(--space-24));
  overflow: hidden;
}

.hero__glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 70%;
  height: 120%;
  background: radial-gradient(ellipse at 60% 40%, rgba(201, 169, 110, 0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

[data-theme="light"] .hero__glow {
  background: radial-gradient(ellipse at 60% 40%, rgba(160, 136, 64, 0.05) 0%, transparent 70%);
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
  position: relative;
  z-index: 2;
}

@media (min-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-10);
  }
}

.hero__content { text-align: left; }

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-4);
  background: var(--color-primary-highlight);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-8);
}

.hero__badge-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.4); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(201, 169, 110, 0); }
}

.hero__headline {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  line-height: 1.05;
  color: var(--color-text);
  margin-bottom: var(--space-6);
  letter-spacing: -0.02em;
}

.gold-text {
  background: linear-gradient(135deg, #C9A96E 0%, #D4A850 50%, #E8C878 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .gold-text {
  background: linear-gradient(135deg, #A08840 0%, #8A7530 50%, #B59A48 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: var(--space-8);
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* === CODE BLOCK (reusable) === */
.code-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  max-width: 100%;
}

.code-block:hover {
  box-shadow: var(--shadow-card-hover);
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-5);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.code-block__dots {
  display: flex;
  gap: 6px;
}

.code-block__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
}

.code-block__dot--red { background: #FF5F57; }
.code-block__dot--yellow { background: #FEBC2E; }
.code-block__dot--green { background: #28C840; }

.code-block__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.code-block__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-faint);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
}

.copy-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-primary-highlight);
}

.copy-btn.copied {
  color: var(--color-green);
  border-color: var(--color-green);
}

.code-block__body {
  padding: var(--space-5);
  overflow-x: auto;
}

.code-block__body pre {
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 0.65rem + 0.3vw, 0.82rem);
  line-height: 1.75;
  color: var(--color-text-muted);
  white-space: pre;
  margin: 0;
  overflow-x: auto;
}

/* Syntax colors */
.ck  { color: var(--color-text-faint); }
.cs  { color: #C9A96E; }
.ckw { color: #9B8ECE; }
.cf  { color: #7EB8C9; }
.cn  { color: #C9A96E; }
.cp  { color: var(--color-text); }
.cbr { color: var(--color-text-faint); }

[data-theme="light"] .cs  { color: #8A7530; }
[data-theme="light"] .ckw { color: #6B5FAD; }
[data-theme="light"] .cf  { color: #4A8A9B; }
[data-theme="light"] .cn  { color: #8A7530; }

/* === STATS BAR === */
.stats-bar {
  padding-block: var(--space-8);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.stats-bar__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4);
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.stat-pill__icon {
  color: var(--color-primary);
  font-size: 10px;
  line-height: 1;
}

/* === BENTO GRID (Features) === */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
  }
}

.bento-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-interactive),
              box-shadow var(--transition-slow);
}

.bento-card:hover {
  border-color: rgba(201, 169, 110, 0.3);
  box-shadow: var(--shadow-card-hover), 0 0 30px rgba(201, 169, 110, 0.08);
}

[data-theme="light"] .bento-card:hover {
  border-color: rgba(160, 136, 64, 0.3);
  box-shadow: var(--shadow-card-hover), 0 0 30px rgba(160, 136, 64, 0.06);
}

.bento-card--large { grid-column: 1; }

@media (min-width: 768px) {
  .bento-card--large { grid-column: 1 / 3; }
}

.bento-card__icon {
  font-size: var(--text-xl);
  margin-bottom: var(--space-5);
  line-height: 1;
}

.bento-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.bento-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.bento-card__tag {
  display: inline-block;
  margin-top: var(--space-4);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  padding: var(--space-1) var(--space-3);
  background: var(--color-primary-highlight);
  border-radius: var(--radius-sm);
}

/* === HOW IT WORKS === */
.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .steps-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-10);
  }
}

.step { position: relative; }

.step__number {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-primary-highlight);
  line-height: 1;
  margin-bottom: var(--space-4);
  user-select: none;
}

[data-theme="light"] .step__number {
  color: rgba(160, 136, 64, 0.15);
}

.step__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.step__desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.step__desc code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--color-primary);
  background: var(--color-primary-highlight);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

/* === USE CASE CARDS === */
.usecase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .usecase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.usecase-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: border-color var(--transition-interactive),
              box-shadow var(--transition-slow);
  display: flex;
  flex-direction: column;
}

.usecase-card:hover {
  border-color: rgba(201, 169, 110, 0.3);
  box-shadow: var(--shadow-card-hover), 0 0 30px rgba(201, 169, 110, 0.08);
}

[data-theme="light"] .usecase-card:hover {
  border-color: rgba(160, 136, 64, 0.3);
  box-shadow: var(--shadow-card-hover), 0 0 30px rgba(160, 136, 64, 0.06);
}

.usecase-card__icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-highlight);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: var(--radius-lg);
  font-size: 20px;
  margin-bottom: var(--space-5);
}

.usecase-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.usecase-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-5);
}

.usecase-card__queries {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-5) 0;
  flex-grow: 1;
}

.usecase-card__queries li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.usecase-card__queries li:last-child { border-bottom: none; }

.usecase-card__queries li::before {
  content: '→';
  color: var(--color-primary);
  flex-shrink: 0;
}

.usecase-card__cost {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-highlight);
  border-radius: var(--radius-lg);
  margin-top: auto;
}

.usecase-card__cost-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.usecase-card__cost-value {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--color-primary);
}

/* === CURL EXAMPLE === */
.curl-section {
  max-width: 720px;
  margin: 0 auto;
}

/* === JSON RESPONSE === */
.json-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  align-items: start;
}

@media (min-width: 900px) {
  .json-section {
    grid-template-columns: 1fr 1fr;
  }
}

.json-section__text { }

.json-section__text p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-5);
}

.json-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.json-features li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  font-size: var(--text-sm);
  color: var(--color-text);
}

.json-features li svg {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 3px;
}

/* === MCP SECTION === */
.mcp-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: center;
}

@media (min-width: 900px) {
  .mcp-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.mcp-info { }

.mcp-info__desc {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-6);
}

.mcp-info__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.mcp-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text);
}

.mcp-badge__dot {
  width: 6px;
  height: 6px;
  background: var(--color-green);
  border-radius: 50%;
}

.mcp-install {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.mcp-install__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-5);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.mcp-install__body {
  padding: var(--space-5);
}

.mcp-install__body pre {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-primary);
  margin: 0;
}

.mcp-install__body .mcp-prefix {
  color: var(--color-text-faint);
}

/* === PRICING === */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  max-width: 800px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.pricing-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-interactive),
              box-shadow var(--transition-slow);
}

.pricing-card:hover {
  border-color: rgba(201, 169, 110, 0.3);
  box-shadow: var(--shadow-card-hover), 0 0 30px rgba(201, 169, 110, 0.08);
}

.pricing-card--featured {
  border-color: rgba(201, 169, 110, 0.25);
}

.pricing-card--featured::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}

.pricing-card__endpoint {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pricing-card__price {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--space-2);
}

.pricing-card__unit {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-6);
}

.pricing-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6) 0;
}

.pricing-card__features li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  font-size: var(--text-sm);
  color: var(--color-text);
}

.pricing-card__features li svg {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 3px;
}

/* === TRUST BAR === */
.trust-bar {
  padding-block: var(--space-10);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.trust-bar__label {
  text-align: center;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-faint);
  margin-bottom: var(--space-6);
}

.trust-bar__logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .trust-bar__logos { gap: var(--space-10); }
}

.trust-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-interactive);
  white-space: nowrap;
}

.trust-item:hover {
  color: var(--color-text);
}

.trust-item svg {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.trust-item:hover svg {
  opacity: 1;
}

/* === SPECS === */
.specs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .specs-grid { grid-template-columns: repeat(2, 1fr); }
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.spec-item__label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}

.spec-item__value {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text);
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}

/* === BOTTOM CTA === */
.bottom-cta {
  text-align: center;
  padding-block: clamp(var(--space-16), 8vw, var(--space-32));
  position: relative;
  overflow: hidden;
}

.bottom-cta__glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(201, 169, 110, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.bottom-cta__headline {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  position: relative;
  z-index: 1;
}

.bottom-cta__sub {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin-bottom: var(--space-8);
  max-width: 500px;
  margin-inline: auto;
  position: relative;
  z-index: 1;
}

.bottom-cta__buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4);
  position: relative;
  z-index: 1;
}

/* === FOOTER === */
.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-8);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
}

@media (min-width: 640px) {
  .footer__inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer__copy {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-5);
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__links a {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-decoration: none;
}

.footer__links a:hover {
  color: var(--color-primary);
}

/* === GOLD GRADIENT === */
.gold-gradient {
  background: linear-gradient(135deg, #C9A96E 0%, #D4A850 50%, #E8C878 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .gold-gradient {
  background: linear-gradient(135deg, #A08840 0%, #8A7530 50%, #B59A48 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* === FADE IN === */
.fade-in {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* === DIVIDER === */
.divider {
  width: 60px;
  height: 2px;
  background: var(--color-primary);
  opacity: 0.4;
  margin: var(--space-6) 0;
}

.section-center .divider {
  margin-inline: auto;
}

/* === RESPONSIVE TWEAKS === */
@media (max-width: 640px) {
  .hero__headline {
    font-size: clamp(2rem, 1rem + 5vw, 3rem);
  }

  .section-title {
    font-size: clamp(1.5rem, 1rem + 3vw, 2.5rem);
  }

  .code-block__body pre {
    font-size: 0.7rem;
  }
}

/* ==== MOBILE OVERRIDES ==== */
@media (max-width: 768px) {
  /* Prevent horizontal overflow */
  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }

  .container {
    padding-inline: var(--space-4);
    max-width: 100%;
  }

  /* Force all fade-in visible */
  .fade-in, .fade-in.is-visible {
    opacity: 1 !important;
    transform: none !important;
  }

  /* Hero layout — stack vertically */
  .hero__inner {
    grid-template-columns: 1fr !important;
    gap: var(--space-8);
  }

  .hero__content {
    max-width: 100%;
  }

  .hero__headline {
    font-size: clamp(1.75rem, 6vw, 2.5rem);
  }

  /* Code block — prevent overflow */
  .hero__code-wrapper,
  .code-block {
    max-width: 100%;
    overflow: hidden;
  }

  .code-block__body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .code-block__body pre {
    font-size: 0.65rem;
    white-space: pre;
    min-width: 0;
  }

  /* Stats bar — wrap on mobile */
  .stats-bar__inner {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);
  }

  .stat-pill {
    font-size: var(--text-xs);
    padding: var(--space-2) var(--space-3);
  }

  /* Bento grid single column */
  .bento-grid {
    grid-template-columns: 1fr !important;
  }

  .bento-card--large {
    grid-column: 1 !important;
  }

  /* Steps grid single column */
  .steps-grid {
    grid-template-columns: 1fr !important;
  }

  /* Pricing grid single column */
  .pricing-grid,
  [style*="grid-template-columns: 1fr 1fr"],
  [style*="grid-template-columns:1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }

  .pricing-card {
    max-width: 100% !important;
    padding: var(--space-8) var(--space-5);
  }

  .pricing-card__price {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  /* Specs grid single column */
  .specs-grid {
    grid-template-columns: 1fr !important;
  }

  .spec-item {
    padding: var(--space-3) var(--space-4);
  }

  .spec-item__value {
    font-size: var(--text-xs);
    word-break: break-all;
  }

  /* Section titles */
  .section-title {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }

  /* Step numbers */
  .step__number {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  /* Bottom CTA */
  .bottom-cta__headline {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }

  .bottom-cta__buttons {
    flex-direction: column;
    align-items: center;
  }

  /* Footer */
  .footer__links {
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  /* Header wordmark */
  .header__wordmark {
    white-space: nowrap;
    font-size: var(--text-base);
  }

  /* Buttons — min tap target 44px */
  .btn {
    min-height: 44px;
    min-width: 44px;
    padding: var(--space-3) var(--space-5);
  }

  .theme-toggle,
  .mobile-menu-btn {
    min-width: 44px;
    min-height: 44px;
  }

  /* MCP section code blocks */
  .mcp-code-block {
    max-width: 100%;
    overflow-x: auto;
  }
}

/* Extra small screens */
@media (max-width: 380px) {
  .hero__headline {
    font-size: 1.5rem;
  }

  .code-block__body pre {
    font-size: 0.58rem;
  }

  .pricing-card__price {
    font-size: 1.8rem;
  }

  .stat-pill {
    font-size: 0.7rem;
    padding: var(--space-1) var(--space-2);
  }
}
</style>

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AgentOracle",
  "applicationCategory": "DeveloperApplication",
  "description": "Pay-per-query research API for autonomous AI agents. From $0.02 per query via x402 protocol on Base mainnet.",
  "operatingSystem": "Web",
  "offers": [
    { "@type": "Offer", "price": "0.02", "priceCurrency": "USD", "name": "/research" },
    { "@type": "Offer", "price": "0.10", "priceCurrency": "USD", "name": "/deep-research" }
  ],
  "creator": {
    "@type": "SoftwareApplication",
    "name": "Perplexity Computer",
    "url": "https://www.perplexity.ai/computer"
  }
}
</script>
</head>
<body>

<!-- ========== HEADER ========== -->
<header class="header" id="header">
  <div class="container header__inner">
    <a href="#" class="header__brand">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AgentOracle logo">
        <circle cx="16" cy="16" r="15" fill="#0D0D0D" stroke="#C9A96E" stroke-width="1.5"/>
        <path d="M16 8L10 20h4l-1 4 7-10h-4l1-6z" fill="#C9A96E"/>
      </svg>
      <span class="header__wordmark">AgentOracle</span>
    </a>

    <nav class="header__nav" aria-label="Main navigation">
      <a href="#features" class="header__nav-link">Features</a>
      <a href="#how-it-works" class="header__nav-link">How It Works</a>
      <a href="#pricing" class="header__nav-link">Pricing</a>
      <a href="#specs" class="header__nav-link">Specs</a>
    </nav>

    <div class="header__actions">
      <button class="theme-toggle" data-theme-toggle aria-label="Switch to light mode">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>
      <button class="mobile-menu-btn" aria-label="Toggle menu" data-mobile-toggle>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
    </div>
  </div>

  <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
    <a href="#features" class="mobile-nav__link" data-mobile-link>Features</a>
    <a href="#how-it-works" class="mobile-nav__link" data-mobile-link>How It Works</a>
    <a href="#pricing" class="mobile-nav__link" data-mobile-link>Pricing</a>
    <a href="#specs" class="mobile-nav__link" data-mobile-link>Specs</a>
    <a href="#mcp" class="mobile-nav__link" data-mobile-link>MCP Server</a>
  </nav>
</header>

<!-- ========== HERO ========== -->
<section class="hero section">
  <div class="hero__glow"></div>
  <div class="container hero__inner">
    <div class="hero__content">
      <div class="hero__badge fade-in">
        <span class="hero__badge-dot"></span>
        Live on Base Mainnet
      </div>
      <h1 class="hero__headline fade-in">
        Research API<br>for <span class="gold-text">AI Agents</span>
      </h1>
      <p class="hero__subtitle fade-in">
        Give your autonomous agent real-time research capabilities. Pay per query with USDC or EURC via the x402 protocol — no API keys, no subscriptions. Returning buyers sign in with their wallet via SIWX.
      </p>
      <div class="hero__ctas fade-in">
        <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--primary" target="_blank" rel="noopener noreferrer">View x402 Manifest →</a>
        <a href="https://agentoracle.co/demo" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">▶ Watch Demo</a>
        <a href="#how-it-works" class="btn btn--ghost">How It Works</a>
      </div>
    </div>

    <div class="hero__code-wrapper fade-in">
      <div class="code-block">
        <div class="code-block__header">
          <div class="code-block__dots">
            <span class="code-block__dot code-block__dot--red"></span>
            <span class="code-block__dot code-block__dot--yellow"></span>
            <span class="code-block__dot code-block__dot--green"></span>
          </div>
          <span class="code-block__label">agent.ts</span>
        </div>
        <div class="code-block__body">
<pre><span class="ck">// Query AgentOracle — one endpoint, one payment</span>
<span class="ckw">const</span> response = <span class="ckw">await</span> <span class="cf">fetch</span>(<span class="cs">"https://agentoracle.co/research"</span>, {
  <span class="cp">method:</span> <span class="cs">"POST"</span>,
  <span class="cp">headers:</span> {
    <span class="cs">"Content-Type"</span>: <span class="cs">"application/json"</span>,
    <span class="cs">"X-PAYMENT"</span>: x402Payment  <span class="ck">// USDC or EURC on Base</span>
  },
  <span class="cp">body:</span> <span class="cf">JSON.stringify</span>({
    <span class="cp">query:</span> <span class="cs">"Latest AI agent frameworks 2026"</span>
  })
});

<span class="ckw">const</span> data = <span class="ckw">await</span> response.<span class="cf">json</span>();
<span class="ck">// → structured research with sources</span></pre>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== STATS BAR ========== -->
<div class="stats-bar">
  <div class="container stats-bar__inner">
    <span class="stat-pill">
      <span class="stat-pill__icon">◆</span>
      From $0.02
    </span>
    <span class="stat-pill">
      <span class="stat-pill__icon">◆</span>
      Base Mainnet
    </span>
    <span class="stat-pill">
      <span class="stat-pill__icon">◆</span>
      USDC + EURC
    </span>
    <span class="stat-pill">
      <span class="stat-pill__icon">◆</span>
      SIWX Wallet Auth
    </span>
    <span class="stat-pill">
      <span class="stat-pill__icon">◆</span>
      MCP Compatible
    </span>
  </div>
</div>

<!-- ========== FEATURES ========== -->
<section class="section section--alt" id="features">
  <div class="container">
    <span class="section-label fade-in">Capabilities</span>
    <h2 class="section-title fade-in">Built for Autonomous Agents</h2>
    <p class="section-subtitle fade-in">Everything your agent needs to research, verify, and reason about the real world.</p>

    <div class="bento-grid fade-in">
      <div class="bento-card bento-card--large">
        <div class="bento-card__icon">⚡</div>
        <h3 class="bento-card__title">Real-Time Research</h3>
        <p class="bento-card__desc">
          Powered by Perplexity Sonar, your agent gets access to live web data with source citations. No stale training data — every query returns current, verified information with full provenance.
        </p>
        <span class="bento-card__tag">Core Engine</span>
      </div>

      <div class="bento-card">
        <div class="bento-card__icon">{ }</div>
        <h3 class="bento-card__title">Structured JSON</h3>
        <p class="bento-card__desc">
          Every response is machine-readable JSON with typed fields. Parse results directly into your agent's reasoning pipeline.
        </p>
      </div>

      <div class="bento-card">
        <div class="bento-card__icon">◈</div>
        <h3 class="bento-card__title">Multi-Token Payments</h3>
        <p class="bento-card__desc">
          Accept USDC, EURC, or any ERC-20 token on Base. EIP-3009 for gasless transfers, Permit2 for universal token support. Pay in the stablecoin you prefer.
        </p>
        <span class="bento-card__tag">NEW</span>
      </div>

      <div class="bento-card">
        <div class="bento-card__icon">🔐</div>
        <h3 class="bento-card__title">Sign-In-With-X (SIWX)</h3>
        <p class="bento-card__desc">
          CAIP-122 wallet authentication. Returning buyers prove wallet ownership and access content they already paid for — no repayment needed.
        </p>
        <span class="bento-card__tag">NEW</span>
      </div>

      <div class="bento-card bento-card--large">
        <div class="bento-card__icon">⎔</div>
        <h3 class="bento-card__title">Agent-Native Interface</h3>
        <p class="bento-card__desc">
          Designed for machines, not humans. One endpoint. One method. One payment header. No OAuth flows, no session management. Your agent discovers pricing via the standard x402 manifest and pays inline with each request.
        </p>
        <span class="bento-card__tag">Zero Config</span>
      </div>

      <div class="bento-card">
        <div class="bento-card__icon">⬡</div>
        <h3 class="bento-card__title">Verifiable On-Chain</h3>
        <p class="bento-card__desc">
          Every payment settles on Base L2. Full transaction transparency via BaseScan. Trustless and auditable.
        </p>
      </div>

      <div class="bento-card">
        <div class="bento-card__icon">↯</div>
        <h3 class="bento-card__title">Low Latency</h3>
        <p class="bento-card__desc">
          Deployed on Vercel Edge for sub-second responses globally. Your agent doesn't wait.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ========== CURL EXAMPLE ========== -->
<section class="section" id="try-it">
  <div class="container section-center">
    <span class="section-label fade-in">Try It</span>
    <h2 class="section-title fade-in">Copy. Paste. Research.</h2>
    <p class="section-subtitle fade-in">One curl command — that's all it takes for your agent to access real-time research.</p>

    <div class="curl-section fade-in">
      <div class="code-block">
        <div class="code-block__header">
          <div class="code-block__dots">
            <span class="code-block__dot code-block__dot--red"></span>
            <span class="code-block__dot code-block__dot--yellow"></span>
            <span class="code-block__dot code-block__dot--green"></span>
          </div>
          <div class="code-block__actions">
            <span class="code-block__label">terminal</span>
            <button class="copy-btn" data-copy="curl" aria-label="Copy curl command">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Copy
            </button>
          </div>
        </div>
        <div class="code-block__body">
<pre id="curl-code"><span class="cf">curl</span> <span class="ckw">-X</span> POST https://agentoracle.co/research \\
  <span class="ckw">-H</span> <span class="cs">"Content-Type: application/json"</span> \\
  <span class="ckw">-H</span> <span class="cs">"X-PAYMENT: &lt;x402-payment&gt;"</span> \\
  <span class="ckw">-d</span> <span class="cs">'{"query": "Latest AI agent frameworks 2026"}'</span></pre>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== JSON RESPONSE EXAMPLE ========== -->
<section class="section section--alt" id="response">
  <div class="container">
    <div class="json-section">
      <div class="json-section__text fade-in">
        <span class="section-label">Response Format</span>
        <h2 class="section-title">What Your Agent Gets Back</h2>
        <div class="divider"></div>
        <p>Every response is structured, typed, and ready for your agent's reasoning pipeline. No parsing, no guessing — just clean data.</p>

        <ul class="json-features" role="list">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Concise summary with key facts extracted
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Source URLs with domain attribution
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Confidence score for reliability assessment
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Query metadata with model &amp; timing info
          </li>
        </ul>
      </div>

      <div class="fade-in">
        <div class="code-block">
          <div class="code-block__header">
            <div class="code-block__dots">
              <span class="code-block__dot code-block__dot--red"></span>
              <span class="code-block__dot code-block__dot--yellow"></span>
              <span class="code-block__dot code-block__dot--green"></span>
            </div>
            <div class="code-block__actions">
              <span class="code-block__label">response.json</span>
              <button class="copy-btn" data-copy="json" aria-label="Copy JSON response">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy
              </button>
            </div>
          </div>
          <div class="code-block__body">
<pre id="json-code">{
  <span class="cs">"summary"</span>: <span class="cs">"The leading AI agent frameworks in
    2026 include CrewAI, LangGraph, AutoGen,
    and Mastra, each offering distinct
    approaches to multi-agent orchestration."</span>,
  <span class="cs">"key_facts"</span>: [
    <span class="cs">"CrewAI leads with role-based agents"</span>,
    <span class="cs">"LangGraph offers graph-based workflows"</span>,
    <span class="cs">"AutoGen excels at code generation"</span>,
    <span class="cs">"Mastra is the newest TypeScript-native"</span>
  ],
  <span class="cs">"sources"</span>: [
    {
      <span class="cs">"url"</span>: <span class="cs">"https://docs.crewai.com"</span>,
      <span class="cs">"domain"</span>: <span class="cs">"docs.crewai.com"</span>
    },
    {
      <span class="cs">"url"</span>: <span class="cs">"https://langchain-ai.github.io"</span>,
      <span class="cs">"domain"</span>: <span class="cs">"langchain-ai.github.io"</span>
    }
  ],
  <span class="cs">"confidence_score"</span>: <span class="cn">0.94</span>,
  <span class="cs">"query_metadata"</span>: {
    <span class="cs">"model"</span>: <span class="cs">"sonar"</span>,
    <span class="cs">"latency_ms"</span>: <span class="cn">1240</span>,
    <span class="cs">"cost_usd"</span>: <span class="cn">0.02</span>
  }
}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== HOW IT WORKS ========== -->
<section class="section" id="how-it-works">
  <div class="container">
    <span class="section-label fade-in">Process</span>
    <h2 class="section-title fade-in">Three Steps. No Setup.</h2>
    <p class="section-subtitle fade-in">Your agent goes from zero to real-time research in seconds.</p>

    <div class="steps-grid fade-in">
      <div class="step">
        <div class="step__number">01</div>
        <h3 class="step__title">Discover Pricing</h3>
        <p class="step__desc">
          Your agent fetches the x402 manifest at <code>/.well-known/x402.json</code> to learn the endpoint, price, and accepted tokens (USDC, EURC, or any ERC-20 on Base).
        </p>
      </div>
      <div class="step">
        <div class="step__number">02</div>
        <h3 class="step__title">Send Payment + Query</h3>
        <p class="step__desc">
          POST to <code>/research</code> or <code>/deep-research</code> with a JSON body and an <code>X-PAYMENT</code> header. Pay with USDC, EURC, or sign in with SIWX for repeat access.
        </p>
      </div>
      <div class="step">
        <div class="step__number">03</div>
        <h3 class="step__title">Receive Structured Data</h3>
        <p class="step__desc">
          Get back clean JSON with research results, source citations, confidence scores, and metadata — ready for your agent's next reasoning step.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ========== USE CASES ========== -->
<section class="section section--alt" id="use-cases">
  <div class="container">
    <div class="section-center">
      <span class="section-label fade-in">Use Cases</span>
      <h2 class="section-title fade-in">Real Agent Workflows</h2>
      <p class="section-subtitle fade-in">See how agents use AgentOracle in production — with real cost breakdowns.</p>
    </div>

    <div class="usecase-grid fade-in">
      <!-- Use Case 1: Market Intelligence -->
      <div class="usecase-card">
        <div class="usecase-card__icon">📊</div>
        <h3 class="usecase-card__title">Market Intelligence</h3>
        <p class="usecase-card__desc">Agent researches competitor pricing and market positioning across three dimensions.</p>
        <ul class="usecase-card__queries" role="list">
          <li>"Competitor X pricing model 2026"</li>
          <li>"Market share AI API providers"</li>
          <li>"Developer API pricing trends"</li>
        </ul>
        <div class="usecase-card__cost">
          <span class="usecase-card__cost-label">3 queries · /research</span>
          <span class="usecase-card__cost-value">$0.06</span>
        </div>
      </div>

      <!-- Use Case 2: Due Diligence -->
      <div class="usecase-card">
        <div class="usecase-card__icon">🔍</div>
        <h3 class="usecase-card__title">Due Diligence</h3>
        <p class="usecase-card__desc">Agent verifies a company's claims and cross-references with public records using deep research.</p>
        <ul class="usecase-card__queries" role="list">
          <li>"Company Y revenue claims verification"</li>
          <li>"Company Y regulatory filings analysis"</li>
        </ul>
        <div class="usecase-card__cost">
          <span class="usecase-card__cost-label">2 queries · /deep-research</span>
          <span class="usecase-card__cost-value">$0.20</span>
        </div>
      </div>

      <!-- Use Case 3: Real-Time News -->
      <div class="usecase-card">
        <div class="usecase-card__icon">📡</div>
        <h3 class="usecase-card__title">Real-Time News</h3>
        <p class="usecase-card__desc">Agent monitors breaking developments across multiple topics and synthesizes updates.</p>
        <ul class="usecase-card__queries" role="list">
          <li>"AI regulation updates today"</li>
          <li>"Crypto market events this week"</li>
          <li>"Base network ecosystem news"</li>
          <li>"x402 protocol adoption updates"</li>
          <li>"Agent framework releases 2026"</li>
        </ul>
        <div class="usecase-card__cost">
          <span class="usecase-card__cost-label">5 queries · /research</span>
          <span class="usecase-card__cost-value">$0.10</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== MCP INTEGRATION ========== -->
<section class="section" id="mcp">
  <div class="container">
    <div class="mcp-grid">
      <div class="mcp-info fade-in">
        <span class="section-label">Integration</span>
        <h2 class="section-title">MCP Server</h2>
        <div class="divider"></div>
        <p class="mcp-info__desc">
          Connect AgentOracle to any MCP-compatible client with a single command. Your agent gets research tools without writing any integration code.
        </p>

        <div class="mcp-info__badges">
          <span class="mcp-badge">
            <span class="mcp-badge__dot"></span>
            Claude
          </span>
          <span class="mcp-badge">
            <span class="mcp-badge__dot"></span>
            Cursor
          </span>
          <span class="mcp-badge">
            <span class="mcp-badge__dot"></span>
            Any MCP Client
          </span>
        </div>

        <a href="https://github.com/TKCollective/agentoracle-mcp" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub →
        </a>
      </div>

      <div class="fade-in">
        <div class="mcp-install">
          <div class="mcp-install__header">
            <div class="code-block__dots">
              <span class="code-block__dot code-block__dot--red"></span>
              <span class="code-block__dot code-block__dot--yellow"></span>
              <span class="code-block__dot code-block__dot--green"></span>
            </div>
            <div class="code-block__actions">
              <span class="code-block__label">terminal</span>
              <button class="copy-btn" data-copy="mcp" aria-label="Copy MCP install command">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy
              </button>
            </div>
          </div>
          <div class="mcp-install__body">
            <pre id="mcp-code"><span class="mcp-prefix">$</span> npx agentoracle-mcp</pre>
          </div>
        </div>

        <div style="margin-top: var(--space-4); padding: var(--space-5); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl);">
          <p style="font-size: var(--text-xs); color: var(--color-text-faint); font-family: var(--font-mono); margin-bottom: var(--space-3);">// claude_desktop_config.json</p>
<pre style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); margin: 0; line-height: 1.7;">{
  <span class="cs">"mcpServers"</span>: {
    <span class="cs">"agentoracle"</span>: {
      <span class="cs">"command"</span>: <span class="cs">"npx"</span>,
      <span class="cs">"args"</span>: [<span class="cs">"agentoracle-mcp"</span>]
    }
  }
}</pre>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== PRICING ========== -->
<section class="section section--alt" id="pricing">
  <div class="container">
    <div class="section-center">
      <span class="section-label fade-in">Pricing</span>
      <h2 class="section-title fade-in">Pay Only for What You Use</h2>
      <p class="section-subtitle fade-in">No subscriptions. No minimums. No API keys. Pay per query with USDC or EURC on Base. Returning buyers use SIWX wallet auth.</p>
    </div>

    <div class="pricing-grid fade-in">
      <!-- /research -->
      <div class="pricing-card pricing-card--featured">
        <div class="pricing-card__endpoint">/research</div>
        <div class="pricing-card__price gold-gradient">$0.02</div>
        <div class="pricing-card__unit">per query · USDC or EURC on Base</div>
        <ul class="pricing-card__features" role="list">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Real-time web research
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Structured JSON with citations
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            SIWX wallet auth for repeat access
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            On-chain payment verification
          </li>
        </ul>
        <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--primary" style="width: 100%;" target="_blank" rel="noopener noreferrer">View x402 Manifest →</a>
      </div>

      <!-- /deep-research -->
      <div class="pricing-card">
        <div class="pricing-card__endpoint">/deep-research</div>
        <div class="pricing-card__price gold-gradient">$0.10</div>
        <div class="pricing-card__unit">per query · USDC or EURC on Base</div>
        <ul class="pricing-card__features" role="list">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Multi-step deep analysis
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Comprehensive source verification
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            SIWX wallet auth for repeat access
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Extended context window
          </li>
        </ul>
        <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--ghost" style="width: 100%;" target="_blank" rel="noopener noreferrer">View Manifest →</a>
      </div>
    </div>
  </div>
</section>

<!-- ========== TRUST / ECOSYSTEM BAR ========== -->
<div class="trust-bar">
  <div class="container">
    <div class="trust-bar__label fade-in">Ecosystem &amp; Integrations</div>
    <div class="trust-bar__logos fade-in">
      <a href="https://www.coinbase.com/developer-platform" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M12 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-2.5 8a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-5z" fill="var(--color-bg)"/></svg>
        x402 Protocol
      </a>
      <a href="https://base.org" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M12 6a6 6 0 100 12 6 6 0 000-12z" fill="var(--color-bg)"/><path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" fill="currentColor"/></svg>
        Base Network
      </a>
      <a href="https://aiagents.directory" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
        aiagents.directory
      </a>
      <a href="https://moltbook.com" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        Moltbook Verified
      </a>
      <a href="https://github.com/TKCollective/agentoracle-mcp" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>
    </div>
  </div>
</div>

<!-- ========== TECH SPECS ========== -->
<section class="section" id="specs">
  <div class="container">
    <span class="section-label fade-in">Technical</span>
    <h2 class="section-title fade-in">Specs &amp; Infrastructure</h2>
    <p class="section-subtitle fade-in">Everything under the hood.</p>

    <div class="specs-grid fade-in">
      <div class="spec-item">
        <span class="spec-item__label">Protocol</span>
        <span class="spec-item__value">x402</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Chain</span>
        <span class="spec-item__value">Base (L2)</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Tokens</span>
        <span class="spec-item__value">USDC + EURC</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Token Standard</span>
        <span class="spec-item__value">EIP-3009 + Permit2</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Auth</span>
        <span class="spec-item__value">SIWX (CAIP-122)</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Facilitator</span>
        <span class="spec-item__value">Coinbase CDP</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Research Model</span>
        <span class="spec-item__value">Perplexity Sonar</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Endpoints</span>
        <span class="spec-item__value">/research · /deep-research</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Hosting</span>
        <span class="spec-item__value">Vercel Edge</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Wallet</span>
        <span class="spec-item__value">0xdF902...e109</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">MCP Server</span>
        <span class="spec-item__value">npx agentoracle-mcp</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Response Format</span>
        <span class="spec-item__value">JSON</span>
      </div>
    </div>
  </div>
</section>

<!-- ========== BOTTOM CTA ========== -->
<section class="bottom-cta section">
  <div class="container">
    <div class="bottom-cta__glow"></div>
    <h2 class="bottom-cta__headline fade-in">Give Your Agent a Brain</h2>
    <p class="bottom-cta__sub fade-in">Start querying the real world in minutes. No setup required.</p>
    <div class="bottom-cta__buttons fade-in">
      <a href="https://agentoracle.co/demo" class="btn btn--primary" target="_blank" rel="noopener noreferrer">▶ Watch Demo</a>
      <a href="https://agentoracle.co/health" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">Check Health Status →</a>
      <a href="https://github.com/TKCollective/agentoracle-mcp" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline;margin-right:4px;vertical-align:middle;"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        MCP Server
      </a>
      <a href="https://basescan.org/address/0xdF90200B0031051BbF7a66BB9387d2Ecf599e109" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">View on BaseScan</a>
    </div>
  </div>
</section>

<!-- ========== FOOTER ========== -->
<footer class="footer">
  <div class="container footer__inner">
    <span class="footer__copy">&copy; 2026 AgentOracle. All rights reserved.</span>
    <ul class="footer__links" role="list">
      <li><a href="https://agentoracle.co/.well-known/x402.json" target="_blank" rel="noopener noreferrer">x402 Manifest</a></li>
      <li><a href="https://agentoracle.co/health" target="_blank" rel="noopener noreferrer">API Health</a></li>
      <li><a href="https://github.com/TKCollective/agentoracle-mcp" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="https://basescan.org/address/0xdF90200B0031051BbF7a66BB9387d2Ecf599e109" target="_blank" rel="noopener noreferrer">BaseScan</a></li>
      <li><a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer">Created with Perplexity Computer</a></li>
    </ul>
  </div>
</footer>

<!-- ========== SCRIPTS ========== -->
<script>
(function () {
  "use strict";

  /* ---- Theme Toggle ---- */
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;
  var currentTheme = "dark";

  function setTheme(theme) {
    currentTheme = theme;
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        "Switch to " + (theme === "dark" ? "light" : "dark") + " mode"
      );
      themeToggle.innerHTML =
        theme === "dark"
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  setTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /* ---- Header Scroll Effect ---- */
  var header = document.getElementById("header");

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile Menu ---- */
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  var mobileNav = document.getElementById("mobileNav");
  var mobileLinks = document.querySelectorAll("[data-mobile-link]");
  var mobileOpen = false;

  function toggleMobileMenu() {
    mobileOpen = !mobileOpen;
    mobileNav.classList.toggle("is-open", mobileOpen);
    mobileToggle.setAttribute("aria-expanded", String(mobileOpen));
    mobileToggle.innerHTML = mobileOpen
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", toggleMobileMenu);
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (mobileOpen) toggleMobileMenu();
    });
  });

  /* ---- Copy Buttons ---- */
  var copyTexts = {
    curl: 'curl -X POST https://agentoracle.co/research \\\\\\n  -H "Content-Type: application/json" \\\\\\n  -H "X-PAYMENT: <x402-payment>" \\\\\\n  -d \\'{"query": "Latest AI agent frameworks 2026"}\\'',
    json: '{\\n  "summary": "The leading AI agent frameworks in 2026 include CrewAI, LangGraph, AutoGen, and Mastra...",\\n  "key_facts": [\\n    "CrewAI leads with role-based agents",\\n    "LangGraph offers graph-based workflows",\\n    "AutoGen excels at code generation",\\n    "Mastra is the newest TypeScript-native"\\n  ],\\n  "sources": [\\n    {"url": "https://docs.crewai.com", "domain": "docs.crewai.com"},\\n    {"url": "https://langchain-ai.github.io", "domain": "langchain-ai.github.io"}\\n  ],\\n  "confidence_score": 0.94,\\n  "query_metadata": {\\n    "model": "sonar",\\n    "latency_ms": 1240,\\n    "cost_usd": 0.02\\n  }\\n}',
    mcp: "npx agentoracle-mcp"
  };

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-copy");
      var text = copyTexts[key] || "";
      navigator.clipboard.writeText(text).then(function () {
        btn.classList.add("copied");
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy';
        }, 2000);
      });
    });
  });

  /* ---- Scroll Fade-In ---- */
  var fadeElements = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
</script>
</body>
</html>
`;
