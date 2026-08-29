// receipt-registry-page.js
// Backup canonical URL for the verification.v0.3 Receipt Profile Registry entry.
// Substance mirrors the drafted Ethereum Magicians reply to Post 46. Lives on
// AO's own turf so Jacky (or anyone) can link to the substance while the
// Discourse account-hold clears, and remains a canonical reference thereafter.

export const RECEIPT_REGISTRY_PAGE_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>verification.v0.3 in the ERC-8210 Receipt Profile Registry — AgentOracle</title>
<meta name="description" content="Issuer-side implementation details for verification.v0.3, the first candidate profile entry in the ERC-8210 Receipt Profile Registry.">
<link rel="icon" type="image/png" href="/assets/ao-logo-v8.png">
<link rel="apple-touch-icon" href="/assets/ao-logo-v8.png">
<style>
  :root {
    --bg: #070706; --surface: #0f1114; --surface-alt: #14171b;
    --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.16);
    --text: #eef1f4; --text-muted: #9ba3ab; --gold: #c9a96e; --gold-hover: #d8bb85;
    --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; background: var(--bg); color: var(--text); font-family: var(--font-sans); line-height: 1.65; -webkit-font-smoothing: antialiased; }
  a { color: var(--gold); text-decoration: none; }
  a:hover { color: var(--gold-hover); text-decoration: underline; }
  code { font-family: var(--font-mono); font-size: 0.92em; background: var(--surface-alt); padding: 1px 6px; border-radius: 3px; }
  pre { background: var(--surface-alt); border: 1px solid var(--border); padding: 14px 16px; border-radius: 8px; overflow-x: auto; font-family: var(--font-mono); font-size: 13px; line-height: 1.55; }
  pre code { background: transparent; padding: 0; }

  .nav { position: sticky; top: 0; z-index: 20; background: rgba(7,7,6,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
  .nav__brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; letter-spacing: 0.02em; }
  .nav__brand-mark { width: 24px; height: 24px; border-radius: 4px; background: var(--gold); color: #000; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 800; font-size: 12px; }
  .nav__back { font-size: 13px; color: var(--text-muted); }

  .container { max-width: 820px; margin: 0 auto; padding: 60px 24px 120px; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border: 1px solid rgba(201,169,110,0.35); border-radius: 999px; color: var(--gold); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 22px; }
  .eyebrow::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }

  h1 { font-size: 44px; line-height: 1.1; letter-spacing: -0.02em; font-weight: 700; margin: 0 0 20px; }
  h1 em { font-style: normal; color: var(--gold); }
  h2 { font-size: 24px; margin: 40px 0 14px; letter-spacing: -0.01em; }
  h3 { font-size: 17px; margin: 28px 0 8px; }
  .lede { font-size: 17px; color: var(--text-muted); max-width: 720px; margin: 0 0 32px; }
  .lede strong { color: var(--text); }

  .attribution { padding: 18px 22px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin: 28px 0; font-size: 15px; }
  .attribution strong { color: var(--gold); }

  ul { padding-left: 22px; }
  li { margin-bottom: 8px; }

  .four-links { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 20px 0; }
  .four-links a { display: flex; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; text-decoration: none; align-items: center; gap: 12px; }
  .four-links a:hover { border-color: var(--gold); }
  .four-links__label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); min-width: 36px; }
  .four-links__title { font-weight: 600; color: var(--text); font-size: 15px; }
  .four-links__desc { color: var(--text-muted); font-size: 13px; margin-top: 2px; }

  .footer-note { margin-top: 60px; padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; font-size: 14px; color: var(--text-muted); }
  .footer-note a { color: var(--gold); }
</style>
</head>
<body>
  <nav class="nav">
    <a href="/" class="nav__brand" style="text-decoration:none;"><span class="nav__brand-mark">AO</span><span>AgentOracle</span></a>
    <div class="nav__links" style="display:flex;gap:22px;align-items:center;font-size:14px;">
      <a href="/#how-it-works" style="color:#a49a82;text-decoration:none;">The loop</a>
      <a href="/#proof" style="color:#a49a82;text-decoration:none;">Proof</a>
      <a href="/#pricing" style="color:#a49a82;text-decoration:none;">Pricing</a>
      <a href="/whitepaper" style="color:#a49a82;text-decoration:none;">Whitepaper</a>
      <a href="/changelog" style="color:#a49a82;text-decoration:none;">Changelog</a>
    </div>
  </nav>

  <main class="container">
    <span class="eyebrow">Standards \u00b7 Receipt Profile Registry</span>
    <h1><em>verification.v0.3</em> — issuer-side implementation.</h1>
    <p class="lede">Issuer-side implementation details for <strong>verification.v0.3</strong>, the first candidate profile entry in the <a href="https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097/46">ERC-8210 Receipt Profile Registry</a> (<a href="https://github.com/wangbin9953/erc8210-aap/pull/4">entry merged 2026-06-23</a>) introduced by <a href="https://ethereum-magicians.org/u/jackywang">Jacky Wang</a> in the ERC-8210 v2 Progress Update on 2026-07-05.</p>

    <div class="attribution">
      <strong>Attribution.</strong> The registry itself is maintained by <a href="https://ethereum-magicians.org/u/jackywang">@wangbin9953</a> (independent ERC-8210 editor, agent.tech). AgentOracle contributed the first profile entry via <a href="https://github.com/wangbin9953/erc8210-aap/pull/4" target="_blank" rel="noopener noreferrer">PR #4 ↗</a> (merged 2026-06-23 by the ERC author). Two independent issuers produce conformant receipts against the profile: AgentOracle and AgentTrust — meeting the registry\u2019s two-implementer threshold for elevating a pattern.
    </div>

    <h2>Where verification.v0.3 is produced</h2>
    <p>The reference implementation of the profile lives at <a href="https://github.com/TKCollective/agentoracle-receipt-spec/tree/main/examples/v0.3-composed">TKCollective/agentoracle-receipt-spec</a>, under <code>examples/v0.3-composed/</code>. It carries the full deterministic build (<code>build_fixtures.py</code>), three published JWKS (AgentOracle + AgentTrust + Presidio), and both accept and reject vectors as detached JWS files. Byte-identical rebuilds from a cold clone are part of the intended workflow \u2014 the spec assumes recompute discipline, not trust.</p>

    <h2>Multi-issuer composition</h2>
    <p>A single envelope carries up to three signer slots today:</p>
    <ul>
      <li><code>v_gate</code> \u2014 AgentOracle\u2019s independent verifier</li>
      <li><code>v_gate_skill</code> \u2014 AgentTrust\u2019s independent verifier (AgentTrust runs its own <code>/v1/compose</code> endpoint against the same canonical bytes; adapter merged into <a href="https://github.com/babyblueviper1/preaction-governance-conformance/pull/2">babyblueviper1/preaction-governance-conformance PR #2</a> on 2026-07-04)</li>
      <li><code>screen_ref</code> \u2014 Presidio\u2019s screen leg (three-signer JWS on live bytes demonstrated in <a href="https://github.com/x402-foundation/x402/issues/2332">x402-foundation/x402 #2332</a>, 2026-06-28)</li>
    </ul>
    <p>Composition rule is <code>AND_PRESENT</code> \u2014 every present slot must recompute, or the composed decision halts. Conformance for that halt is <code>comp-006</code> in the composed fixture set.</p>

    <h2>Conformance vectors, independent registry</h2>
    <p>Both issuers\u2019 conformance suites are landed in <a href="https://github.com/giskard09/argentum-core">giskard09/argentum-core</a>:</p>
    <ul>
      <li><strong>AgentTrust conformance</strong>: <a href="https://github.com/giskard09/argentum-core/pull/28">PR #28</a>, merged 2026-07-02.</li>
      <li><strong>Presidio <code>decision_ref</code> vectors</strong>: <a href="https://github.com/giskard09/argentum-core/pull/29">PR #29</a>, merged 2026-06-30. See <a href="https://github.com/giskard09/argentum-core/blob/main/examples/conformance/presidio/presidio-x402-decision-ref-v1.fixture.json"><code>presidio-x402-decision-ref-v1.fixture.json</code></a> for the three vectors (accept + <code>signer-equals-runtime</code> reject + <code>verdict-not-recomputable</code> reject).</li>
    </ul>
    <p>Both were independently recompute-graded by <a href="https://github.com/babyblueviper1">@babyblueviper1</a> before merge \u2014 the two-implementers threshold is grounded in that cross-implementation verification, not in issuer self-attestation.</p>

    <h2>Verification tooling</h2>
    <p>Byte-identical verifiers across three languages:</p>
    <ul>
      <li><strong>Node:</strong> <code>verify_node.mjs</code> in the reference repo (jose)</li>
      <li><strong>Python:</strong> <code>pip install agentoracle-receipt-verify</code> \u2014 <a href="https://pypi.org/project/agentoracle-receipt-verify/">pypi.org/project/agentoracle-receipt-verify/</a>, live since 2026-07-02</li>
      <li><strong>Browser:</strong> WebCrypto-only bundle, same JCS + Ed25519 semantics</li>
    </ul>
    <p>All three consume the same JWKS files and produce the same canonical hash byte-for-byte, so a receipt can be verified anywhere the client can compute SHA-256 + Ed25519. No AgentOracle service required to verify an AgentOracle receipt.</p>

    <h2>Normative spec</h2>
    <p>The profile references IETF <a href="https://datatracker.ietf.org/doc/draft-krausz-verification-state/"><code>draft-krausz-verification-state-01</code></a> for the on-wire semantics (act/halt verdict, canonicalization, signer binding). The draft is an individual submission at <code>I-D Exists</code>; feedback in the Datatracker or through the registry PR path is welcome.</p>

    <h2>Canonical URLs (as delivered to Jacky)</h2>
    <div class="four-links">
      <a href="https://github.com/TKCollective/agentoracle-receipt-spec/tree/main/examples/v0.3-composed">
        <span class="four-links__label">(a)</span>
        <span>
          <span class="four-links__title">/v1/compose reference implementation</span>
          <div class="four-links__desc">Spec + fixtures + build script + three JWKS</div>
        </span>
      </a>
      <a href="https://github.com/giskard09/argentum-core/pull/28">
        <span class="four-links__label">(b)</span>
        <span>
          <span class="four-links__title">argentum-core PR #28</span>
          <div class="four-links__desc">AgentTrust conformance, merged 2026-07-02</div>
        </span>
      </a>
      <a href="https://github.com/giskard09/argentum-core/pull/29">
        <span class="four-links__label">(c)</span>
        <span>
          <span class="four-links__title">argentum-core PR #29</span>
          <div class="four-links__desc">Presidio decision_ref vectors, merged 2026-06-30</div>
        </span>
      </a>
      <a href="https://pypi.org/project/agentoracle-receipt-verify/">
        <span class="four-links__label">(d)</span>
        <span>
          <span class="four-links__title">agentoracle-receipt-verify on PyPI</span>
          <div class="four-links__desc">Python verifier, byte-identical to Node and browser siblings</div>
        </span>
      </a>
    </div>

    <h2>On the two open questions from ERC-8210 Post 46</h2>
    <h3>Q4 \u2014 multi-issuer envelope citation strategy</h3>
    <p>Direction B (protocol-neutral prose in Rationale, registry as the naming mechanism) reads cleanly from the issuer side. The registry is content-addressed on <code>keccak256(profile_identifier)</code>, so the identifier itself is the citation \u2014 subsequent profile entries won\u2019t require ERC revisions to be reachable. Registry-first stays honest as the profile set grows.</p>
    <h3>Q2 \u2014 behavioral similarity as a fifth independence category</h3>
    <p>No strong opinion. If it lands as a non-breaking extension in <code>IIndependenceSignal</code>, verification.v0.3 wouldn\u2019t need any changes to accommodate it \u2014 the profile is independence-model agnostic.</p>

    <div class="footer-note">
      <p><strong>About this page.</strong> This URL exists as a canonical home for the substance of the issuer-side implementation reply drafted for the <a href="https://ethereum-magicians.org/t/erc-8210-agent-assurance/28097/46">ERC-8210 v2 Progress Update thread</a>. The Ethereum Magicians reply itself lands under Post 47 once account review clears (Discourse spam-heuristic hold, standard procedure). Everything above is drawn from public artifacts; every link resolves.</p>
      <p><strong>Contact.</strong> AgentOracle (TK Collective LLC) \u00b7 <a href="mailto:joe@agentoracle.co">joe@agentoracle.co</a> \u00b7 <a href="https://agentoracle.co">agentoracle.co</a></p>
    </div>
  </main>
</body>
</html>`;
