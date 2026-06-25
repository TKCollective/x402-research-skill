# Deterministic-first grounding — Phase 1

Spec: [`/docs/deterministic-first-grounding.md`](../docs/deterministic-first-grounding.md)

Status: **scaffold + correctness suite landed. Not yet wired into `/v1/v_gate`.**

## What's here

| File | Role |
|---|---|
| `classifier.js` | Maps a structured claim to one of six kinds (or routes to probabilistic). No LLM. Conservative: when in doubt, escalate. |
| `field_lookup.js` | Fetch cited source → hash → resolve dotted/JSONPath-lite selector → compare to expected value → return resolved/escalate. |
| `comparison.js` | Fetch cited source → resolve two field paths → coerce to numbers → apply numeric operator → return resolved/escalate. |
| `test_vectors/vectors.json` | 30 hermetic test vectors covering positive, negative, escalate, and edge cases. |
| `run_tests.mjs` | In-process test runner with mocked fetch. Zero real network. Exit 0 on full pass, 1 on any failure. |

## Why this exists

AgentOracle's current `/v1/v_gate` grounding leg always invokes an LLM. That works, but it has two consequences worth fixing:

1. Most factual claims don't actually need an LLM. "HbA1c is 7.2 per the EHR" should be resolved by structural field lookup — fetch the source, look at the field, compare. No language model required.
2. The "you use an LLM too" question carries weight at the single-issuer level. Mixed deterministic + probabilistic resolution with explicit path disclosure on every receipt removes the ambiguity: a verifier that says "I checked field X in source Y at hash Z and observed value matches" is structurally different from a verifier that says "an LLM looked at this and signed off."

The end state: most verdicts resolve deterministically with near-100% accuracy. The LLM tier handles the small fuzzy slice with the existing AVeriTeC accuracy profile. Every receipt's `v_gate` block discloses `resolution_path: deterministic | probabilistic | hybrid` and, when deterministic, the exact check that produced the verdict.

## Acceptance bar

This module sits on the **same correctness bar as the conformance suite**: a deterministic check that's subtly wrong is worse than no deterministic check. Every claim shape that doesn't unambiguously resolve must escalate to probabilistic — never produce a confident verdict in the presence of ambiguity.

The test suite (`run_tests.mjs`) enforces this. Each vector either passes exactly, or the suite fails. No flaky checks, no tolerated drift.

## Run the tests

```sh
node deterministic_grounding/run_tests.mjs
```

Expected output:

```
PASS: 30 vectors (13 classifier, 12 field_lookup, 5 comparison)
```

## What Phase 1 covers

- `field_lookup` — single field, single expected value, equality with conservative cross-type coercion (number ↔ numeric-string, boolean ↔ "true"/"false")
- `comparison` — two paths, numeric operator (`==`, `!=`, `<`, `<=`, `>`, `>=`)
- Classifier validation for: `field_lookup`, `comparison`, `range`, `set_membership`, `citation_existence`, `probabilistic`

## What Phase 2 covers (not in this PR)

- `range` resolver (Phase 1 classifier accepts it; resolver not built)
- `set_membership` resolver (same)
- `citation_existence` resolver (same — requires HTML/PDF section matching, deferred)
- Hybrid mode: deterministic + probabilistic dual-resolution with calibrated confidence

## Wiring plan (Phase 1 → `/v1/v_gate`)

The Phase 1 modules are pure functions and a runner. They are **not yet wired** into `evaluateVerdict` in `v_gate_compose.js`. The wiring step is intentionally separate so it can be reviewed on its own:

1. `evaluateVerdict` accepts `{claim_hash, mcp_content, structured_claim?}`.
2. When `structured_claim` is present, call `classify(structured_claim)`.
3. If `kind` is `field_lookup`, call `fieldLookup`. If `comparison`, call `comparison`. Otherwise → probabilistic path (existing LLM tier).
4. If the deterministic call returns `status: "resolved"`, populate `v_gate.resolution_path = "deterministic"` and embed the `deterministic_check` block.
5. If `status: "escalate"`, fall through to the probabilistic path; `v_gate.resolution_path = "probabilistic"`.

The wiring is the next commit. This commit lands the modules and the test suite — the foundation — so the wiring is built on top of code that is verifiably correct.

## Per-path numbers

When wired, the AVeriTeC harness will be re-run and the `/benchmarks` page will gain two columns per category:

- accuracy on the slice that resolved deterministically (expected near-100% by construction)
- accuracy on the slice that escalated to probabilistic (expected near the existing 57.6% headline)
- the % of claims that resolved deterministically per category

This is the per-path disclosure that makes the "most verdicts don't use an LLM" story checkable rather than asserted.

## Hard rules

- **Conservative classification.** Any ambiguity → probabilistic. The cost of escalating a deterministic-eligible claim is one LLM call. The cost of resolving a probabilistic-eligible claim as deterministic is a confidently-wrong verdict. Asymmetric. Always escalate.
- **No silent coercion.** Cross-type comparisons are explicit (number ↔ numeric-string, boolean ↔ "true"/"false"). Object/array observed values always escalate.
- **Source-bytes hash always captured** when status is `resolved`. The receipt names the bytes that produced the verdict.
- **No real network in tests.** Suite must be hermetic. Any test that depends on external network is rejected.

## Open questions for review

These were flagged in the design spec and are not closed in Phase 1:

1. Should `resolution_path` be a normative field in `draft-krausz-verification-state-02`, or kept as an issuer extension? (Probably normative if AT and Presidio also expose a deterministic option.)
2. Should `source_hash` be MUST or SHOULD for `resolution_path != "probabilistic"`? (Probably MUST; pragmatic case for SHOULD on sources that don't return stable bytes.)
3. Allowlisted-citation-sources for high-stakes verdicts — config or policy? (Probably config, per-issuer.)
