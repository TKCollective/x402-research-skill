// /whitepaper — full HTML rendering of the AgentOracle white paper.
// PDF companion: /whitepaper.pdf

export const WHITEPAPER_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verifiable AI Action Records — A Standards-Track Approach to EU AI Act Compliance | AgentOracle</title>
<meta name="description" content="A technical white paper on cryptographically signed verification records for EU AI Act Article 12 compliance. Standards-track: RFC 8785, RFC 7515, RFC 8037, IETF draft-krausz-verification-state, ERC-8210 v2.">
<meta name="author" content="Joe Krausz">
<meta property="og:title" content="Verifiable AI Action Records — Standards-Track EU AI Act Compliance">
<meta property="og:description" content="How cryptographically signed receipts satisfy Article 12 record-keeping obligations that conventional logs structurally cannot.">
<meta property="og:type" content="article">
<meta property="og:url" content="https://agentoracle.co/whitepaper">
<meta property="og:image" content="https://agentoracle.co/og-image.png">
<link rel="canonical" href="https://agentoracle.co/whitepaper">
<link rel="icon" type="image/png" href="/assets/ao-logo-v8.png">
<link rel="apple-touch-icon" href="/assets/ao-logo-v8.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#F7F6F2;
    --surface:#FBFBF9;
    --border:#D4D1CA;
    --text:#28251D;
    --muted:#7A7974;
    --faint:#BAB9B4;
    --primary:#01696F;
    --primary-hover:#0C4E54;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
  a{color:var(--primary);text-decoration:none;border-bottom:1px solid rgba(1,105,111,0.25);transition:border-color .15s}
  a:hover{color:var(--primary-hover);border-bottom-color:var(--primary-hover)}
  .container{max-width:720px;margin:0 auto;padding:0 24px}
  header.top{padding:24px 0;border-bottom:1px solid var(--border);margin-bottom:48px}
  header.top .nav{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  header.top a.brand{font-weight:700;color:var(--text);border:none;font-size:15px;letter-spacing:-0.01em}
  header.top .links{display:flex;gap:20px;flex-wrap:wrap}
  header.top .links a{font-size:14px;color:var(--muted);border:none}
  header.top .links a:hover{color:var(--text)}

  .paper-header{margin-bottom:40px}
  .kicker{font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:var(--muted);font-weight:600;margin-bottom:16px}
  h1{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:48px;line-height:1.1;letter-spacing:-0.02em;margin:0 0 12px}
  .subtitle{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:24px;line-height:1.3;color:var(--muted);font-weight:400;margin:0 0 32px}
  .meta{font-size:14px;color:var(--muted);margin-bottom:32px;line-height:1.6}
  .meta strong{color:var(--text);font-weight:600}
  .disclaimer{font-size:13px;color:var(--muted);font-style:italic;padding:16px 20px;border-left:2px solid var(--border);background:var(--surface);margin-bottom:40px;line-height:1.55}

  .actions{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:56px}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;transition:all .15s;border:none;cursor:pointer}
  .btn-primary{background:var(--text);color:var(--bg)}
  .btn-primary:hover{background:var(--primary);color:#fff}
  .btn-secondary{background:transparent;color:var(--text);border:1px solid var(--border)}
  .btn-secondary:hover{border-color:var(--text)}

  h2{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:32px;line-height:1.2;letter-spacing:-0.01em;margin:56px 0 16px;color:var(--text)}
  h3{font-size:18px;font-weight:600;margin:32px 0 12px;color:var(--text);letter-spacing:-0.005em}
  p{margin:0 0 18px;font-size:16px}

  code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;background:var(--surface);padding:1px 6px;border-radius:4px;border:1px solid var(--border)}
  pre{font-family:'JetBrains Mono',ui-monospace,monospace;background:#1c1b19;color:#e8e7e4;padding:20px 24px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.6;margin:20px 0}
  pre code{background:transparent;border:none;padding:0;color:inherit}

  table{width:100%;border-collapse:collapse;margin:24px 0;font-size:14px}
  th,td{text-align:left;padding:14px 12px;border-bottom:1px solid var(--border);vertical-align:top}
  th{font-weight:600;background:var(--surface);font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted)}

  .refs{list-style:none;padding:0;margin:24px 0;font-size:14px;line-height:1.7}
  .refs li{padding:6px 0 6px 40px;position:relative;color:var(--muted)}
  .refs li .num{position:absolute;left:0;top:6px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--faint);font-weight:600}
  .refs li a{color:var(--primary);word-break:break-word}

  .author-box{margin-top:64px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:12px;font-size:14px;line-height:1.6}
  .author-box h3{margin-top:0}

  footer.bottom{margin-top:80px;padding:32px 0;border-top:1px solid var(--border);font-size:13px;color:var(--muted);text-align:center}
  footer.bottom a{color:var(--muted);border:none}
  footer.bottom a:hover{color:var(--text)}

  @media (max-width:640px){
    h1{font-size:36px}
    .subtitle{font-size:20px}
    h2{font-size:26px}
    .container{padding:0 20px}
  }

  @media print {
    :root{
      --bg:#ffffff;
      --surface:#fafafa;
      --border:#dcdad3;
      --text:#1a1815;
      --muted:#5a5a55;
    }
    html,body{background:#ffffff !important;color:#1a1815 !important;font-size:11pt}
    header.top, .actions, footer.bottom { display: none !important; }
    .paper-header{margin-top:0}
    .container{max-width:none;padding:0}
    h1{font-size:30pt}
    .subtitle{font-size:16pt}
    h2{font-size:18pt;page-break-after:avoid}
    h3{font-size:12pt;page-break-after:avoid}
    p, li, td, th{font-size:10.5pt;line-height:1.55}
    pre{page-break-inside:avoid;background:#f4f2ec !important;color:#1a1815 !important;border:1px solid #dcdad3;font-size:9pt}
    pre code{color:#1a1815 !important}
    table{page-break-inside:avoid;font-size:9.5pt}
    a{color:#0C4E54 !important;border-bottom:none !important;text-decoration:underline}
    .disclaimer{background:#fafafa !important;color:#5a5a55 !important}
    .author-box{page-break-inside:avoid;background:#fafafa !important}
  }
</style>
</head>
<body>
<header class="top">
  <div class="container">
    <nav class="nav">
      <a href="/" class="brand">AgentOracle</a>
      <div class="links">
        <a href="/#how-it-works">The loop</a>
        <a href="/#proof">Proof</a>
        <a href="/#pricing">Pricing</a>
        <a href="/whitepaper">Whitepaper</a>
        <a href="/changelog">Changelog</a>
      </div>
    </nav>
  </div>
</header>

<main class="container">

<div class="paper-header">
  <div class="kicker">White Paper · July 2026</div>
  <h1>Verifiable AI Action Records</h1>
  <div class="subtitle">A Standards-Track Approach to EU AI Act Compliance</div>
  <div class="meta">
    <strong>Joe Krausz</strong> — AgentOracle (TK Collective LLC)<br>
    Version 1.3 · Revised 2026-07-23 · <a href="https://agentoracle.co">agentoracle.co</a> · <a href="mailto:joe@agentoracle.co">joe@agentoracle.co</a>
  </div>
  <div class="disclaimer">
    This paper is technical commentary intended for compliance, audit, and engineering audiences. It is not legal advice. Statements about Regulation (EU) 2024/1689 are drawn from the operative text of the Regulation; statements about implementations are drawn from public, independently checkable artifacts cited in the References.
  </div>
  <div class="actions">
    <a class="btn btn-primary" href="/whitepaper.pdf">Download PDF</a>
    <a class="btn btn-secondary" href="/article-12">Try the Article 12 Considerations tool</a>
  </div>
</div>

<h2>Executive Summary</h2>

<p>The record-keeping obligations of Article 12 of the EU Artificial Intelligence Act (Regulation (EU) 2024/1689) apply to standalone Annex III high-risk AI systems from 2 December 2027, after the Digital Omnibus deferred the original date of 2 August 2026; systems embedded in Annex I regulated products follow from 2 August 2028. (The amending act received final Council approval in June 2026; formal publication was pending at this revision.) Article 12 requires that such systems technically allow the automatic recording of events over their lifetime, and that those records support risk identification, post-market monitoring, and operational oversight. For systems in the Annex III categories — employment and worker management, credit, education, medical devices, and others — the obligations extend to recording the period of each use, the reference data consulted, the inputs that led to a match, and the identity of the natural persons involved in verifying results.</p>

<p>Most organizations plan to meet these obligations with conventional application logs. This paper argues that conventional logs have a structural weakness as compliance evidence: they are mutable, they are not independently verifiable, and they require the auditor to trust the operator that produced them. A log line can be edited, backdated, or deleted, and nothing in the log itself reveals that this happened. A record that cannot prove its own integrity is a weak foundation for a legal obligation whose purpose is proof.</p>

<p>The paper describes an alternative that is implemented and publicly specified today: cryptographically signed verification records ("receipts") built entirely from open standards — JSON canonicalization (RFC 8785), JSON Web Signatures (RFC 7515) with Ed25519 keys (RFC 8037), and published key sets (RFC 7517) — and defined normatively in an IETF Internet-Draft, draft-krausz-verification-state. The format is the <a href="https://github.com/wangbin9953/erc8210-aap/pull/4">first candidate profile entry</a> in the Receipt Profile Registry of ERC-8210 (Agent Assurance), a draft Ethereum standard under active development — the profile entry was merged by the ERC author on 2026-06-23 — and has multiple independent implementations. Records in this format are tamper-evident, carry their timestamp inside the signed payload, and can be verified offline by any third party — including a regulator or auditor — without trusting or contacting the operator that produced them.</p>

<p>Three properties distinguish the approach. <strong>Independence:</strong> multiple unaffiliated issuers can sign the same canonical record, so no single party — including the vendor — has to be trusted. <strong>Reproducibility:</strong> verification requires only the published specification and public keys; a reference verifier is a one-line install. <strong>Falsifiability:</strong> accuracy claims about the underlying verification pipeline are published against a public academic benchmark that anyone can re-run, with weak categories disclosed alongside strong ones.</p>

<p>The paper maps each subsection of Article 12 to the specific mechanism that addresses it, describes how an auditor verifies records in practice, and closes with the approach's honest limits: a signed record proves what a system recorded, who signed it, and when — it does not by itself make an AI system accurate, and it does not by itself make an organization compliant.</p>

<h2>1. The Compliance Evidence Problem</h2>

<h3>1.1 What Article 12 requires</h3>
<p>Article 12(1) of Regulation (EU) 2024/1689 requires that high-risk AI systems "technically allow for the automatic recording of events (logs) over the lifetime of the system." Article 12(2) requires that logging enable the identification of situations that may result in the system presenting a risk within the meaning of Article 79(1) or in a substantial modification; facilitate the post-market monitoring referred to in Article 72; and support the monitoring of operation referred to in Article 26(5). For the high-risk systems listed in Annex III, Article 12(3) additionally requires recording of the period of each use, the reference database against which input data has been checked, the input data for which the search has led to a match, and the identification of the natural persons involved in the verification of results as referred to in Article 14(5). Article 19 requires providers to keep these logs for a period appropriate to the intended purpose, of at least six months.</p>

<p>The Regulation is deliberately technology-neutral about how records are kept. It specifies what the records must enable — identification, monitoring, oversight — not the storage mechanism. That neutrality leaves open the question this paper addresses: which record-keeping architectures can actually serve as evidence when the record itself is questioned?</p>

<h3>1.2 Why conventional logs fall short as evidence</h3>
<p>Conventional application logs — structured or unstructured, local or centralized — share four structural weaknesses when treated as compliance evidence rather than as operational telemetry.</p>

<p>First, <strong>mutability.</strong> Ordinary log entries can be edited, rotated, truncated, or deleted by anyone with write access to the store, and the resulting record is indistinguishable from one that was never touched. Second, <strong>unbound time.</strong> A timestamp in a mutable record proves nothing about when the event actually occurred; it is simply another editable field. Third, <strong>unverifiable identity.</strong> "Reviewed by: jsmith" is a string, not a proof; any process with write access could have inserted it. Fourth — and most consequential for audit — <strong>trust dependence.</strong> A third party examining conventional logs has no way to confirm their integrity except to trust the organization that produced them. The evidence and the party whose conduct is being evidenced are the same party.</p>

<p>None of this means conventional logs are useless; they remain essential operational telemetry. The claim is narrower: where the purpose of a record is to prove something to a party who does not already trust you — a market surveillance authority, an auditor, a counterparty, a court — a record that cannot demonstrate its own integrity does not achieve that purpose. The gap Article 12 enforcement will expose is not the gap between organizations that log and organizations that do not. It is the gap between records that assert and records that prove.</p>

<h2>2. Requirements for Compliance-Grade Records</h2>

<p>Working backwards from the audit scenario — an unaffiliated examiner must be able to rely on the record — five requirements follow.</p>

<p><strong>Tamper-evidence.</strong> Any modification to a record after its creation must be detectable from the record itself, without reference to the operator's systems. <strong>Binding.</strong> The elements that matter — the input examined, the verdict reached, the evidence consulted, the time, the identity of each party that vouched for the result — must be sealed together in one unit, so that none can be swapped independently of the others. <strong>Independent verifiability.</strong> A third party must be able to confirm the record's integrity and origin using only public materials: a published format specification and published keys. Verification must work offline and must not require the operator's cooperation, availability, or continued existence. <strong>Issuer independence.</strong> A record vouched for only by the system that produced the output is self-attestation. Compliance-grade records should permit — and where stakes are high, should carry — signatures from parties independent of the operator. <strong>Enumerability and durability.</strong> Records must be storable, countable, and retrievable across the retention period as discrete artifacts, not reconstructed views over a mutable store.</p>

<p>These requirements are not exotic. Each corresponds to an existing, widely deployed open standard. The contribution of the architecture described below is not new cryptography; it is the assembly of standard parts into a record format designed for the audit scenario, published openly so that no single vendor is a dependency.</p>

<h2>3. A Standards-Track Architecture</h2>

<h3>3.1 Design principle: no proprietary trust</h3>
<p>Every component in the architecture is an open, published standard with multiple independent implementations. This is a compliance property, not only an engineering preference: an organization that adopts the format is not adopting a vendor. Any party can implement the specification, issue records, and verify records, using reference implementations published under the MIT license or their own independent code.</p>

<h3>3.2 Canonicalization: one payload, one byte sequence (RFC 8785)</h3>
<p>Digital signatures operate on bytes, and the same JSON object can be serialized into many different byte sequences. The JSON Canonicalization Scheme (JCS, RFC 8785) removes that ambiguity: it defines a single, deterministic byte representation for any JSON payload. Every receipt is canonicalized before signing, which yields a practical guarantee: independent implementations in different languages produce byte-identical canonical forms — and therefore identical hashes — for the same record. This has been demonstrated across parallel Node.js, Python, and browser implementations, each producing the same canonical bytes and the same SHA-256 digest for shared test vectors.</p>

<h3>3.3 Signatures and published keys (RFC 7515, RFC 8037, RFC 7517)</h3>
<p>Canonical bytes are signed as a JSON Web Signature (RFC 7515) using Ed25519 keys (RFC 8037). Each issuer publishes its public keys in a JSON Web Key Set (RFC 7517) at a well-known HTTPS location under its own domain. Verification is therefore a local computation: fetch the issuer's published keys once, then confirm any number of records offline. If a single byte of a record has changed since signing, verification fails.</p>

<h3>3.4 The verification.v0.3 receipt format</h3>
<p>The receipt format itself is defined in draft-krausz-verification-state, filed as an individual-submission Internet-Draft on the IETF Datatracker. (Internet-Drafts are working documents of the IETF; an individual submission is not an adopted working-group item or an RFC, and this paper does not claim otherwise. The relevance of the filing is that the format is publicly and normatively specified, versioned, and open to technical challenge.) A receipt binds, in one signed envelope: a hash of the claim or action examined; the evidence set consulted; a verdict — act, halt, or abstain — with associated confidence signals; the issuer's identity; and the timestamp. The verdict vocabulary is deliberately small. In particular, <em>halt</em> is a first-class outcome with its own signed receipt: a compliant system can prove not only what it allowed but what it refused, and when.</p>

<h3>3.5 Registry positioning</h3>
<p>Publicly announced in July 2026 (with registry scaffolding seeded the month prior), the author of ERC-8210 (Agent Assurance), a draft Ethereum standard under active community development, introduced a Receipt Profile Registry for evidence formats and registered verification.v0.3 as its first entry, citing draft-krausz-verification-state as the normative specification and two independent implementations (AgentOracle and AgentTrust) as meeting the registry's implementer threshold. The registry entry does not confer regulatory status; its significance is narrower and useful — the format is now citable by a stable, content-addressed identifier in a public registry maintained by an independent editor, which is the shape of reference that procurement and audit language can attach to.</p>

<h2>4. Multi-Issuer Composed Envelopes</h2>

<h3>4.1 The self-certification problem</h3>
<p>A verification record signed only by the party that produced the output is self-attestation, however sophisticated the machinery behind it. This remains true when the machinery is elaborate: an operator that runs several AI models internally and signs the consensus with its own single key has produced a more considered self-attestation, but a self-attestation nonetheless. The examiner's question — why should I believe this record? — still terminates at one organization and one key.</p>

<h3>4.2 Independent issuers over the same bytes</h3>
<p>The composed envelope addresses this structurally. Multiple unaffiliated issuers — separate organizations, separate infrastructure, separate published keys — each sign the same canonical bytes. In the current production composition, the issuers perform orthogonal checks rather than repeating one another: one issuer signs a claim-grounding verdict (was the factual claim supported by the cited sources?); a second, AgentTrust, signs a capability-scope verdict (was the action within the agent's authorized skills, tools, and endpoints?); a third, Presidio (a PII and content-screening service operated by PRESIDIO EOOD, <a href="https://presidio-group.eu">presidio-group.eu</a>), signs a screening verdict (does the content violate policy or leak personal data?). Because the checks are orthogonal, the failure modes are largely uncorrelated — three different ways of being wrong, rather than three votes from one room.</p>

<p>The composition rule is deliberately conservative. Under AND_PRESENT, the composed decision is <em>act</em> only if every gate present in the envelope is <em>act</em>; any single issuer's <em>halt</em> collapses the composed decision to <em>halt</em>. A published three-signer example demonstrates exactly this property: a payment action approved by both the grounding and capability gates was halted by the screening issuer's PII block, and the halt — with all three signatures over the same canonical bytes — is the signed, verifiable record.</p>

<h3>4.3 Current status, stated precisely</h3>
<p>Composed envelopes carrying two and three independent issuer signatures over identical canonical bytes have been published publicly and verify end-to-end against each issuer's published JWKS. The two-signer composition (AgentOracle and AgentTrust) is operationally live in production. In the published three-signer envelope, the third issuer's signature is produced against a fixed canonical payload rather than in the live request path; live wiring of the third leg is in progress. The third issuer's public key is already retrievable at <a href="https://screen.presidio-group.eu/.well-known/jwks.json">screen.presidio-group.eu/.well-known/jwks.json</a>, alongside the AgentOracle and AgentTrust JWKS. A publicly retrievable sample envelope, together with the recompute steps, is available so that any reader can perform the verification themselves rather than relying on this paper's description.</p>

<h3>4.4 Self-attested versus independently probed</h3>
<p>A useful distinction is emerging in the ecosystem between claims that are <em>self-attested</em> (asserted by the party they describe) and claims that are <em>independently probed</em> (checked by an unaffiliated party against the artifact itself). The composed envelope is an instrument for moving record-keeping from the first category to the second: each additional independent signer converts one more link in the chain from "trust me" to "check it."</p>

<h2>5. Independent Verification in Practice</h2>

<h3>5.1 The auditor's workflow</h3>
<p>Verification of a receipt requires no relationship with any issuer. The examiner obtains the record set from the organization under review, fetches each issuer's published JWKS over HTTPS, and recomputes locally: canonicalize the payload, hash it, and check each signature against the corresponding published key. A reference verifier is published on PyPI as <code>agentoracle-receipt-verify</code> under the MIT license; verification of an envelope is three lines of Python. The same verification can be implemented independently from the specification alone — the reference library is a convenience, not a dependency.</p>

<pre><code>pip install agentoracle-receipt-verify

from agentoracle_receipt_verify import verify
verify(envelope, jwks_by_issuer=...)   # offline; no issuer service required</code></pre>

<h3>5.2 Conformance and independent certification</h3>
<p>The specification repository publishes conformance test vectors — accept cases and deliberate reject cases (tampered signatures, mismatched composition rules, unresolvable references) — with parallel verifiers in Node.js and Python that must agree byte-for-byte. Independently of the vendor, the format's conformance vectors have been merged into argentum-core, an unaffiliated maintainer's specification repository, via pull request #33 — authored by Pote (poteshniy) of AgentTrust and merged 2026-07-16 — following byte-identical reproduction of the reference verifier's output across the at-001, at-002, and at-r01 conformance vectors: the first external conformant implementation of <code>verification.v0.3</code>. Separately, the format's records — canonical bytes, signatures, and on-chain anchor — have been independently recomputed by the operator of a public pre-action-governance conformance board, who published the recompute steps rather than accepting reported results. The purpose of citing these is not the authority of any particular repository or board; it is that the claim "these records verify" has been checked by parties with no stake in the answer, and that any reader can repeat the check.</p>

<h3>5.3 Optional on-chain anchoring: proving precedence</h3>
<p>Signatures prove integrity and origin; they do not, by themselves, prove that a record existed before a particular external event. For deployments where precedence matters — demonstrating that a verification verdict existed before the action's outcome, rather than being stamped retroactively — receipts can optionally be anchored to a public blockchain transaction. The anchor binds the record's hash into a transaction whose block timestamp is set by an external, operator-independent clock; strict precedence (anchor time earlier than outcome time) is then a recomputable boolean, not an assertion. This layer is optional and additive: receipts are complete evidence artifacts without it, and it is available where the audit posture warrants an external clock.</p>

<h3>5.4 Falsifiable accuracy claims</h3>
<p>Record integrity and verdict accuracy are different properties, and conflating them is a common failure of vendor claims in this space. The verification pipeline whose verdicts these receipts record is benchmarked against AVeriTeC (Schlichtkrull et al., NeurIPS 2023), a public academic fact-checking benchmark, scoring 57.6% overall on the 2024 development set (57.7% on a held-out split) against published paper baselines of roughly 30%. That figure is reported with the verdict mapping selected by inspection on the calibration half; retrieval recall is not reported and parametric-knowledge contamination is not controlled for, so it should be read as an internal baseline rather than a leaderboard result. Per-category results are published in full — 70.6% on Supported claims, 61.6% on Refuted, 27.3% on Not-Enough-Evidence, and 13.6% on Conflicting-Evidence — with the weak categories disclosed alongside the strong, reflecting a calibration that fails skeptical rather than falsely confident, which is the preferable failure mode for regulated content. The dataset, methodology, and harness are public under the MIT license, and the results can be re-run by any reader. The point of this disclosure is not the particular number; it is the epistemic posture. An accuracy claim that cannot be independently re-run is marketing. The record-keeping architecture described in this paper extends the same principle — verify, don't trust — from the records to the claims made about the system that produces them.</p>

<h2>6. Mapping to Article 12</h2>

<p>The table below maps each operative requirement of Article 12 to the property of conventional logging it strains against, and the mechanism by which signed receipts address it. The middle column describes what conventional logging categorically cannot prove, as a general observation about mutable log stores; it makes no assertion about any particular organization's practices.</p>

<table>
<thead>
<tr><th>Article 12 requirement</th><th>What conventional logging cannot prove</th><th>What signed receipts provide</th></tr>
</thead>
<tbody>
<tr>
<td><strong>Art. 12(1)</strong> — High-risk AI systems shall technically allow automatic recording of events (logs) over the lifetime of the system.</td>
<td>Ordinary logs can be edited or rotated after the fact. Nothing binds a log line to a specific system state at a specific time.</td>
<td>Cryptographically signed receipts are recorded per event over the full lifecycle. Each receipt is sealed at creation; any later modification breaks the signature.</td>
</tr>
<tr>
<td><strong>Art. 12(2)(a)</strong> — Logs shall enable identification of situations that may result in the system presenting a risk (Art. 79(1)) or in a substantial modification.</td>
<td>Risk classification is typically inferred after the fact from unstructured log context; no verdict is bound to the event itself.</td>
<td>A verdict field (act / halt / abstain) with confidence and evidence signals is recorded and signed on every event, enabling systematic identification of halt and abstain situations.</td>
</tr>
<tr>
<td><strong>Art. 12(2)(b)</strong> — Logs shall facilitate post-market monitoring (Art. 72).</td>
<td>Monitoring against mutable logs requires trusting the operator; a third party cannot independently verify the record set.</td>
<td>Receipts bind inputs, verdict, and signer identity into an enumerable record set that the provider, a deployer, or an unaffiliated third party can verify independently.</td>
</tr>
<tr>
<td><strong>Art. 12(2)(c)</strong> — Logs shall support monitoring of high-risk system operation (Art. 26(5)).</td>
<td>Standard logs do not detect tampering; nothing prevents silent post-hoc edits.</td>
<td>Canonicalization (RFC 8785) plus an Ed25519 signature means recomputation confirms nothing was altered after signing.</td>
</tr>
<tr>
<td><strong>Art. 12(3)(a)</strong> — Recording of the period of each use (start and end date/time). Applies to Annex III systems.</td>
<td>Timestamps in mutable logs are not cryptographically bound; an auditor cannot prove the recorded time is the actual time.</td>
<td>The timestamp is bound inside the signed envelope; because the payload is canonicalized before signing, altering the time breaks the signature. Optional on-chain anchoring proves the record existed before a given external clock reading.</td>
</tr>
<tr>
<td><strong>Art. 12(3)(b)–(c)</strong> — Recording of reference databases checked against, and input data leading to a match. Applies to Annex III systems.</td>
<td>Free-form log fields make source-and-match evidence difficult to enumerate and impossible to verify without trusting the operator.</td>
<td>The claim hash and evidence set are first-class receipt fields; sources consulted and match outcomes are part of the signed payload.</td>
</tr>
<tr>
<td><strong>Art. 12(3)(d)</strong> — Identification of the natural persons involved in verification of results (Art. 14(5)).</td>
<td>Reviewer identity in ordinary logs is at best a username string that anyone with write access could have inserted.</td>
<td>In a composed envelope, each verifying party — human-operated or automated — signs with its own published key. Identity is a cryptographic signature, not a string.</td>
</tr>
</tbody>
</table>

<p><strong>On retention:</strong> Article 19 requires providers to keep Article 12 logs for a period appropriate to the intended purpose of the system, of at least six months, subject to other Union or national law. Receipts are compact, self-contained JSON artifacts, which makes multi-year retention inexpensive where sector rules extend the baseline.</p>

<h2>7. Scope and Honest Limitations</h2>

<p>Signed records prove provenance, integrity, and time; they do not make the underlying AI system correct. A receipt demonstrates that a specific check produced a specific verdict at a specific moment and that no one has altered the record since — it does not guarantee the verdict was right. Verdict quality is an empirical property, which is why Section 5.4 insists that accuracy claims be benchmarked publicly and reproducibly rather than asserted.</p>

<p>Verdicts that rely on model judgment are probabilistic. Where a verification pipeline uses AI models to assess whether a claim is grounded, its verdicts inherit the models' error rates. A development direction worth naming — as direction, not as a shipped capability — is <em>deterministic-first resolution</em>: resolving claims by direct structural lookup against cited sources where possible, reserving model judgment for genuinely ambiguous cases, and disclosing in each receipt which resolution path produced the verdict. The specification work for this path is public; per-path accuracy figures will be published when the implementation lands, under the same reproducibility discipline as the existing benchmark.</p>

<p>Receipts address the evidence dimension of Article 12; they are not, by themselves, compliance. The AI Act imposes obligations well beyond record-keeping — risk management, data governance, human oversight, transparency, conformity assessment among them — and an organization's overall compliance posture is a legal question for qualified counsel. What a receipt architecture contributes is narrower and concrete: when the record-keeping obligation is tested, the records can prove themselves.</p>

<p>Finally, standards status should be stated plainly: draft-krausz-verification-state is an individual-submission Internet-Draft, not an RFC; ERC-8210 is a draft standard under community development, not a ratified one. The strength of the approach does not rest on regulatory endorsement of these documents. It rests on the fact that every constituent mechanism — JCS, JWS, Ed25519, published JWKS — is a mature, widely deployed open standard, and that every claim made about the implementation is publicly checkable.</p>

<h2>8. Implementation Considerations</h2>

<p><strong>Integration shape.</strong> The natural integration point is pre-action: the system submits a claim or intended action for verification, receives a signed verdict, and acts only on <em>act</em>. This produces the strongest records — including signed halts — because the verdict demonstrably preceded the action. Post-hoc recording of already-taken actions is also supported and still yields tamper-evident, independently verifiable records; it simply cannot prove the check came first unless anchoring (Section 5.3) is used.</p>

<p><strong>Storage and enumeration.</strong> Receipts are self-contained JSON documents, typically one to a few kilobytes. They can be retained in ordinary object storage, exported for an examiner as a directory of files, and verified in bulk with the reference tooling. No live service is required at verification time.</p>

<p><strong>Auditor experience.</strong> An examiner's requirements are the published specification, the issuers' JWKS URLs, and the record set. Everything else is local computation. Organizations preparing for these obligations can rehearse this: hand a colleague the records and the public materials, and confirm they can verify the set with no further assistance.</p>

<p><strong>For platforms and integrators.</strong> Because the format is openly specified with MIT-licensed reference implementations, platforms can issue conformant receipts under their own infrastructure and add independent co-signers where engagements warrant. Procurement and audit language can reference the profile rather than any vendor — for example: <em>"record-keeping implemented in conformance with the candidate receipt profile verification.v0.3 in the ERC-8210 Receipt Profile Registry, normatively specified in draft-krausz-verification-state."</em> Referencing the profile keeps the requirement vendor-neutral while remaining precise and testable.</p>

<h2>9. Conclusion</h2>

<p>Article 12 asks a question most logging infrastructure was never designed to answer: can your records prove themselves? Conventional logs assert; they cannot prove. The architecture described here — canonical bytes, published keys, small verdict vocabulary with <em>halt</em> as a first-class outcome, independent co-signers over identical bytes, optional external-clock anchoring, and accuracy claims that anyone can re-run — is assembled entirely from open standards so that adopting the record format never means trusting a vendor.</p>

<p>The underlying principle is older than the Regulation and will outlast it: evidence is what survives examination by someone who does not trust you. Records built to that standard satisfy more than a compliance checkbox — they change the character of the conversation with any examiner from assurance to demonstration. For high-risk AI systems building toward the December 2027 deadline — with records that must exist well before it — that is the difference worth engineering for.</p>

<h2>Acknowledgments</h2>

<p>The author thanks Pote (poteshniy) of <a href="https://agenttrust.uk">AgentTrust (agenttrust.uk)</a> for producing the first external byte-identical implementation of the <code>verification.v0.3</code> composed-envelope format. That implementation was merged into argentum-core — an unaffiliated maintainer's specification repository — as pull request #33 on 2026-07-16, regenerating the at-001, at-002, and at-r01 conformance fixtures and confirming byte-identical reproduction of the reference verifier's output. AgentTrust separately maintains its own compose and sign implementation of <code>verification.v0.3</code>, independent of the reference implementation; that independent re-implementation is the reason the claim "the format is publicly and normatively specified, versioned, and open to technical challenge" (§3.4) is not self-referential. AgentTrust's capability-scope signing additionally operates as the co-signer in the two-signer production composition described in §4.</p>

<h2>References</h2>
<ol class="refs">
  <li><span class="num">[1]</span> Regulation (EU) 2024/1689 (Artificial Intelligence Act), Articles 12, 14(5), 19, 26(5), 72, 79(1), and Annex III. Official Journal of the European Union.</li>
  <li><span class="num">[2]</span> Krausz, J. "The verification.* Constraint Family: Pre-Action Fail-Closed Gates for AI Agent Decisions," IETF Internet-Draft draft-krausz-verification-state-01 (individual submission). <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/">datatracker.ietf.org/doc/draft-krausz-verification-state/</a></li>
  <li><span class="num">[3]</span> ERC-8210: Agent Assurance — Receipt Profile Registry, entry verification.v0.3, status candidate (<a href="https://github.com/wangbin9953/erc8210-aap/pull/4">merged 2026-06-23</a>). Discussion: <a href="https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097">ethereum-magicians.org/t/erc-8210-agent-assurance/28097</a></li>
  <li><span class="num">[4]</span> RFC 8785 — JSON Canonicalization Scheme (JCS).</li>
  <li><span class="num">[5]</span> RFC 7515 — JSON Web Signature (JWS); RFC 7517 — JSON Web Key (JWK); RFC 8037 — CFRG Elliptic Curve Signatures in JOSE (Ed25519).</li>
  <li><span class="num">[6]</span> Schlichtkrull, M., Guo, Z., Vlachos, A. "AVeriTeC: A Dataset for Real-world Claim Verification with Evidence from the Web," Advances in Neural Information Processing Systems 36 (NeurIPS 2023), Datasets and Benchmarks Track.</li>
  <li><span class="num">[7]</span> AgentOracle evaluation harness and benchmark results (MIT license). <a href="https://github.com/TKCollective/agentoracle-eval-harness">github.com/TKCollective/agentoracle-eval-harness</a> and <a href="https://github.com/TKCollective/agentoracle-benchmark">github.com/TKCollective/agentoracle-benchmark</a></li>
  <li><span class="num">[8]</span> AgentOracle receipt specification, conformance vectors, and reference verifiers (MIT license). <a href="https://github.com/TKCollective/agentoracle-receipt-spec">github.com/TKCollective/agentoracle-receipt-spec</a></li>
  <li><span class="num">[9]</span> agentoracle-receipt-verify — reference verifier (Python, MIT license). <a href="https://pypi.org/project/agentoracle-receipt-verify/">pypi.org/project/agentoracle-receipt-verify/</a></li>
  <li><span class="num">[10]</span> Live sample envelope and recompute steps: <a href="https://agentoracle.co">agentoracle.co</a> ("Verify it yourself") and <a href="https://agentoracle.co/benchmarks">agentoracle.co/benchmarks</a></li>
</ol>

<div class="author-box">
  <h3>About the author</h3>
  <p style="margin-bottom:0">Joe Krausz is the founder of AgentOracle (TK Collective LLC), author of draft-krausz-verification-state, and contributor of the <a href="https://github.com/wangbin9953/erc8210-aap/pull/4">first candidate profile entry</a> in the ERC-8210 Receipt Profile Registry. AgentOracle provides pre-action factual-claim verification for AI systems, with signed receipts in the format this paper describes. Contact: <a href="mailto:joe@agentoracle.co">joe@agentoracle.co</a>.</p>
</div>

</main>

<footer class="bottom">
  <div class="container">
    <div>AgentOracle · TK Collective LLC · <a href="/">agentoracle.co</a></div>
    <div style="margin-top:6px">
      <a href="/whitepaper.pdf">Download PDF</a> · <a href="/article-12">Article 12 Tool</a> · <a href="/benchmarks">Benchmarks</a> · <a href="/receipt-registry">Receipt Registry</a>
    </div>
  </div>
</footer>

</body>
</html>`;
