// incident-page.js — /incidents/2026-08-25-canned-verdicts
//
// Public incident note. The content of this page is a factual record; it is
// deliberately static rather than generated, because an incident note that
// can change without a trail is not a record. Corrections go in the
// corrections list at the bottom, dated, never by editing the body above it.
//
// Source of truth: "Sep 2 Option A outline — final.md"
//   sha256 8c7c78943d18029b048c19fd7a7c814fd2e3dd491cb394924dda134cd1fb4de4
//   (verified 2026-09-01, post name-fix, §5b propagation-failure paragraph,
//    Msebenzi credit, §8 no-receipt correction, and generic role-parameter phrasing)
//
// Commit shas cited below are inlined rather than templated, because
// {{D6_SHA}} was a misleading placeholder name: the git commit 49261a37b
// carries the message "fix D6" from an earlier defect-numbering scheme
// that the outline never uses. Inlining removes the ambiguity.
//
//   49261a37b — flag-penalty threshold fix (D5-cluster follow-up in §5)
//   a8ce2a18d — sample rebuild + oracle close (§5b)
//
// Route registration: see the sibling block in index.js. The page shipped
// dark from 2026-08-27 (route registered, X-Robots-Tag noindex, no page linking
// to it) and is scheduled to publish 2026-09-02 via the queued patch that adds
// the changelog entry and removes the noindex header.

export const INCIDENT_2026_08_25_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Incident: canned verdicts, 21-25 August 2026 — AgentOracle</title>
<meta name="description" content="For four days /evaluate signed and returned receipts for evaluations it never performed. The signed layer halted every affected request; the human-readable body did not disclose that. Full record.">
<link rel="canonical" href="https://agentoracle.co/incidents/2026-08-25-canned-verdicts">
<meta property="og:type" content="article">
<meta property="og:site_name" content="AgentOracle">
<meta property="og:url" content="https://agentoracle.co/incidents/2026-08-25-canned-verdicts">
<meta property="og:title" content="Incident: canned verdicts, 21-25 August 2026">
<meta property="og:description" content="The cryptographic layer was right the whole time. The presentation layer understated it. Full record.">
<meta property="og:image" content="https://agentoracle.co/og-image.png?v=20260803">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/assets/ao-logo-v8.png">
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
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
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:2px;font-family:'JetBrains Mono',monospace;font-size:.9rem;letter-spacing:.02em;transition:all .2s;border:1px solid transparent}
.btn-gold{background:var(--gold);color:var(--ink);font-weight:500}
.btn-gold:hover{background:var(--gold-2)}
.nav-cta{padding:9px 16px;font-size:.88rem}
@media(max-width:820px){.nav-links a:not(.btn){display:none}}

.hero{padding:72px 0 34px}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.22em;color:var(--gold);margin-bottom:18px;display:block;text-transform:uppercase}
.hero h1{font-size:clamp(2rem,4.6vw,3rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:18px;font-weight:500}
.hero h1 span{color:var(--gold)}
.hero .sub{color:var(--mut-d);font-size:1.06rem;max-width:660px}

section{padding:34px 0}
h2{font-size:1.34rem;font-weight:500;letter-spacing:-.01em;margin:0 0 14px;color:var(--paper)}
h3{font-size:1.02rem;font-weight:500;color:var(--gold-2);margin:22px 0 8px;letter-spacing:-.005em}
p{color:var(--paper);font-size:.98rem;line-height:1.7;margin-bottom:14px}
p+p{margin-top:12px}
p a,li a{color:var(--gold);border-bottom:1px solid rgba(212,169,74,.3)}
p a:hover,li a:hover{color:var(--gold-2)}
section p,section li{color:var(--paper)}
ul,ol{margin:12px 0 0 22px}
li{margin-bottom:8px;color:var(--paper);font-size:.96rem;line-height:1.65}
li strong{color:var(--paper);font-weight:600}
code{font-family:'JetBrains Mono',monospace;font-size:.9em;color:var(--gold-2);background:var(--ink-3);padding:2px 6px;border-radius:2px}
.lede{border-left:2px solid var(--gold);padding:18px 22px;background:var(--ink-2);margin:26px 0}
.lede p{font-size:1.06rem;color:var(--paper)}
.defect{border:1px solid var(--gline);padding:20px 22px;margin:16px 0;background:var(--ink-2)}
.defect .tag{font-family:'JetBrains Mono',monospace;font-size:.74rem;letter-spacing:.16em;color:var(--gold);text-transform:uppercase;display:block;margin-bottom:8px}
.note{border:1px solid var(--gline);border-left:2px solid var(--gold);padding:16px 20px;margin:18px 0;background:var(--ink-3);font-size:.96rem;color:var(--mut-d)}
blockquote{border-left:2px solid var(--gline-hi);padding:12px 20px;margin:14px 0;color:var(--paper);font-size:.98rem;font-style:italic;background:var(--ink-2)}
table{width:100%;border-collapse:collapse;margin:14px 0;font-size:.94rem}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--gline);vertical-align:top}
th{font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;font-weight:500}
footer{border-top:1px solid var(--gline);margin-top:48px;padding:30px 0 60px;color:var(--mut-d);font-size:.9rem}
</style>
</head>
<body>
<nav>
  <div class="nav-in">
    <div class="nav-brand"><a href="/">agent<span>oracle</span></a></div>
    <div class="nav-links">
      <a href="/whitepaper">Whitepaper</a>
      <a href="/docs">Docs</a>
      <a href="/changelog">Changelog</a>
      <a class="btn btn-gold nav-cta" href="/pricing">Get a key</a>
    </div>
  </div>
</nav>

<div class="wrap">

<div class="hero">
  <span class="eyebrow">Incident record</span>
  <h1>Canned verdicts, <span>21-25 August 2026</span></h1>
  <p class="sub">A four-day window in which the verification service signed and returned receipts for evaluations it never performed.</p>
</div>

<div class="lede">
  <p>Between 2026-08-21 and 2026-08-25, an outage of AgentOracle's <code>/evaluate</code> verification service caused it to sign and return receipts for evaluations it had never performed. It was discovered 2026-08-25 from the receipts themselves; the signed layer had correctly halted every affected request, and the human-readable body did not disclose that.</p>
  <p>Five days undetected is the shape of this incident. Discovery from the receipts themselves — not from a customer complaint, not from a monitoring alert — is what made that window recoverable at all. The signed layer was doing what a signed layer is supposed to do; the presentation next to it was not.</p>
</div>

<section>
  <h2>What happened</h2>
  <ul>
    <li>The paid API account funding the three parallel verification calls exhausted its balance and began returning errors instead of results. Balance protection was manual top-up only; no auto-reload was configured.</li>
    <li>The handler did not treat "no source returned a parseable claim set" as first-class unavailability. It proceeded, seeded overall confidence at exactly 0.50, emitted a canned recommendation text, and signed a composed receipt.</li>
    <li>Every affected receipt derived to <code>v_recommendation: unverifiable</code> and <code>verdict: halt</code>. <strong>No degraded receipt in the entire incident carried <code>verdict: act</code>.</strong> The cryptographic layer was right the whole time.</li>
    <li>The plain-text body next to those receipts said "partially supported" with a <code>verify</code> recommendation. A caller integrating on the body alone had no signal that no verification had occurred. A caller integrating on receipt verification would have halted correctly.</li>
    <li>After the upstream was restored, the cache re-served at least one degraded response; the entry was preserved in a snapshot and then deliberately deleted.</li>
  </ul>
</section>

<section>
  <h2>The population</h2>
  <p>17,784 verdicts were issued during the affected window. 17,703 carried a byte-identical canned reason string — 99.54% — every one of them a valid Ed25519 signature over a receipt that correctly derived <code>verdict: halt</code>. The remaining 81 evaluations completed before the balance drained fully; those receipts are unaffected.</p>
</section>

<section>
  <h2>Why the receipts were still right</h2>
  <p>The cryptographic layer was right the whole time. The presentation layer understated it. For the full duration of a total upstream verification outage, the signed evidence artifact carried <code>v_verdict: unverifiable</code> and <code>v_gate: halt</code>. The v0.3 receipt derivation reaches <code>act</code> only through an evaluated, adversarially-resistant claim set. A response with no evaluated claims cannot express <code>act</code> in the signed layer, and none did.</p>
  <p>If a customer had integrated on receipt verification, we would have nothing to disclose to them beyond the body text they saw next to a correct receipt.</p>
</section>

<section>
  <h2>What we changed</h2>
  <table>
    <thead><tr><th>Commit</th><th>When (UTC)</th><th>Change</th></tr></thead>
    <tbody>
      <tr><td><code>4a8b37177</code></td><td>2026-08-27 01:52Z</td><td>Handler early-returns HTTP 503 <code>not_evaluated</code> when no source produced a parseable claim set. No confidence, no verdict, no receipt, no cache write.</td></tr>
      <tr><td><code>4a8b37177</code></td><td>2026-08-27 01:52Z</td><td>Cache admission gated on evaluation completeness, across both the full-response and per-claim namespaces.</td></tr>
      <tr><td><code>98b3b7e78</code></td><td>2026-08-27 04:41Z</td><td>Reverted a co-shipped change that collapsed <code>un_probed_not_cleared</code> into the generic <code>unverifiable</code>. Both halt, but the two states are distinct at the receipt layer.</td></tr>
      <tr><td><code>c28c5dd6f</code></td><td>2026-08-28 02:13Z</td><td>Recommendation text derives from the caller's threshold instead of a hard-coded 0.80. Present since <code>min_confidence</code> became caller-tunable; unrelated to the outage but the same disclosure-asymmetry class.</td></tr>
      <tr><td><code>49261a37b</code></td><td>2026-08-28 03:50Z</td><td>The adversarial-flag confidence penalty re-checks the applied threshold, so a flagged response can no longer report <code>act</code> in the body when the receipt-side gate would halt. Same disclosure-asymmetry family as the row above.</td></tr>
      <tr><td><code>a8ce2a18d</code></td><td>2026-08-28 18:02Z</td><td>Mapping binding derived at boot from the published mapping document; <code>/v1/compose</code>, <code>/v1/v_gate</code>, <code>/v1/sign</code>, and <code>/v1/sign/batch</code> return <code>503</code> until their verdict path or auth is completed. See the externally-reported defect below.</td></tr>
    </tbody>
  </table>
  <p>The pre-registration for the benchmark run whose collection window this outage sat inside carries an <a href="https://github.com/TKCollective/agentoracle-benchmark-a-b/commit/2351e29">append-only amendment (2351e29f6)</a> withdrawing the pre-registered headline for the same reason. This note and that amendment describe the same withdrawal.</p>
</section>

<section>
  <h2>A defect found by someone else, while this note was being written</h2>
  <div class="defect">
    <span class="tag">Externally reported</span>
    <p>On 2026-08-28, <a href="https://github.com/giskard09">@giskard09</a> independently ran the published recompute procedure against <code>/v1/conformance/sample</code> and reported two things (<a href="https://github.com/x402-foundation/x402/issues/3234">x402-foundation/x402#3234</a>). Both are correct.</p>
    <p>First, the sample's <code>v_gate.mapping_hash</code> was a hand-typed placeholder rather than a digest of any mapping document. The envelope's signatures were genuine — both issuers verified, canonical bytes recomputed — so the cryptographic layer faithfully committed to a mapping binding that had never been computed. A relying party following our published procedure would resolve that hash, fail to match it, and correctly halt. This is the same failure class as the first defect above: a genuine signature over content the service never produced.</p>
    <p>Second, we found the same hard-coded constant was used by the live <code>POST /v1/compose</code> and <code>POST /v1/v_gate</code> endpoints, both reachable without authentication. It was not confined to a fixture. In the same audit we discovered <code>POST /v1/sign</code> and <code>POST /v1/sign/batch</code> signed caller-supplied bytes under the production issuer key with no authentication — a forgery oracle for this receipt format while it was open.</p>
    <p><strong>The same string was reported five weeks earlier.</strong> On 2026-07-28 Michael Msebenzi (<a href="https://github.com/headlessoracle" target="_blank" rel="noopener noreferrer">headlessoracle</a>) reported that the mapping hash carried in our published fixtures was a placeholder that had never resolved. We repaired the fixtures within twenty hours and computed the correct mapping hash on 2026-07-29 — the value the conformance sample carries today. <strong>The identical placeholder string remained in the production constant for five more weeks</strong>, and the defect above is that same string. The July fix was scoped to the artifact that had been reported rather than to the class, so the correct value existed, published, in one location while the placeholder kept being stamped from another.</p>
  <p><strong>Fixed in <code>a8ce2a18d</code>, 2026-08-28 18:02Z UTC.</strong> The mapping binding is now derived at boot from the published mapping document, or the process refuses to start. All four endpoints return <code>503 not_issuing</code>; <code>/v1/sign*</code> require an authorization header, and the composed endpoints will resume issuing only when their verdict path is completed. The private issuer key was never exposed — an oracle that signs what you hand it is not the same as a stolen key — and closing the routes ended the capability.</p>
    <p><strong>Bound on the exposure window.</strong> Requests to these routes were not counted; the request-tracking helper is called zero times in the composing module. Log retention is roughly one hour. <strong>We cannot enumerate what was signed, or by whom, between 2026-06-23 and 2026-08-28.</strong> Absence of known forgery is absence of evidence, not evidence of absence, and it must be said that way rather than leaned on.</p>
  </div>
</section>

<section>
  <h2>Where the recompute leg stands</h2>
  <p>Alongside the sample defect, @giskard09 also ran the full verification protocol against a genuine <code>/evaluate</code> receipt: cryptographic signature check, mapping-hash match against a SHA-256 he computed himself of the live mapping document, and the Section 4.3 recompute of <code>candidate_recommendation</code> and <code>candidate_gate</code>. All three held. In his own words:</p>
  <blockquote>"The recompute requirement stands as demonstrated — we ran the full leg independently (signature, mapping_hash, §4.3 steps 3-6) and it held. The signature-implies-issuance step is a separate claim from that, and it shouldn't carry the same weight until kid separation lands on your side. That's not a knock on the recompute work, it's just a different property being verified."</blockquote>
  <p>That split is right, and it names the property still open. <strong>Same-kid conflation.</strong> The kid <code>ao-composed-2026-06-ed25519-c3abfce3</code> currently signs both receipts where AgentOracle evaluated the claim (<code>/evaluate</code>) and receipts where the service only signed bytes a caller handed it (<code>/v1/sign*</code>). A relying party cannot distinguish those provenances from a receipt alone.</p>
  <p>This is a property of the composed format, not of one operator’s implementation. It is present on both issuers we have checked. <a href="https://github.com/poteshniy">@poteshniy</a> independently identified the same conflation on Base-side composed issuance during this review window, and the two of us have converged on a format-level fix rather than two separate operational patches.</p>
  <p>The fix is an <strong>issuance-path assertion</strong>: a <code>role</code> parameter in the JWS protected header naming what the signature attests, checked against a <code>role</code> member on the signing key in the issuer’s published JWKS, so a verifier resolves what a signature attests from the same fetch that already resolves the key. Semantics are additive — a receipt carrying no role resolves to <code>unknown</code>, not to malformed, so every receipt issued before role annotation keeps verifying. <code>unknown</code> is not a pass: it records that the issuance path was not established, and a relying party whose policy requires an established path treats it as its own fail.</p>
  <p>Kid separation remains worth doing operationally on both sides as defence in depth, but it is no longer the durable fix — the assertion is, because it survives key rotation and does not require any verifier to carry a mapping table it has to keep current. <strong>No date is set here.</strong> The old kid stays in JWKS so nothing already issued is invalidated.</p>
</section>

<section>
  <h2>Evidence limitations</h2>
  <ul>
    <li>Vercel hobby-tier log retention is roughly one hour. Per-customer attribution across the outage window is not reconstructable.</li>
    <li>Cached verdict entries expired on a 24-hour TTL before the snapshot was taken, so the number of post-recovery re-serves cannot be established from cache state.</li>
    <li>The exhausted-balance HTTP status was inferred by convention, not observed at incident time.</li>
    <li>The <code>/v1/compose</code>, <code>/v1/v_gate</code>, <code>/v1/sign</code>, and <code>/v1/sign/batch</code> routes were not instrumented. We cannot enumerate what was signed under the same kid between 2026-06-23 and 2026-08-28.</li>
  </ul>
</section>

<section>
  <h2>What did not happen</h2>
  <ul>
    <li>No degraded response could carry a signed <code>act</code> verdict. The v0.3 derivation reaches <code>act</code> only through an evaluated, adversarially-resistant claim set, and no degraded request produced one.</li>
    <li>No signature verification failed. No key was compromised.</li>
    <li>No spec change is required. The v0.3 receipt derivation was correct throughout.</li>
  </ul>
</section>

<section>
  <h2>What is still open</h2>
  <ul>
    <li>Body-side presentation redesign to name the actual <code>v_recommendation</code> state rather than compress four states into three prose bands.</li>
    <li>A <code>not_evaluated</code> value at the receipt layer (v0.4 discussion). Non-evaluation currently produces <strong>no receipt at all</strong> — see <code>4a8b37177</code> above. No signed artifact records that the service was consulted and could not answer, so the distinction is <strong>absent from the record rather than collapsed within it</strong>: an auditor reading the records later cannot separate “asked and unanswerable” from “never asked.”</li>
    <li>Alarms A2–A4 per the appended spec. <strong>A1, the hourly content canary, shipped 2026-08-29 as <code>851269789</code></strong> — before this note published. Discovery of this incident took roughly six hours; A1 is the alarm that would have caught it in one, which is why it went first. A2 (credit balance), A3 (rate-limit and upstream-error) and A4 (response-shape anomaly) remain open.</li>
    <li><strong>Issuance-path assertion.</strong> As above: the same signing key currently attests both AO-evaluated receipts and receipts where the service only signed caller-supplied bytes. Format-level fix converged with a second issuer and committed publicly; no date. Old kid retained in JWKS so nothing already issued is invalidated. Kid separation stays on both sides as operational defence in depth.</li>
    <li><strong>Auto-reload with a cap.</strong> Balance protection remains manual top-up only as of publication. A prepaid balance drained silently once; nothing structural prevents that from repeating.</li>
  </ul>
  <div class="note">Records cannot be backdated. An examiner asking in 2028 about behaviour in 2026 can only be answered by records that existed in 2026. That is the whole argument for this format, and it is why the incident belongs here, in the record, rather than nowhere.</div>
</section>

<section>
  <h2>Contact and references</h2>
  <p><code>joe@agentoracle.co</code>. Commits <code>4a8b37177</code>, <code>98b3b7e78</code>, <code>c28c5dd6f</code>, <code>49261a37b</code>, <code>a8ce2a18d</code>. External review thread: <a href="https://github.com/x402-foundation/x402/issues/3234">x402-foundation/x402#3234</a>. Benchmark amendment: <a href="https://github.com/TKCollective/agentoracle-benchmark-a-b/commit/2351e29">agentoracle-benchmark-a-b@2351e29f6</a>.</p>
</section>

<section>
  <h2>Corrections</h2>
  <p>Corrections to this note are added here, dated. The body above is not edited after publication.</p>
</section>

</div>

<footer>
  <div class="wrap">
    <p>Published 2026-09-02 · <a href="/whitepaper">Whitepaper</a> · <a href="/changelog">Changelog</a> · <a href="/docs">Docs</a></p>
  </div>
</footer>
</body>
</html>`;
