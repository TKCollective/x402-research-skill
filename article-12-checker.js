// article-12-checker.js
// EU AI Act Article 12 Considerations tool.
//
// Two tracks share this single artifact:
//  A) Self-serve: compliance officer fills in their own use case and downloads
//     a personalized "Article 12 Considerations" document.
//  B) Done-for-them: Joe (or a research assistant) fills in a prospect's PUBLIC
//     use case with an orbit reference URL, generates the same document, and
//     sends it via email with a short cover note.
//
// The orbit reference URL is REQUIRED whenever the document names a specific
// company — the tool enforces this to keep Track B on the right side of the
// "gift vs. surveillance" line. The output is framed as commentary on public
// statements, never as a covert audit of the recipient.
//
// Standards citations (verified against real regulatory text and our shipped artifacts):
//   - EU AI Act — Regulation (EU) 2024/1689, Article 12 (Record-keeping)
//     https://eur-lex.europa.eu/eli/reg/2024/1689/oj
//     Application date for standalone Annex III high-risk AI system obligations:
//     2 December 2027 (Digital Omnibus deferral; Council final approval 29 June 2026;
//     formal OJ publication pending at time of writing). Systems embedded in Annex I
//     regulated products: 2 August 2028.
//   - IETF draft-krausz-verification-state-01
//     https://datatracker.ietf.org/doc/draft-krausz-verification-state/
//   - ERC-8210 Receipt Profile Registry, Section D (verification.v0.3 as first entry)
//     https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097/46
//   - RFC 7515 (JWS), 7517 (JWK), 8037 (EdDSA JOSE)
//   - AgentOracle receipt spec — TKCollective/agentoracle-receipt-spec

const ARTICLE_12_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Article 12 Considerations — AgentOracle</title>
<meta name="description" content="Generate a personalized EU AI Act Article 12 considerations document for a publicly-announced AI initiative. Free tool from AgentOracle.">
<meta name="robots" content="index,follow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>
  :root {
    --bg: #08090a;
    --surface: #0f1114;
    --surface-alt: #14171b;
    --border: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.16);
    --text: #eef1f4;
    --text-muted: #9ba3ab;
    --text-faint: #6b7278;
    --gold: #c9a96e;
    --gold-hover: #d8bb85;
    --danger: #ff6b6b;
    --success: #6bd39d;
    --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    --font-display: "Inter", ui-sans-serif, system-ui, sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: var(--font-sans); line-height: 1.55; -webkit-font-smoothing: antialiased; }
  a { color: var(--gold); text-decoration: none; }
  a:hover { color: var(--gold-hover); text-decoration: underline; }

  .nav { position: sticky; top: 0; z-index: 20; background: rgba(8,9,10,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
  .nav__brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; letter-spacing: 0.02em; }
  .nav__brand-mark { width: 24px; height: 24px; border-radius: 4px; background: var(--gold); color: #000; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 800; font-size: 12px; }
  .nav__back { font-size: 13px; color: var(--text-muted); }

  .container { max-width: 900px; margin: 0 auto; padding: 60px 24px 120px; }

  .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border: 1px solid rgba(201,169,110,0.35); border-radius: 999px; color: var(--gold); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 22px; }
  .eyebrow::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }

  h1 { font-family: var(--font-display); font-size: 52px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 700; margin: 0 0 20px; }
  h1 em { font-style: normal; color: var(--gold); }
  .lede { font-size: 18px; color: var(--text-muted); max-width: 680px; margin: 0 0 12px; }
  .lede strong { color: var(--text); font-weight: 600; }
  .info-chip { display: block; max-width: 780px; margin-top: 12px; padding: 12px 16px; background: rgba(201,169,110,0.06); border: 1px solid rgba(201,169,110,0.22); border-radius: 8px; color: #e0d3b8; font-family: var(--font-mono); font-size: 13px; line-height: 1.55; }

  .form { margin-top: 48px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 32px; }
  .form__section { margin-bottom: 28px; }
  .form__section:last-child { margin-bottom: 0; }
  .form__legend { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); font-family: var(--font-mono); margin-bottom: 6px; }
  .form__label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 15px; }
  .form__hint { display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 10px; }
  .form__required { color: var(--danger); font-weight: 700; margin-left: 2px; }
  .form__input, .form__textarea, .form__select { width: 100%; padding: 11px 14px; background: var(--surface-alt); border: 1px solid var(--border-strong); border-radius: 8px; color: var(--text); font-size: 15px; font-family: inherit; }
  .form__input:focus, .form__textarea:focus, .form__select:focus { outline: none; border-color: var(--gold); }
  .form__textarea { min-height: 90px; resize: vertical; font-family: inherit; }
  .form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 720px) { .form__row { grid-template-columns: 1fr; } }

  .form__checks { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
  @media (max-width: 720px) { .form__checks { grid-template-columns: 1fr; } }
  .form__check { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; user-select: none; font-size: 14px; }
  .form__check:hover { border-color: var(--border-strong); }
  .form__check input { margin-top: 2px; accent-color: var(--gold); }
  .form__check--checked { border-color: rgba(201,169,110,0.5); background: rgba(201,169,110,0.06); }

  .form__actions { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
  .btn { padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; border: 1px solid transparent; font-family: inherit; transition: all 0.15s ease; }
  .btn--primary { background: var(--gold); color: #0a0a0a; }
  .btn--primary:hover { background: var(--gold-hover); }
  .btn--secondary { background: transparent; color: var(--text); border-color: var(--border-strong); }
  .btn--secondary:hover { border-color: var(--gold); }
  .btn[disabled] { opacity: 0.4; cursor: not-allowed; }

  .warning { margin-top: 16px; padding: 12px 14px; background: rgba(255,107,107,0.06); border: 1px solid rgba(255,107,107,0.2); border-radius: 8px; color: #ffbcbc; font-size: 13px; display: none; }
  .warning--show { display: block; }

  .footer-cta { margin-top: 60px; padding: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; text-align: center; }
  .footer-cta h3 { margin: 0 0 8px; font-size: 20px; }
  .footer-cta p { margin: 0 0 16px; color: var(--text-muted); font-size: 15px; }

  /* Considerations doc styles — separate print-friendly surface */
  #doc { display: none; }
  #doc.show { display: block; margin-top: 60px; }

  .doc-actions { display: flex; gap: 10px; justify-content: flex-end; margin-bottom: 20px; }
  .doc-actions .btn { font-size: 13px; padding: 8px 14px; }

  .doc-paper { background: #fdfcf9; color: #1a1a1a; padding: 56px 60px; border-radius: 10px; font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif; line-height: 1.55; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
  .doc-paper a { color: #6b4a1a; }

  .doc-header { border-bottom: 2px solid #1a1a1a; padding-bottom: 18px; margin-bottom: 28px; }
  .doc-header__eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #6b4a1a; margin-bottom: 8px; }
  .doc-header h2 { font-family: inherit; font-size: 30px; line-height: 1.15; margin: 0 0 8px; letter-spacing: -0.01em; }
  .doc-header__ref { font-size: 13px; color: #555; margin: 6px 0 0; }
  .doc-header__ref-empty { color: #999; font-style: italic; }
  .doc-header__meta { display: flex; gap: 24px; margin-top: 12px; font-size: 12px; color: #666; font-family: var(--font-mono); }

  .doc-preamble { font-size: 15px; color: #333; background: #f5eddc; padding: 14px 18px; border-left: 3px solid #c9a96e; border-radius: 3px; margin: 20px 0 30px; }

  .doc h3 { font-size: 18px; font-family: var(--font-sans); font-weight: 700; margin: 30px 0 12px; letter-spacing: -0.005em; }
  .doc h4 { font-size: 15px; font-family: var(--font-sans); font-weight: 700; margin: 22px 0 8px; }
  .doc p { font-size: 15px; margin: 0 0 12px; }
  .doc ul, .doc ol { padding-left: 22px; margin: 0 0 12px; }
  .doc li { margin-bottom: 6px; font-size: 15px; }
  .doc-inline-code { font-family: var(--font-mono); font-size: 13px; background: #efe7d1; padding: 1px 6px; border-radius: 3px; }

  .doc-table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 14px; }
  .doc-table th, .doc-table td { padding: 10px 12px; border: 1px solid #d0c9b8; text-align: left; vertical-align: top; }
  .doc-table th { background: #efe7d1; font-family: var(--font-sans); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .doc-table td.status-covered { color: #1c6b3a; font-weight: 600; }
  .doc-table td.status-partial { color: #8a6a15; font-weight: 600; }
  .doc-table td.status-gap { color: #a13544; font-weight: 600; }

  .doc-demo-box { background: #fff8e1; border: 2px solid #c9a96e; border-radius: 6px; padding: 16px 20px; margin: 18px 0; position: relative; }
  .doc-demo-box::before { content: "DEMO SAMPLE — NOT PROCESSED FROM YOUR DATA"; position: absolute; top: -10px; left: 16px; background: #c9a96e; color: #fff; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; padding: 2px 10px; border-radius: 3px; font-weight: 700; }
  .doc-demo-box pre { font-family: var(--font-mono); font-size: 11.5px; line-height: 1.5; margin: 8px 0 0; white-space: pre-wrap; word-break: break-all; color: #3a3a3a; }
  .doc-demo-note { font-size: 12px; color: #6b4a1a; margin-top: 10px; font-style: italic; }

  .doc-letter-box { background: #f5eddc; border: 1px dashed #c9a96e; border-radius: 6px; padding: 16px 20px; margin: 18px 0; position: relative; }
  .doc-letter-box::before { content: "TEMPLATE"; position: absolute; top: -8px; left: 16px; background: #6b4a1a; color: #fff; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; padding: 2px 10px; border-radius: 3px; font-weight: 700; }
  .doc-letter-box p { font-family: var(--font-sans); font-size: 13.5px; color: #333; margin: 6px 0; }

  .doc-footer { border-top: 1px solid #c9a96e; padding-top: 16px; margin-top: 32px; font-size: 12px; color: #666; }
  .doc-footer strong { color: #1a1a1a; }
  .doc-footer a { color: #6b4a1a; }
  .doc-standards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0 12px; font-size: 12px; }
  @media (max-width: 720px) { .doc-standards { grid-template-columns: 1fr; } }
  .doc-standards li { list-style: none; margin: 0; }

  @media print {
    html, body { background: #fff !important; color: #000; }
    .nav, .container > *:not(#doc), .doc-actions { display: none !important; }
    .container { padding: 0 !important; max-width: none !important; }
    #doc { display: block !important; margin: 0 !important; }
    .doc-paper { box-shadow: none !important; padding: 30px 34px !important; border-radius: 0 !important; min-height: 100vh; }
    a { color: #000 !important; text-decoration: underline; }
    /* Force page-break avoidance on tables and key elements */
    .doc-table { page-break-inside: auto; }
    .doc-table tr { page-break-inside: avoid; page-break-after: auto; }
    .doc-demo-box, .doc-letter-box { page-break-inside: avoid; }
    .doc h3 { page-break-after: avoid; }
  }
</style>
</head>
<body>
  <nav class="nav">
    <div class="nav__brand"><span class="nav__brand-mark">AO</span><span>AgentOracle</span></div>
    <div style="display:flex;gap:20px;align-items:center;">
      <a class="nav__back" href="/whitepaper" style="text-decoration:none;">Read the white paper &rarr;</a>
      <a class="nav__back" href="/">&larr; Back to agentoracle.co</a>
    </div>
  </nav>

  <main class="container">
    <span class="eyebrow">Free · EU AI Act</span>
    <h1>Article 12 <em>Considerations</em> for a specific AI initiative.</h1>
    <p class="lede">A free, personalized commentary on how <strong>EU AI Act Article 12 (record-keeping for high-risk AI systems)</strong> applies to a publicly announced AI initiative. Fill in the details below — you get a printable document you can share internally with your legal or compliance team.</p>
    <p class="lede">The document is educational commentary applied to information you provide, not an audit or assessment of any company.</p>
    <div class="info-chip">Article 12 obligations for standalone Annex III high-risk AI systems apply from <strong>2 December 2027</strong>, following the Digital Omnibus deferral (systems embedded in Annex I regulated products: <strong>2 August 2028</strong>). The extra time changes the calendar, not the work — records can't be backdated, and a 2028 examiner asking about earlier behavior can only be answered by records that existed then.</div>

    <form class="form" id="a12-form" autocomplete="off">
      <div class="form__section">
        <div class="form__legend">Subject</div>
        <label class="form__label" for="f-company">Company or organization <span style="color:var(--text-muted);font-weight:400;font-size:13px">(optional)</span></label>
        <span class="form__hint">If omitted, the document is generic ("your organization"). If filled, a public reference URL below becomes required.</span>
        <input class="form__input" id="f-company" placeholder="e.g., Acme Health Systems" maxlength="120">
      </div>

      <div class="form__section">
        <label class="form__label" for="f-initiative">Publicly announced AI initiative <span class="form__required">*</span></label>
        <span class="form__hint">Name or short description of the specific AI initiative this document addresses. Example: "AI-assisted claims triage" or "customer support agent pilot".</span>
        <input class="form__input" id="f-initiative" required placeholder="e.g., AI-assisted claims triage" maxlength="140">
      </div>

      <div class="form__section">
        <label class="form__label" for="f-ref">Public reference URL <span id="ref-required" style="display:none;color:var(--danger);font-weight:700;margin-left:2px">*</span></label>
        <span class="form__hint">Link to the press release, blog post, executive statement, or governance page that describes this initiative. <strong>Required when a company name is provided</strong> — this keeps the document grounded in public information only.</span>
        <input class="form__input" id="f-ref" placeholder="https://…" type="url">
        <div class="warning" id="ref-warning">A public reference URL is required whenever a specific company name is included. This grounds the document in public information rather than assumptions.</div>
      </div>

      <div class="form__section">
        <div class="form__legend">Deployment</div>
        <div class="form__row">
          <div>
            <label class="form__label" for="f-region">EU exposure</label>
            <select class="form__select" id="f-region">
              <option value="eu">Deployed in EU or serves EU users</option>
              <option value="planning">Planning EU deployment</option>
              <option value="global">Global / mixed</option>
              <option value="non-eu">Non-EU only (Article 12 may still inform buyer procurement)</option>
            </select>
          </div>
          <div>
            <label class="form__label" for="f-scale">Deployment scale</label>
            <select class="form__select" id="f-scale">
              <option value="internal">Internal use only</option>
              <option value="customer">Customer-facing</option>
              <option value="high-stakes">High-stakes decisions (finance, health, employment, etc.)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__section">
        <label class="form__label">High-risk categories under Annex III <span style="color:var(--text-muted);font-weight:400;font-size:13px">(select all that may apply)</span></label>
        <span class="form__hint">Article 12 record-keeping obligations are strongest for AI systems falling under one or more Annex III categories.</span>
        <div class="form__checks">
          <label class="form__check"><input type="checkbox" value="biometric"><span>Biometric identification or categorization</span></label>
          <label class="form__check"><input type="checkbox" value="infrastructure"><span>Critical infrastructure management</span></label>
          <label class="form__check"><input type="checkbox" value="education"><span>Education access, scoring, monitoring</span></label>
          <label class="form__check"><input type="checkbox" value="employment"><span>Employment, workforce, recruitment</span></label>
          <label class="form__check"><input type="checkbox" value="essential-services"><span>Essential services access (credit, benefits, insurance)</span></label>
          <label class="form__check"><input type="checkbox" value="law-enforcement"><span>Law enforcement</span></label>
          <label class="form__check"><input type="checkbox" value="migration"><span>Migration, asylum, border control</span></label>
          <label class="form__check"><input type="checkbox" value="justice"><span>Administration of justice and democratic processes</span></label>
          <label class="form__check"><input type="checkbox" value="none-of-above"><span>None of the above (still worth reviewing)</span></label>
        </div>
      </div>

      <div class="form__section">
        <div class="form__legend">Current state</div>
        <div class="form__row">
          <div>
            <label class="form__label" for="f-logging">Current record-keeping approach</label>
            <select class="form__select" id="f-logging">
              <option value="none">No structured logging</option>
              <option value="plaintext">Plaintext logs (app-level)</option>
              <option value="structured">Structured event logging (JSON, ELK, etc.)</option>
              <option value="immutable">Immutable append-only store (WORM, blockchain)</option>
              <option value="crypto">Cryptographic receipts / signed audit trail</option>
            </select>
          </div>
          <div>
            <label class="form__label" for="f-retention">Retention target</label>
            <select class="form__select" id="f-retention">
              <option value="unset">Not yet decided</option>
              <option value="under-6">Less than 6 months</option>
              <option value="6-12">6 to 12 months</option>
              <option value="over-12">More than 12 months</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form__actions">
        <button type="submit" class="btn btn--primary" id="btn-generate">Generate considerations document</button>
        <button type="reset" class="btn btn--secondary">Reset</button>
      </div>
    </form>

    <div id="doc" class="doc">
      <div class="doc-actions">
        <button class="btn btn--secondary" onclick="window.print()">Print / Save as PDF</button>
        <button class="btn btn--secondary" onclick="document.getElementById('doc').scrollIntoView({behavior:'smooth',block:'end'})">Jump to bottom</button>
      </div>
      <article class="doc-paper" id="doc-paper"><!-- rendered doc goes here --></article>
    </div>

    <div class="footer-cta">
      <h3>Want AgentOracle to prepare this for a specific initiative?</h3>
      <p>Send us the public reference URL and one line describing the AI initiative. We'll prepare the same document, formatted for your team, at no cost. No call needed.</p>
      <a class="btn btn--primary cta-mail" data-email="joe@agentoracle.co" href="mailto:joe@agentoracle.co?subject=Article%2012%20Considerations%20request&body=Public%20reference%20URL%3A%0AInitiative%20description%3A%0A">Email joe@agentoracle.co</a>
    </div>
  </main>

<script>
(function(){
  // Highlight checked options
  document.querySelectorAll('.form__check input').forEach(function(cb){
    cb.addEventListener('change', function(){ cb.closest('.form__check').classList.toggle('form__check--checked', cb.checked); });
  });

  // Company name → public ref required
  const co = document.getElementById('f-company');
  const ref = document.getElementById('f-ref');
  const refRequired = document.getElementById('ref-required');
  const refWarning = document.getElementById('ref-warning');
  function syncRefRequired(){
    const need = co.value.trim().length > 0;
    ref.required = need;
    refRequired.style.display = need ? 'inline' : 'none';
    if (!need) refWarning.classList.remove('warning--show');
  }
  co.addEventListener('input', syncRefRequired);

  // Escape HTML
  function esc(s){ return String(s || '').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function statusFor(logging){
    if (logging === 'crypto') return {label: 'Covered', cls: 'status-covered'};
    if (logging === 'immutable') return {label: 'Partial', cls: 'status-partial'};
    return {label: 'Gap', cls: 'status-gap'};
  }

  function renderDoc(data){
    const co  = esc(data.company || '');
    const init = esc(data.initiative);
    const ref  = esc(data.reference || '');
    const dateStr = new Date().toISOString().slice(0, 10);
    const subject = (function(){
      if (!co) return init;
      const initLower = init.toLowerCase();
      const coLower = co.toLowerCase();
      // If initiative already leads with company name, don't repeat it
      if (initLower.indexOf(coLower) === 0) return init;
      // Grammatical possessive: 'Media Group’s' vs 'Companies’' (already ends in s)
      const poss = /s$/i.test(co) ? co + '&rsquo;' : co + '&rsquo;s';
      return poss + ' ' + init;
    })();

    const annex3 = data.categories.filter(function(c){ return c !== 'none-of-above'; });
    const highRisk = annex3.length > 0;
    const status = statusFor(data.logging);

    const preamble = ref
      ? '<div class="doc-preamble">Prepared with reference to publicly available information about <strong>' + subject + '</strong> at <a href="' + ref + '">' + ref + '</a>. This document is commentary on that public information applied to Article 12; it is not an audit, assessment, or investigation of any organization. Nothing in it reflects private or non-public data.</div>'
      : '<div class="doc-preamble">This document is educational commentary on how Article 12 of the EU AI Act applies to <strong>' + init + '</strong>. It is not an audit, assessment, or investigation of any organization.</div>';

    // Build the Article 12 requirements table.
    // The middle column describes what CONVENTIONAL logging (plaintext, mutable
    // application logs, structured events without cryptographic binding) categorically
    // cannot prove. This is a general industry statement about ordinary practice,
    // not an assessment of the recipient's specific system.
    const rows = [
      {
        art: 'Art. 12(1)',
        req: 'High-risk AI systems shall technically allow automatic recording of events (logs) over the lifetime of the system.',
        conv: 'Ordinary logs can be edited or rotated. Nothing binds a log line to a specific system state at a specific time.',
        addr: 'Cryptographically signed receipts recorded per event over the full lifecycle. See IETF draft-krausz-verification-state-01 §3.'
      },
      {
        art: 'Art. 12(2)(a)',
        req: 'Logs shall enable identification of situations that may result in the system presenting a risk within Art. 79(1) or in a substantial modification.',
        conv: 'Risk classification is typically inferred after the fact from unstructured log context; the verdict is not bound to the event.',
        addr: 'Verdict field (act / halt / abstain) with confidence and evidence signals recorded on every claim.'
      },
      {
        art: 'Art. 12(2)(b)',
        req: 'Logs shall facilitate post-market monitoring per Art. 72.',
        conv: 'Post-market monitoring against mutable logs requires trusting the operator; a third party cannot independently verify.',
        addr: 'Post-settlement receipt binds inputs, verdict, and signer identity — enumerable and independently verifiable by the provider or a third party.'
      },
      {
        art: 'Art. 12(2)(c)',
        req: 'Logs shall support monitoring of high-risk system operation per Art. 26(5).',
        conv: 'Standard logs do not detect tampering. Nothing prevents silent post-hoc edits.',
        addr: 'JCS canonicalization + Ed25519 signature: recompute confirms nothing was altered post-hoc.'
      }
    ];
    if (highRisk) {
      rows.push({
        art: 'Art. 12(3)(a)',
        req: 'Recording of the period of each use (start and end date/time of each use). Applies to Annex III systems.',
        conv: 'Timestamps in mutable logs are not cryptographically bound; an auditor cannot prove the recorded time is the actual time.',
        addr: 'Timestamp bound into the signed envelope; canonicalized so any tampering breaks the signature.'
      });
      rows.push({
        art: 'Art. 12(3)(b–c)',
        req: 'Recording of reference databases checked against, input data leading to a match. Applies to Annex III systems.',
        conv: 'Free-form log fields make source-and-match evidence difficult to enumerate and impossible to verify without trusting the operator.',
        addr: 'Claim hash + evidence set is a first-class receipt field; sources and match outcomes are part of the signed payload.'
      });
      rows.push({
        art: 'Art. 12(3)(d)',
        req: 'Identification of natural persons involved in verification of results, per Art. 14(5).',
        conv: 'Reviewer identity in ordinary logs is at best a username string, not a cryptographic signature.',
        addr: 'Multi-issuer composed envelope: independent human/system verifier signers can be added as slots (e.g., AT + AO + policy-issuer).'
      });
    }

    let tableHtml = '<table class="doc-table"><thead><tr><th style="width:110px">Article 12</th><th style="width:32%">Requirement</th><th>What conventional logging cannot prove</th><th>What signed receipts add</th></tr></thead><tbody>';
    rows.forEach(function(r){
      tableHtml += '<tr><td><strong>' + r.art + '</strong></td><td>' + esc(r.req) + '</td><td>' + esc(r.conv) + '</td><td>' + r.addr + '</td></tr>';
    });
    tableHtml += '</tbody></table>';

    const retentionNote = (function(){
      if (data.retention === 'under-6') return '<p><strong>Retention flag:</strong> Article 12 does not set a fixed retention period in the article text, but sector-specific instruments (e.g., financial services) commonly require 6 months to several years. Under-6-month retention should be reviewed against sectoral obligations.</p>';
      if (data.retention === '6-12') return '<p><strong>Retention:</strong> 6–12 months typically satisfies the baseline expectation. Sector-specific rules may extend this.</p>';
      if (data.retention === 'over-12') return '<p><strong>Retention:</strong> Longer retention aligns comfortably with Art. 12 expectations and most sector-specific instruments.</p>';
      return '<p><strong>Retention:</strong> Not yet decided. Base recommendation is at least 6 months, extended per sector-specific instruments where applicable.</p>';
    })();

    const scaleNote = (function(){
      if (data.scale === 'high-stakes') return '<p>High-stakes decision systems face the strictest Article 12 scrutiny. Auditors will typically expect signed, timestamped, non-repudiable event records — plain application logs generally do not meet this bar.</p>';
      if (data.scale === 'customer') return '<p>Customer-facing systems are visible to regulators and end-user complaints. Signed receipts materially reduce the evidence burden during any post-market monitoring inquiry.</p>';
      return '<p>Even internal-only systems can be in scope if they support decisions covered by Annex III. Signed receipts scale down to internal use with no additional operational overhead.</p>';
    })();

    const categoriesReadable = annex3.length === 0
      ? '<em>None selected — the initiative may still trigger Article 12 through Annex I (product safety AI) or sector-specific rules.</em>'
      : annex3.map(function(c){ return {
          'biometric':'Biometric identification / categorization',
          'infrastructure':'Critical infrastructure',
          'education':'Education access, scoring, monitoring',
          'employment':'Employment, workforce, recruitment',
          'essential-services':'Essential services access',
          'law-enforcement':'Law enforcement',
          'migration':'Migration, asylum, border control',
          'justice':'Administration of justice / democratic processes'
        }[c] || c; }).join(', ');

    const sampleReceipt = JSON.stringify({
      envelope_kind: 'verification.v0.3+composed',
      subject: {
        claim_hash: 'sha256-DEMO-example-0000000000000000000000000000000000000000000000',
        initiative_ref: 'https://example.com/announcement'
      },
      timestamp: '2027-12-02T09:00:00.000Z',
      v_gate:       { issuer: 'agentoracle.co',   verdict: 'act',  confidence: 0.87 },
      v_gate_skill: { issuer: 'agenttrust.uk',    verdict: 'act',  skill_results: [{status:'clean'}] },
      screen_ref:   { issuer: 'policy-issuer',    verdict: 'ALLOW', policy_version: 'sample-v1' },
      composed_decision: 'act',
      canonical_sha256: 'sha256-DEMO0000000000000000000000000000000000000000000000000000000000',
      note: 'DEMO SAMPLE ONLY — not from any real event'
    }, null, 2);

    const html = ''
      + '<div class="doc-header">'
      +   '<div class="doc-header__eyebrow">EU AI Act &middot; Article 12 &middot; Considerations Document</div>'
      +   '<h2>' + subject + '</h2>'
      +   '<div class="doc-header__meta"><span>Prepared ' + dateStr + '</span><span>Article 12 applies 2 Dec 2027 (Annex III)</span><span>Free · Educational</span></div>'
      + '</div>'
      + preamble
      + '<h3>Scope</h3>'
      + '<p><strong>Deployment:</strong> ' + ({eu:'Deployed in EU or serves EU users', planning:'Planning EU deployment', global:'Global / mixed', 'non-eu':'Non-EU only'}[data.region]) + ' &middot; <strong>Scale:</strong> ' + ({internal:'Internal use only', customer:'Customer-facing', 'high-stakes':'High-stakes decisions'}[data.scale]) + '.</p>'
      + '<p><strong>Annex III categories identified:</strong> ' + categoriesReadable + '.</p>'
      + scaleNote
      + '<h3>Article 12 requirements at a glance</h3>'
      + '<p>The requirements below are drawn directly from the operative text of Article 12 of Regulation (EU) 2024/1689. The middle column describes what conventional logging — mutable application logs, structured events without cryptographic binding — categorically cannot prove, as a general industry observation. The right column describes how a signed-receipt approach, as defined in <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/">IETF draft-krausz-verification-state-01</a>, would address each subsection.</p>'
      + tableHtml
      + retentionNote
      + '<h3>What a compliant record looks like</h3>'
      + '<p>The block below is a sample signed envelope in the format defined by the ' + '<a href="https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097/46">ERC-8210 Receipt Profile Registry</a>' + ' entry for <span class="doc-inline-code">verification.v0.3</span>. Each field is bound into a canonicalized payload (RFC 8785 JCS) and signed with Ed25519 (RFC 8037). Anyone with the public JWKS can recompute and verify.</p>'
      + '<div class="doc-demo-box"><pre>' + esc(sampleReceipt) + '</pre><p class="doc-demo-note">Any auditor can verify a receipt like this offline in three lines: <span class="doc-inline-code">pip install agentoracle-receipt-verify</span> &rarr; <span class="doc-inline-code">from agentoracle_receipt_verify import verify</span> &rarr; <span class="doc-inline-code">verify(envelope, jwks_by_issuer=&hellip;)</span>. No AgentOracle service required.</p></div>'
      + '<h3>Auditor letter template</h3>'
      + '<p>A version of the paragraph below can be included in an auditor communication or an internal Article 12 conformance memo. Adapt to your organization&rsquo;s letterhead and factual specifics.</p>'
      + '<div class="doc-letter-box">'
      +   '<p><em>To whom it may concern,</em></p>'
      +   '<p>[Organization] operates the AI system described above in accordance with the record-keeping obligations of Article 12 of Regulation (EU) 2024/1689. Each event of the system produces a signed record in the ' + '<span class="doc-inline-code">verification.v0.3</span> format (registered as the first entry of the ERC-8210 Receipt Profile Registry; normatively defined in IETF <span class="doc-inline-code">draft-krausz-verification-state</span>). ' + 'Records are canonicalized per RFC 8785 and signed with Ed25519 keys published at [JWKS URL]. Any independent party may verify a record offline using the <span class="doc-inline-code">agentoracle-receipt-verify</span> library or equivalent implementation of the profile.</p>'
      +   '<p>Records are retained for [retention period] and made available on request to [regulator / auditor / supervisory authority] under the conditions of Article 12.</p>'
      +   '<p><em>Signed,<br>[Compliance Officer], [Date]</em></p>'
      + '</div>'
      + '<h3>Standards references</h3>'
      + '<ul class="doc-standards">'
      +   '<li><a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj">Regulation (EU) 2024/1689 &mdash; Article 12</a></li>'
      +   '<li><a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/">IETF draft-krausz-verification-state-01</a></li>'
      +   '<li><a href="https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097/46">ERC-8210 Receipt Profile Registry &mdash; verification.v0.3 (Section D)</a></li>'
      +   '<li><a href="https://datatracker.ietf.org/doc/html/rfc8785">RFC 8785 &mdash; JSON Canonicalization Scheme</a></li>'
      +   '<li><a href="https://datatracker.ietf.org/doc/html/rfc7515">RFC 7515 &mdash; JSON Web Signature</a></li>'
      +   '<li><a href="https://datatracker.ietf.org/doc/html/rfc8037">RFC 8037 &mdash; EdDSA in JOSE</a></li>'
      +   '<li><a href="https://pypi.org/project/agentoracle-receipt-verify/">agentoracle-receipt-verify &mdash; Python verifier (PyPI)</a></li>'
      +   '<li><a href="https://github.com/TKCollective/agentoracle-receipt-spec">Reference implementation (GitHub)</a></li>'
      + '</ul>'
      + '<div class="doc-footer">'
      +   '<p><strong>How this document was prepared.</strong> Generated by the AgentOracle Article 12 Considerations tool at <a href="https://agentoracle.co/article-12">agentoracle.co/article-12</a>. All statements about Article 12 are drawn from the operative text of Regulation (EU) 2024/1689. Statements about ' + (co ? co : 'the named initiative') + ' are drawn ' + (ref ? 'exclusively from the public reference provided above' : 'from generic patterns and are not tied to any specific organization') + '. This is not legal advice.</p>'
      +   '<p><strong>Contact.</strong> AgentOracle (TK Collective LLC) &middot; <a href="mailto:joe@agentoracle.co">joe@agentoracle.co</a> &middot; <a href="https://agentoracle.co">agentoracle.co</a></p>'
      + '</div>';

    return html;
  }

  document.getElementById('a12-form').addEventListener('submit', function(e){
    e.preventDefault();
    const company = document.getElementById('f-company').value.trim();
    const initiative = document.getElementById('f-initiative').value.trim();
    const reference = document.getElementById('f-ref').value.trim();
    if (company && !reference) {
      refWarning.classList.add('warning--show');
      refWarning.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    if (!initiative) return;

    const data = {
      company: company,
      initiative: initiative,
      reference: reference,
      region: document.getElementById('f-region').value,
      scale: document.getElementById('f-scale').value,
      categories: Array.from(document.querySelectorAll('.form__check input:checked')).map(function(cb){ return cb.value; }),
      logging: document.getElementById('f-logging').value,
      retention: document.getElementById('f-retention').value
    };

    const paper = document.getElementById('doc-paper');
    paper.innerHTML = renderDoc(data);
    document.getElementById('doc').classList.add('show');
    document.getElementById('doc').scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Clipboard fallback for mailto CTAs (same pattern as landing)
  const ORIG = new WeakMap();
  function copy(text){
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text); } catch(e){}
    return new Promise(function(r){ const ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(ta); r(); });
  }
  document.addEventListener("click", function(e){
    const a = e.target.closest("a.cta-mail");
    if (!a) return;
    const email = a.getAttribute("data-email") || "joe@agentoracle.co";
    copy(email);
    if (!ORIG.has(a)) ORIG.set(a, a.innerHTML);
    a.innerHTML = "\\u2713 " + email + " copied";
    setTimeout(function(){ const orig = ORIG.get(a); if (orig) a.innerHTML = orig; }, 2500);
  }, {passive:true});
})();
</script>
</body>
</html>`;

export function registerArticle12Checker(app) {
  app.get("/article-12", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.send(ARTICLE_12_PAGE_HTML);
  });
  app.get("/article-12-preview", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.send(ARTICLE_12_PAGE_HTML);
  });
}
