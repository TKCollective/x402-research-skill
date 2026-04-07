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
<title>AgentOracle — Research Intelligence for AI Agents | Confidence Scoring + x402</title>
<meta name="description" content="AgentOracle delivers research intelligence for AI agents — confidence scoring (0.00–1.00), structured JSON output, and x402 payments on Base, SKALE (gasless), and Stellar. Agents don't just retrieve data. They trust it.">

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

  --space-1:  0.25rem; --space-2:  0.5rem; --space-3:  0.75rem;
  --space-4:  1rem; --space-5:  1.25rem; --space-6:  1.5rem;
  --space-8:  2rem; --space-10: 2.5rem; --space-12: 3rem;
  --space-16: 4rem; --space-20: 5rem; --space-24: 6rem; --space-32: 8rem;

  --radius-sm: 0.375rem; --radius-md: 0.5rem; --radius-lg: 0.75rem;
  --radius-xl: 1rem; --radius-2xl: 1.25rem; --radius-full: 9999px;

  --transition-interactive: 180ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);

  --content-narrow: 640px; --content-default: 960px; --content-wide: 1200px;

  --font-display: 'Cabinet Grotesk', 'Helvetica Neue', Arial, sans-serif;
  --font-body: 'General Sans', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

/* === DARK MODE === */
:root, [data-theme="dark"] {
  --color-bg: #0D0D0D; --color-surface: #131313; --color-surface-2: #1A1A1A;
  --color-surface-3: #222222; --color-border: #2A2A2A; --color-border-subtle: #1E1E1E;
  --color-text: #F0ECE2; --color-text-muted: #9A9590; --color-text-faint: #5A5550;
  --color-primary: #C9A96E; --color-primary-hover: #D4A850; --color-primary-dim: #A08850;
  --color-primary-highlight: rgba(201, 169, 110, 0.12);
  --color-primary-glow: rgba(201, 169, 110, 0.06);
  --color-green: #4ADE80; --color-blue: #60A5FA; --color-purple: #A78BFA;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3); --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.15);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.2);
  --shadow-gold-glow: 0 0 30px rgba(201, 169, 110, 0.15), 0 0 60px rgba(201, 169, 110, 0.05);
}

/* === LIGHT MODE === */
[data-theme="light"] {
  --color-bg: #FAFAF7; --color-surface: #FFFFFF; --color-surface-2: #F5F3EE;
  --color-surface-3: #EDEAE5; --color-border: #E0DDD6; --color-border-subtle: #EBE8E2;
  --color-text: #1A1A17; --color-text-muted: #6B6860; --color-text-faint: #A09D96;
  --color-primary: #A08840; --color-primary-hover: #8A7530; --color-primary-dim: #8A7530;
  --color-primary-highlight: rgba(160, 136, 64, 0.1);
  --color-primary-glow: rgba(160, 136, 64, 0.05);
  --color-green: #22C55E; --color-blue: #3B82F6; --color-purple: #8B5CF6;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06); --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 4px 16px rgba(0,0,0,0.08), 0 12px 48px rgba(0,0,0,0.1);
  --shadow-gold-glow: 0 0 30px rgba(160, 136, 64, 0.1), 0 0 60px rgba(160, 136, 64, 0.03);
}

/* === RESET === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html {
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility; scroll-behavior: smooth;
  scroll-padding-top: var(--space-20);
}
body {
  min-height: 100dvh; line-height: 1.6; font-family: var(--font-body);
  font-size: var(--text-base); color: var(--color-text); background-color: var(--color-bg);
  overflow-x: hidden;
}
img, picture, video, canvas, svg { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; color: inherit; }
h1, h2, h3, h4, h5, h6 { text-wrap: balance; line-height: 1.15; font-family: var(--font-display); }
p, li, figcaption { text-wrap: pretty; max-width: 72ch; }
::selection { background: var(--color-primary-highlight); color: var(--color-text); }
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; border-radius: var(--radius-sm); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important;
  }
}
button { cursor: pointer; background: none; border: none; }
table { border-collapse: collapse; width: 100%; }
a, button, [role="button"], input, textarea, select {
  transition: color var(--transition-interactive), background var(--transition-interactive),
              border-color var(--transition-interactive), box-shadow var(--transition-interactive);
}
a { color: var(--color-primary); text-decoration: none; }
a:hover { color: var(--color-primary-hover); }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
}

/* === LAYOUT === */
.container { width: 100%; max-width: var(--content-wide); margin: 0 auto; padding-inline: var(--space-6); }
@media (min-width: 768px) { .container { padding-inline: var(--space-8); } }

.section { padding-block: clamp(var(--space-20), 10vw, var(--space-32)); position: relative; }
.section--alt { background: var(--color-surface); }
.section-label {
  display: inline-block; font-family: var(--font-body); font-size: var(--text-xs);
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--color-primary); margin-bottom: var(--space-5);
}
.section-title {
  font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 800;
  color: var(--color-text); line-height: 1.1; margin-bottom: var(--space-5);
}
.section-subtitle {
  font-size: var(--text-base); color: var(--color-text-muted); line-height: 1.7;
  max-width: 600px; margin-bottom: var(--space-12);
}
.section-center { text-align: center; }
.section-center .section-subtitle { margin-inline: auto; }

/* === ANNOUNCEMENT BAR (Category 6) === */
.announcement-bar {
  background: var(--color-surface-2); border-bottom: 1px solid var(--color-border);
  text-align: center; padding: 8px var(--space-4);
  font-size: var(--text-xs); font-weight: 600; color: var(--color-text);
}
.announcement-bar a { color: var(--color-primary); text-decoration: underline; text-underline-offset: 2px; }

/* === HEADER === */
.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(13, 13, 13, 0.88); backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: box-shadow var(--transition-slow);
}
[data-theme="light"] .header { background: rgba(250, 250, 247, 0.9); }
.header--scrolled { box-shadow: var(--shadow-sm); }
.header__inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.header__brand { display: flex; align-items: center; gap: var(--space-3); text-decoration: none; color: var(--color-text); }
.header__logo { width: 32px; height: 32px; object-fit: contain; }
.header__wordmark {
  font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm);
  letter-spacing: 0.02em; color: var(--color-primary);
}
.header__nav { display: none; align-items: center; gap: var(--space-8); }
@media (min-width: 768px) { .header__nav { display: flex; } }
.header__nav-link {
  font-size: var(--text-sm); font-weight: 500; color: var(--color-text-muted);
  text-decoration: none; letter-spacing: 0.01em; position: relative;
}
.header__nav-link:hover { color: var(--color-text); }
.header__actions { display: flex; align-items: center; gap: var(--space-3); }
.theme-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--radius-md);
  color: var(--color-text-muted); border: 1px solid transparent;
}
.theme-toggle:hover { color: var(--color-text); background: var(--color-primary-highlight); border-color: var(--color-border); }
.mobile-menu-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; color: var(--color-text-muted);
}
@media (min-width: 768px) { .mobile-menu-btn { display: none; } }
.mobile-menu-btn:hover { color: var(--color-text); }
.mobile-nav {
  display: none; position: fixed; inset: 64px 0 0 0; background: var(--color-bg);
  z-index: 99; padding: var(--space-8) var(--space-6); flex-direction: column; gap: var(--space-6);
}
.mobile-nav.is-open { display: flex; }
.mobile-nav__link {
  font-family: var(--font-display); font-size: var(--text-lg); font-weight: 700;
  color: var(--color-text); text-decoration: none; padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}
.mobile-nav__link:hover { color: var(--color-primary); }

.header__status {
  display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); font-weight: 600;
  color: var(--color-text-muted); padding: var(--space-1) var(--space-3);
  background: var(--color-surface-2); border: 1px solid var(--color-border);
  border-radius: var(--radius-full); text-decoration: none; white-space: nowrap;
}
.header__status:hover { border-color: var(--color-green); color: var(--color-text); }
.header__status-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--color-green);
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.5); animation: status-pulse 2.5s ease-in-out infinite;
}
.header__status-dot--offline { background: #EF4444; box-shadow: 0 0 6px rgba(239, 68, 68, 0.5); animation: none; }
.header__status-dot--checking { background: var(--color-text-faint); box-shadow: none; animation: status-pulse 1s ease-in-out infinite; }
@keyframes status-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@media (max-width: 768px) { .header__status { display: none; } }

/* === BUTTONS === */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600;
  padding: var(--space-3) var(--space-6); border-radius: var(--radius-lg);
  text-decoration: none; white-space: nowrap; cursor: pointer; border: none;
}
.btn--primary { background: var(--color-primary); color: #0D0D0D; }
.btn--primary:hover { background: var(--color-primary-hover); box-shadow: var(--shadow-gold-glow); }
.btn--ghost { background: transparent; color: var(--color-text); border: 1px solid var(--color-border); }
.btn--ghost:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-highlight); }
.btn--small { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }

/* Hero CTA LARGE (Cat 4) */
.btn--hero {
  padding: var(--space-4) var(--space-10); font-size: var(--text-base); font-weight: 700;
  border-radius: var(--radius-xl); animation: cta-glow 3s ease-in-out infinite;
  position: relative; overflow: hidden;
}
.btn--hero:hover {
  background: var(--color-primary-hover) !important;
  color: #0D0D0D !important;
  box-shadow: 0 0 35px rgba(201,169,110,0.45), 0 0 70px rgba(201,169,110,0.2), inset 0 0 20px rgba(255,255,255,0.15);
  animation: none;
  transform: translateY(-1px);
}
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(201,169,110,0.2), 0 0 40px rgba(201,169,110,0.1); }
  50% { box-shadow: 0 0 30px rgba(201,169,110,0.35), 0 0 60px rgba(201,169,110,0.15); }
}

/* === HERO === */
.hero { position: relative; padding-top: clamp(var(--space-16), 10vw, var(--space-32)); padding-bottom: clamp(var(--space-16), 8vw, var(--space-24)); overflow: hidden; }
.hero__glow { position: absolute; top: -20%; right: -10%; width: 70%; height: 120%; background: radial-gradient(ellipse at 60% 40%, rgba(201, 169, 110, 0.07) 0%, transparent 70%); pointer-events: none; z-index: 0; }
[data-theme="light"] .hero__glow { background: radial-gradient(ellipse at 60% 40%, rgba(160, 136, 64, 0.05) 0%, transparent 70%); }

/* Enhanced particles (Cat 2) */
.hero__particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
.hero__particle { position: absolute; opacity: 0; animation: float-up linear infinite; }
.hero__particle--diamond { width: 12px; height: 12px; border: 1.5px solid rgba(201, 169, 110, 0.3); transform: rotate(45deg); }
.hero__particle--hexagon { width: 14px; height: 14px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); box-shadow: inset 0 0 0 1.5px rgba(201, 169, 110, 0.25); }
.hero__particle--dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(201, 169, 110, 0.25); }
.hero__particle--cross { width: 10px; height: 10px; position: relative; }
.hero__particle--cross::before, .hero__particle--cross::after {
  content: ''; position: absolute; background: rgba(201,169,110,0.2);
}
.hero__particle--cross::before { width: 10px; height: 2px; top: 4px; left: 0; }
.hero__particle--cross::after { width: 2px; height: 10px; top: 0; left: 4px; }
.hero__particle--ring { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid rgba(201,169,110,0.15); }

@keyframes float-up {
  0% { opacity: 0; transform: translateY(100%) rotate(0deg); }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-100vh) rotate(180deg); }
}
.hero__particle:nth-child(1)  { left: 3%;  animation-duration: 16s; animation-delay: 0s; }
.hero__particle:nth-child(2)  { left: 10%; animation-duration: 22s; animation-delay: 2s; }
.hero__particle:nth-child(3)  { left: 18%; animation-duration: 18s; animation-delay: 1s; }
.hero__particle:nth-child(4)  { left: 27%; animation-duration: 24s; animation-delay: 5s; }
.hero__particle:nth-child(5)  { left: 35%; animation-duration: 19s; animation-delay: 3s; }
.hero__particle:nth-child(6)  { left: 43%; animation-duration: 21s; animation-delay: 7s; }
.hero__particle:nth-child(7)  { left: 52%; animation-duration: 23s; animation-delay: 4s; }
.hero__particle:nth-child(8)  { left: 60%; animation-duration: 17s; animation-delay: 6s; }
.hero__particle:nth-child(9)  { left: 68%; animation-duration: 25s; animation-delay: 1.5s; }
.hero__particle:nth-child(10) { left: 76%; animation-duration: 20s; animation-delay: 8s; }
.hero__particle:nth-child(11) { left: 83%; animation-duration: 26s; animation-delay: 10s; }
.hero__particle:nth-child(12) { left: 90%; animation-duration: 22s; animation-delay: 12s; }
.hero__particle:nth-child(13) { left: 7%;  animation-duration: 28s; animation-delay: 3s; }
.hero__particle:nth-child(14) { left: 47%; animation-duration: 15s; animation-delay: 9s; }
.hero__particle:nth-child(15) { left: 72%; animation-duration: 20s; animation-delay: 11s; }
.hero__particle:nth-child(16) { left: 95%; animation-duration: 24s; animation-delay: 2s; }

[data-theme="light"] .hero__particle--diamond { border-color: rgba(160, 136, 64, 0.25); }
[data-theme="light"] .hero__particle--hexagon { box-shadow: inset 0 0 0 1.5px rgba(160, 136, 64, 0.2); }
[data-theme="light"] .hero__particle--dot { background: rgba(160, 136, 64, 0.2); }

.hero__inner { display: grid; grid-template-columns: 1fr; gap: var(--space-12); align-items: center; position: relative; z-index: 2; }
@media (min-width: 900px) { .hero__inner { grid-template-columns: 1fr 1fr; gap: var(--space-10); } }
.hero__content { text-align: left; }
.hero__badge {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-5); background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.25); border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 600; color: #4ADE80; margin-bottom: var(--space-8);
  font-family: var(--font-mono); letter-spacing: 0.02em;
}
.hero__badge-dot { width: 8px; height: 8px; background: #4ADE80; border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(201, 169, 110, 0); }
}
.hero__headline {
  font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 800;
  line-height: 1.05; color: var(--color-text); margin-bottom: var(--space-6); letter-spacing: -0.02em;
}
.gold-text {
  background: linear-gradient(135deg, #C9A96E 0%, #D4A850 50%, #E8C878 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
[data-theme="light"] .gold-text {
  background: linear-gradient(135deg, #A08840 0%, #8A7530 50%, #B59A48 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero__subtitle { font-size: var(--text-base); color: var(--color-text-muted); line-height: 1.7; max-width: 520px; margin-bottom: var(--space-4); }
.hero__secondary-tagline { font-size: var(--text-xs); color: var(--color-primary); font-weight: 600; margin-bottom: var(--space-8); letter-spacing: 0.05em; }
.hero__ctas { display: flex; flex-wrap: wrap; gap: var(--space-4); }

/* === CODE BLOCK === */
.code-block {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-card); max-width: 100%;
}
.code-block:hover { box-shadow: var(--shadow-card-hover); }
.code-block__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}
.code-block__dots { display: flex; gap: 6px; }
.code-block__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--color-border); }
.code-block__dot--red { background: #FF5F57; }
.code-block__dot--yellow { background: #FEBC2E; }
.code-block__dot--green { background: #28C840; }
.code-block__label { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-faint); }
.code-block__actions { display: flex; align-items: center; gap: var(--space-3); }
.copy-btn {
  display: flex; align-items: center; gap: var(--space-1); font-family: var(--font-mono);
  font-size: 11px; color: var(--color-text-faint); padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-surface); cursor: pointer;
}
.copy-btn:hover { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-primary-highlight); }
.copy-btn.copied { color: var(--color-green); border-color: var(--color-green); }
.code-block__body { padding: var(--space-5); overflow-x: auto; }
.code-block__body pre {
  font-family: var(--font-mono); font-size: clamp(0.72rem, 0.65rem + 0.3vw, 0.82rem);
  line-height: 1.75; color: var(--color-text-muted); white-space: pre; margin: 0; overflow-x: auto;
}
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

/* Typing cursor (Cat 2) */
.typing-cursor { display: inline-block; width: 2px; height: 1em; background: var(--color-primary); animation: blink-cursor 1s step-end infinite; vertical-align: text-bottom; margin-left: 2px; }
@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* === STATS BAR === */
.stats-bar { padding-block: var(--space-8); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
.stats-bar__inner { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-4); }
.stat-pill {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-5); background: var(--color-surface-2);
  border: 1px solid var(--color-border); border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 600; color: var(--color-text); white-space: nowrap;
}
.stat-pill__icon { color: var(--color-primary); font-size: 10px; line-height: 1; }

/* Social proof numbers (Cat 6) */
.social-proof {
  text-align: center; padding: var(--space-6) 0; font-size: var(--text-sm);
  color: var(--color-text-muted); font-weight: 500;
}
.social-proof strong { color: var(--color-primary); font-weight: 700; font-size: var(--text-base); }

/* === FEATURE LIST (Two-Column) === */
.feature-list { display: grid; grid-template-columns: 1fr; gap: 0; max-width: 1060px; margin: 0 auto; padding: 2rem 0 0; }
@media (min-width: 768px) { .feature-list { grid-template-columns: 1fr 1px 1fr; padding: 3rem 0 0; } }
.feature-list__divider { display: none; }
@media (min-width: 768px) { .feature-list__divider { display: block; background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.12) 20%, rgba(201,169,110,0.12) 80%, transparent); width: 1px; } }
.feature-col { display: flex; flex-direction: column; gap: 0.5rem; }
@media (min-width: 768px) { .feature-col { gap: 0.75rem; } }
.feature-row {
  display: flex; align-items: flex-start; gap: 1.25rem; padding: 1.75rem 1.5rem;
  transition: background 0.35s ease;
  border-radius: 14px; margin: 0 0.25rem;
}
@media (min-width: 768px) { .feature-row { padding: 2rem 1.75rem; } }
.feature-row:hover { background: rgba(201, 169, 110, 0.025); }
.feature-row__icon {
  flex-shrink: 0; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center;
  border-radius: 13px; background: transparent;
  border: 1px solid rgba(201, 169, 110, 0.07);
  transition: box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease;
}
.feature-row:hover .feature-row__icon { box-shadow: 0 0 24px rgba(201, 169, 110, 0.08); border-color: rgba(201, 169, 110, 0.18); background: rgba(201, 169, 110, 0.03); }
.feature-row__icon svg { width: 22px; height: 22px; stroke: var(--color-primary); fill: none; stroke-width: 1.25; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
.feature-row:hover .feature-row__icon svg { opacity: 1; }
.feature-row__content { flex: 1; padding-top: 4px; }
.feature-row__title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; color: var(--color-text); margin-bottom: 8px; letter-spacing: -0.01em; }
.feature-row__desc { font-size: 0.855rem; color: var(--color-text-muted); line-height: 1.7; letter-spacing: 0.005em; }
.feature-row__badge { display: inline-block; font-size: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #0D0D0D; background: var(--color-green); padding: 2px 8px; border-radius: 4px; margin-left: 8px; vertical-align: middle; position: relative; top: -1px; }
.feature-row__badge--new { background: #C9A96E; }
/* Keep old bento classes hidden */
.bento-grid { display: none !important; }
.bento-card, .bento-card--large, .bento-card__icon, .bento-card__title, .bento-card__desc, .bento-card__tag, .bento-card__badge-new { display: none !important; }

/* === FLOW DIAGRAM (Cat 2) === */
.flow-diagram { display: flex; flex-direction: column; align-items: center; gap: var(--space-6); margin-top: var(--space-12); }
@media (min-width: 768px) { .flow-diagram { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 0; max-width: 100%; } }
.flow-step {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: var(--space-6) var(--space-4); background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-xl);
  position: relative;
  transition: border-color var(--transition-interactive), box-shadow var(--transition-slow), transform var(--transition-slow);
}
.flow-step:hover { border-color: rgba(201,169,110,0.3); box-shadow: var(--shadow-card-hover), 0 0 30px rgba(201,169,110,0.08); transform: translateY(-2px); }
.flow-step__icon {
  width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-highlight); border: 2px solid rgba(201,169,110,0.3); margin-bottom: var(--space-4);
  font-size: 24px;
}
.flow-step__label { font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); color: var(--color-text); margin-bottom: var(--space-2); }
.flow-step__desc { font-size: var(--text-xs); color: var(--color-text-muted); max-width: 180px; }
.flow-arrow {
  display: flex; align-items: center; justify-content: center; color: var(--color-primary); font-size: 24px;
  padding: 0 var(--space-3); position: relative;
}
.flow-arrow svg { animation: arrow-pulse 2s ease-in-out infinite; }
@keyframes arrow-pulse { 0%, 100% { opacity: 0.5; transform: translateX(0); } 50% { opacity: 1; transform: translateX(4px); } }
@media (max-width: 767px) {
  .flow-arrow svg { transform: rotate(90deg); }
  @keyframes arrow-pulse { 0%, 100% { opacity: 0.5; transform: rotate(90deg) translateX(0); } 50% { opacity: 1; transform: rotate(90deg) translateX(4px); } }
}

/* === HOW IT WORKS === */
.steps-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-10); }
@media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-12); } }
.step { position: relative; }
.step__number { font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 800; color: var(--color-primary-highlight); line-height: 1; margin-bottom: var(--space-4); user-select: none; }
[data-theme="light"] .step__number { color: rgba(160, 136, 64, 0.15); }
.step__title { font-family: var(--font-display); font-size: var(--text-lg); font-weight: 700; color: var(--color-text); margin-bottom: var(--space-3); }
.step__desc { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; }
.step__desc code { font-family: var(--font-mono); font-size: 0.85em; color: var(--color-primary); background: var(--color-primary-highlight); padding: 2px 6px; border-radius: var(--radius-sm); }

/* === USE CASE CARDS === */
.usecase-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-8); }
@media (min-width: 768px) { .usecase-grid { grid-template-columns: repeat(3, 1fr); } }
.usecase-card {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); padding: var(--space-10);
  transition: border-color var(--transition-interactive), box-shadow var(--transition-slow), transform var(--transition-slow);
  display: flex; flex-direction: column;
}
.usecase-card:hover { border-color: rgba(201, 169, 110, 0.3); box-shadow: var(--shadow-card-hover), 0 0 30px rgba(201, 169, 110, 0.08); transform: translateY(-4px); }
.usecase-card__icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--color-primary-highlight); border: 1px solid rgba(201, 169, 110, 0.2); border-radius: var(--radius-lg); font-size: 20px; margin-bottom: var(--space-5); }
.usecase-card__title { font-family: var(--font-display); font-size: var(--text-lg); font-weight: 700; color: var(--color-text); margin-bottom: var(--space-3); }
.usecase-card__desc { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--space-5); }
.usecase-card__queries { list-style: none; padding: 0; margin: 0 0 var(--space-5) 0; flex-grow: 1; }
.usecase-card__queries li { display: flex; align-items: flex-start; gap: var(--space-2); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-subtle); }
.usecase-card__queries li:last-child { border-bottom: none; }
.usecase-card__queries li::before { content: '\\2192'; color: var(--color-primary); flex-shrink: 0; }
.usecase-card__cost { display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4); background: var(--color-primary-highlight); border-radius: var(--radius-lg); margin-top: auto; }
.usecase-card__cost-label { font-size: var(--text-xs); font-weight: 500; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.usecase-card__cost-value { font-family: var(--font-display); font-size: var(--text-lg); font-weight: 800; color: var(--color-primary); }

/* Section CTA (Cat 4) */
.section-cta { text-align: center; margin-top: var(--space-12); }
.section-cta .btn { display: inline-flex; }

/* MCP */
.mcp-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-10); align-items: center; }
@media (min-width: 900px) { .mcp-grid { grid-template-columns: 1fr 1fr; } }
.mcp-info__desc { font-size: var(--text-base); color: var(--color-text-muted); line-height: 1.7; margin-bottom: var(--space-6); }
.mcp-info__badges { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-6); }
.mcp-badge { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; color: var(--color-text); }
.mcp-badge__dot { width: 6px; height: 6px; background: var(--color-green); border-radius: 50%; }
.mcp-install { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); overflow: hidden; }
.mcp-install__header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--color-border); background: var(--color-surface-2); }
.mcp-install__body { padding: var(--space-5); }
.mcp-install__body pre { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-primary); margin: 0; }
.mcp-prefix { color: var(--color-text-faint); }

/* === PRICING === */
.pricing-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-8); max-width: 1100px; margin: 0 auto; }
@media (min-width: 640px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 960px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }
.pricing-card {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); padding: var(--space-10); position: relative; overflow: hidden;
  transition: border-color var(--transition-interactive), box-shadow var(--transition-slow), transform var(--transition-slow);
}
.pricing-card:hover { border-color: rgba(201, 169, 110, 0.3); box-shadow: var(--shadow-card-hover), 0 0 30px rgba(201, 169, 110, 0.08); transform: translateY(-4px); }
.pricing-card--green::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, var(--color-green), transparent); }
.pricing-card--green { border-color: rgba(74, 222, 128, 0.15); }
.pricing-card--green:hover { border-color: rgba(74, 222, 128, 0.3); box-shadow: var(--shadow-card-hover), 0 0 30px rgba(74, 222, 128, 0.08); }
.pricing-card--featured { border-color: rgba(201, 169, 110, 0.25); }
.pricing-card--featured::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, var(--color-primary), transparent); }
.pricing-card--purple::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, var(--color-purple), transparent); }
.pricing-card--purple { border-color: rgba(167, 139, 250, 0.15); }
.pricing-card--purple:hover { border-color: rgba(167, 139, 250, 0.3); box-shadow: var(--shadow-card-hover), 0 0 30px rgba(167, 139, 250, 0.08); }
.pricing-card__endpoint { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-faint); margin-bottom: var(--space-4); text-transform: uppercase; letter-spacing: 0.06em; }
.pricing-card__price { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-2); }
.pricing-card__unit { font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-6); }
.pricing-card__features { list-style: none; padding: 0; margin: 0 0 var(--space-6) 0; }
.pricing-card__features li { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-2) 0; font-size: var(--text-sm); color: var(--color-text); }
.pricing-card__features li svg { flex-shrink: 0; color: var(--color-primary); margin-top: 3px; }
/* Most Popular badge (Cat 5) */
.pricing-badge-popular {
  position: absolute; top: 16px; right: -28px; background: var(--color-primary); color: #0D0D0D;
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  padding: 4px 40px; transform: rotate(45deg); z-index: 2;
}

/* === TRUST BAR === */
.trust-bar { padding-block: var(--space-12); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }
.trust-bar__label { text-align: center; font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-faint); margin-bottom: var(--space-6); }
.trust-bar__logos { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-6); }
@media (min-width: 768px) { .trust-bar__logos { gap: var(--space-10); } }
.trust-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color var(--transition-interactive); white-space: nowrap; }
.trust-item:hover { color: var(--color-text); }
.trust-item svg { width: 20px; height: 20px; opacity: 0.6; }
.trust-item:hover svg { opacity: 1; }

/* Built On bar (Cat 6) */
.built-on-bar { padding-block: var(--space-8); border-bottom: 1px solid var(--color-border); }
.built-on-bar__label { text-align: center; font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-faint); margin-bottom: var(--space-5); }
.built-on-bar__logos { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-8); }
.built-on-item { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted); padding: var(--space-2) var(--space-4); background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-full); }

/* === ERROR CARDS === */
.error-cards { display: grid; grid-template-columns: 1fr; gap: var(--space-5); max-width: 800px; }
.error-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); overflow: hidden; transition: border-color var(--transition-interactive); }
.error-card:hover { border-color: rgba(201, 169, 110, 0.2); }
.error-card__header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-5) var(--space-6); cursor: pointer; user-select: none; gap: var(--space-4); }
.error-card__header:hover { background: var(--color-surface-2); }
.error-card__left { display: flex; align-items: center; gap: var(--space-4); }
.error-card__code { font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 600; color: var(--color-primary); padding: var(--space-1) var(--space-3); background: var(--color-primary-highlight); border-radius: var(--radius-sm); white-space: nowrap; }
.error-card__name { font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm); color: var(--color-text); }
.error-card__chevron { transition: transform 0.3s ease; color: var(--color-text-faint); flex-shrink: 0; }
.error-card.is-open .error-card__chevron { transform: rotate(180deg); }
.error-card__body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.error-card.is-open .error-card__body { max-height: 200px; }
.error-card__body-inner { padding: 0 var(--space-6) var(--space-6) var(--space-6); font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.7; font-family: var(--font-mono); }

/* === LIVE DEMO === */
.live-demo { max-width: 720px; margin: 0 auto; }
.live-demo__form { display: flex; gap: var(--space-3); margin-bottom: var(--space-3); }
.live-demo__input { flex: 1; padding: var(--space-3) var(--space-5); font-family: var(--font-body); font-size: var(--text-sm); color: var(--color-text); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); outline: none; transition: border-color var(--transition-interactive), box-shadow var(--transition-interactive); }
.live-demo__input::placeholder { color: var(--color-text-faint); }
.live-demo__input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-highlight); }
.live-demo__btn { padding: var(--space-3) var(--space-8); font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; color: #0D0D0D; background: var(--color-primary); border: none; border-radius: var(--radius-lg); cursor: pointer; white-space: nowrap; transition: background var(--transition-interactive), box-shadow var(--transition-interactive); display: inline-flex; align-items: center; gap: var(--space-2); }
.live-demo__btn:hover { background: var(--color-primary-hover); box-shadow: var(--shadow-gold-glow); }
.live-demo__btn:disabled { opacity: 0.6; cursor: not-allowed; }
.live-demo__spinner { display: none; width: 16px; height: 16px; border: 2px solid rgba(13, 13, 13, 0.3); border-top-color: #0D0D0D; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.live-demo__btn.is-loading .live-demo__spinner { display: inline-block; }
.live-demo__btn.is-loading .live-demo__btn-text { display: none; }
.live-demo__result { display: none; }
.live-demo__result.is-visible { display: block; }
.live-demo__error { display: none; padding: var(--space-4) var(--space-5); background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-lg); color: #EF4444; font-size: var(--text-sm); font-family: var(--font-mono); }
.live-demo__error.is-visible { display: block; }
.live-demo__hint { text-align: center; font-size: var(--text-xs); color: var(--color-text-faint); margin-bottom: var(--space-6); }
.live-demo__hint kbd { display: inline-block; padding: 2px 8px; background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.8em; }

/* === SPECS === */
.specs-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 640px) { .specs-grid { grid-template-columns: repeat(2, 1fr); } }
.spec-item { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-4); padding: var(--space-4) var(--space-5); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
.spec-item__label { font-size: var(--text-sm); color: var(--color-text-muted); font-weight: 500; }
.spec-item__value { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text); font-weight: 500; text-align: right; word-break: break-all; }

/* === COMPARISON TABLE === */
.compare-section { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.compare-table { width: 100%; min-width: 700px; border-collapse: separate; border-spacing: 0; font-size: var(--text-sm); }
.compare-table thead th { padding: var(--space-4) var(--space-5); text-align: left; font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm); color: var(--color-text-muted); border-bottom: 2px solid var(--color-border); white-space: nowrap; }
.compare-table thead th:first-child { color: var(--color-text-faint); font-weight: 500; }
.compare-table thead th.compare-highlight { color: var(--color-primary); }
.compare-table tbody td { padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--color-border-subtle); color: var(--color-text); vertical-align: middle; }
.compare-table tbody tr:last-child td { border-bottom: none; }
.compare-table tbody td:first-child { font-weight: 600; color: var(--color-text-muted); white-space: nowrap; }
.compare-table tbody td.compare-highlight { background: var(--color-primary-highlight); }
.compare-table .check-yes { color: var(--color-primary); font-weight: 700; }
.compare-table .check-no { color: var(--color-text-faint); }
.compare-table-wrapper { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); overflow: hidden; }
.compare-mobile-cards { display: none; }
.compare-note { text-align: center; font-size: var(--text-xs); color: var(--color-text-faint); margin-top: var(--space-4); }

/* === FAQ === */
.faq-grid { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-4); }
.faq-item { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); overflow: hidden; transition: border-color var(--transition-interactive); }
.faq-item:hover { border-color: rgba(201, 169, 110, 0.25); }
.faq-item__trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-5) var(--space-6); background: none; border: none; cursor: pointer; text-align: left; font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; color: var(--color-text); min-height: 44px; }
.faq-item__trigger:hover { color: var(--color-primary); }
.faq-item__icon { flex-shrink: 0; width: 20px; height: 20px; color: var(--color-text-faint); transition: transform 0.3s ease, color 0.2s ease; }
.faq-item.is-open .faq-item__icon { transform: rotate(180deg); color: var(--color-primary); }
.faq-item__body { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.faq-item.is-open .faq-item__body { max-height: 300px; }
.faq-item__answer { padding: 0 var(--space-6) var(--space-6) var(--space-6); font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.7; }
.faq-item__answer code { font-family: var(--font-mono); font-size: 0.85em; color: var(--color-primary); background: var(--color-primary-highlight); padding: 2px 6px; border-radius: var(--radius-sm); }

/* === COLLAPSIBLE === */
.collapsible-toggle { display: inline-flex; align-items: center; gap: var(--space-2); font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500; color: var(--color-primary); padding: var(--space-3) var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); cursor: pointer; margin-bottom: var(--space-4); }
.collapsible-toggle:hover { border-color: var(--color-primary); background: var(--color-primary-highlight); }
.collapsible-content { max-height: 0; overflow: hidden; transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; opacity: 0; }
.collapsible-content.is-open { max-height: 800px; opacity: 1; }

/* JSON features */
.json-section { display: grid; grid-template-columns: 1fr; gap: var(--space-12); align-items: start; }
@media (min-width: 900px) { .json-section { grid-template-columns: 1fr 1fr; } }
.json-features { list-style: none; padding: 0; margin: 0; }
.json-features li { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3) 0; font-size: var(--text-sm); color: var(--color-text); }
.json-features li svg { flex-shrink: 0; color: var(--color-primary); margin-top: 3px; }
.divider { width: 60px; height: 2px; background: var(--color-primary); opacity: 0.4; margin: var(--space-6) 0; }
.section-center .divider { margin-inline: auto; }

/* === BOTTOM CTA (Cat 4 - enhanced) === */
.bottom-cta {
  text-align: center; padding-block: clamp(var(--space-20), 10vw, var(--space-32));
  position: relative; overflow: hidden;
  background: linear-gradient(180deg, var(--color-bg) 0%, rgba(201,169,110,0.04) 50%, var(--color-bg) 100%);
}
.bottom-cta__glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 500px; background: radial-gradient(ellipse, rgba(201, 169, 110, 0.08) 0%, transparent 70%); pointer-events: none; }
.bottom-cta__headline { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 800; color: var(--color-text); margin-bottom: var(--space-4); position: relative; z-index: 1; }
.bottom-cta__sub { font-size: var(--text-lg); color: var(--color-text-muted); margin-bottom: var(--space-10); max-width: 600px; margin-inline: auto; position: relative; z-index: 1; }
.bottom-cta__buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-4); position: relative; z-index: 1; }

/* === FOOTER === */
.footer { border-top: 1px solid var(--color-border); padding-block: var(--space-16); }
.footer__grid { display: grid; grid-template-columns: 1fr; gap: var(--space-10); margin-bottom: var(--space-12); }
@media (min-width: 768px) { .footer__grid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: var(--space-8); } }
.footer__brand-col { max-width: 280px; }
.footer__brand-logo { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); text-decoration: none; color: var(--color-text); }
.footer__brand-logo svg { display: inline-block; }
.footer__brand-logo span { font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm); color: var(--color-primary); }
.footer__tagline { font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--space-6); }
.footer__socials { display: flex; gap: var(--space-4); }
.footer__social-link { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: var(--radius-md); border: 1px solid var(--color-border); color: var(--color-text-muted); transition: all var(--transition-interactive); }
.footer__social-link:hover { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-primary-highlight); }
.footer__social-link svg { width: 16px; height: 16px; }
.footer__col-title { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text); margin-bottom: var(--space-5); }
.footer__col-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-3); }
.footer__col-links a { font-size: var(--text-sm); color: var(--color-text-muted); text-decoration: none; }
.footer__col-links a:hover { color: var(--color-primary); }
.footer__bottom { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); padding-top: var(--space-8); border-top: 1px solid var(--color-border); text-align: center; }
@media (min-width: 640px) { .footer__bottom { flex-direction: row; justify-content: space-between; text-align: left; } }
.footer__copy { font-size: var(--text-xs); color: var(--color-text-faint); }
.footer__attribution { font-size: var(--text-xs); color: var(--color-text-faint); }
.footer__attribution a { color: var(--color-text-muted); text-decoration: none; }
.footer__attribution a:hover { color: var(--color-primary); }

/* Gold gradient */
.gold-gradient { background: linear-gradient(135deg, #C9A96E 0%, #D4A850 50%, #E8C878 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
[data-theme="light"] .gold-gradient { background: linear-gradient(135deg, #A08840 0%, #8A7530 50%, #B59A48 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* === SCROLL FADE IN (Cat 5) === */
.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-in.is-visible { opacity: 1; transform: translateY(0); }

/* Back to Top (Cat 5) */
.back-to-top {
  position: fixed; bottom: 24px; right: 24px; z-index: 90;
  width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--color-primary); color: #0D0D0D; border: none; cursor: pointer;
  box-shadow: var(--shadow-md); opacity: 0; transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.back-to-top.is-visible { opacity: 1; transform: translateY(0); }
.back-to-top:hover { background: var(--color-primary-hover); box-shadow: var(--shadow-gold-glow); }

/* ==== RESPONSIVE / MOBILE ==== */
@media (max-width: 640px) {
  .hero__headline { font-size: clamp(2rem, 1rem + 5vw, 3rem); }
  .section-title { font-size: clamp(1.5rem, 1rem + 3vw, 2.5rem); }
  .code-block__body pre { font-size: 0.7rem; }
}
@media (max-width: 768px) {
  html, body { overflow-x: hidden; max-width: 100vw; }
  .container { padding-inline: var(--space-4); max-width: 100%; }
  .hero__inner { grid-template-columns: 1fr !important; gap: var(--space-8); }
  .hero__content { max-width: 100%; }
  .hero__headline { font-size: clamp(1.75rem, 6vw, 2.5rem); }
  .hero__code-wrapper, .code-block { max-width: 100%; overflow: hidden; }
  .code-block__body { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .code-block__body pre { font-size: 0.65rem; white-space: pre; min-width: 0; }
  .stats-bar__inner { flex-wrap: wrap; justify-content: center; gap: var(--space-3); }
  .stat-pill { font-size: var(--text-xs); padding: var(--space-2) var(--space-3); }
  .bento-grid { grid-template-columns: 1fr !important; }
  .bento-card--large { grid-column: 1 !important; }
  .bento-card { min-height: auto; }
  .steps-grid { grid-template-columns: 1fr !important; }
  .pricing-grid { grid-template-columns: 1fr !important; }
  .pricing-card { max-width: 100% !important; padding: var(--space-8) var(--space-5); }
  .pricing-card__price { font-size: clamp(2rem, 10vw, 3rem); }
  .specs-grid { grid-template-columns: 1fr !important; }
  .section-title { font-size: clamp(1.5rem, 5vw, 2rem); }
  .step__number { font-size: clamp(2rem, 8vw, 3rem); }
  .bottom-cta__headline { font-size: clamp(1.5rem, 5vw, 2rem); }
  .bottom-cta__buttons { flex-direction: column; align-items: center; }
  .footer__grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); }
  .footer__brand-col { grid-column: 1 / -1; max-width: none; }
  .header__wordmark { white-space: nowrap; font-size: var(--text-base); }
  .btn { min-height: 44px; min-width: 44px; padding: var(--space-3) var(--space-5); }
  .theme-toggle, .mobile-menu-btn { min-width: 44px; min-height: 44px; }
  .live-demo__form { flex-direction: column; }
  .live-demo__btn { width: 100%; justify-content: center; }
  .error-card__header { min-height: 52px; padding: var(--space-4) var(--space-5); }
  .compare-table-wrapper { overflow: hidden; }
  .compare-table { display: none !important; }
  .compare-mobile-cards { display: flex !important; flex-direction: column; gap: var(--space-4); padding: var(--space-4); }
  .compare-mobile-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-5); }
  .compare-mobile-card.is-highlight { border-color: var(--color-primary); background: var(--color-primary-highlight); }
  .compare-mobile-card__name { font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); color: var(--color-text); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border-subtle); }
  .compare-mobile-card.is-highlight .compare-mobile-card__name { color: var(--color-primary); }
  .compare-mobile-card__row { display: flex; justify-content: space-between; align-items: baseline; padding: var(--space-2) 0; font-size: var(--text-sm); }
  .compare-mobile-card__label { color: var(--color-text-muted); font-weight: 500; }
  .compare-mobile-card__value { color: var(--color-text); font-weight: 600; text-align: right; max-width: 55%; }
  .compare-mobile-card__value .check-yes { color: var(--color-primary); }
  .compare-mobile-card__value .check-no { color: var(--color-text-faint); }
}
@media (max-width: 480px) { .footer__grid { grid-template-columns: 1fr; } }
@media (max-width: 380px) {
  .hero__headline { font-size: 1.5rem; }
  .code-block__body pre { font-size: 0.58rem; }
  .pricing-card__price { font-size: 1.8rem; }
  .stat-pill { font-size: 0.7rem; padding: var(--space-1) var(--space-2); }
}
</style>
</head>
<body>



<!-- ANNOUNCEMENT BAR (Cat 6) -->
<div class="announcement-bar">
  &#127881; SKALE gasless payments LIVE — zero gas fees for agents. <a href="#specs">Learn more</a> · 50% off repeat queries with Research Cache
</div>

<!-- HEADER -->
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
      <a href="#live-demo" class="header__nav-link">Demo</a>
      <a href="#specs" class="header__nav-link">Specs</a>
    </nav>
    <div class="header__actions">
      <a href="https://agentoracle.co/health" class="header__status" id="apiStatus" target="_blank" rel="noopener noreferrer" title="API Health">
        <span class="header__status-dot header__status-dot--checking" id="statusDot"></span>
        <span id="statusText">Checking...</span>
      </a>
      <button class="theme-toggle" data-theme-toggle aria-label="Switch to light mode">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
      <button class="mobile-menu-btn" aria-label="Toggle menu" data-mobile-toggle>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
    <a href="#features" class="mobile-nav__link" data-mobile-link>Features</a>
    <a href="#how-it-works" class="mobile-nav__link" data-mobile-link>How It Works</a>
    <a href="#pricing" class="mobile-nav__link" data-mobile-link>Pricing</a>
    <a href="#live-demo" class="mobile-nav__link" data-mobile-link>Demo</a>
    <a href="#specs" class="mobile-nav__link" data-mobile-link>Specs</a>
    <a href="#mcp" class="mobile-nav__link" data-mobile-link>MCP Server</a>
  </nav>
</header>

<!-- HERO -->
<section class="hero section" style="position:relative;overflow:hidden;">
<canvas id="sparkle-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;"></canvas>
  <div class="hero__glow"></div>
  <!-- Enhanced particles (Cat 2) -->
  <div class="hero__particles">
    <div class="hero__particle hero__particle--diamond"></div>
    <div class="hero__particle hero__particle--hexagon"></div>
    <div class="hero__particle hero__particle--dot"></div>
    <div class="hero__particle hero__particle--diamond"></div>
    <div class="hero__particle hero__particle--dot"></div>
    <div class="hero__particle hero__particle--hexagon"></div>
    <div class="hero__particle hero__particle--diamond"></div>
    <div class="hero__particle hero__particle--dot"></div>
    <div class="hero__particle hero__particle--hexagon"></div>
    <div class="hero__particle hero__particle--diamond"></div>
    <div class="hero__particle hero__particle--dot"></div>
    <div class="hero__particle hero__particle--hexagon"></div>
    <div class="hero__particle hero__particle--cross"></div>
    <div class="hero__particle hero__particle--ring"></div>
    <div class="hero__particle hero__particle--cross"></div>
    <div class="hero__particle hero__particle--ring"></div>
  </div>

  <div class="container" style="text-align:center;margin-bottom:var(--space-6);">
    <div class="hero__badge fade-in" style="display:inline-flex;">
      <span class="hero__badge-dot"></span>
      v1.9.0 — Base · SKALE Gasless · Stellar · Confidence Scoring
    </div>
  </div>
  <div class="container hero__inner">
    <div class="hero__content">
      <h1 class="hero__headline fade-in">
        Research Intelligence<br><span class="gold-text">Agents Can Trust</span>
      </h1>
      <p class="hero__subtitle fade-in">
        Agents don't just need data. They need to know how much to trust it. AgentOracle delivers structured research intelligence over x402 — $0.02/query, with a confidence score on every result, so your agent can reason, not just retrieve.
      </p>
      <p class="hero__secondary-tagline fade-in">Get Started in 60 Seconds</p>
      <div class="hero__ctas fade-in">
        <a href="#live-demo" class="btn btn--primary btn--hero">Try Live Demo &#8594;</a>
        <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">View x402 Manifest</a>
        <a href="https://agentoracle.co/demo" class="btn btn--ghost" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Watch Demo</a>
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
<pre id="heroCode"></pre>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS BAR -->
<div class="stats-bar">
  <div class="container stats-bar__inner">
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> Confidence Scoring</span>
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> x402 Native</span>
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> From $0.02/query</span>
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> Base + SKALE + Stellar</span>
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> SKALE Gasless</span>
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> MCP Compatible</span>
    <span class="stat-pill"><span class="stat-pill__icon">&#9670;</span> No API Keys</span>
  </div>
</div>

<!-- Social Proof (Cat 6) -->
<div class="social-proof">
  <div class="container">
    <strong>x402</strong> Native &middot; <strong>Base</strong> Mainnet &middot; <strong>$0.02</strong> Per Query
  </div>
</div>

<!-- FEATURES -->
<section class="section section--alt" id="features">
  <div class="container">
    <span class="section-label fade-in">Capabilities</span>
    <h2 class="section-title fade-in">Built for Autonomous Agents</h2>
    <p class="section-subtitle fade-in">Everything your agent needs to research, verify, and reason with confidence \u2014 without human intervention.</p>
    <div class="feature-list fade-in">
      <div class="feature-col">
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Real-Time Research</div>
            <div class="feature-row__desc">Agents get fresh web data on demand with structured JSON output. Powered by Perplexity Sonar.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M15 3h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"/><line x1="12" y1="21" x2="12" y2="13"/><polyline points="8 17 12 21 16 17"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Source Attribution</div>
            <div class="feature-row__desc">Full URLs and domain transparency. Every fact is traceable \u2014 no black-box answers.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Confidence Scoring</div>
            <div class="feature-row__desc">Pure x402 micropayments. Agents simply pay and receive data. No OAuth, no accounts.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Structured JSON</div>
            <div class="feature-row__desc">Machine-readable output with typed fields. Parse results directly into your agent\u2019s pipeline.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Agent-Native Interface</div>
            <div class="feature-row__desc">One endpoint. One payment header. Agents discover pricing via the x402 manifest.</div>
          </div>
        </div>
      </div>
      <div class="feature-list__divider"></div>
      <div class="feature-col">
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Confidence Scoring</div>
            <div class="feature-row__desc">Every response includes a 0.0\u20131.0 trust score so agents know exactly how much to rely on it.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Gasless on SKALE <span class="feature-row__badge">LIVE</span></div>
            <div class="feature-row__desc">Zero gas fees for x402 payments on SKALE. Same $0.02 price. Agent picks the cheapest chain.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Free Preview Endpoint</div>
            <div class="feature-row__desc">Test queries without any wallet or payment. 20 requests per hour, no setup required.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Research Cache <span class="feature-row__badge feature-row__badge--new">NEW</span></div>
            <div class="feature-row__desc">Repeat queries within 24 hours cost 50% less ($0.01). Automatic savings for trending topics.</div>
          </div>
        </div>
        <div class="feature-row">
          <div class="feature-row__icon"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
          <div class="feature-row__content">
            <div class="feature-row__title">Low Latency</div>
            <div class="feature-row__desc">Deployed on Vercel Edge for fast global responses. Your agent doesn\u2019t wait.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bento-grid fade-in" style="display:none;">
      <div class="bento-card bento-card--large">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
        <h3 class="bento-card__title">Real-Time Research</h3>
        <p class="bento-card__desc">Powered by Perplexity Sonar, your agent gets live web data with source citations. Every query returns current, verified information with full provenance.</p>
        <span class="bento-card__tag">Core Engine</span>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M7 4a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2"/><path d="M17 4a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2"/></svg></div>
        <h3 class="bento-card__title">Structured JSON</h3>
        <p class="bento-card__desc">Every response is machine-readable JSON with typed fields. Parse results directly into your agent's reasoning pipeline.</p>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12 12 2z"/></svg></div>
        <h3 class="bento-card__title">x402 Payments</h3>
        <p class="bento-card__desc">HTTP-native micropayments. Your agent pays per request with USDC — built into the protocol layer, not bolted on.</p>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div>
        <h3 class="bento-card__title">Verifiable On-Chain</h3>
        <p class="bento-card__desc">Every payment settles on Base L2. Full transaction transparency via BaseScan. Trustless and auditable.</p>
      </div>
      <div class="bento-card bento-card--large">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
        <h3 class="bento-card__title">Agent-Native Interface</h3>
        <p class="bento-card__desc">Designed for machines, not humans. One endpoint. One method. One payment header. No OAuth flows, no session management. Your agent discovers pricing via the x402 manifest and pays inline.</p>
        <span class="bento-card__tag">Zero Config</span>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" style="stroke-width:2;fill:none;stroke:var(--color-primary)"/><path d="M12 12l4-4" style="stroke-width:2;stroke:var(--color-primary)"/><circle cx="12" cy="12" r="1" style="fill:var(--color-primary);stroke:none"/></svg></div>
        <h3 class="bento-card__title">Low Latency</h3>
        <p class="bento-card__desc">Deployed on Vercel Edge for sub-second responses globally. Your agent doesn't wait.</p>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
        <h3 class="bento-card__title">Live Preview <span class="bento-card__badge-new">NEW</span></h3>
        <p class="bento-card__desc">Try before you pay. POST /preview with any query — get truncated results free. 20 requests per hour.</p>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
        <h3 class="bento-card__title">Confidence Scoring <span class="bento-card__badge-new">NEW</span></h3>
        <p class="bento-card__desc">Every response includes a confidence object with score (0-1), level, sources found, and facts extracted.</p>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        <h3 class="bento-card__title">Rate Limit Headers <span class="bento-card__badge-new">NEW</span></h3>
        <p class="bento-card__desc">X-RateLimit-Limit, Remaining, and Reset headers on every response. Plan agent usage with 100 requests/hour per IP.</p>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <h3 class="bento-card__title">Tier Selector</h3>
        <p class="bento-card__desc">Pass tier: &apos;deep&apos; in the /research body to upgrade to Sonar Pro without switching endpoints. One endpoint, both tiers.</p>
      </div>
      <div class="bento-card bento-card--large">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-9-9" style="stroke-width:2;fill:none;stroke:var(--color-primary)"/><path d="M21 3v6h-6" style="stroke-width:2;fill:none;stroke:var(--color-primary)"/></svg></div>
        <h3 class="bento-card__title">Research Cache <span class="bento-card__badge-new">NEW</span></h3>
        <p class="bento-card__desc">Same query within 24 hours? Pay half. Repeat queries cost $0.01 instead of $0.02 — a 50% discount served automatically. Agents save money, you save API calls. Designed for the reality that agents researching trending topics will overlap.</p>
        <span class="bento-card__tag">50% Off Repeat Queries</span>
      </div>
      <div class="bento-card">
        <div class="bento-card__icon"><svg viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" style="stroke-width:2;fill:none;stroke:var(--color-primary)"/><line x1="12" y1="22" x2="12" y2="8.5" style="stroke-width:2;stroke:var(--color-primary)"/></svg></div>
        <h3 class="bento-card__title">SKALE Gasless <span style="font-size:0.6rem;font-weight:700;color:#0D0D0D;background:var(--color-green);padding:2px 6px;border-radius:4px;margin-left:4px;">LIVE</span></h3>
        <p class="bento-card__desc">Zero gas fees on SKALE Base. Agents pay only the query price — $0.02 USDC.e with no gas overhead. PayAI facilitator handles settlement. Same endpoint, agent picks the cheapest chain.</p>
      </div>
    </div>
  </div>
</section>

<!-- CURL EXAMPLE -->
<section class="section" id="try-it">
  <div class="container section-center">
    <span class="section-label fade-in">Try It</span>
    <h2 class="section-title fade-in">Copy. Paste. Research.</h2>
    <p class="section-subtitle fade-in">One curl command — that's all it takes for your agent to access structured research intelligence with confidence scoring.</p>
    <div class="curl-section fade-in" style="max-width:720px;margin:0 auto;">
      <div class="code-block">
        <div class="code-block__header">
          <div class="code-block__dots"><span class="code-block__dot code-block__dot--red"></span><span class="code-block__dot code-block__dot--yellow"></span><span class="code-block__dot code-block__dot--green"></span></div>
          <div class="code-block__actions"><span class="code-block__label">terminal</span>
            <button class="copy-btn" data-copy="curl" aria-label="Copy curl command"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>
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

<!-- LIVE DEMO -->
<section class="section section--alt" id="live-demo">
  <div class="container section-center">
    <span class="section-label fade-in">Live Demo</span>
    <h2 class="section-title fade-in">Try It Now</h2>
    <p class="section-subtitle fade-in">Send a query to the /preview endpoint and see the response in real time. No payment required.</p>
    <div class="live-demo fade-in">
      <div class="live-demo__form">
        <input type="text" class="live-demo__input" id="demoInput" placeholder="Ask anything..." value="Latest AI agent frameworks 2026" aria-label="Research query">
        <button class="live-demo__btn" id="demoBtn" type="button">
          <span class="live-demo__btn-text">Run Query</span>
          <span class="live-demo__spinner"></span>
        </button>
      </div>

      <div class="live-demo__error" id="demoError"></div>
      <div class="live-demo__result" id="demoResult">
        <div class="code-block">
          <div class="code-block__header">
            <div class="code-block__dots"><span class="code-block__dot code-block__dot--red"></span><span class="code-block__dot code-block__dot--yellow"></span><span class="code-block__dot code-block__dot--green"></span></div>
            <div class="code-block__actions"><span class="code-block__label">response.json</span>
              <button class="copy-btn" data-copy="demo-result" aria-label="Copy response"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>
            </div>
          </div>
          <div class="code-block__body"><pre id="demoResponseCode"></pre></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- JSON RESPONSE -->
<section class="section" id="response">
  <div class="container">
    <div class="json-section">
      <div class="json-section__text fade-in">
        <span class="section-label">Response Format</span>
        <h2 class="section-title">What Your Agent Gets Back</h2>
        <div class="divider"></div>
        <p style="font-size:var(--text-sm);color:var(--color-text-muted);line-height:1.7;margin-bottom:var(--space-5);">Every response is structured, typed, and ready for your agent's reasoning pipeline. No parsing, no guessing — just clean data.</p>
        <ul class="json-features" role="list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Concise summary with key facts extracted</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Source URLs with domain attribution</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Confidence score for reliability assessment</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Query metadata with model &amp; timing info</li>
        </ul>
      </div>
      <div class="fade-in">
        <button class="collapsible-toggle" id="jsonToggle" type="button">Show Example Response <span class="collapsible-toggle__arrow">&#9660;</span></button>
        <div class="collapsible-content" id="jsonCollapsible">
          <div class="code-block">
            <div class="code-block__header">
              <div class="code-block__dots"><span class="code-block__dot code-block__dot--red"></span><span class="code-block__dot code-block__dot--yellow"></span><span class="code-block__dot code-block__dot--green"></span></div>
              <div class="code-block__actions"><span class="code-block__label">response.json</span></div>
            </div>
            <div class="code-block__body">
<pre>{
  <span class="cs">"summary"</span>: <span class="cs">"The leading AI agent frameworks in
    2026 include CrewAI, LangGraph, AutoGen,
    and Mastra."</span>,
  <span class="cs">"key_facts"</span>: [
    <span class="cs">"CrewAI leads with role-based agents"</span>,
    <span class="cs">"LangGraph offers graph-based workflows"</span>
  ],
  <span class="cs">"sources"</span>: [
    { <span class="cs">"url"</span>: <span class="cs">"https://docs.crewai.com"</span> }
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
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="section section--alt" id="how-it-works">
  <div class="container">
    <span class="section-label fade-in">Process</span>
    <h2 class="section-title fade-in">Three Steps. No Setup.</h2>
    <p class="section-subtitle fade-in">Your agent goes from zero to trusted research intelligence in seconds.</p>

    <!-- Flow Diagram (Cat 2) -->
    <div class="flow-diagram fade-in">
      <div class="flow-step">
        <div class="flow-step__icon">&#128269;</div>
        <div class="flow-step__label">Discover</div>
        <div class="flow-step__desc">Fetch the x402 manifest to learn pricing &amp; endpoints</div>
      </div>
      <div class="flow-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </div>
      <div class="flow-step">
        <div class="flow-step__icon">&#128176;</div>
        <div class="flow-step__label">Pay</div>
        <div class="flow-step__desc">Send USDC micropayment via X-PAYMENT header</div>
      </div>
      <div class="flow-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </div>
      <div class="flow-step">
        <div class="flow-step__icon">&#128200;</div>
        <div class="flow-step__label">Research</div>
        <div class="flow-step__desc">Receive structured JSON with sources &amp; confidence</div>
      </div>
    </div>

    <div class="steps-grid fade-in" style="margin-top: var(--space-16);">
      <div class="step">
        <div class="step__number">01</div>
        <h3 class="step__title">Discover Pricing</h3>
        <p class="step__desc">Your agent fetches the x402 manifest at <code>/.well-known/x402.json</code> to learn the endpoint, price, and accepted currency (USDC on Base).</p>
      </div>
      <div class="step">
        <div class="step__number">02</div>
        <h3 class="step__title">Send Payment + Query</h3>
        <p class="step__desc">POST to <code>/research</code> or <code>/deep-research</code> with a JSON body and an <code>X-PAYMENT</code> header containing the USDC payment proof.</p>
      </div>
      <div class="step">
        <div class="step__number">03</div>
        <h3 class="step__title">Receive Structured Data</h3>
        <p class="step__desc">Get back clean JSON with research results, source citations, confidence scores, and metadata — ready for your agent's next reasoning step.</p>
      </div>
    </div>

    <!-- CTA after How It Works (Cat 4) -->
    <div class="section-cta fade-in">
      <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Start Building Now &#8594; View Documentation</a>
    </div>
  </div>
</section>

<!-- USE CASES -->
<section class="section" id="use-cases">
  <div class="container">
    <div class="section-center">
      <span class="section-label fade-in">Use Cases</span>
      <h2 class="section-title fade-in">Real Agent Workflows</h2>
      <p class="section-subtitle fade-in">See how agents use AgentOracle in production — with real cost breakdowns.</p>
    </div>
    <div class="usecase-grid fade-in">
      <div class="usecase-card">
        <div class="usecase-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg></div>
        <h3 class="usecase-card__title">Market Intelligence</h3>
        <p class="usecase-card__desc">Agent researches competitor pricing and market positioning across three dimensions.</p>
        <ul class="usecase-card__queries" role="list">
          <li>"Competitor X pricing model 2026"</li>
          <li>"Market share AI API providers"</li>
          <li>"Developer API pricing trends"</li>
        </ul>
        <div class="usecase-card__cost"><span class="usecase-card__cost-label">3 queries &middot; /research</span><span class="usecase-card__cost-value">$0.06</span></div>
      </div>
      <div class="usecase-card">
        <div class="usecase-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg></div>
        <h3 class="usecase-card__title">Due Diligence</h3>
        <p class="usecase-card__desc">Agent verifies a company's claims and cross-references with public records using deep research.</p>
        <ul class="usecase-card__queries" role="list">
          <li>"Company Y revenue claims verification"</li>
          <li>"Company Y regulatory filings analysis"</li>
        </ul>
        <div class="usecase-card__cost"><span class="usecase-card__cost-label">2 queries &middot; /deep-research</span><span class="usecase-card__cost-value">$0.20</span></div>
      </div>
      <div class="usecase-card">
        <div class="usecase-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg></div>
        <h3 class="usecase-card__title">Real-Time News</h3>
        <p class="usecase-card__desc">Agent monitors breaking developments and synthesizes updates across multiple topics.</p>
        <ul class="usecase-card__queries" role="list">
          <li>"AI regulation updates today"</li>
          <li>"Crypto market events this week"</li>
          <li>"Base network ecosystem news"</li>
          <li>"x402 protocol adoption updates"</li>
          <li>"Agent framework releases 2026"</li>
        </ul>
        <div class="usecase-card__cost"><span class="usecase-card__cost-label">5 queries &middot; /research</span><span class="usecase-card__cost-value">$0.10</span></div>
      </div>
    </div>
    <!-- CTA after Use Cases (Cat 4) -->
    <div class="section-cta fade-in">
      <a href="#pricing" class="btn btn--ghost">Calculate Your Agent's Research Cost &#8594;</a>
    </div>
  </div>
</section>

<!-- MCP -->
<section class="section section--alt" id="mcp">
  <div class="container">
    <div class="mcp-grid">
      <div class="mcp-info fade-in">
        <span class="section-label">Integration</span>
        <h2 class="section-title">MCP Server</h2>
        <div class="divider"></div>
        <p class="mcp-info__desc">Connect AgentOracle to any MCP-compatible client with a single command. Your agent gets research tools without writing any integration code.</p>
        <div class="mcp-info__badges">
          <span class="mcp-badge"><span class="mcp-badge__dot"></span> Claude</span>
          <span class="mcp-badge"><span class="mcp-badge__dot"></span> Cursor</span>
          <span class="mcp-badge"><span class="mcp-badge__dot"></span> Any MCP Client</span>
        </div>
        <a href="https://github.com/TKCollective/agentoracle-mcp" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub &#8594;
        </a>
      </div>
      <div class="fade-in">
        <div class="mcp-install">
          <div class="mcp-install__header">
            <div class="code-block__dots"><span class="code-block__dot code-block__dot--red"></span><span class="code-block__dot code-block__dot--yellow"></span><span class="code-block__dot code-block__dot--green"></span></div>
            <div class="code-block__actions"><span class="code-block__label">terminal</span>
              <button class="copy-btn" data-copy="mcp" aria-label="Copy"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>
            </div>
          </div>
          <div class="mcp-install__body">
            <pre id="mcp-code"><span class="mcp-prefix">$</span> npx agentoracle-mcp</pre>
          </div>
        </div>
        <div style="margin-top:var(--space-4);padding:var(--space-5);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);">
          <p style="font-size:var(--text-xs);color:var(--color-text-faint);font-family:var(--font-mono);margin-bottom:var(--space-3);">// claude_desktop_config.json</p>
<pre style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-muted);margin:0;line-height:1.7;">{
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

<!-- PRICING -->
<section class="section" id="pricing">
  <div class="container">
    <div class="section-center">
      <span class="section-label fade-in">Pricing</span>
      <h2 class="section-title fade-in">Pay Only for What You Use</h2>
      <p class="section-subtitle fade-in">No subscriptions. No minimums. No API keys. Just pay per query with USDC on Base.</p>
      <p class="section-subtitle fade-in" style="font-size:var(--text-sm);color:var(--color-green);margin-top:var(--space-3);display:flex;align-items:center;justify-content:center;gap:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg> Gasless on SKALE Network — zero gas cost for your agent queries</p>
    </div>
    <div class="pricing-grid fade-in">
      <div class="pricing-card pricing-card--green">
        <div class="pricing-card__endpoint">/preview</div>
        <div class="pricing-card__price gold-gradient">FREE</div>
        <div class="pricing-card__unit">no payment required</div>
        <ul class="pricing-card__features" role="list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Live truncated results</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Confidence scores</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> 20 requests/hour</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> No payment required</li>
        </ul>
        <a href="#live-demo" class="btn btn--ghost" style="width:100%;">Try /preview</a>
      </div>
      <div class="pricing-card pricing-card--featured" style="position:relative;">

        <div class="pricing-card__endpoint">/research</div>
        <div class="pricing-card__price gold-gradient">$0.02</div>
        <div class="pricing-card__unit">per query &middot; USDC on Base</div>
        <ul class="pricing-card__features" role="list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Real-time web research</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Structured JSON with citations</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Sub-2 second responses</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> On-chain payment verification</li>
        </ul>
        <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--primary" style="width:100%;" target="_blank" rel="noopener noreferrer">View x402 Manifest &#8594;</a>
      </div>
      <div class="pricing-card pricing-card--purple">
        <div class="pricing-card__endpoint">/deep-research</div>
        <div class="pricing-card__price gold-gradient">$0.10</div>
        <div class="pricing-card__unit">per query &middot; USDC on Base</div>
        <ul class="pricing-card__features" role="list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Multi-step deep analysis</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Comprehensive source verification</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Higher confidence scoring</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Extended context window</li>
        </ul>
        <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--ghost" style="width:100%;" target="_blank" rel="noopener noreferrer">View Manifest &#8594;</a>
      </div>
    </div>
  </div>
</section>

<!-- TRUST / ECOSYSTEM -->
<div class="trust-bar">
  <div class="container">
    <div class="trust-bar__label fade-in">Ecosystem &amp; Integrations</div>
    <div class="trust-bar__logos fade-in">
      <a href="https://www.coinbase.com/developer-platform" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M12 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-2.5 8a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-5z" fill="var(--color-bg)"/></svg> x402 Protocol
      </a>
      <a href="https://base.org" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/><path d="M12 6a6 6 0 100 12 6 6 0 000-12z" fill="var(--color-bg)"/></svg> Base Network
      </a>
      <a href="https://aiagents.directory" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 12h6M9 15h4"/></svg> aiagents.directory
      </a>
      <a href="https://moltbook.com" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Moltbook Verified
      </a>
      <a href="https://github.com/TKCollective/agentoracle-mcp" class="trust-item" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> GitHub
      </a>
      <a href="https://skale.space" class="trust-item" target="_blank" rel="noopener noreferrer" style="position:relative;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="8.5"/><polyline points="22 8.5 12 15 2 8.5"/></svg> SKALE <span style="font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#0D0D0D;background:var(--color-green);padding:2px 6px;border-radius:4px;margin-left:4px;">Live — Zero Gas</span>
      </a>
    </div>
  </div>
</div>

<!-- Built On bar (Cat 6) -->
<div class="built-on-bar">
  <div class="container">
    <div class="built-on-bar__label fade-in">Built On</div>
    <div class="built-on-bar__logos fade-in">
      <span class="built-on-item">Base</span>
      <span class="built-on-item">x402</span>
      <span class="built-on-item">Perplexity Sonar</span>
      <span class="built-on-item">Vercel</span>
      <span class="built-on-item">MCP</span>
    </div>
  </div>
</div>

<!-- ERROR HANDLING -->
<section class="section section--alt" id="error-handling">
  <div class="container">
    <span class="section-label fade-in">Developer Reference</span>
    <h2 class="section-title fade-in">Error Handling</h2>
    <p class="section-subtitle fade-in">Common error codes and how to handle them in your agent's logic.</p>
    <div class="error-cards fade-in">
      <div class="error-card" data-error-card><div class="error-card__header"><div class="error-card__left"><span class="error-card__code">402</span><span class="error-card__name">Payment Required</span></div><svg class="error-card__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div><div class="error-card__body"><div class="error-card__body-inner">Payment header missing or invalid. Include <code style="color:var(--color-primary);background:var(--color-primary-highlight);padding:2px 6px;border-radius:4px;">X-PAYMENT</code> header with valid x402 proof.</div></div></div>
      <div class="error-card" data-error-card><div class="error-card__header"><div class="error-card__left"><span class="error-card__code">429</span><span class="error-card__name">Too Many Requests</span></div><svg class="error-card__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div><div class="error-card__body"><div class="error-card__body-inner">Rate limit exceeded. Check <code style="color:var(--color-primary);background:var(--color-primary-highlight);padding:2px 6px;border-radius:4px;">X-RateLimit-Reset</code> header for cooldown.</div></div></div>
      <div class="error-card" data-error-card><div class="error-card__header"><div class="error-card__left"><span class="error-card__code">500</span><span class="error-card__name">Internal Server Error</span></div><svg class="error-card__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div><div class="error-card__body"><div class="error-card__body-inner">Upstream provider issue. Retry with exponential backoff.</div></div></div>
    </div>
  </div>
</section>

<!-- SPECS -->
<section class="section" id="specs">
  <div class="container">
    <span class="section-label fade-in">Technical</span>
    <h2 class="section-title fade-in">Specs &amp; Infrastructure</h2>
    <p class="section-subtitle fade-in">Everything under the hood.</p>
    <div class="specs-grid fade-in">
      <div class="spec-item"><span class="spec-item__label">Protocol</span><span class="spec-item__value">x402</span></div>
      <div class="spec-item"><span class="spec-item__label">Chain</span><span class="spec-item__value">Base (L2)</span></div>
      <div class="spec-item"><span class="spec-item__label">Currency</span><span class="spec-item__value">USDC + EURC</span></div>
      <div class="spec-item"><span class="spec-item__label">Facilitator</span><span class="spec-item__value">Coinbase CDP</span></div>
      <div class="spec-item"><span class="spec-item__label">Research Model</span><span class="spec-item__value">Perplexity Sonar</span></div>
      <div class="spec-item"><span class="spec-item__label">Endpoints</span><span class="spec-item__value">/preview &middot; /research &middot; /deep-research</span></div>
      <div class="spec-item"><span class="spec-item__label">Hosting</span><span class="spec-item__value">Vercel Edge</span></div>
      <div class="spec-item"><span class="spec-item__label">Wallet</span><span class="spec-item__value">0xdF902...e109</span></div>
      <div class="spec-item"><span class="spec-item__label">MCP Server</span><span class="spec-item__value">npx agentoracle-mcp</span></div>
      <div class="spec-item"><span class="spec-item__label">Response Format</span><span class="spec-item__value">JSON</span></div>
      <div class="spec-item"><span class="spec-item__label">Networks</span><span class="spec-item__value">Base · SKALE (gasless) · Stellar</span></div>
      <div class="spec-item"><span class="spec-item__label">Rate Limits</span><span class="spec-item__value">100/hr paid &middot; 20/hr preview</span></div>
      <div class="spec-item"><span class="spec-item__label">Version</span><span class="spec-item__value">v1.9.0</span></div>
    </div>
  </div>
</section>

<!-- COMPARISON TABLE -->
<section class="section section--alt" id="compare">
  <div class="container">
    <div class="section-center">
      <span class="section-label fade-in">Why AgentOracle</span>
      <h2 class="section-title fade-in">How We Compare</h2>
      <p class="section-subtitle fade-in">The only research API with native crypto payments and zero auth overhead.</p>
    </div>
    <div class="compare-section fade-in">
      <div class="compare-table-wrapper">
        <table class="compare-table">
          <thead><tr><th></th><th class="compare-highlight">AgentOracle</th><th>Exa <span style="font-size:10px;color:#4ADE80;font-weight:600;">+x402</span></th><th>Tavily</th><th>Brave Search</th><th>Perplexity API</th></tr></thead>
          <tbody>
            <tr><td>Pricing</td><td class="compare-highlight"><span class="check-yes">$0.02/query</span></td><td>$0.005–$0.012/query</td><td>$0.008/credit</td><td>$5-9/1K</td><td>$5-12/1K</td></tr>
            <tr><td>Output Type</td><td class="compare-highlight"><span class="check-yes">Synthesized intelligence</span></td><td class="check-no">Raw search results</td><td class="check-no">Raw search results</td><td class="check-no">Raw search results</td><td>Answers + tokens</td></tr>
            <tr><td>Confidence Scoring</td><td class="compare-highlight"><span class="check-yes">Built-in (0.00–1.00)</span></td><td class="check-no">No</td><td class="check-no">No</td><td class="check-no">No</td><td class="check-no">No</td></tr>
            <tr><td>x402 / Agent-Native</td><td class="compare-highlight"><span class="check-yes">x402 native (all chains)</span></td><td style="color:#4ADE80;font-weight:600;">x402 (Base only)</td><td class="check-no">API key</td><td class="check-no">API key</td><td class="check-no">API key</td></tr>
            <tr><td>Multi-Chain</td><td class="compare-highlight"><span class="check-yes">Base + SKALE + Stellar</span></td><td class="check-no">Base only</td><td class="check-no">N/A</td><td class="check-no">N/A</td><td class="check-no">N/A</td></tr>
            <tr><td>Gasless Option</td><td class="compare-highlight"><span class="check-yes">Yes (SKALE)</span></td><td class="check-no">No</td><td class="check-no">No</td><td class="check-no">No</td><td class="check-no">No</td></tr>
            <tr><td>On-Chain Verifiable</td><td class="compare-highlight"><span class="check-yes">Yes (Base L2)</span></td><td class="check-no">No</td><td class="check-no">No</td><td class="check-no">No</td><td class="check-no">No</td></tr>
            <tr><td>Free Preview</td><td class="compare-highlight"><span class="check-yes">20 req/hr (no auth)</span></td><td>1K/mo (signup)</td><td>1K/mo (signup)</td><td>2K/mo (signup)</td><td>100/day (signup)</td></tr>
            <tr><td>MCP Server</td><td class="compare-highlight"><span class="check-yes">Yes</span></td><td><span class="check-yes">Yes</span></td><td><span class="check-yes">Yes</span></td><td class="check-no">No</td><td class="check-no">No</td></tr>
            <tr><td>Human Setup</td><td class="compare-highlight"><span class="check-yes">0 min</span></td><td>Signup required</td><td>~5 min</td><td>~5 min</td><td>~5 min</td></tr>
          </tbody>
        </table>
        <div class="compare-mobile-cards">
          <div class="compare-mobile-card is-highlight">
            <div class="compare-mobile-card__name">AgentOracle</div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Pricing</span><span class="compare-mobile-card__value"><span class="check-yes">$0.02/query</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Payment</span><span class="compare-mobile-card__value"><span class="check-yes">USDC on-chain</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Auth</span><span class="compare-mobile-card__value"><span class="check-yes">None (x402)</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Agent-Native</span><span class="compare-mobile-card__value"><span class="check-yes">x402 (HTTP 402)</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">On-Chain</span><span class="compare-mobile-card__value"><span class="check-yes">Yes (Base L2)</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Multi-Chain</span><span class="compare-mobile-card__value"><span class="check-yes">Base + SKALE + Stellar</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">MCP Server</span><span class="compare-mobile-card__value"><span class="check-yes">Yes</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Free Tier</span><span class="compare-mobile-card__value"><span class="check-yes">20 req/hr</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Confidence Scoring</span><span class="compare-mobile-card__value"><span class="check-yes">Built-in</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Human Setup</span><span class="compare-mobile-card__value"><span class="check-yes">0 min</span></span></div>
          </div>
          <div class="compare-mobile-card">
            <div class="compare-mobile-card__name">Tavily</div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Pricing</span><span class="compare-mobile-card__value">$0.008/credit</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Payment</span><span class="compare-mobile-card__value">Credit card</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Auth</span><span class="compare-mobile-card__value">API key</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Agent-Native</span><span class="compare-mobile-card__value"><span class="check-no">REST only</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">On-Chain</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">MCP Server</span><span class="compare-mobile-card__value"><span class="check-yes">Yes</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Free Tier</span><span class="compare-mobile-card__value">1K/mo</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Confidence Scoring</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Human Setup</span><span class="compare-mobile-card__value">~5 min</span></div>
          </div>
          <div class="compare-mobile-card">
            <div class="compare-mobile-card__name">Exa <span style="font-size:10px;color:#4ADE80;font-weight:600;">+x402</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Pricing</span><span class="compare-mobile-card__value">$0.005–$0.012/query</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Output</span><span class="compare-mobile-card__value"><span class="check-no">Raw search results</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">x402</span><span class="compare-mobile-card__value" style="color:#4ADE80;">Base only</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Multi-Chain</span><span class="compare-mobile-card__value"><span class="check-no">Base only</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">On-Chain</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Free Tier</span><span class="compare-mobile-card__value">1K/mo (signup)</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Confidence Scoring</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Human Setup</span><span class="compare-mobile-card__value">Signup required</span></div>
          </div>
          <div class="compare-mobile-card">
            <div class="compare-mobile-card__name">Brave Search</div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Pricing</span><span class="compare-mobile-card__value">$5-9/1K</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Payment</span><span class="compare-mobile-card__value">Credit card</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Auth</span><span class="compare-mobile-card__value">API key</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Agent-Native</span><span class="compare-mobile-card__value"><span class="check-no">REST only</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">On-Chain</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">MCP Server</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Free Tier</span><span class="compare-mobile-card__value">2K/mo</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Confidence Scoring</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Human Setup</span><span class="compare-mobile-card__value">~5 min</span></div>
          </div>
          <div class="compare-mobile-card">
            <div class="compare-mobile-card__name">Perplexity API</div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Pricing</span><span class="compare-mobile-card__value">$5-12/1K</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Payment</span><span class="compare-mobile-card__value">Credit card</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Auth</span><span class="compare-mobile-card__value">API key</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Agent-Native</span><span class="compare-mobile-card__value"><span class="check-no">REST only</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">On-Chain</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">MCP Server</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Free Tier</span><span class="compare-mobile-card__value">100/day</span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Confidence Scoring</span><span class="compare-mobile-card__value"><span class="check-no">No</span></span></div>
            <div class="compare-mobile-card__row"><span class="compare-mobile-card__label">Human Setup</span><span class="compare-mobile-card__value">~5 min</span></div>
          </div>
        </div>
      </div>
      <p class="compare-note">Comparison based on publicly available pricing and documentation as of April 2026. Exa added x402 support on April 7, 2026 (Base only).</p>
    </div>
  </div>
</section>

<!-- FAQ (Expanded - Cat 3) -->
<section class="section" id="faq">
  <div class="container">
    <div class="section-center">
      <span class="section-label fade-in">FAQ</span>
      <h2 class="section-title fade-in">Common Questions</h2>
      <p class="section-subtitle fade-in">Everything you need to know before integrating.</p>
    </div>
    <div class="faq-grid fade-in">
      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>What is the x402 protocol?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">x402 is an open protocol by Coinbase that enables HTTP-native payments. Instead of API keys and subscriptions, your agent includes a payment proof in the <code>X-PAYMENT</code> header of each request. The server verifies the on-chain payment and returns the response. Think of it like paying for a vending machine — insert coin, get result.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>Do I need a crypto wallet?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Yes, your agent needs a wallet with USDC on the Base network. Most agent frameworks support wallet integration through Coinbase CDP, Privy, or direct ethers.js. The <code>/preview</code> endpoint is free and requires no wallet — use it to test first.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>What chains and currencies are supported?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">We accept USDC on Base (L2), USDC.e on SKALE Base (zero gas fees via PayAI facilitator), and native USDC on Stellar (via x402.org facilitator). Same endpoint, agent picks the cheapest chain. Repeat queries within 24hrs cost 50% less via Research Cache. Payments settle on-chain — <a href="https://basescan.org/address/0xdF90200B0031051BbF7a66BB9387d2Ecf599e109" target="_blank" rel="noopener noreferrer">BaseScan</a> · <a href="https://skale-base-explorer.skalenodes.com/" target="_blank" rel="noopener noreferrer">SKALE Explorer</a>.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>How is this different from using Perplexity directly?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Perplexity's API requires API keys, billing setup, and human-managed accounts. AgentOracle wraps the same research engine in an agent-native payment layer — your agent discovers pricing automatically via the x402 manifest, pays per query with USDC, and gets structured JSON responses with confidence scoring. Zero human setup required.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>What happens if my agent's payment fails?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">The facilitator validates payments before forwarding. If the payment is invalid, you receive a <code>402</code> response with details about what went wrong. No funds are lost — the payment is only settled when the request is valid and processed.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>Can I use AgentOracle without crypto?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Not yet — x402 requires USDC on Base. We're exploring fiat onramps for future versions. In the meantime, the <code>/preview</code> endpoint is completely free and requires no crypto.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>What's the difference between /research and /deep-research?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer"><code>/research</code> uses Perplexity Sonar (fast, $0.02 per query). <code>/deep-research</code> uses Sonar Pro (comprehensive multi-step analysis, $0.10 per query). Both return structured JSON with sources, confidence scores, and metadata.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>Is there a rate limit?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Yes, 100 requests per hour per IP for paid endpoints, and 20 requests per hour for the free <code>/preview</code> endpoint. Rate limit headers (<code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>) are included on every response.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>Do you support EURC?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Yes! Both USDC and EURC are accepted on Base mainnet. The x402 manifest at <code>/.well-known/x402.json</code> lists all supported currencies and their contract addresses.</div></div></div>

      <div class="faq-item"><button class="faq-item__trigger" data-faq-toggle>Can I use this with Claude, GPT, or other LLMs?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Yes. Install the AgentOracle MCP server with <code>npx agentoracle-mcp</code> and any MCP-compatible client (Claude, Cursor, or custom agents) can call it as a tool. For direct integration, just POST to the endpoint from any language or framework.</div></div></div>
    </div>
  </div>
</section>

<!-- ========== LIVE & PROVEN ========== -->
<section class="section section--alt" id="live-proven">
  <div class="container">
    <span class="section-label fade-in">Payment Validation</span>
    <h2 class="section-title fade-in">Live &amp; Proven</h2>
    <p class="section-subtitle fade-in">Real USDC payments confirmed on Base mainnet.</p>

    <div class="specs-grid fade-in" style="margin-top:2rem;">
      <div class="spec-item">
        <span class="spec-item__label">On-Chain Transactions</span>
        <span class="spec-item__value" style="color:var(--color-green);">20+</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Total USDC Received</span>
        <span class="spec-item__value" style="color:var(--color-green);">$3.40+</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Avg Round-Trip</span>
        <span class="spec-item__value">~7 seconds</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Endpoints Validated</span>
        <span class="spec-item__value" style="font-size:0.8em;white-space:nowrap;">/research &middot; /deep &middot; /batch</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Settlement Network</span>
        <span class="spec-item__value">Base mainnet</span>
      </div>
      <div class="spec-item">
        <span class="spec-item__label">Gasless Option</span>
        <span class="spec-item__value" style="color:var(--color-green);">SKALE &mdash; Active</span>
      </div>
    </div>

    <div class="fade-in" style="margin-top:2rem;padding:1.25rem 1.5rem;background:var(--color-surface-2);border:1px solid var(--color-border);border-radius:var(--radius-lg);max-width:680px;margin-left:auto;margin-right:auto;text-align:center;">
      <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.08em;">Verified On-Chain</p>
      <div style="margin-top:0.75rem;">
        <a href="https://basescan.org/address/0xdF90200B0031051BbF7a66BB9387d2Ecf599e109"
           target="_blank" rel="noopener noreferrer"
           style="font-size:var(--text-sm);color:var(--color-primary);text-decoration:underline;">
          View all transactions on BaseScan &#8594;
        </a>
      </div>
    </div>
  </div>
</section>

<!-- BOTTOM CTA (Cat 4 - enhanced) -->
<section class="bottom-cta section">
  <div class="container">
    <div class="bottom-cta__glow"></div>
    <h2 class="bottom-cta__headline fade-in">Start Querying in <span class="gold-text">Seconds</span></h2>
    <p class="bottom-cta__sub fade-in">One endpoint. One payment. Real-time research for your agent.<br>No setup required. Get started in 60 seconds.</p>
    <div class="bottom-cta__buttons fade-in">
      <a href="#live-demo" class="btn btn--primary btn--hero">Try Live Demo &#8594;</a>
      <a href="https://agentoracle.co/health" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">Check Health Status &#8594;</a>
      <a href="https://github.com/TKCollective/agentoracle-mcp" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline;margin-right:4px;vertical-align:middle;"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> MCP Server
      </a>
      <a href="https://basescan.org/address/0xdF90200B0031051BbF7a66BB9387d2Ecf599e109" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">View on BaseScan</a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand-col">
        <a href="#" class="footer__brand-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="AgentOracle logo" style="display:inline-block"><circle cx="16" cy="16" r="15" fill="#0D0D0D" stroke="#C9A96E" stroke-width="1.5"/><path d="M16 8L10 20h4l-1 4 7-10h-4l1-6z" fill="#C9A96E"/></svg>
          <span>AgentOracle</span>
        </a>
        <p class="footer__tagline">Pay-per-query research for AI agents</p>
        <div class="footer__socials">
          <a href="https://x.com/AgentOracle_AI" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow on X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a href="https://github.com/TKCollective" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
        </div>
      </div>
      <div><h4 class="footer__col-title">Product</h4><ul class="footer__col-links" role="list"><li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href="https://agentoracle.co/.well-known/x402.json" target="_blank" rel="noopener noreferrer">Docs</a></li><li><a href="#live-demo">Demo</a></li></ul></div>
      <div><h4 class="footer__col-title">Community</h4><ul class="footer__col-links" role="list"><li><a href="https://x.com/AgentOracle_AI" target="_blank" rel="noopener noreferrer">X / Twitter</a></li><li><a href="https://github.com/TKCollective" target="_blank" rel="noopener noreferrer">GitHub</a></li><li><a href="https://moltbook.com" target="_blank" rel="noopener noreferrer">Moltbook</a></li></ul></div>
      <div><h4 class="footer__col-title">Built With</h4><ul class="footer__col-links" role="list"><li><a href="https://www.coinbase.com/developer-platform" target="_blank" rel="noopener noreferrer">x402 Protocol</a></li><li><a href="https://base.org" target="_blank" rel="noopener noreferrer">Base Network</a></li></ul></div>
    </div>
    <div class="footer__bottom">
      <span class="footer__copy">&copy; 2026 TK Collective LLC. All rights reserved.</span>

    </div>
  </div>
</footer>

<!-- Back to Top (Cat 5) -->
<button class="back-to-top" id="backToTop" aria-label="Back to top">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
</button>

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
      themeToggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
      themeToggle.innerHTML = theme === "dark"
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }
  setTheme(currentTheme);
  if (themeToggle) { themeToggle.addEventListener("click", function () { setTheme(currentTheme === "dark" ? "light" : "dark"); }); }

  /* ---- Header Scroll Effect ---- */
  var header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) header.classList.add("header--scrolled");
    else header.classList.remove("header--scrolled");
  }, { passive: true });

  /* ---- Mobile Menu ---- */
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  var mobileNav = document.getElementById("mobileNav");
  var mobileOpen = false;
  function toggleMobileMenu() {
    mobileOpen = !mobileOpen;
    mobileNav.classList.toggle("is-open", mobileOpen);
    mobileToggle.innerHTML = mobileOpen
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  }
  if (mobileToggle) mobileToggle.addEventListener("click", toggleMobileMenu);
  document.querySelectorAll("[data-mobile-link]").forEach(function (l) {
    l.addEventListener("click", function () { if (mobileOpen) toggleMobileMenu(); });
  });

  /* ---- Copy Buttons ---- */
  var copyTexts = {
    curl: "curl -X POST https://agentoracle.co/research \\\\\\n  -H \\"Content-Type: application/json\\" \\\\\\n  -H \\"X-PAYMENT: <x402-payment>\\" \\\\\\n  -d '{\\"query\\": \\"Latest AI agent frameworks 2026\\"}\\'",
    mcp: "npx agentoracle-mcp"
  };
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-copy");
      var text = key === "demo-result" ? (document.getElementById("demoResponseCode") || {}).textContent || "" : copyTexts[key] || "";
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

  /* ---- Scroll Fade-In (Cat 5) ---- */
  if ("IntersectionObserver" in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); fadeObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll(".fade-in").forEach(function (el) { fadeObserver.observe(el); });
  } else {
    document.querySelectorAll(".fade-in").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        /* Immediately reveal all fade-in elements in the target section so they're visible when scroll arrives */
        target.querySelectorAll(".fade-in").forEach(function (el) { el.classList.add("is-visible"); fadeObserver.unobserve(el); });
        /* Also reveal the target itself if it has fade-in */
        if (target.classList.contains("fade-in")) { target.classList.add("is-visible"); fadeObserver.unobserve(target); }
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---- Collapsible JSON ---- */
  var jsonToggle = document.getElementById("jsonToggle");
  var jsonCollapsible = document.getElementById("jsonCollapsible");
  if (jsonToggle && jsonCollapsible) {
    jsonToggle.addEventListener("click", function () {
      var isOpen = jsonCollapsible.classList.toggle("is-open");
      jsonToggle.classList.toggle("is-open", isOpen);
      jsonToggle.innerHTML = isOpen ? 'Hide Response <span style="display:inline-block;transform:rotate(180deg)">&#9660;</span>' : 'Show Example Response <span>&#9660;</span>';
    });
  }

  /* ---- Error Cards ---- */
  document.querySelectorAll("[data-error-card]").forEach(function (card) {
    var h = card.querySelector(".error-card__header");
    if (h) h.addEventListener("click", function () { card.classList.toggle("is-open"); });
  });

  /* ---- FAQ Toggles ---- */
  document.querySelectorAll("[data-faq-toggle]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".faq-item");
      if (!item) return;
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (o) { if (o !== item) o.classList.remove("is-open"); });
      item.classList.toggle("is-open", !isOpen);
    });
  });

  /* ---- Live Demo ---- */
  var demoInput = document.getElementById("demoInput");
  var demoBtn = document.getElementById("demoBtn");
  var demoResult = document.getElementById("demoResult");
  var demoError = document.getElementById("demoError");
  var demoResponseCode = document.getElementById("demoResponseCode");
  if (demoBtn && demoInput) {
    demoBtn.addEventListener("click", function () {
      var query = demoInput.value.trim();
      if (!query) { demoError.textContent = "Please type a query."; demoError.classList.add("is-visible"); demoResult.classList.remove("is-visible"); return; }
      demoError.classList.remove("is-visible"); demoResult.classList.remove("is-visible");
      demoBtn.classList.add("is-loading"); demoBtn.disabled = true;
      fetch("https://agentoracle.co/preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: query }) })
        .then(function (res) {
          if (!res.ok) return res.text().then(function (t) { var m; try { m = JSON.parse(t).error || res.status + " " + res.statusText; } catch(e) { m = res.status + " " + res.statusText; } throw new Error(m); });
          return res.json();
        })
        .then(function (data) { demoResponseCode.textContent = JSON.stringify(data, null, 2); demoResult.classList.add("is-visible"); })
        .catch(function (err) {
          var msg = err.message || "Unknown error";
          if (msg.indexOf("Upstream") !== -1 || msg.indexOf("API key") !== -1 || msg.indexOf("Preview Unavailable") !== -1) msg = "Preview endpoint temporarily unavailable. Paid endpoints (/research, /deep-research) work with x402 payment.";
          demoError.textContent = msg; demoError.classList.add("is-visible");
        })
        .finally(function () { demoBtn.classList.remove("is-loading"); demoBtn.disabled = false; });
    });
    demoInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); demoBtn.click(); } });
  }

  /* ---- API Status ---- */
  (function checkApiStatus() {
    var dot = document.getElementById("statusDot"), text = document.getElementById("statusText");
    if (!dot || !text) return;
    fetch("https://agentoracle.co/health", { mode: "cors" })
      .then(function (res) { if (res.ok) { dot.className = "header__status-dot"; text.textContent = "Online"; } else { dot.className = "header__status-dot header__status-dot--offline"; text.textContent = "Degraded"; } })
      .catch(function () { dot.className = "header__status-dot header__status-dot--offline"; text.textContent = "Offline"; });
    setTimeout(checkApiStatus, 60000);
  })();

  /* ---- Back to Top (Cat 5) ---- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---- Hero Typing Effect (Cat 2) ---- */
  var heroCode = document.getElementById("heroCode");
  if (heroCode) {
    var lines = [
      '<span class="ck">// Query AgentOracle \\u2014 one endpoint, one payment</span>',
      '<span class="ckw">const</span> response = <span class="ckw">await</span> <span class="cf">fetch</span>(<span class="cs">"https://agentoracle.co/research"</span>, {',
      '  <span class="cp">method:</span> <span class="cs">"POST"</span>,',
      '  <span class="cp">headers:</span> {',
      '    <span class="cs">"Content-Type"</span>: <span class="cs">"application/json"</span>,',
      '    <span class="cs">"X-PAYMENT"</span>: x402Payment  <span class="ck">// USDC on Base</span>',
      '  },',
      '  <span class="cp">body:</span> <span class="cf">JSON.stringify</span>({',
      '    <span class="cp">query:</span> <span class="cs">"Latest AI agent frameworks 2026"</span>',
      '  })',
      '});',
      '',
      '<span class="ckw">const</span> data = <span class="ckw">await</span> response.<span class="cf">json</span>();',
      '<span class="ck">// \\u2192 structured research with sources</span>'
    ];
    var currentLine = 0, currentChar = 0, html = "";
    function typeChar() {
      if (currentLine >= lines.length) {
        heroCode.innerHTML = html;
        return;
      }
      var line = lines[currentLine];
      var plainText = line.replace(/<[^>]+>/g, "");
      if (currentChar === 0 && currentLine > 0) html += "\\n";
      if (currentChar >= plainText.length) {
        html += line.substring(line.lastIndexOf(">") === -1 ? currentChar : 0);
        if (currentChar === 0) html += line;
        currentLine++; currentChar = 0;
        heroCode.innerHTML = html + '<span class="typing-cursor"></span>';
        setTimeout(typeChar, currentLine < lines.length && lines[currentLine] === "" ? 100 : 40);
        return;
      }
      currentChar++; currentLine++; currentChar = 0;
      html += line;
      heroCode.innerHTML = html + '<span class="typing-cursor"></span>';
      setTimeout(typeChar, Math.random() * 30 + 20);
    }
    /* Simplified: show all lines with typing cursor at end */
    var fullHtml = lines.join("\\n");
    var charIdx = 0;
    var stripped = fullHtml.replace(/<[^>]+>/g, "");
    function showLine(idx) {
      if (idx >= lines.length) { heroCode.innerHTML = lines.join("\\n"); return; }
      heroCode.innerHTML = lines.slice(0, idx + 1).join("\\n") + '<span class="typing-cursor"></span>';
      setTimeout(function () { showLine(idx + 1); }, 60 + Math.random() * 40);
    }
    showLine(0);
  }
})();
// Sparkle canvas animation
(function(){
const c=document.getElementById('sparkle-canvas');
if(!c)return;
const ctx=c.getContext('2d');
let w,h,particles=[];
function resize(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight;}
window.addEventListener('resize',resize);resize();
for(let i=0;i<40;i++)particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+0.5,dx:(Math.random()-0.5)*0.3,dy:(Math.random()-0.5)*0.3,o:Math.random()*0.5+0.1});
function draw(){
ctx.clearRect(0,0,w,h);
particles.forEach(p=>{
p.x+=p.dx;p.y+=p.dy;
if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle='rgba(201,169,110,'+p.o+')';ctx.fill();
});
requestAnimationFrame(draw);}
draw();
})();
</script>
</body>
</html>`;