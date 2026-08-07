// deterministic-mode-page.js — /docs/deterministic-mode route.
//
// This page IS the checkable version of "no LLM in the trust chain."
// The check-type catalog is NOT hardcoded here — it is fetched at page
// load from GET /v1/verify-facts, the same endpoint that serves the
// route. If the endpoint ships a check type, this page shows it; if it
// drops one, this page stops showing it. The page cannot drift from what
// the endpoint actually does, which is the whole point: a reader
// evaluating the claim can compare this page against the live catalog
// in one request.
//
// PERPLEXITY: (1) `import { DETERMINISTIC_MODE_PAGE_HTML } from './deterministic-mode-page.js'`
//             (2) `app.get('/docs/deterministic-mode', (_req,res)=>{ ... })`
//             (3) Add to sitemap.xml

export const DETERMINISTIC_MODE_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deterministic mode — AgentOracle</title>
<meta name="description" content="For claims that are lookups, not judgments. POST /v1/verify-facts runs deterministic checks with no LLM in the trust chain, and records check_mode in the signed receipt so a verifier can prove it.">
<link rel="canonical" href="https://agentoracle.co/docs/deterministic-mode">
<meta property="og:type" content="article">
<meta property="og:site_name" content="AgentOracle">
<meta property="og:url" content="https://agentoracle.co/docs/deterministic-mode">
<meta property="og:title" content="Deterministic mode — no LLM in the trust chain">
<meta property="og:description" content="Six deterministic check types. The receipt records check_mode: deterministic and check_types_applied[] so a verifier can prove no model was in the trust chain.">
<meta property="og:image" content="https://agentoracle.co/og-image.png?v=20260803">
<meta name="twitter:card" content="summary_large_image">
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
a{text-decoration:none}
.mono{font-family:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace}
.wrap{max-width:900px;margin:0 auto;padding:0 32px}
@media(max-width:720px){.wrap{padding:0 22px}}

nav{border-bottom:1px solid var(--gline);background:var(--ink);position:sticky;top:0;z-index:50}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:64px;max-width:1180px;margin:0 auto;padding:0 32px}
.nav-brand{font-family:'JetBrains Mono',monospace;font-size:.94rem;letter-spacing:.06em;color:var(--paper)}
.nav-brand a{color:var(--paper)}
.nav-brand span{color:var(--gold)}
.nav-links{display:flex;gap:26px;align-items:center;font-size:.92rem}
.nav-links a{color:var(--mut-d);transition:color .2s}
.nav-links a:hover{color:var(--paper)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:2px;font-family:'JetBrains Mono',monospace;font-size:.9rem;letter-spacing:.02em;transition:all .2s;border:1px solid transparent;cursor:pointer}
.btn-gold{background:var(--gold);color:var(--ink);font-weight:500}
.btn-gold:hover{background:var(--gold-2)}
.btn-ghost{background:transparent;color:var(--paper);border-color:var(--gline)}
.btn-ghost:hover{border-color:var(--gline-hi);color:var(--gold-2)}
.nav-cta{padding:9px 16px;font-size:.88rem}
@media(max-width:820px){.nav-links a:not(.btn){display:none}}

.hero{padding:72px 0 34px}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.22em;color:var(--gold);margin-bottom:18px;display:block;text-transform:uppercase}
.hero h1{font-size:clamp(2rem,4.6vw,3rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:18px;font-weight:500}
.hero h1 span{color:var(--gold)}
.hero .sub{color:var(--mut-d);font-size:1.06rem;max-width:660px}

section{padding:34px 0}
h2{font-size:1.42rem;color:var(--paper);letter-spacing:-.01em;margin-bottom:14px;font-weight:500}
h3{font-size:1.02rem;color:var(--paper);font-weight:500;margin:22px 0 8px;letter-spacing:-.005em}
p{color:var(--mut-d);font-size:.98rem;line-height:1.7;margin-bottom:14px}
p a,li a{color:var(--gold);border-bottom:1px solid rgba(212,169,74,.3)}
p a:hover,li a:hover{color:var(--gold-2)}
code{font-family:'JetBrains Mono',monospace;font-size:.86rem;background:rgba(212,169,74,.08);padding:1px 5px;border-radius:2px;color:var(--gold-2)}
ul{list-style:none;padding:0;margin:0 0 16px}
li{padding-left:20px;position:relative;margin-bottom:8px;color:var(--mut-d);font-size:.96rem;line-height:1.65}
li::before{content:"·";color:var(--gold);position:absolute;left:8px;top:0;font-weight:700}
li strong{color:var(--paper);font-weight:600}

pre{background:var(--ink-2);border:1px solid var(--gline);border-radius:4px;padding:18px 20px;overflow-x:auto;margin-bottom:18px}
pre code{background:none;padding:0;color:var(--paper);font-size:.84rem;line-height:1.65;display:block}
.c-key{color:var(--gold-2)} .c-str{color:#9ecb8a} .c-cm{color:var(--mut-l)} .c-p{color:var(--gold)}

table{width:100%;border-collapse:collapse;font-size:.9rem;margin-bottom:18px}
th,td{text-align:left;padding:13px 15px;border-bottom:1px solid var(--gline);vertical-align:top}
th{background:var(--ink-2);color:var(--gold);font-family:'JetBrains Mono',monospace;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500}
tr:last-child td{border-bottom:none}
td strong{color:var(--paper);font-weight:600}
td code{font-size:.8rem}

.callout{border-left:2px solid var(--gold);background:rgba(212,169,74,.05);padding:16px 20px;margin-bottom:20px;border-radius:0 3px 3px 0}
.callout p:last-child{margin-bottom:0}
.callout strong{color:var(--paper)}

.live{border:1px solid var(--gline);border-radius:4px;padding:22px 24px;background:var(--ink-2);margin-bottom:20px}
.live-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px;flex-wrap:wrap}
.live-head .lbl{font-family:'JetBrains Mono',monospace;font-size:.74rem;letter-spacing:.16em;color:var(--gold);text-transform:uppercase}
.live-head .src{font-family:'JetBrains Mono',monospace;font-size:.78rem;color:var(--mut-l)}
.live-head .src a{color:var(--mut-d);border-bottom:1px solid var(--gline)}
.live-head .src a:hover{color:var(--gold-2)}
#ct-list{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(max-width:680px){#ct-list{grid-template-columns:1fr}}
.ct{border:1px solid var(--gline);border-radius:3px;padding:12px 14px;font-family:'JetBrains Mono',monospace;font-size:.84rem;color:var(--paper);display:flex;align-items:center;gap:9px}
.ct::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--ok);flex:none}
.ct-note{font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--mut-l);margin-top:12px}
.ct-err{color:var(--err);font-family:'JetBrains Mono',monospace;font-size:.84rem}

footer{border-top:1px solid var(--gline);padding:44px 0 32px;background:var(--ink);margin-top:36px}
footer .foot-in{display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;font-size:.86rem;color:var(--mut-d);font-family:'JetBrains Mono',monospace;letter-spacing:.02em;max-width:1180px;margin:0 auto;padding:0 32px}
footer a{color:var(--mut-d);transition:color .2s}
footer a:hover{color:var(--gold-2)}
.foot-links{display:flex;gap:22px;flex-wrap:wrap}
</style>
</head>
<body>

<nav>
  <div class="nav-in">
    <div class="nav-brand"><a href="/">agent<span>oracle</span></a></div>
    <div class="nav-links">
      <a href="/whitepaper">Whitepaper</a>
      <a href="/pricing">Pricing</a>
      <a href="/changelog">Changelog</a>
      <a class="btn btn-gold nav-cta" href="https://buy.stripe.com/6oU9ATdcggwJgUB7Zr3ZK02">Get a key</a>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">Docs · Deterministic mode</span>
    <h1>For claims that are lookups,<br>not <span>judgments</span>.</h1>
    <p class="sub"><code>POST /v1/verify-facts</code> resolves a claim with a deterministic check and signs the result. No LLM is invoked anywhere in the pipeline. The receipt records <code>check_mode: "deterministic"</code> so a verifier can prove that — not take our word for it.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Why this exists</h2>
    <p>The reasonable objection to any verification service is: who checks the checker? If an LLM decides whether a claim is true, the trust chain contains a model, and the model is the weakest link in an audit.</p>
    <p>Some claims do not need judgment. "Does this signature verify against this key" is not an opinion. "Does this package exist in PyPI at this version" is a lookup. "Is this timestamp inside this window" is arithmetic. For that class, the honest answer is to run the check and sign the result — with nothing probabilistic in the path.</p>
    <div class="callout">
      <p><strong>What the mode claims:</strong> no LLM in the trust chain, recomputable end-to-end, same envelope and same verifier as every other AgentOracle receipt.</p>
      <p><strong>What it does not claim:</strong> that the underlying source is correct. A deterministic check proves <em>what was checked and what the check returned</em> — not that a registry, a key, or a schema is itself trustworthy. It also does not make the caller's agent AI-free; the agent may well have used a model to <em>generate</em> the claim. The guarantee is scoped to our check.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Shipped check types</h2>
    <p>This list is not written into the page. It is fetched from <code>GET /v1/verify-facts</code> when you load it — the same endpoint that serves the checks. If the catalog and this page ever disagree, the catalog is right and this page is broken.</p>
    <div class="live">
      <div class="live-head">
        <span class="lbl">Live catalog</span>
        <span class="src">pulled from <a href="/v1/verify-facts">GET /v1/verify-facts</a></span>
      </div>
      <div id="ct-list"><span class="ct-note">loading catalog…</span></div>
      <div class="ct-note" id="ct-meta"></div>
    </div>

    <table>
      <thead><tr><th>Check type</th><th>Resolves</th><th>Required input</th></tr></thead>
      <tbody>
        <tr>
          <td><code>signature_verification</code></td>
          <td>Does this signature verify against this key? Ed25519 / EdDSA.</td>
          <td><code>signing_input_b64u</code>, <code>signature_b64u</code>, <code>public_jwk</code></td>
        </tr>
        <tr>
          <td><code>hash_comparison</code></td>
          <td>Does the claimed digest match a digest computed over the content? SHA-256 / SHA-512, timing-safe compare.</td>
          <td><code>claimed_digest</code>, and <code>content</code> or <code>content_b64u</code></td>
        </tr>
        <tr>
          <td><code>registry_lookup</code></td>
          <td>Does this entry exist in a declared authoritative registry, with matching metadata? Allowlisted registries only.</td>
          <td><code>registry</code>, <code>identifier</code>, optional <code>expect</code></td>
        </tr>
        <tr>
          <td><code>regex_match</code></td>
          <td>Does this value match a declared pattern?</td>
          <td><code>value</code>, <code>pattern</code>, optional <code>flags</code></td>
        </tr>
        <tr>
          <td><code>timestamp_validation</code></td>
          <td>Does this timestamp fall inside declared bounds?</td>
          <td><code>timestamp</code>, and <code>not_before</code> and/or <code>not_after</code></td>
        </tr>
        <tr>
          <td><code>json_schema_conformance</code></td>
          <td>Does this document conform to a declared schema? Documented keyword subset; unsupported keywords are rejected, never skipped.</td>
          <td><code>document</code>, <code>schema</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Call shape</h2>
<pre><code><span class="c-p">$</span> curl -sS https://agentoracle.co/v1/verify-facts \\
    -H <span class="c-str">"authorization: Bearer \$AO_API_KEY"</span> \\
    -H <span class="c-str">"content-type: application/json"</span> \\
    -d '{
      <span class="c-key">"subject"</span>: { <span class="c-key">"claim_hash"</span>: <span class="c-str">"sha256-…"</span> },
      <span class="c-key">"checks"</span>: [
        {
          <span class="c-key">"check_type"</span>: <span class="c-str">"hash_comparison"</span>,
          <span class="c-key">"input"</span>: {
            <span class="c-key">"content"</span>: <span class="c-str">"the exact bytes being attested"</span>,
            <span class="c-key">"claimed_digest"</span>: <span class="c-str">"sha256-…"</span>
          }
        },
        {
          <span class="c-key">"check_type"</span>: <span class="c-str">"registry_lookup"</span>,
          <span class="c-key">"input"</span>: {
            <span class="c-key">"registry"</span>: <span class="c-str">"pypi"</span>,
            <span class="c-key">"identifier"</span>: <span class="c-str">"agentoracle-receipt-verify"</span>
          }
        }
      ]
    }'</code></pre>

    <h3>What comes back</h3>
<pre><code>{
  <span class="c-key">"jws"</span>: { <span class="c-key">"payload"</span>: <span class="c-str">"…"</span>, <span class="c-key">"signatures"</span>: [ … ] },
  <span class="c-key">"canonical_sha256"</span>: <span class="c-str">"sha256-…"</span>,
  <span class="c-key">"verdict"</span>: <span class="c-str">"act"</span>,
  <span class="c-key">"check_mode"</span>: <span class="c-str">"deterministic"</span>,
  <span class="c-key">"check_types_applied"</span>: [<span class="c-str">"hash_comparison"</span>, <span class="c-str">"registry_lookup"</span>],
  <span class="c-key">"check_results"</span>: [ { <span class="c-key">"check_type"</span>: …, <span class="c-key">"outcome"</span>: <span class="c-str">"pass"</span>, <span class="c-key">"evidence"</span>: { … } } ]
}</code></pre>
    <p>Inside the signed payload, <code>check_mode: "deterministic"</code> and <code>check_types_applied[]</code> sit under the signature, so they cannot be added or removed after issue without breaking verification. <code>v_gate.confidence</code> is <code>1.0</code> by construction and <code>v_gate.v_adversarial_result</code> is <code>"n/a"</code> — there is no judgment to contest and no probability to report.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Rejection: <code>422 claim_not_deterministic</code></h2>
    <p>If a claim cannot be resolved by a shipped check type, the endpoint refuses it. There is no fallback to the judgment path. A silent escalation to <code>/v1/compose</code> would mean a caller who asked for a deterministic receipt could receive a model-judged one without knowing — which would make <code>check_mode</code> worthless as a signal.</p>
<pre><code>HTTP/1.1 422 Unprocessable Entity

{
  <span class="c-key">"error"</span>: <span class="c-str">"claim_not_deterministic"</span>,
  <span class="c-key">"reason"</span>: <span class="c-str">"Claim cannot be resolved by any deterministic check type…"</span>,
  <span class="c-key">"supported_check_types"</span>: [ … ],
  <span class="c-key">"llm_fallback"</span>: <span class="c-str">false</span>
}</code></pre>

    <h3>Two rejection cases, deliberately distinguished</h3>
    <ul>
      <li><strong>Unresolvable</strong> — the check type is unknown, or a required input is absent. Rejected before any work runs.</li>
      <li><strong>Unexecutable</strong> — the check type is shipped and the inputs are present, but the check could not actually run: an unsupported schema keyword, an unreachable registry, a malformed JWK. This is also a 422, and that matters. Signing a <code>halt</code> here would assert <em>"this claim is false"</em> when the truth is <em>"we could not check."</em> A receipt must never misrepresent an inability to check as a negative finding.</li>
    </ul>
    <p>Move to <code>POST /v1/compose</code> or <code>POST /evaluate</code> if you want judgment. That has to be an explicit decision by the caller.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Design constraints worth knowing</h2>
    <h3>Registries are allowlisted, not freeform</h3>
    <p>A caller cannot pass an arbitrary URL. Beyond the obvious request-forgery surface, an open fetch would destroy recomputability: a caller could point the check at a server they control and obtain a signed receipt attesting whatever that server returned. Each lookup pins a <code>response_sha256</code> and <code>observed_at</code> in the evidence, so the receipt stays auditable after the upstream registry changes.</p>
    <h3>Unsupported schema keywords are rejected, not ignored</h3>
    <p><code>json_schema_conformance</code> ships a documented subset. A schema using keywords outside it returns 422 rather than validating against the part we understand. Silently skipping unknown keywords would issue a signed receipt attesting a check that was never performed.</p>
    <h3>One canonicalization implementation</h3>
    <p>Deterministic-mode receipts are canonicalized and signed by the same RFC 8785 JCS implementation and the same Ed25519 key as every other AgentOracle receipt. There is exactly one canonicalizer in the process — a second copy would silently diverge from the reference verifiers in the conformance suite.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Verifying a deterministic receipt</h2>
    <p>Nothing changes on the verifier side. Same envelope, same published JWKS, same reference verifier.</p>
<pre><code><span class="c-p">$</span> pip install agentoracle-receipt-verify
<span class="c-p">$</span> python3 -c <span class="c-str">"import json,sys; from agentoracle_receipt_verify import verify; print(verify(json.load(open('receipt.json'))))"</span>
<span class="c-cm">✓ valid: True — signature verifies against published JWKS (offline)</span></code></pre>
    <p>To confirm the mode independently, decode the payload and read <code>check_mode</code> yourself. It is inside the signed bytes; if it says <code>deterministic</code> and the signature verifies, no model was in the trust chain for that decision.</p>
    <p>Conformance vectors for each check type — including the rejection cases, which must never produce a receipt — ship in the <a href="https://github.com/TKCollective/agentoracle-receipt-spec">receipt-spec repo</a> so a second implementer can byte-match the deterministic path the same way the judgment path is already matched.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>Availability</h2>
    <p>Deterministic mode is a capability of the existing tiers, not a separate product. Self-Serve keys and x402 pay-per-call both reach <code>POST /v1/verify-facts</code> with no change to your credentials. Verification is free and offline, as it is for every AgentOracle receipt. See <a href="/pricing">pricing</a>.</p>
  </div>
</section>

<footer>
  <div class="foot-in">
    <div>© 2026 TK Collective LLC</div>
    <div class="foot-links">
      <a href="/">Home</a>
      <a href="/whitepaper">Whitepaper</a>
      <a href="/pricing">Pricing</a>
      <a href="/changelog">Changelog</a>
      <a href="/receipt-registry">Receipt registry</a>
      <a href="/benchmarks">Benchmarks</a>
      <a href="/business">Business</a>
    </div>
  </div>
</footer>

<script>
// Pull the shipped catalog from the endpoint itself. The page must not
// carry its own copy of the check-type list — if these two could drift,
// the page would stop being evidence of anything.
(async () => {
  const list = document.getElementById('ct-list');
  const meta = document.getElementById('ct-meta');
  try {
    const r = await fetch('/v1/verify-facts', { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    const types = Array.isArray(j.supported_check_types) ? j.supported_check_types : [];
    if (!types.length) throw new Error('empty catalog');
    list.innerHTML = types
      .map(t => '<div class="ct">' + String(t).replace(/[<>&]/g, '') + '</div>')
      .join('');
    const bits = [];
    bits.push(types.length + ' check types shipped');
    if (Array.isArray(j.supported_registries) && j.supported_registries.length) {
      bits.push('registries: ' + j.supported_registries.join(', '));
    }
    if (j.deterministic_mapping_id) bits.push('mapping: ' + j.deterministic_mapping_id);
    if (j.rejection && j.rejection.status) bits.push('rejection: HTTP ' + j.rejection.status + ' ' + j.rejection.error);
    meta.textContent = bits.join('  ·  ');
  } catch (e) {
    list.innerHTML = '<span class="ct-err">Catalog unavailable (' + e.message +
      '). Query GET /v1/verify-facts directly — that endpoint, not this page, is authoritative.</span>';
    meta.textContent = '';
  }
})();
</script>

</body>
</html>`;
