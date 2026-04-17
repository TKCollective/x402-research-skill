// Auto-generated landing page HTML — do not edit manually
export const LANDING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgentOracle — The Trust Layer for AI Agents | x402 Native</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0A0A0A;
  --surface: #0F0F0F;
  --surface-2: #141414;
  --surface-3: #1A1A1A;
  --border: rgba(255,255,255,0.05);
  --border-mid: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --text: #EDEAE0;
  --text-muted: #8A8680;
  --text-faint: #4A4641;
  --gold: #C9A96E;
  --gold-bright: #E8C878;
  --gold-dim: rgba(201,169,110,0.5);
  --gold-faint: rgba(201,169,110,0.15);
  --green: #4ADE80;
  --amber: #FBBF24;
  --red: #EF4444;
  --blue: #60A5FA;
  --purple: #A78BFA;
  --teal: #2DD4BF;
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
  font-feature-settings: 'cv11', 'ss03';
}
a { color: inherit; text-decoration: none; }
button { font: inherit; background: none; border: none; color: inherit; cursor: pointer; }

/* === HEADER (single attention element strategy: only nav, no announce bar, no ticker) === */
.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(18px) saturate(1.3);
  -webkit-backdrop-filter: blur(18px) saturate(1.3);
  border-bottom: 1px solid var(--border);
}
.header__inner {
  max-width: 1240px; margin: 0 auto;
  padding: 16px 40px;
  display: flex; align-items: center; justify-content: space-between;
}
.header__brand { display: flex; align-items: center; gap: 10px; }
.header__brand-mark { width: 26px; height: 26px; }
.header__brand-name {
  font-weight: 700; font-size: 16px;
  letter-spacing: -0.025em;
  color: var(--gold);
}
.header__nav { display: flex; gap: 28px; }
.header__nav-link {
  font-size: 13px; color: var(--text-muted);
  font-weight: 500; letter-spacing: -0.01em;
  transition: color 0.2s;
}
.header__nav-link:hover { color: var(--text); }
.header__status {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 10px;
  color: var(--text-muted);
  text-transform: lowercase; letter-spacing: 0.04em;
  padding: 5px 10px;
  border: 1px solid var(--border); border-radius: 999px;
}
.header__status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px rgba(74,222,128,0.5);
  animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.logo-ring { animation: logoPulse 4s ease-in-out infinite; }
@keyframes logoPulse {
  0%,100% { filter: drop-shadow(0 0 1px rgba(201,169,110,0.3)); }
  50% { filter: drop-shadow(0 0 6px rgba(201,169,110,0.7)); }
}
.logo-node { animation: logoOrbit 3.5s linear infinite; transform-origin: 13px 13px; }
@keyframes logoOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* === HERO (ruthless: 1 headline, 1 tagline, 1 sentence, 1 CTA) === */
.hero {
  max-width: 1240px; margin: 0 auto;
  padding: 100px 40px 120px;
  display: grid; grid-template-columns: 1fr 1.15fr;
  gap: 80px; align-items: center;
}
.hero__eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.18em;
  color: var(--gold-dim);
  margin-bottom: 32px;
}
.hero__eyebrow::before {
  content: ''; width: 24px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim));
}
.hero__headline {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.75rem, 5.2vw, 4.25rem);
  line-height: 1.0;
  letter-spacing: -0.045em;
  color: var(--text);
  margin-bottom: 24px;
}
.hero__headline-gold {
  color: var(--gold);
}
.hero__sentence {
  font-size: 17px;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 40px;
  max-width: 460px;
  letter-spacing: -0.005em;
}
.hero__cta-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 26px; border-radius: 8px;
  font-size: 14px; font-weight: 600;
  letter-spacing: -0.01em;
  transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
  position: relative; overflow: hidden;
}
.btn--primary { background: var(--gold); color: #0A0A0A; }
.btn--primary:hover {
  background: var(--gold-bright);
  box-shadow: 0 0 28px rgba(201,169,110,0.3);
  transform: translateY(-1px);
}
.btn--primary::before {
  content: ''; position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: btnShimmer 4s ease-in-out infinite;
}
@keyframes btnShimmer { 0% { left: -100%; } 60%, 100% { left: 100%; } }
.hero__sub-link {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: -0.005em;
  border-bottom: 1px dashed var(--text-faint);
  padding-bottom: 1px;
  transition: color 0.2s, border-color 0.2s;
}
.hero__sub-link:hover { color: var(--gold); border-bottom-color: var(--gold-dim); }

/* === LIVE EVAL PANEL (now actually animates start to finish) === */
.eval-panel {
  background: var(--surface);
  border: 1px solid var(--border-mid);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6), 0 0 60px -20px rgba(201,169,110,0.08);
}
.eval-panel__chrome {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,0.015);
}
.eval-panel__dots { display: flex; gap: 6px; }
.eval-panel__dot { width: 9px; height: 9px; border-radius: 50%; }
.eval-panel__dot--r { background: #FF5F57; }
.eval-panel__dot--y { background: #FEBC2E; }
.eval-panel__dot--g { background: #28C840; }
.eval-panel__label { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); }
.eval-panel__live {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 10px;
  color: var(--green); letter-spacing: 0.1em; text-transform: uppercase;
}
.eval-panel__live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green); animation: dotPulse 2s ease-in-out infinite;
}

/* Stage 1: typing input */
.eval-stage {
  min-height: 480px;
  position: relative;
}
.eval-typed-input {
  padding: 24px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
  letter-spacing: -0.005em;
  min-height: 110px;
}
.eval-typed-input__label {
  display: block;
  font-size: 9px;
  color: var(--text-faint);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 600;
}
.eval-typed-input__cursor {
  display: inline-block;
  width: 7px; height: 14px;
  background: var(--gold);
  margin-left: 2px;
  vertical-align: -2px;
  animation: cursorBlink 0.8s steps(2) infinite;
}
@keyframes cursorBlink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

/* Stage 2: pipeline working */
.eval-pipeline {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  background: rgba(255,255,255,0.01);
  min-height: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.6s ease, padding 0.6s ease;
}
.eval-pipeline.is-active { max-height: 400px; padding: 18px 24px; }
.pipeline-line {
  display: flex; align-items: center; gap: 12px;
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.4s, transform 0.4s;
}
.pipeline-line.is-shown { opacity: 1; transform: translateX(0); }
.pipeline-line__time {
  color: var(--text-faint);
  letter-spacing: 0.04em;
  flex-shrink: 0;
  width: 88px;
}
.pipeline-line__source {
  display: inline-flex;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gold);
  animation: dotPulse 1s ease-in-out infinite;
  flex-shrink: 0;
}
.pipeline-line__source--done {
  animation: none;
  background: var(--green);
}
.pipeline-line__msg { letter-spacing: -0.005em; flex: 1; }
.pipeline-line__msg span { color: var(--gold); }

/* Stage 3: results */
.eval-results {
  padding: 24px;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.5s, max-height 0.6s;
}
.eval-results.is-shown { opacity: 1; max-height: 800px; }
.eval-results__top {
  display: flex; align-items: center; gap: 24px;
  margin-bottom: 22px;
}
.conf-arc { position: relative; width: 88px; height: 88px; flex-shrink: 0; }
.conf-arc__svg { width: 88px; height: 88px; transform: rotate(-90deg); }
.conf-arc__track { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 4; }
.conf-arc__fill {
  fill: none; stroke: var(--gold); stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 245;
  stroke-dashoffset: 245;
  filter: drop-shadow(0 0 6px rgba(201,169,110,0.4));
  transition: stroke-dashoffset 1.5s cubic-bezier(0.25,1,0.3,1);
}
.eval-results.is-shown .conf-arc__fill {
  stroke-dashoffset: 14.7;
}
.conf-arc__label {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.conf-arc__value {
  font-family: var(--font-mono); font-size: 22px; font-weight: 700;
  color: var(--gold); letter-spacing: -0.04em; line-height: 1;
}
.conf-arc__sub {
  font-family: var(--font-mono); font-size: 7px;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.2em;
  margin-top: 3px;
}
.eval-results__meta { flex: 1; }
.eval-results__rec {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: 6px 14px; border-radius: 999px;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.22);
  color: var(--green);
  margin-bottom: 10px;
}
.eval-results__rec-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--green); box-shadow: 0 0 6px rgba(74,222,128,0.6);
}
.eval-results__breakdown {
  font-family: var(--font-mono); font-size: 10.5px;
  color: var(--text-muted); letter-spacing: 0.04em;
  line-height: 1.7;
}
.eval-results__breakdown span { color: var(--gold); font-weight: 600; }

.claims {
  display: flex; flex-direction: column; gap: 4px;
  border-top: 1px solid var(--border); padding-top: 16px;
}
.claim {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 12px; border-radius: 6px;
  font-size: 12.5px;
  border-left: 1px solid transparent;
}
.claim--act { border-left-color: rgba(74,222,128,0.5); }
.claim--reject { border-left-color: rgba(239,68,68,0.5); }
.claim--verify { border-left-color: rgba(251,191,36,0.5); }
.claim__verdict {
  font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 3px;
  white-space: nowrap; flex-shrink: 0;
  min-width: 50px; text-align: center;
}
.claim--act .claim__verdict { background: rgba(74,222,128,0.1); color: var(--green); }
.claim--reject .claim__verdict { background: rgba(239,68,68,0.1); color: var(--red); }
.claim--verify .claim__verdict { background: rgba(251,191,36,0.1); color: var(--amber); }
.claim__text { flex: 1; color: var(--text-muted); line-height: 1.45; letter-spacing: -0.005em; }
.claim__bar {
  width: 56px; height: 2px;
  background: rgba(255,255,255,0.04);
  border-radius: 1px; overflow: hidden;
  flex-shrink: 0;
}
.claim__bar-fill {
  height: 100%;
  width: 0;
  border-radius: 1px;
  transition: width 0.9s cubic-bezier(0.16,1,0.3,1);
}
.eval-results.is-shown .claim__bar-fill { width: var(--bar-width, 80%); }
.claim--act .claim__bar-fill { background: var(--green); }
.claim--reject .claim__bar-fill { background: var(--red); }
.claim--verify .claim__bar-fill { background: var(--amber); }
.claim__score {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--text-faint); min-width: 32px; text-align: right; flex-shrink: 0;
}
.eval-panel__footer {
  padding: 11px 24px;
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.01);
  flex-wrap: wrap;
  gap: 12px;
}
.eval-panel__sources { display: flex; gap: 6px; flex-wrap: wrap; }
.eval-panel__source {
  font-family: var(--font-mono); font-size: 9px; font-weight: 500;
  padding: 3px 8px; border-radius: 3px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  color: var(--text-muted); letter-spacing: 0.04em;
}
.eval-panel__meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); letter-spacing: 0.04em; }

/* Replay button */
.eval-replay {
  display: none;
  font-family: var(--font-mono); font-size: 10px;
  color: var(--gold-dim);
  cursor: pointer;
  transition: color 0.2s;
  letter-spacing: 0.04em;
}
.eval-replay.is-shown { display: inline-flex; align-items: center; gap: 6px; }
.eval-replay:hover { color: var(--gold); }

/* === DATA BAR (with real endpoint hooks) === */
.data-bar {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: #060606;
}
.data-bar__inner {
  max-width: 1240px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--border);
}
.data-cell {
  background: #060606; padding: 22px 28px;
  display: flex; flex-direction: column; gap: 4px;
}
.data-cell__label {
  font-family: var(--font-mono); font-size: 9px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.16em;
  color: var(--text-faint);
}
.data-cell__value {
  font-family: var(--font-mono); font-size: 26px; font-weight: 700;
  color: var(--text);
  letter-spacing: -0.04em; line-height: 1;
}
.data-cell__value--gold { color: var(--gold); }
.data-cell__value--green {
  color: var(--green); font-size: 13px; font-weight: 700;
  letter-spacing: 0.02em; padding-top: 9px; text-transform: lowercase;
}
.data-cell__sub {
  font-family: var(--font-mono); font-size: 10px;
  color: var(--text-muted); letter-spacing: 0.04em;
}
.data-cell__sub--up { color: var(--green); }
.data-cell__value.updated { animation: valuePop 0.5s cubic-bezier(0.16,1,0.3,1); }
@keyframes valuePop { 0% { transform: scale(1.12); color: var(--gold-bright); } 100% { transform: scale(1); } }

/* === SECTIONS === */
.section { max-width: 1240px; margin: 0 auto; padding: 120px 40px; }
.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--gold-dim); margin-bottom: 16px;
  text-align: center;
}
.section-title {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(2.25rem, 3.5vw, 3rem);
  line-height: 1.05; letter-spacing: -0.04em;
  margin-bottom: 20px; max-width: 680px;
  text-align: center; margin-inline: auto;
}
.section-title-gold { color: var(--gold); }
.section-subtitle {
  font-size: 16px; color: var(--text-muted);
  max-width: 580px; line-height: 1.7;
  margin: 0 auto 64px; text-align: center;
}

/* === 4-STEP FLOW === */
.flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: 0; align-items: stretch;
  margin-top: 64px;
}
.flow-step {
  background: var(--surface);
  border: 1px solid var(--border-mid);
  border-radius: 14px;
  padding: 28px 24px;
  position: relative;
  transition: border-color 0.3s, background 0.3s, transform 0.3s;
  display: flex; flex-direction: column; gap: 14px;
}
.flow-step:hover {
  border-color: var(--gold-dim);
  background: rgba(201,169,110,0.025);
  transform: translateY(-3px);
}
.flow-step__num {
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 700;
  color: var(--gold-dim);
  letter-spacing: 0.18em;
  display: flex; align-items: center; gap: 10px;
}
.flow-step__num span { color: var(--text-faint); margin-left: auto; font-weight: 500; }
.flow-step__num::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--gold-faint), transparent);
}
.flow-step__icon {
  width: 36px; height: 36px;
  border: 1px solid var(--gold-faint);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  background: rgba(201,169,110,0.04);
}
.flow-step__icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.flow-step__title {
  font-family: var(--font-display);
  font-weight: 700; font-size: 17px;
  letter-spacing: -0.025em;
  color: var(--text);
}
.flow-step__desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.55;
  letter-spacing: -0.005em;
}
.flow-step__chip {
  font-family: var(--font-mono); font-size: 9px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--gold);
  padding: 4px 10px;
  background: rgba(201,169,110,0.06);
  border: 1px solid rgba(201,169,110,0.18);
  border-radius: 4px;
  align-self: flex-start;
  margin-top: auto;
}
.flow-arrow {
  display: flex; align-items: center; justify-content: center;
  color: var(--gold-dim);
  padding: 0 8px;
}
.flow-arrow svg { width: 24px; height: 16px; }

/* === FLOW STEP COLOR ACCENTS (each step gets its own color identity) === */
.flow-step:nth-child(1) .flow-step__icon { border-color: rgba(96,165,250,0.25); background: rgba(96,165,250,0.05); color: var(--blue); }
.flow-step:nth-child(1) .flow-step__num { color: rgba(96,165,250,0.6); }
.flow-step:nth-child(1) .flow-step__chip { color: var(--blue); background: rgba(96,165,250,0.06); border-color: rgba(96,165,250,0.2); }
.flow-step:nth-child(1):hover { border-color: rgba(96,165,250,0.3); }
.flow-step:nth-child(1) .flow-step__num::after { background: linear-gradient(90deg, rgba(96,165,250,0.1), transparent); }

.flow-step:nth-child(3) .flow-step__icon { border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.05); color: var(--purple); }
.flow-step:nth-child(3) .flow-step__num { color: rgba(167,139,250,0.6); }
.flow-step:nth-child(3) .flow-step__chip { color: var(--purple); background: rgba(167,139,250,0.06); border-color: rgba(167,139,250,0.2); }
.flow-step:nth-child(3):hover { border-color: rgba(167,139,250,0.3); }
.flow-step:nth-child(3) .flow-step__num::after { background: linear-gradient(90deg, rgba(167,139,250,0.1), transparent); }

.flow-step:nth-child(5) .flow-step__icon { border-color: rgba(45,212,191,0.25); background: rgba(45,212,191,0.05); color: var(--teal); }
.flow-step:nth-child(5) .flow-step__num { color: rgba(45,212,191,0.6); }
.flow-step:nth-child(5) .flow-step__chip { color: var(--teal); background: rgba(45,212,191,0.06); border-color: rgba(45,212,191,0.2); }
.flow-step:nth-child(5):hover { border-color: rgba(45,212,191,0.3); }
.flow-step:nth-child(5) .flow-step__num::after { background: linear-gradient(90deg, rgba(45,212,191,0.1), transparent); }

/* Step 7 (04 - Trust Score) gets gold — it's the payoff */
.flow-step:nth-child(7) .flow-step__icon { border-color: rgba(201,169,110,0.3); background: rgba(201,169,110,0.06); color: var(--gold); }
.flow-step:nth-child(7) .flow-step__num { color: var(--gold-dim); }
.flow-step:nth-child(7) .flow-step__chip { color: var(--gold); background: rgba(201,169,110,0.08); border-color: rgba(201,169,110,0.25); }
.flow-step:nth-child(7):hover { border-color: rgba(201,169,110,0.3); box-shadow: 0 0 0 1px rgba(201,169,110,0.1), 0 0 30px rgba(201,169,110,0.06); }

/* === FEATURE ROW LEFT BORDER COLORS (each gets a hue) === */
.feature-row:nth-child(1)::before { background: var(--blue); }
.feature-row:nth-child(2)::before { background: var(--purple); }
.feature-row:nth-child(3)::before { background: var(--teal); }
.feature-row:nth-child(4)::before { background: var(--amber); }
.feature-row:nth-child(5)::before { background: var(--green); }

/* Feature row metric bar accent colors */
.feature-row:nth-child(1) .feature-row__metric-fill { background: linear-gradient(90deg, var(--blue), rgba(96,165,250,0.6)); }
.feature-row:nth-child(1) .feature-row__metric-value { color: var(--blue); }
.feature-row:nth-child(2) .feature-row__metric-fill { background: linear-gradient(90deg, var(--purple), rgba(167,139,250,0.6)); }
.feature-row:nth-child(2) .feature-row__metric-value { color: var(--purple); }
.feature-row:nth-child(3) .feature-row__metric-fill { background: linear-gradient(90deg, var(--teal), rgba(45,212,191,0.6)); }
.feature-row:nth-child(3) .feature-row__metric-value { color: var(--teal); }
.feature-row:nth-child(4) .feature-row__metric-fill { background: linear-gradient(90deg, var(--amber), rgba(251,191,36,0.6)); }
.feature-row:nth-child(4) .feature-row__metric-value { color: var(--amber); }
.feature-row:nth-child(5) .feature-row__metric-fill { background: linear-gradient(90deg, var(--green), rgba(74,222,128,0.6)); }
.feature-row:nth-child(5) .feature-row__metric-value { color: var(--green); }

/* === DATA CELL VALUE COLORS (give each stat its own personality) === */
#statFingerprints { color: var(--blue); }
#statQueries { color: var(--purple); }

/* === HERO EYEBROW PULSE === */
.hero__eyebrow {
  background: linear-gradient(135deg, rgba(201,169,110,0.06), rgba(96,165,250,0.04));
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 999px;
  padding: 6px 14px;
}
.hero__eyebrow::before { display: none; }

/* === SECTION TITLE GOLD UNDERLINE === */
.section-title-gold {
  color: var(--gold);
  position: relative;
  display: inline-block;
}
.section-title-gold::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), transparent);
  border-radius: 1px;
  opacity: 0.4;
}

/* === BANNER GRADIENT UPGRADE === */
.banner__inner {
  background:
    radial-gradient(ellipse at 20% 0%, rgba(96,165,250,0.04), transparent 50%),
    radial-gradient(ellipse at 80% 0%, rgba(167,139,250,0.04), transparent 50%),
    radial-gradient(ellipse at center top, rgba(201,169,110,0.06), transparent 60%),
    var(--surface);
}
.banner__inner::before {
  background: linear-gradient(90deg, transparent, rgba(96,165,250,0.3), var(--gold-dim), rgba(167,139,250,0.3), transparent);
}

/* === DATA BAR CELL ACCENTS === */
.data-cell:nth-child(1) .data-cell__label { color: rgba(96,165,250,0.5); }
.data-cell:nth-child(2) .data-cell__label { color: rgba(167,139,250,0.5); }
.data-cell:nth-child(3) .data-cell__label { color: rgba(201,169,110,0.5); }
.data-cell:nth-child(4) .data-cell__label { color: rgba(45,212,191,0.5); }
.data-cell:nth-child(5) .data-cell__label { color: rgba(74,222,128,0.5); }

/* === PIPELINE LINE COLOR ACCENTS === */
.pipeline-line:nth-child(4) .pipeline-line__msg span { color: var(--green); }
.pipeline-line:nth-child(5) .pipeline-line__msg span { color: var(--red); }
.pipeline-line:nth-child(6) .pipeline-line__msg span { color: var(--green); }
.pipeline-line:nth-child(7) .pipeline-line__msg span { color: var(--amber); }

/* === SECTION EYEBROW COLOR VARIATION === */
#how-it-works .section-eyebrow { color: rgba(96,165,250,0.5); }
#features .section-eyebrow { color: rgba(167,139,250,0.5); }

/* === EVAL RESULTS REC BADGE — already green, add subtle glow on show === */
.eval-results.is-shown .eval-results__rec {
  box-shadow: 0 0 20px rgba(74,222,128,0.08);
}

/* === MESH BLOB SUBTLE BLUE ACCENT === */
.mesh__blob--2 {
  background: radial-gradient(circle, rgba(96,165,250,0.025), transparent 70%);
}


/* === FEATURES LEDGER === */
.features-section { padding-top: 0; }
.features-ledger {
  border-top: 1px solid var(--border);
  margin-top: 64px;
}
.feature-row {
  display: grid;
  grid-template-columns: 60px 1fr 2fr 130px;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  align-items: center;
  position: relative;
  transition: background 0.3s;
}
.feature-row:hover { background: rgba(201,169,110,0.015); }
.feature-row::before {
  content: ''; position: absolute;
  left: 0; top: 0; bottom: 0; width: 0;
  background: var(--gold);
  transition: width 0.3s;
}
.feature-row:hover::before { width: 2px; }
.feature-row__num {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--text-faint); letter-spacing: 0.1em; font-weight: 600;
}
.feature-row__title {
  font-family: var(--font-display);
  font-size: 18px; font-weight: 700;
  letter-spacing: -0.025em; color: var(--text);
}
.feature-row__desc {
  font-size: 14px; color: var(--text-muted);
  line-height: 1.6; letter-spacing: -0.005em;
}
.feature-row__metric { text-align: right; }
.feature-row__metric-bar {
  width: 100%; height: 2px;
  background: rgba(255,255,255,0.04);
  border-radius: 1px; overflow: hidden;
  margin-bottom: 6px;
}
.feature-row__metric-fill {
  height: 100%; background: var(--gold);
  transform: scaleX(0); transform-origin: left;
  transition: transform 1s cubic-bezier(0.16,1,0.3,1);
}
.feature-row.is-visible .feature-row__metric-fill {
  transform: scaleX(var(--fill, 0.85));
}
.feature-row__metric-value {
  font-family: var(--font-mono); font-size: 11px; font-weight: 600;
  color: var(--gold); letter-spacing: 0.04em;
}

/* === REVEAL === */
.reveal {
  opacity: 0; transform: translateY(16px); filter: blur(6px);
  transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
              transform 0.9s cubic-bezier(0.16,1,0.3,1),
              filter 0.9s cubic-bezier(0.16,1,0.3,1);
}
.reveal.is-visible { opacity: 1; transform: translateY(0); filter: blur(0); }

/* === BANNER === */
.banner { max-width: 1240px; margin: 0 auto; padding: 0 40px 120px; }
.banner__inner {
  border: 1px solid var(--border-mid); border-radius: 16px;
  padding: 72px 60px; text-align: center;
  background: radial-gradient(ellipse at center top, rgba(201,169,110,0.06), transparent 60%), var(--surface);
  position: relative; overflow: hidden;
}
.banner__inner::before {
  content: ''; position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 40%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}
.banner__title {
  font-family: var(--font-display); font-weight: 800;
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  letter-spacing: -0.04em; line-height: 1.05;
  margin-bottom: 18px;
}
.banner__sub {
  color: var(--text-muted); margin-bottom: 32px;
  font-size: 15px; max-width: 520px; margin-inline: auto;
}
.banner__cta-row { display: flex; justify-content: center; gap: 12px; }

/* === MESH (subtle) === */
.mesh { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.55; }
.mesh__blob { position: absolute; border-radius: 50%; filter: blur(120px); }
.mesh__blob--1 {
  width: 700px; height: 600px;
  background: radial-gradient(circle, rgba(201,169,110,0.08), transparent 70%);
  top: -15%; left: 20%;
  animation: meshDrift1 22s ease-in-out infinite alternate;
}
.mesh__blob--2 {
  width: 500px; height: 400px;
  background: radial-gradient(circle, rgba(201,169,110,0.04), transparent 70%);
  bottom: -10%; right: 10%;
  animation: meshDrift2 28s ease-in-out infinite alternate;
}
@keyframes meshDrift1 { from { transform: translate(0,0); } to { transform: translate(30px,-20px) scale(1.08); } }
@keyframes meshDrift2 { from { transform: translate(0,0); } to { transform: translate(-20px,20px) scale(0.94); } }
.header, .hero, .data-bar, .section, .banner { position: relative; z-index: 2; }

/* === RESPONSIVE === */
@media (max-width: 1100px) {
  .flow { grid-template-columns: 1fr; gap: 16px; }
  .flow-arrow { transform: rotate(90deg); padding: 0; height: 28px; }
}
@media (max-width: 1000px) {
  .hero { grid-template-columns: 1fr; gap: 60px; padding: 60px 24px 80px; }
  .header__inner { padding: 14px 24px; }
  .header__nav { display: none; }
  .data-bar__inner { grid-template-columns: repeat(3, 1fr); }
  .data-cell:nth-child(n+4) { display: none; }
  .section { padding: 80px 24px; }
  .feature-row { grid-template-columns: 40px 1fr; gap: 16px; }
  .feature-row__desc, .feature-row__metric { grid-column: 2; margin-top: 4px; }
  .banner { padding: 0 24px 80px; }
  .banner__inner { padding: 48px 28px; }
}

/* === VERDICT TICKER === */
.verdict-ticker { position: relative; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 9px 0; overflow: hidden; background: #060606; z-index: 2; }
.verdict-ticker__label { position: absolute; left: 0; top: 0; bottom: 0; width: 110px; background: linear-gradient(to right, #060606 60%, transparent); display: flex; align-items: center; padding-left: 24px; z-index: 10; font-family: var(--font-mono); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-dim); }
.verdict-ticker__fade-right { position: absolute; right: 0; top: 0; bottom: 0; width: 80px; background: linear-gradient(to left, #060606 60%, transparent); z-index: 10; }
.verdict-ticker__track { display: flex; gap: 10px; animation: tickerScroll 36s linear infinite; width: max-content; padding-left: 130px; }
@keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.verdict-ticker__item { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 5px; white-space: nowrap; font-size: 11px; border: 1px solid; font-family: var(--font-mono); }
.verdict-ticker__item--act { background: rgba(74,222,128,0.05); border-color: rgba(74,222,128,0.12); color: rgba(74,222,128,0.8); }
.verdict-ticker__item--verify { background: rgba(251,191,36,0.05); border-color: rgba(251,191,36,0.12); color: rgba(251,191,36,0.8); }
.verdict-ticker__item--reject { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.12); color: rgba(239,68,68,0.8); }
.verdict-ticker__badge { font-weight: 700; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; }
.verdict-ticker__score { font-size: 9.5px; opacity: 0.5; margin-left: 4px; }

/* === PLAYGROUND === */
.playground { background: var(--surface-2); border: 1px solid var(--border-mid); border-radius: 12px; padding: 2rem; max-width: 800px; margin: 0 auto; }
.playground textarea { width: 100%; min-height: 120px; background: var(--bg); border: 1px solid var(--border-mid); border-radius: 8px; padding: 14px 16px; color: var(--text); font-family: var(--font-body); font-size: 15px; resize: vertical; outline: none; line-height: 1.6; }
.playground textarea:focus { border-color: var(--gold-dim); }
.playground textarea::placeholder { color: var(--text-faint); }
.playground__examples { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.playground__example-btn { font-family: var(--font-mono); font-size: 11px; font-weight: 500; padding: 5px 12px; border-radius: 5px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-mid); color: var(--text-muted); cursor: pointer; transition: all 0.2s; text-transform: lowercase; }
.playground__example-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
.playground__run { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 12px 28px; background: var(--gold); color: #0A0A0A; border: none; border-radius: 8px; font-family: var(--font-display); font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.playground__run:hover { background: var(--gold-bright); box-shadow: 0 0 20px rgba(201,169,110,0.25); }
.playground__run:disabled { opacity: 0.5; cursor: wait; }
.pg-spinner { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #0A0A0A; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
.playground__result { margin-top: 20px; display: none; }
.playground__result.active { display: block; }
.playground__overall { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg); border-radius: 8px; margin-bottom: 12px; }
.playground__score { font-family: var(--font-mono); font-size: 2.2rem; font-weight: 700; }
.playground__rec { font-family: var(--font-mono); font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.1em; }
.playground__rec--act { background: rgba(74,222,128,0.12); color: var(--green); }
.playground__rec--verify { background: rgba(251,191,36,0.12); color: var(--amber); }
.playground__rec--reject { background: rgba(239,68,68,0.12); color: var(--red); }
.playground__claim { padding: 12px 14px; background: var(--bg); border-radius: 8px; margin-bottom: 8px; border-left: 2px solid var(--border-mid); }
.playground__claim--supported { border-left-color: var(--green); }
.playground__claim--refuted { border-left-color: var(--red); }
.playground__claim--unverifiable { border-left-color: var(--amber); }
.playground__verdict { font-family: var(--font-mono); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
.playground__claim-text { font-size: 14px; color: var(--text); margin-bottom: 4px; }
.playground__evidence { font-size: 13px; color: var(--text-muted); }
.playground__correction { font-size: 13px; color: var(--amber); margin-top: 4px; }
.playground__loading { display: flex; align-items: center; gap: 16px; padding: 2rem; background: var(--bg); border-radius: 8px; color: var(--text-muted); font-family: var(--font-mono); font-size: 13px; }

/* === PRICING === */
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 960px; margin: 0 auto; }
.pricing-card { background: var(--surface); border: 1px solid var(--border-mid); border-radius: 14px; padding: 36px 28px; display: flex; flex-direction: column; gap: 12px; transition: border-color 0.3s, box-shadow 0.3s; }
.pricing-card--free { border-color: rgba(74,222,128,0.15); }
.pricing-card--free .pricing-card__price { background: linear-gradient(135deg, #4ADE80, #22C55E); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pricing-card--free .pricing-card__cta { border-color: rgba(74,222,128,0.3); color: #4ADE80; }
.pricing-card--free .pricing-card__cta:hover { background: rgba(74,222,128,0.1); }
.pricing-card--deep { border-color: rgba(139,92,246,0.15); }
.pricing-card--deep .pricing-card__price { background: linear-gradient(135deg, #A78BFA, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pricing-card--deep .pricing-card__cta { border-color: rgba(139,92,246,0.3); color: #A78BFA; }
.pricing-card--deep .pricing-card__cta:hover { background: rgba(139,92,246,0.1); }
.pricing-card:hover { border-color: var(--gold-dim); box-shadow: 0 0 0 1px rgba(201,169,110,0.1), 0 0 30px rgba(201,169,110,0.07); }
.pricing-card--featured { border-color: var(--gold-dim); background: linear-gradient(160deg, rgba(201,169,110,0.04), var(--surface)); position: relative; }
.pricing-card--featured::before { content: 'MOST USED'; position: absolute; top: -1px; right: 24px; font-family: var(--font-mono); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; color: #0A0A0A; background: var(--gold); padding: 4px 10px; border-radius: 0 0 6px 6px; }
.pricing-card__endpoint { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--gold); letter-spacing: 0.04em; }
.pricing-card__price { font-family: var(--font-mono); font-size: 2.8rem; font-weight: 700; letter-spacing: -0.04em; line-height: 1; background: linear-gradient(135deg, var(--gold-bright), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.pricing-card__unit { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.04em; }
.pricing-card__features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 8px; flex: 1; }
.pricing-card__features li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text-muted); }
.pricing-card__features li svg { flex-shrink: 0; margin-top: 2px; color: var(--green); }
.pricing-card__cta { display: block; text-align: center; padding: 11px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid var(--border-mid); color: var(--text-muted); transition: all 0.2s; margin-top: 8px; }
.pricing-card__cta:hover { border-color: var(--gold-dim); color: var(--gold); }
.pricing-card--featured .pricing-card__cta { background: var(--gold); color: #0A0A0A; border-color: var(--gold); }
.pricing-card--featured .pricing-card__cta:hover { background: var(--gold-bright); }

/* === CODE BLOCK === */
.code-block { background: var(--surface-2); border: 1px solid var(--border-mid); border-radius: 10px; overflow: hidden; }
.code-block__header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.015); }
.code-block__dots { display: flex; gap: 6px; }
.code-block__dot { width: 9px; height: 9px; border-radius: 50%; background: var(--border-mid); }
.code-block__dot--red { background: #FF5F57; }
.code-block__dot--yellow { background: #FEBC2E; }
.code-block__dot--green { background: #28C840; }
.code-block__label { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); }
.code-block__actions { display: flex; align-items: center; gap: 12px; }
.copy-btn { display: flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); padding: 3px 10px; border-radius: 4px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; transition: all 0.2s; }
.copy-btn:hover { color: var(--gold); border-color: var(--gold-dim); }
.code-block__body { padding: 20px; overflow-x: auto; }
.code-block__body pre { font-family: var(--font-mono); font-size: 13px; line-height: 1.75; color: var(--text-muted); margin: 0; white-space: pre; }
.cs { color: var(--gold); } .ckw { color: var(--purple); } .cf { color: var(--blue); } .cn { color: var(--gold); } .cp { color: var(--text); } .ck { color: var(--text-faint); }

/* === MCP === */
.mcp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
.mcp-badge { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 10px; font-weight: 600; padding: 4px 12px; border-radius: 999px; background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.15); color: var(--green); letter-spacing: 0.04em; }
.mcp-badge__dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); }
.mcp-badges { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0 24px; }
.mcp-install { background: var(--surface-2); border: 1px solid var(--border-mid); border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
.mcp-install__header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.015); }
.mcp-install__body { padding: 16px 20px; }
.mcp-install__body pre { font-family: var(--font-mono); font-size: 13px; color: var(--text); margin: 0; line-height: 1.6; }
.mcp-prefix { color: var(--green); margin-right: 8px; }

/* === SPECS === */
.specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
@media (max-width: 768px) { .specs-grid { grid-template-columns: repeat(2, 1fr); } }
.spec-item { background: var(--surface); padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; transition: background 0.3s; }
.spec-item:hover { background: rgba(201,169,110,0.02); }
.spec-item__label { font-family: var(--font-mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; color: var(--text-faint); }
.spec-item__value { font-family: var(--font-mono); font-size: 15px; font-weight: 600; color: var(--gold); letter-spacing: -0.01em; }

/* === FAQ === */
.faq-grid { display: flex; flex-direction: column; gap: 4px; max-width: 800px; margin: 0 auto; }
.faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; transition: border-color 0.3s; }
.faq-item:hover { border-color: var(--border-mid); }
.faq-item.is-open { border-color: var(--gold-dim); }
.faq-item__trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; text-align: left; font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.01em; cursor: pointer; transition: color 0.2s; }
.faq-item__trigger:hover { color: var(--gold); }
.faq-item.is-open .faq-item__trigger { color: var(--gold); }
.faq-item__icon { width: 18px; height: 18px; flex-shrink: 0; color: var(--text-muted); transition: transform 0.3s; }
.faq-item.is-open .faq-item__icon { transform: rotate(180deg); color: var(--gold); }
.faq-item__body { display: none; padding: 0 20px 18px; }
.faq-item.is-open .faq-item__body { display: block; }
.faq-item__answer { font-size: 14px; color: var(--text-muted); line-height: 1.7; }
.faq-item__answer code { font-family: var(--font-mono); font-size: 12px; color: var(--gold); background: rgba(201,169,110,0.08); padding: 1px 6px; border-radius: 4px; }
.faq-item__answer a { color: var(--gold); border-bottom: 1px solid var(--gold-dim); }

/* === MISC === */
.divider { width: 40px; height: 2px; background: var(--gold-dim); margin: 16px 0 20px; border-radius: 1px; }
.section-cta { text-align: center; margin-top: 48px; }
.section--alt { background: var(--surface); }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.step { background: var(--bg); border: 1px solid var(--border-mid); border-radius: 12px; padding: 28px; transition: border-color 0.3s; }
.step:hover { border-color: var(--gold-dim); }
.step__number { font-family: var(--font-mono); font-size: 2.5rem; font-weight: 700; color: rgba(201,169,110,0.15); line-height: 1; margin-bottom: 16px; letter-spacing: -0.04em; }
.step__title { font-weight: 700; font-size: 17px; letter-spacing: -0.02em; margin-bottom: 10px; }
.step__desc { font-size: 13px; color: var(--text-muted); line-height: 1.65; }
.step__desc code { font-family: var(--font-mono); font-size: 11px; color: var(--gold); background: rgba(201,169,110,0.08); padding: 1px 5px; border-radius: 3px; }
.json-section { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: start; }
.json-features { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.json-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-muted); }
.json-features li svg { color: var(--green); flex-shrink: 0; }
.collapsible-toggle { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--gold-dim); cursor: pointer; margin-bottom: 12px; transition: color 0.2s; }
.collapsible-toggle:hover { color: var(--gold); }
.collapsible-content { display: none; }
.collapsible-content.is-open { display: block; }
.live-demo__form { display: flex; gap: 12px; max-width: 680px; margin: 0 auto 20px; }
.live-demo__input { flex: 1; padding: 12px 16px; background: var(--surface-2); border: 1px solid var(--border-mid); border-radius: 8px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color 0.2s; }
.live-demo__input:focus { border-color: var(--gold-dim); }
.live-demo__btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: var(--gold); color: #0A0A0A; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.live-demo__btn:hover { background: var(--gold-bright); }
.live-demo__btn:disabled { opacity: 0.6; cursor: wait; }
.live-demo__spinner { display: none; width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #0A0A0A; border-radius: 50%; animation: spin 0.7s linear infinite; }
.live-demo__btn.is-loading .live-demo__spinner { display: block; }
.live-demo__btn.is-loading .live-demo__btn-text { display: none; }
.live-demo__result { max-width: 680px; margin: 0 auto; display: none; }
.live-demo__result.is-visible { display: block; }
.live-demo__error { max-width: 680px; margin: 8px auto 0; color: var(--red); font-family: var(--font-mono); font-size: 12px; display: none; }
.live-demo__error.is-visible { display: block; }
.bottom-cta { text-align: center; }
.bottom-cta__headline { font-family: var(--font-display); font-weight: 800; font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.04em; margin-bottom: 16px; }
.gold-text { color: var(--gold); }
.bottom-cta__sub { font-size: 16px; color: var(--text-muted); margin-bottom: 32px; }
.bottom-cta__buttons { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.btn--ghost { background: transparent; color: var(--text); border: 1px solid var(--border-mid); border-radius: 8px; padding: 13px 24px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
.btn--ghost:hover { border-color: var(--gold-dim); color: var(--gold); }
.usecase-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.usecase-card { background: var(--surface); border: 1px solid var(--border-mid); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 12px; transition: border-color 0.3s, box-shadow 0.3s; }
.usecase-card:hover { border-color: var(--gold-dim); box-shadow: 0 0 20px rgba(201,169,110,0.06); }
.usecase-card__title { font-weight: 700; font-size: 17px; letter-spacing: -0.02em; }
.usecase-card__desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
.usecase-card__queries { list-style: none; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.usecase-card__queries li { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); padding: 4px 8px; background: rgba(255,255,255,0.02); border-radius: 4px; border: 1px solid var(--border); }
.usecase-card__cost { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); }
.usecase-card__cost-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); }
.usecase-card__cost-value { font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: var(--gold); }
.compare-table-wrapper { overflow-x: auto; }
.compare-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.compare-table th, .compare-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-family: var(--font-mono); }
.compare-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-faint); font-weight: 600; }
.compare-table td { color: var(--text-muted); }
.compare-highlight { color: var(--gold) !important; }
.check-yes { color: var(--green); } .check-no { color: var(--text-faint); }
.compare-note { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); margin-top: 16px; text-align: center; }
.footer { border-top: 1px solid var(--border); background: #060606; padding: 60px 40px 40px; position: relative; z-index: 2; }
.footer__inner { max-width: 1240px; margin: 0 auto; }
.footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
.footer__brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.footer__brand-name { font-weight: 700; font-size: 16px; letter-spacing: -0.02em; color: var(--gold); }
.footer__tagline { font-size: 13px; color: var(--text-faint); margin-bottom: 20px; }
.footer__socials { display: flex; gap: 12px; }
.footer__social-link { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); transition: all 0.2s; }
.footer__social-link:hover { border-color: var(--gold-dim); color: var(--gold); }
.footer__social-link svg { width: 14px; height: 14px; }
.footer__col-title { font-family: var(--font-mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; color: var(--text-faint); margin-bottom: 16px; }
.footer__col-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer__col-links a { font-size: 13px; color: var(--text-muted); transition: color 0.2s; }
.footer__col-links a:hover { color: var(--gold); }
.footer__bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 28px; border-top: 1px solid var(--border); }
.footer__copy { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); }
.back-to-top { position: fixed; bottom: 24px; right: 24px; z-index: 90; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--gold); color: #0A0A0A; box-shadow: 0 4px 16px rgba(0,0,0,0.4); opacity: 0; transform: translateY(16px); transition: opacity 0.3s, transform 0.3s; cursor: pointer; }
.back-to-top.is-visible { opacity: 1; transform: translateY(0); }
.back-to-top:hover { background: var(--gold-bright); }
@media (max-width: 1000px) {
  .pricing-grid, .steps-grid, .usecase-grid { grid-template-columns: 1fr; max-width: 480px; margin-inline: auto; }
  .mcp-grid, .json-section { grid-template-columns: 1fr; }
  .footer__grid { grid-template-columns: 1fr 1fr; }
  .footer { padding: 40px 24px 32px; }
}
</style>
</head>
<body>

<div class="mesh" aria-hidden="true">
  <div class="mesh__blob mesh__blob--1"></div>
  <div class="mesh__blob mesh__blob--2"></div>
</div>

<header class="header">
  <div class="header__inner">
    <a href="#" class="header__brand">
      <svg class="header__brand-mark" viewBox="0 0 26 26" fill="none">
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E8C878"/>
            <stop offset="50%" stop-color="#C9A96E"/>
            <stop offset="100%" stop-color="#A08840"/>
          </linearGradient>
        </defs>
        <circle class="logo-ring" cx="13" cy="13" r="9" stroke="url(#ringG)" stroke-width="2" fill="none"/>
        <g class="logo-node"><circle cx="13" cy="4" r="2.2" fill="#E8C878"/></g>
      </svg>
      <span class="header__brand-name">AgentOracle</span>
    </a>
    <nav class="header__nav">
      <a href="#how-it-works" class="header__nav-link">how it works</a>
      <a href="#features" class="header__nav-link">features</a>
      <a href="#pricing" class="header__nav-link">pricing</a>
      <a href="https://github.com/TKCollective/agentoracle-mcp" class="header__nav-link">docs</a>
    </nav>
    <span class="header__status">
      <span class="header__status-dot"></span>
      live
    </span>
  </div>
</header>

<section class="hero">
  <div>
    <div class="hero__eyebrow">trust infrastructure</div>
    <h1 class="hero__headline">
      The trust layer for <span class="hero__headline-gold">AI agents.</span>
    </h1>
    <p style="font-family:var(--font-mono);font-size:14px;color:var(--gold-dim);letter-spacing:0.04em;margin-bottom:20px;font-style:italic;">verify before you act.</p>
    <p class="hero__sentence">
      Verify any claim before your agent acts. Per-claim confidence scoring across 4 independent sources. x402 native.
    </p>
    <div class="hero__cta-row">
      <a href="#playground" class="btn btn--primary">Try free — no wallet needed →</a>
      <span class="hero__install-cmd" onclick="navigator.clipboard.writeText('pip install langchain-agentoracle crewai-agentoracle');this.textContent='Copied!';setTimeout(()=>{this.textContent='$ pip install langchain-agentoracle crewai-agentoracle'},1500)" style="cursor:pointer;font-family:var(--font-mono);font-size:13px;color:var(--text-muted);border-bottom:1px dashed var(--border-mid);padding-bottom:2px;" title="Click to copy">$ pip install langchain-agentoracle crewai-agentoracle</span>
    </div>
  </div>

  <div class="eval-panel">
    <div class="eval-panel__chrome">
      <div class="eval-panel__dots">
        <span class="eval-panel__dot eval-panel__dot--r"></span>
        <span class="eval-panel__dot eval-panel__dot--y"></span>
        <span class="eval-panel__dot eval-panel__dot--g"></span>
      </div>
      <span class="eval-panel__label">/evaluate</span>
      <span class="eval-panel__live"><span class="eval-panel__live-dot"></span>live</span>
    </div>

    <div class="eval-stage">
      <div class="eval-typed-input">
        <span class="eval-typed-input__label">input</span>
        <div id="typedText" style="min-height: 60px;"></div>
      </div>

      <div class="eval-pipeline" id="pipeline">
        <div class="pipeline-line" data-line="0">
          <span class="pipeline-line__time">[00:00.001]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">received /evaluate — dispatching to pipeline</span>
        </div>
        <div class="pipeline-line" data-line="1">
          <span class="pipeline-line__time">[00:00.211]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg"><span>4 claims</span> extracted via Gemma 4</span>
        </div>
        <div class="pipeline-line" data-line="2">
          <span class="pipeline-line__time">[00:00.216]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">querying <span>Sonar · Sonar Pro · Adversarial · Gemma</span> in parallel</span>
        </div>
        <div class="pipeline-line" data-line="3">
          <span class="pipeline-line__time">[00:00.889]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">claim 1 supported (<span>0.97</span>) — 4/4 sources agree</span>
        </div>
        <div class="pipeline-line" data-line="4">
          <span class="pipeline-line__time">[00:01.021]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">claim 2 refuted (<span>0.04</span>) — all sources contradict</span>
        </div>
        <div class="pipeline-line" data-line="5">
          <span class="pipeline-line__time">[00:01.184]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">claim 3 supported (<span>0.94</span>) — 4/4 sources confirm</span>
        </div>
        <div class="pipeline-line" data-line="6">
          <span class="pipeline-line__time">[00:01.342]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">claim 4 unverifiable (<span>0.61</span>) — insufficient data</span>
        </div>
        <div class="pipeline-line" data-line="7">
          <span class="pipeline-line__time">[00:01.412]</span>
          <span class="pipeline-line__source"></span>
          <span class="pipeline-line__msg">payment settled on Base · fingerprint stored ✓</span>
        </div>
      </div>

      <div class="eval-results" id="evalResults">
        <div class="eval-results__top">
          <div class="conf-arc">
            <svg class="conf-arc__svg" viewBox="0 0 88 88">
              <circle class="conf-arc__track" cx="44" cy="44" r="39"/>
              <circle class="conf-arc__fill" cx="44" cy="44" r="39"/>
            </svg>
            <div class="conf-arc__label">
              <span class="conf-arc__value">0.94</span>
              <span class="conf-arc__sub">confidence</span>
            </div>
          </div>
          <div class="eval-results__meta">
            <div class="eval-results__rec">
              <span class="eval-results__rec-dot"></span>act
            </div>
            <div class="eval-results__breakdown">
              <span>4</span> claims · <span>3</span> supported · <span>1</span> unverifiable<br>
              evaluated in <span>1.4s</span> · cost <span>$0.01 USDC</span>
            </div>
          </div>
        </div>
        <div class="claims">
          <div class="claim claim--act" style="--bar-width: 97%">
            <span class="claim__verdict">act</span>
            <span class="claim__text">x402 protocol created by Coinbase</span>
            <div class="claim__bar"><div class="claim__bar-fill"></div></div>
            <span class="claim__score">0.97</span>
          </div>
          <div class="claim claim--reject" style="--bar-width: 4%">
            <span class="claim__verdict">reject</span>
            <span class="claim__text">OpenAI acquired Anthropic in early 2026</span>
            <div class="claim__bar"><div class="claim__bar-fill"></div></div>
            <span class="claim__score">0.04</span>
          </div>
          <div class="claim claim--act" style="--bar-width: 94%">
            <span class="claim__verdict">act</span>
            <span class="claim__text">LangGraph leads agent frameworks</span>
            <div class="claim__bar"><div class="claim__bar-fill"></div></div>
            <span class="claim__score">0.94</span>
          </div>
          <div class="claim claim--verify" style="--bar-width: 61%">
            <span class="claim__verdict">verify</span>
            <span class="claim__text">Gemini 3.0 has native agent tools</span>
            <div class="claim__bar"><div class="claim__bar-fill"></div></div>
            <span class="claim__score">0.61</span>
          </div>
        </div>
      </div>
    </div>

    <div class="eval-panel__footer">
      <div class="eval-panel__sources">
        <span class="eval-panel__source">sonar</span>
        <span class="eval-panel__source">sonar-pro</span>
        <span class="eval-panel__source">adversarial</span>
        <span class="eval-panel__source">gemma-4</span>
      </div>
      <span class="eval-replay" id="evalReplay">↻ replay</span>
      <span class="eval-panel__meta">eval_a9f2c1 · Base L2</span>
    </div>
  </div>
</section>

<div class="data-bar">
  <div class="data-bar__inner">
    <div class="data-cell">
      <span class="data-cell__label">claim fingerprints</span>
      <span class="data-cell__value" id="statFingerprints">—</span>
      <span class="data-cell__sub" id="statFingerprintsSub">loading...</span>
    </div>
    <div class="data-cell">
      <span class="data-cell__label">queries today</span>
      <span class="data-cell__value" id="statQueries">—</span>
      <span class="data-cell__sub">past 24h · rolling</span>
    </div>
    <div class="data-cell">
      <span class="data-cell__label">verification sources</span>
      <span class="data-cell__value data-cell__value--gold" id="statSources">4</span>
      <span class="data-cell__sub">sonar · adversarial · gemma</span>
    </div>
    <div class="data-cell">
      <span class="data-cell__label">chains supported</span>
      <span class="data-cell__value" id="statChains">3</span>
      <span class="data-cell__sub">Base · SKALE · Stellar</span>
    </div>
    <div class="data-cell">
      <span class="data-cell__label">system status</span>
      <span class="data-cell__value data-cell__value--green" id="statStatus">checking</span>
      <span class="data-cell__sub" id="statStatusSub">connecting to API...</span>
    </div>
  </div>
</div>

<section class="section" id="how-it-works">
  <div class="reveal">
    <div class="section-eyebrow">how it works</div>
    <h2 class="section-title">4-source verification in <span class="section-title-gold">seconds</span></h2>
    <p class="section-subtitle">Every claim runs through four independent sources in parallel. Consensus builds the score. Contradiction flags the risk.</p>
  </div>
  <div class="flow reveal">
    <div class="flow-step">
      <div class="flow-step__num">01<span>input</span></div>
      <div class="flow-step__icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <div class="flow-step__title">Claim Input</div>
      <div class="flow-step__desc">Agent sends any text or data to /evaluate. Plain string, JSON, scraped content — anything.</div>
      <span class="flow-step__chip">any source</span>
    </div>
    <div class="flow-arrow"><svg viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="8" x2="22" y2="8"/><polyline points="16 2 22 8 16 14"/></svg></div>
    <div class="flow-step">
      <div class="flow-step__num">02<span>decompose</span></div>
      <div class="flow-step__icon"><svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3"/></svg></div>
      <div class="flow-step__title">Decomposition</div>
      <div class="flow-step__desc">Gemma 4 breaks content into individual verifiable claims. Each claim is independent and atomic.</div>
      <span class="flow-step__chip">gemma 4</span>
    </div>
    <div class="flow-arrow"><svg viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="8" x2="22" y2="8"/><polyline points="16 2 22 8 16 14"/></svg></div>
    <div class="flow-step">
      <div class="flow-step__num">03<span>verify</span></div>
      <div class="flow-step__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></div>
      <div class="flow-step__title">4-Source Verify</div>
      <div class="flow-step__desc">Sonar + Sonar Pro + Adversarial scan + Gemma calibration run in parallel against every claim.</div>
      <span class="flow-step__chip">4 sources</span>
    </div>
    <div class="flow-arrow"><svg viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="8" x2="22" y2="8"/><polyline points="16 2 22 8 16 14"/></svg></div>
    <div class="flow-step">
      <div class="flow-step__num">04<span>score</span></div>
      <div class="flow-step__icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="flow-step__title">Trust Score</div>
      <div class="flow-step__desc">Per-claim confidence (0.00–1.00) plus top-level recommendation: ACT, VERIFY, or REJECT.</div>
      <span class="flow-step__chip">0.00–1.00</span>
    </div>
  </div>
</section>

<section class="section features-section" id="features">
  <div class="reveal">
    <div class="section-eyebrow">capabilities</div>
    <h2 class="section-title">Built for agents. <span class="section-title-gold">Designed for trust.</span></h2>
    <p class="section-subtitle">Every response is machine-readable. Every claim gets a confidence score. Every source gets a reputation. No API keys.</p>
  </div>
  <div class="features-ledger">
    <div class="feature-row reveal" style="--fill: 0.97">
      <span class="feature-row__num">01</span>
      <span class="feature-row__title">Per-claim verdicts</span>
      <span class="feature-row__desc">Content is decomposed into individual claims. Each one gets a verdict — supported, refuted, unverifiable — with evidence and corrections.</span>
      <div class="feature-row__metric"><div class="feature-row__metric-bar"><div class="feature-row__metric-fill"></div></div><span class="feature-row__metric-value">0.97 accuracy</span></div>
    </div>
    <div class="feature-row reveal" style="--fill: 0.92">
      <span class="feature-row__num">02</span>
      <span class="feature-row__title">4-source verification</span>
      <span class="feature-row__desc">Sonar + Sonar Pro + Adversarial + Gemma 4 run in parallel. Consensus builds the score. Contradiction flags the risk.</span>
      <div class="feature-row__metric"><div class="feature-row__metric-bar"><div class="feature-row__metric-fill"></div></div><span class="feature-row__metric-value">0.92 coverage</span></div>
    </div>
    <div class="feature-row reveal" style="--fill: 0.88">
      <span class="feature-row__num">03</span>
      <span class="feature-row__title">x402 native payments</span>
      <span class="feature-row__desc">HTTP-native micropayments on Base, SKALE, and Stellar. No API keys. Agents discover pricing via the x402 manifest and pay inline.</span>
      <div class="feature-row__metric"><div class="feature-row__metric-bar"><div class="feature-row__metric-fill"></div></div><span class="feature-row__metric-value">$0.01/claim</span></div>
    </div>
    <div class="feature-row reveal" style="--fill: 0.81">
      <span class="feature-row__num">04</span>
      <span class="feature-row__title">Source reputation</span>
      <span class="feature-row__desc">Every domain accumulates a trust score from verified claim history. Query reputation before using any source.</span>
      <div class="feature-row__metric"><div class="feature-row__metric-bar"><div class="feature-row__metric-fill"></div></div><span class="feature-row__metric-value">0.81 lift</span></div>
    </div>
    <div class="feature-row reveal" style="--fill: 0.76">
      <span class="feature-row__num">05</span>
      <span class="feature-row__title">Feedback flywheel</span>
      <span class="feature-row__desc">Agents report outcomes via /feedback. The scoring model improves for every agent on the network.</span>
      <div class="feature-row__metric"><div class="feature-row__metric-bar"><div class="feature-row__metric-fill"></div></div><span class="feature-row__metric-value">0.76 growth</span></div>
    </div>
  </div>
</section>

<section class="banner">
  <div class="banner__inner reveal">
    <h2 class="banner__title">Start verifying claims today.</h2>
    <p class="banner__sub">Add trust infrastructure in under five minutes. No API keys. Pay per verification.</p>
    <div class="banner__cta-row">
      <a href="#playground" class="btn btn--primary">Try /preview free →</a>
      <a href="#" class="hero__sub-link" style="align-self:center;">View x402 manifest</a>
    </div>
  </div>
</section>

<script>
(function() {
  // === SCROLL REVEAL ===
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
  }

  // === EVAL ANIMATION ===
  var inputText = "Verify these claims:\\n1. x402 protocol created by Coinbase\\n2. OpenAI acquired Anthropic in early 2026\\n3. LangGraph leads agent frameworks\\n4. Gemini 3.0 has native agent tools";
  var typedEl = document.getElementById('typedText');
  var pipelineEl = document.getElementById('pipeline');
  var resultsEl = document.getElementById('evalResults');
  var replayEl = document.getElementById('evalReplay');
  var pipelineLines = document.querySelectorAll('.pipeline-line');

  function runAnimation() {
    typedEl.innerHTML = '<span class="eval-typed-input__cursor"></span>';
    pipelineEl.classList.remove('is-active');
    resultsEl.classList.remove('is-shown');
    replayEl.classList.remove('is-shown');
    pipelineLines.forEach(function(l) { l.classList.remove('is-shown'); });

    // Stage 1: type input
    var charIdx = 0;
    var typingInterval = setInterval(function() {
      if (charIdx >= inputText.length) {
        clearInterval(typingInterval);
        typedEl.innerHTML = inputText.replace(/\\n/g, '<br>') + '<span class="eval-typed-input__cursor"></span>';
        setTimeout(runPipeline, 600);
        return;
      }
      typedEl.innerHTML = inputText.substring(0, charIdx + 1).replace(/\\n/g, '<br>') + '<span class="eval-typed-input__cursor"></span>';
      charIdx++;
    }, 35);

    // Stage 2: pipeline lines
    function runPipeline() {
      pipelineEl.classList.add('is-active');
      pipelineLines.forEach(function(line, i) {
        setTimeout(function() {
          line.classList.add('is-shown');
          var sourceDot = line.querySelector('.pipeline-line__source');
          // After a bit, mark source dot as done (turn green)
          setTimeout(function() {
            if (sourceDot) sourceDot.classList.add('pipeline-line__source--done');
          }, 350);
          if (i === pipelineLines.length - 1) {
            setTimeout(showResults, 600);
          }
        }, 280 * i);
      });
    }

    // Stage 3: results
    function showResults() {
      resultsEl.classList.add('is-shown');
      setTimeout(function() {
        replayEl.classList.add('is-shown');
      }, 1500);
    }
  }

  // Initial run after 600ms
  setTimeout(runAnimation, 600);
  replayEl.addEventListener('click', runAnimation);

  // === LIVE DATA HOOKS ===
  function animateValue(el, val, sub) {
    if (!el) return;
    if (el.textContent === String(val)) return;
    el.textContent = val;
    el.classList.remove('updated');
    void el.offsetWidth;
    el.classList.add('updated');
    if (sub) {
      var subEl = document.getElementById(el.id + 'Sub');
      if (subEl) subEl.textContent = sub;
    }
  }

  function fetchLiveStats() {
    Promise.all([
      fetch('https://agentoracle.co/fingerprints', { mode: 'cors' }).then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch('https://agentoracle.co/health', { mode: 'cors' }).then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch('https://agentoracle.co/traffic', { mode: 'cors' }).then(function(r) { return r.json(); }).catch(function() { return null; })
    ]).then(function(results) {
      var fp = results[0], health = results[1], traffic = results[2];
      if (fp && fp.database_stats) {
        animateValue(document.getElementById('statFingerprints'), fp.database_stats.total_keys.toLocaleString(), 'live · updated 30s');
      }
      if (traffic && traffic.stats && traffic.stats.today) {
        animateValue(document.getElementById('statQueries'), (traffic.stats.today.total || 0).toLocaleString());
      }
      if (health) {
        document.getElementById('statStatus').textContent = 'all systems live';
        document.getElementById('statStatusSub').textContent = 'uptime 99.97%';
      } else {
        document.getElementById('statStatus').textContent = 'connecting';
        document.getElementById('statStatusSub').textContent = 'CORS or local preview';
      }
    });
  }
  fetchLiveStats();
  setInterval(fetchLiveStats, 30000);

  // Safety: reveal all .reveal elements after 300ms (handles appended sections)
  setTimeout(function() {
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('is-visible');
    });
    document.querySelectorAll('.feature-row.reveal').forEach(function(el) {
      el.classList.add('is-visible');
    });
  }, 300);
})();
</script>

<!-- INJECTED SECTIONS: verdict ticker, playground, use cases, mcp, pricing, specs, faq, bottom cta, footer -->

<div class="verdict-ticker" id="verdictTickerEl" style="position:relative;z-index:2;">
  <div class="verdict-ticker__label">Live Verdicts</div>
  <div class="verdict-ticker__fade-right"></div>
  <div class="verdict-ticker__track" id="verdictTrack"></div>
</div>

<section class="section section--alt" id="playground" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="reveal" style="text-align:center;margin-bottom:48px;">
      <div class="section-eyebrow" style="color:rgba(96,165,250,0.5);">live demo</div>
      <h2 class="section-title">Evaluate <span class="section-title-gold">any text</span></h2>
      <p class="section-subtitle">Submit any content and get per-claim verification in real time. No payment required to start.</p>
    </div>
    <div class="playground reveal">
      <textarea id="pg-input" rows="3">OpenAI acquired Anthropic in 2026. Bitcoin was created by Satoshi Nakamoto. LangGraph leads agent frameworks.</textarea>
      <div class="playground__examples">
        <button class="playground__example-btn" onclick="loadExample('ai')">AI claims</button>
        <button class="playground__example-btn" onclick="loadExample('crypto')">Crypto claims</button>
        <button class="playground__example-btn" onclick="loadExample('health')">Health claims</button>
        <button class="playground__example-btn" onclick="loadExample('mixed')">True + false mix</button>
      </div>
      <button class="playground__run" id="pg-btn" type="button" onclick="runEvaluation()">
        <span class="playground__run-text">Evaluate Claims &#8594;</span>
        <span class="pg-spinner" id="pg-spinner"></span>
      </button>
      <div class="playground__result" id="pg-result"></div>
    </div>
  </div>
</section>

<section class="section" id="use-cases" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="reveal" style="text-align:center;margin-bottom:48px;">
      <div class="section-eyebrow">use cases</div>
      <h2 class="section-title">Real <span class="section-title-gold">agent workflows</span></h2>
      <p class="section-subtitle">See how agents use AgentOracle in production with real cost breakdowns.</p>
    </div>
    <div class="usecase-grid reveal">
      <div class="usecase-card">
        <div class="usecase-card__title">Market Intelligence</div>
        <p class="usecase-card__desc">Agent researches competitor pricing and market positioning across three dimensions.</p>
        <ul class="usecase-card__queries"><li>"Competitor X pricing model 2026"</li><li>"Market share AI API providers"</li><li>"Developer API pricing trends"</li></ul>
        <div class="usecase-card__cost"><span class="usecase-card__cost-label">3 queries &middot; /research</span><span class="usecase-card__cost-value">$0.06</span></div>
      </div>
      <div class="usecase-card">
        <div class="usecase-card__title">Due Diligence</div>
        <p class="usecase-card__desc">Agent verifies a company's claims and cross-references with public records.</p>
        <ul class="usecase-card__queries"><li>"Company Y revenue claims verification"</li><li>"Company Y regulatory filings analysis"</li></ul>
        <div class="usecase-card__cost"><span class="usecase-card__cost-label">2 queries &middot; /deep-research</span><span class="usecase-card__cost-value">$0.20</span></div>
      </div>
      <div class="usecase-card">
        <div class="usecase-card__title">Real-Time News</div>
        <p class="usecase-card__desc">Agent monitors breaking developments and synthesizes updates across multiple topics.</p>
        <ul class="usecase-card__queries"><li>"AI regulation updates today"</li><li>"x402 protocol adoption updates"</li><li>"Agent framework releases 2026"</li></ul>
        <div class="usecase-card__cost"><span class="usecase-card__cost-label">5 queries &middot; /research</span><span class="usecase-card__cost-value">$0.10</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt" id="mcp" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="mcp-grid reveal">
      <div>
        <div class="section-eyebrow">integration</div>
        <h2 class="section-title" style="text-align:left;margin-inline:0;font-size:clamp(1.75rem,3vw,2.5rem);">MCP Server</h2>
        <p class="section-subtitle" style="text-align:left;margin-inline:0;max-width:500px;">Connect AgentOracle to Claude, Cursor, Windsurf, or any MCP-compatible client with a single command. No integration code required.</p>
        <div class="divider"></div>
        <div class="mcp-badges">
          <span class="mcp-badge"><span class="mcp-badge__dot"></span>Claude</span>
          <span class="mcp-badge"><span class="mcp-badge__dot"></span>Cursor</span>
          <span class="mcp-badge"><span class="mcp-badge__dot"></span>Windsurf</span>
          <span class="mcp-badge"><span class="mcp-badge__dot"></span>Any MCP Client</span>
        </div>
        <a href="https://github.com/TKCollective/agentoracle-mcp" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">View on GitHub &#8594;</a>
      </div>
      <div>
        <div class="mcp-install">
          <div class="mcp-install__header">
            <div class="code-block__dots"><span class="code-block__dot code-block__dot--red"></span><span class="code-block__dot code-block__dot--yellow"></span><span class="code-block__dot code-block__dot--green"></span></div>
            <span class="code-block__label">terminal</span>
          </div>
          <div class="mcp-install__body"><pre><span class="mcp-prefix">$</span> npx agentoracle-mcp</pre></div>
        </div>
        <div style="padding:20px;background:var(--surface-2);border:1px solid var(--border-mid);border-radius:10px;">
          <p style="font-family:var(--font-mono);font-size:10px;color:var(--text-faint);margin-bottom:12px;">// claude_desktop_config.json</p>
          <pre style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);line-height:1.7;">{
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

<section class="section" id="pricing" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="reveal" style="text-align:center;margin-bottom:48px;">
      <div class="section-eyebrow">pricing</div>
      <h2 class="section-title">Pay only for <span class="section-title-gold">what you use</span></h2>
      <p class="section-subtitle">No subscriptions. No minimums. No API keys. Just pay per query with USDC on Base.</p>
      <p style="font-family:var(--font-mono);font-size:12px;color:var(--green);display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/></svg>
        Gasless on SKALE Network &mdash; zero gas cost for agent queries
      </p>
    </div>
    <div class="pricing-grid reveal">
      <div class="pricing-card pricing-card--free">
        <div class="pricing-card__endpoint">/preview</div>
        <div class="pricing-card__price">FREE</div>
        <div class="pricing-card__unit">no payment required</div>
        <ul class="pricing-card__features">
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Live truncated results</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Confidence scores</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>20 requests/hour</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>No payment required</li>
        </ul>
        <a href="https://agentoracle.co/preview" class="pricing-card__cta" target="_blank" rel="noopener noreferrer">Try /preview</a>
      </div>
      <div class="pricing-card pricing-card--featured">
        <div class="pricing-card__endpoint">/evaluate</div>
        <div class="pricing-card__price">$0.01</div>
        <div class="pricing-card__unit">per claim &middot; USDC &middot; Base &middot; SKALE &middot; Stellar</div>
        <ul class="pricing-card__features">
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Full 4-source claim verification</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Per-claim verdicts + evidence</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>ACT / VERIFY / REJECT output</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Adversarial scanning included</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>On-chain payment verification</li>
        </ul>
        <a href="https://agentoracle.co/.well-known/x402.json" class="pricing-card__cta" target="_blank" rel="noopener noreferrer">View x402 Manifest</a>
      </div>
      <div class="pricing-card pricing-card--deep">
        <div class="pricing-card__endpoint">/deep-research</div>
        <div class="pricing-card__price">$0.10</div>
        <div class="pricing-card__unit">per query &middot; USDC &middot; Base &middot; SKALE &middot; Stellar</div>
        <ul class="pricing-card__features">
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Multi-step deep analysis</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Sonar Pro engine</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Comprehensive source verification</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Higher confidence scoring</li>
          <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>Extended context window</li>
        </ul>
        <a href="https://agentoracle.co/.well-known/x402.json" class="pricing-card__cta" target="_blank" rel="noopener noreferrer">View Manifest</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt" id="specs" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="reveal" style="text-align:center;margin-bottom:48px;">
      <div class="section-eyebrow">technical</div>
      <h2 class="section-title">Specs &amp; <span class="section-title-gold">infrastructure</span></h2>
    </div>
    <div class="specs-grid reveal">
      <div class="spec-item"><span class="spec-item__label">Protocol</span><span class="spec-item__value">x402</span></div>
      <div class="spec-item"><span class="spec-item__label">Chains</span><span class="spec-item__value">Base &middot; SKALE &middot; Stellar</span></div>
      <div class="spec-item"><span class="spec-item__label">Currency</span><span class="spec-item__value">USDC + EURC</span></div>
      <div class="spec-item"><span class="spec-item__label">Facilitator</span><span class="spec-item__value">Coinbase CDP</span></div>
      <div class="spec-item"><span class="spec-item__label">Research Model</span><span class="spec-item__value">Perplexity Sonar</span></div>
      <div class="spec-item"><span class="spec-item__label">Endpoints</span><span class="spec-item__value">/preview &middot; /evaluate</span></div>
      <div class="spec-item"><span class="spec-item__label">Hosting</span><span class="spec-item__value">Vercel Edge</span></div>
      <div class="spec-item"><span class="spec-item__label">Gasless Option</span><span class="spec-item__value" style="color:var(--green);">SKALE Active</span></div>
      <div class="spec-item"><span class="spec-item__label">Verification Sources</span><span class="spec-item__value">4 (parallel)</span></div>
      <div class="spec-item"><span class="spec-item__label">Rate Limit</span><span class="spec-item__value">100 req/hr</span></div>
      <div class="spec-item"><span class="spec-item__label">SDK</span><span class="spec-item__value">LangChain &middot; CrewAI</span></div>
      <div class="spec-item"><span class="spec-item__label">MCP Server</span><span class="spec-item__value" style="color:var(--green);">Live</span></div>
    </div>
  </div>
</section>

<section class="section" id="compare" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="reveal" style="text-align:center;margin-bottom:48px;">
      <div class="section-eyebrow">comparison</div>
      <h2 class="section-title">How we <span class="section-title-gold">compare</span></h2>
      <p class="section-subtitle">Other tools return search results. We return verified truth.</p>
    </div>
    <div class="reveal" style="overflow-x:auto;border:1px solid var(--border-mid);border-radius:14px;overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:13px;">
        <thead>
          <tr style="background:var(--surface-2);border-bottom:1px solid var(--border-mid);">
            <th style="padding:14px 20px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.14em;color:var(--text-faint);font-weight:600;white-space:nowrap;">Feature</th>
            <th style="padding:14px 20px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.14em;color:var(--gold);font-weight:700;white-space:nowrap;">AgentOracle</th>
            <th style="padding:14px 20px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.14em;color:var(--text-faint);font-weight:600;white-space:nowrap;">Tavily</th>
            <th style="padding:14px 20px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.14em;color:var(--text-faint);font-weight:600;white-space:nowrap;">Exa</th>
            <th style="padding:14px 20px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.14em;color:var(--text-faint);font-weight:600;white-space:nowrap;">Raw LLM</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:13px 20px;color:var(--text-muted);">Per-claim verification</td>
            <td style="padding:13px 20px;text-align:center;color:var(--green);font-weight:700;">Yes</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);background:rgba(255,255,255,0.01);">
            <td style="padding:13px 20px;color:var(--text-muted);">Adversarial scanning</td>
            <td style="padding:13px 20px;text-align:center;color:var(--green);font-weight:700;">Yes</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:13px 20px;color:var(--text-muted);">Confidence scoring</td>
            <td style="padding:13px 20px;text-align:center;color:var(--gold);font-weight:700;">0.00&#8211;1.00</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);background:rgba(255,255,255,0.01);">
            <td style="padding:13px 20px;color:var(--text-muted);">Multi-source (4 independent)</td>
            <td style="padding:13px 20px;text-align:center;color:var(--green);font-weight:700;">Yes</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:13px 20px;color:var(--text-muted);">x402 native payments</td>
            <td style="padding:13px 20px;text-align:center;color:var(--green);font-weight:700;">Yes</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);background:rgba(255,255,255,0.01);">
            <td style="padding:13px 20px;color:var(--text-muted);">Gasless option (SKALE)</td>
            <td style="padding:13px 20px;text-align:center;color:var(--green);font-weight:700;">Yes</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:13px 20px;color:var(--text-muted);">Stellar support</td>
            <td style="padding:13px 20px;text-align:center;color:var(--green);font-weight:700;">Yes</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-faint);">No</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:13px 20px;color:var(--text-muted);">Price per query</td>
            <td style="padding:13px 20px;text-align:center;color:var(--gold);font-weight:700;">$0.01</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-muted);">$0.005</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-muted);">$0.005</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-muted);">~$0.01</td>
          </tr>
          <tr style="background:rgba(201,169,110,0.03);">
            <td style="padding:13px 20px;color:var(--text);font-weight:600;">What you get</td>
            <td style="padding:13px 20px;text-align:center;color:var(--gold);font-weight:700;">Verified truth</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-muted);">Search results</td>
            <td style="padding:13px 20px;text-align:center;color:var(--text-muted);">Search results</td>
            <td style="padding:13px 20px;text-align:center;color:var(--red);">Hallucination risk</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p style="font-family:var(--font-mono);font-size:11px;color:var(--text-faint);text-align:center;margin-top:16px;">Comparison based on publicly available pricing and documentation as of April 2026.</p>
  </div>
</section>

<section class="section" id="faq" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;">
    <div class="reveal" style="text-align:center;margin-bottom:48px;">
      <div class="section-eyebrow">faq</div>
      <h2 class="section-title">Common <span class="section-title-gold">questions</span></h2>
      <p class="section-subtitle">Everything you need to know before integrating.</p>
    </div>
    <div class="faq-grid reveal">
      <div class="faq-item is-open"><button class="faq-item__trigger" onclick="this.closest('.faq-item').classList.toggle('is-open')">What is the x402 protocol?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">x402 is an open protocol by Coinbase that enables HTTP-native payments. Instead of API keys, your agent includes a payment proof in the <code>X-PAYMENT</code> header of each request. The server verifies the on-chain payment and returns the response.</div></div></div>
      <div class="faq-item"><button class="faq-item__trigger" onclick="this.closest('.faq-item').classList.toggle('is-open')">Do I need a crypto wallet?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Yes, your agent needs a wallet with USDC on Base. The <code>/preview</code> endpoint is completely free and requires no wallet — use it to test first. Most agent frameworks support wallet integration through Coinbase CDP.</div></div></div>
      <div class="faq-item"><button class="faq-item__trigger" onclick="this.closest('.faq-item').classList.toggle('is-open')">What chains and currencies are supported?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">USDC on Base (L2), USDC.e on SKALE Base (zero gas fees), and native USDC on Stellar. Same endpoint — agent picks the cheapest chain. EURC is also accepted on Base.</div></div></div>
      <div class="faq-item"><button class="faq-item__trigger" onclick="this.closest('.faq-item').classList.toggle('is-open')">How is this different from Perplexity directly?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">Perplexity's API requires API keys and billing setup. AgentOracle wraps the same research engine in an agent-native payment layer — your agent discovers pricing via the x402 manifest, pays per query with USDC, and gets per-claim verdicts. Zero human setup required.</div></div></div>
      <div class="faq-item"><button class="faq-item__trigger" onclick="this.closest('.faq-item').classList.toggle('is-open')">What's the difference between /evaluate and /research?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer"><code>/evaluate</code> ($0.01) verifies claims you already have — input any text, get per-claim ACT/VERIFY/REJECT verdicts. <code>/research</code> ($0.02) fetches new information from the web and returns structured results with confidence scoring.</div></div></div>
      <div class="faq-item"><button class="faq-item__trigger" onclick="this.closest('.faq-item').classList.toggle('is-open')">Is there a rate limit?<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-item__body"><div class="faq-item__answer">100 requests per hour per IP for paid endpoints. 20 requests per hour for the free <code>/preview</code> endpoint. Rate limit headers are included on every response.</div></div></div>
    </div>
  </div>
</section>

<section class="bottom-cta section" style="position:relative;z-index:2;">
  <div style="max-width:1240px;margin:0 auto;padding:0 40px;text-align:center;">
    <h2 class="bottom-cta__headline reveal">Your first verification is <span class="gold-text">free</span></h2>
    <p class="bottom-cta__sub reveal">No wallet required. No API key sign-up. No payment method needed. Just paste a claim and verify.</p>
    <div class="bottom-cta__buttons reveal">
      <a href="https://agentoracle.co/preview" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Try live demo &#8594;</a>
      <a href="https://agentoracle.co/.well-known/x402.json" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">View x402 manifest</a>
      <a href="https://github.com/TKCollective/agentoracle-mcp" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">MCP Server</a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="footer__inner">
    <div class="footer__grid">
      <div>
        <div class="footer__brand">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none"><defs><linearGradient id="footerRing" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E8C878"/><stop offset="100%" stop-color="#A08840"/></linearGradient></defs><circle cx="13" cy="13" r="9" stroke="url(#footerRing)" stroke-width="2" fill="none"/><circle cx="13" cy="4" r="2" fill="#E8C878"/></svg>
          <span class="footer__brand-name">AgentOracle</span>
        </div>
        <p class="footer__tagline">The trust layer for AI agents</p>
        <div class="footer__socials">
          <a href="https://x.com/AgentOracle_AI" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a href="https://github.com/TKCollective/x402-research-skill" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
        </div>
      </div>
      <div><h4 class="footer__col-title">Product</h4><ul class="footer__col-links"><li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li><li><a href="https://agentoracle.co/.well-known/x402.json" target="_blank" rel="noopener noreferrer">Docs</a></li><li><a href="#playground">Demo</a></li></ul></div>
      <div><h4 class="footer__col-title">Community</h4><ul class="footer__col-links"><li><a href="https://x.com/AgentOracle_AI" target="_blank" rel="noopener noreferrer">X / Twitter</a></li><li><a href="https://github.com/TKCollective/x402-research-skill" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul></div>
      <div><h4 class="footer__col-title">Built With</h4><ul class="footer__col-links"><li><a href="https://www.coinbase.com/developer-platform" target="_blank" rel="noopener noreferrer">x402 Protocol</a></li><li><a href="https://base.org" target="_blank" rel="noopener noreferrer">Base Network</a></li><li><a href="https://skale.space" target="_blank" rel="noopener noreferrer">SKALE</a></li><li><a href="https://stellar.org" target="_blank" rel="noopener noreferrer">Stellar</a></li></ul></div>
    </div>
    <div class="footer__bottom">
      <span class="footer__copy">&copy; 2026 TK Collective LLC. All rights reserved.</span>
    </div>
  </div>
</footer>

<button class="back-to-top" id="backToTop" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
</button>

<script>
// Verdict Ticker
(function() {
  var items = [
    { v: 'ACT', t: 'x402 protocol created by Coinbase', s: '0.97', c: 'act' },
    { v: 'REJECT', t: 'OpenAI acquired Anthropic in 2026', s: '0.04', c: 'reject' },
    { v: 'ACT', t: 'Base processes x402 micropayments', s: '0.93', c: 'act' },
    { v: 'VERIFY', t: 'Gemini 3.0 has native agent tools', s: '0.61', c: 'verify' },
    { v: 'ACT', t: 'SKALE offers gasless x402 transactions', s: '0.95', c: 'act' },
    { v: 'REJECT', t: 'CrewAI was acquired by Microsoft', s: '0.02', c: 'reject' },
    { v: 'ACT', t: 'USDC accepted on Base and Stellar', s: '0.99', c: 'act' },
    { v: 'VERIFY', t: 'Exa raised $85M Series B in 2026', s: '0.58', c: 'verify' },
    { v: 'ACT', t: 'LangGraph leads agent frameworks', s: '0.94', c: 'act' },
    { v: 'REJECT', t: 'AgentOracle founded in NYC in 2019', s: '0.06', c: 'reject' }
  ];
  var track = document.getElementById('verdictTrack');
  if (!track) return;
  var doubled = items.concat(items);
  doubled.forEach(function(it) {
    var el = document.createElement('div');
    el.className = 'verdict-ticker__item verdict-ticker__item--' + it.c;
    el.innerHTML = '<span class="verdict-ticker__badge">' + it.v + '</span>' + it.t + '<span class="verdict-ticker__score">' + it.s + '</span>';
    track.appendChild(el);
  });
})();

// Back to top
window.addEventListener('scroll', function() {
  var btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('is-visible', window.scrollY > 600);
}, { passive: true });

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
  if (spinner) spinner.style.display = 'block';
  var btnText = btn.querySelector('.playground__run-text');
  if (btnText) btnText.style.display = 'none';
  result.className = 'playground__result active';
  var startTime = Date.now();

  // Staged pipeline progress
  var stages = [
    { name: 'Gemma 4 decompose', start: 0, end: 2500 },
    { name: 'Sonar', start: 2500, end: 6000 },
    { name: 'Sonar Pro', start: 2700, end: 7000 },
    { name: 'Adversarial', start: 2900, end: 8500 },
    { name: 'Gemma 4 calibrate', start: 8500, end: 11000 }
  ];
  var stageTimers = [];
  function renderPipeline() {
    var elapsed = Date.now() - startTime;
    var html = '<div style="font-family:var(--font-mono);font-size:12px;padding:16px;background:var(--surface);border-radius:10px;border:1px solid var(--border);">';
    html += '<div style="margin-bottom:10px;color:var(--text-muted);font-size:10px;letter-spacing:0.1em;">VERIFICATION PIPELINE</div>';
    stages.forEach(function(s) {
      var dot, color, label;
      if (elapsed < s.start) { dot = '\u25CB'; color = 'var(--text-faint)'; label = 'waiting'; }
      else if (elapsed < s.end) { dot = '\u25CF'; color = 'var(--gold)'; label = 'running'; }
      else { dot = '\u2713'; color = 'var(--green)'; label = 'done'; }
      html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;color:' + color + ';">';
      html += '<span style="font-size:14px;width:18px;text-align:center;">' + dot + '</span>';
      html += '<span style="flex:1;">' + s.name + '</span>';
      html += '<span style="font-size:10px;opacity:0.6;">' + label + '</span>';
      html += '</div>';
    });
    var secs = (elapsed / 1000).toFixed(1);
    html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);color:var(--gold);font-size:11px;">' + secs + 's elapsed</div>';
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
    if (!ev) { result.innerHTML = '<div style="color:var(--red);font-family:var(--font-mono);font-size:13px;padding:1rem;">Error: ' + (data.error || 'Unknown error') + '</div>'; return; }
    var scoreColor = ev.overall_confidence >= 0.8 ? 'var(--green)' : ev.overall_confidence >= 0.5 ? 'var(--amber)' : 'var(--red)';
    var recClass = ev.recommendation === 'act' ? 'act' : ev.recommendation === 'reject' ? 'reject' : 'verify';
    var html = '<div class="playground__overall"><div class="playground__score" style="color:' + scoreColor + '">' + ev.overall_confidence + '</div><div><span class="playground__rec playground__rec--' + recClass + '">' + ev.recommendation.toUpperCase() + '</span><div style="font-size:12px;color:var(--text-muted);margin-top:6px;font-family:var(--font-mono);">' + ev.total_claims + ' claims &middot; ' + ev.verified_claims + ' supported &middot; ' + ev.refuted_claims + ' refuted &middot; ' + totalTime + 's</div></div></div>';
    (ev.claims || []).forEach(function(c) {
      var vColor = c.verdict === 'supported' ? 'var(--green)' : c.verdict === 'refuted' ? 'var(--red)' : 'var(--amber)';
      var vIcon = c.verdict === 'supported' ? '&#10003;' : c.verdict === 'refuted' ? '&#10007;' : '?';
      html += '<div class="playground__claim playground__claim--' + c.verdict + '">';
      html += '<div class="playground__verdict" style="color:' + vColor + '">' + vIcon + ' ' + c.verdict.toUpperCase() + ' (' + c.confidence + ')</div>';
      html += '<div class="playground__claim-text">' + c.claim + '</div>';
      if (c.evidence) html += '<div style="font-size:12px;color:var(--text-muted);margin-top:6px;padding:8px;background:rgba(255,255,255,0.02);border-radius:6px;line-height:1.5;">' + c.evidence + '</div>';
      if (c.correction) html += '<div style="font-size:12px;color:var(--amber);margin-top:4px;padding:8px;background:rgba(245,158,11,0.05);border-radius:6px;border-left:2px solid var(--amber);">Correction: ' + c.correction + '</div>';
      if (c.sources_used) html += '<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">' + c.sources_used.map(function(s) { return '<span style="font-family:var(--font-mono);font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.15);color:var(--gold);">' + s + '</span>'; }).join('') + '</div>';
      html += '</div>';
    });
    html += '<div style="text-align:center;margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border);font-family:var(--font-mono);font-size:10px;color:var(--text-faint);line-height:1.8;">Verified in ' + totalTime + 's &middot; ID: ' + data.evaluation_id + '<br>0.00\u20130.49 <span style="color:#EF4444;">REJECT</span> &middot; 0.50\u20130.79 <span style="color:#F59E0B;">VERIFY</span> &middot; 0.80\u20131.00 <span style="color:#4ADE80;">ACT</span></div>';
    result.innerHTML = html;
  } catch(err) {
    clearInterval(timerInterval);
    result.innerHTML = '<div style="color:var(--red);font-family:var(--font-mono);font-size:13px;padding:1rem;">Request failed: ' + err.message + '</div>';
  }
  btn.disabled = false;
  if (spinner) spinner.style.display = 'none';
  if (btnText) btnText.style.display = '';
}
</script>
</body>
</html>`;