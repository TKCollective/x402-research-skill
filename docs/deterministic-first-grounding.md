# Deterministic-first grounding path — design spec

Status: spec only, not yet implemented. This document defines how AgentOracle's `/v1/v_gate` grounding leg should evolve from "always invoke an LLM" to "structural lookup first, LLM second, both paths produce signed receipts that disclose which path resolved the verdict."

## Why this matters

AgentOracle's current grounding leg invokes an LLM-backed pipeline for every claim. That works, but it has two consequences we should fix:

1. **The "we use an LLM too" question.** Asked honestly, a single-issuer multi-LLM panel and a single-issuer single-LLM grounding leg have the same structural property: the verifier evaluates its own input with its own model and signs its own verdict. Our cross-issuer composition (`v_gate` + `v_gate_skill` + `screen_ref`) blunts this concern at the composed-envelope level, but our `v_gate` leg alone is still a single-LLM signed verdict.
2. **Latency and cost.** LLM inference is the dominant cost and latency in `/v1/v_gate` today. Most factual claims do not require LLM inference at all — they require structural lookup against cited sources.

The deterministic-first path closes both gaps. Most verdicts become deterministic. The LLM tier becomes the small slice where probabilistic judgment is unavoidable. Both paths produce signed receipts that explicitly disclose which path resolved the verdict and at what calibrated confidence.

## Claim taxonomy

The path-of-resolution depends on claim shape. We expect roughly the following distribution on a typical agent workload (calibrated against AVeriTeC dev set):

| Claim shape | Example | Path |
|---|---|---|
| Structural field lookup | "patient HbA1c is 7.2 per EHR record #4421" | deterministic |
| Numerical comparison | "Q3 revenue exceeded Q2 revenue" | deterministic (compare two looked-up values) |
| Set membership | "drug X is on the formulary" | deterministic |
| Range check | "interest rate is between 4.5% and 5.0%" | deterministic |
| Citation existence | "RFC 8785 §3.2.2.3 specifies ECMAScript number serialization" | deterministic (cited URL fetched + section matched) |
| Multi-hop inference | "based on labs A and B, patient is at elevated risk" | probabilistic (LLM) |
| Free-text grounding | "the news article supports the claim that ..." | probabilistic (LLM) |
| Conflicting evidence | "sources disagree on the population of city X" | probabilistic (LLM, with explicit conflict signal) |
| Not-enough-evidence | "no source reports the figure" | probabilistic (LLM, with explicit NEE signal) |

The first five categories should resolve deterministically with near-100% accuracy when the cited source is reachable and the field is present. The probabilistic categories carry AgentOracle's existing AVeriTeC accuracy profile.

## API surface — proposed additions to the `v_gate` block

The `v_gate` sibling block grows two fields. Both are non-breaking additions to the existing schema.

```jsonc
{
  "v_gate": {
    "issuer": "agentoracle.co",
    "mapping_id": "agentoracle-v0.3-2026-05-30",
    "mapping_hash": "sha256-...",
    "verdict": "act",
    "signed_at": "2026-06-25T22:14:00Z",
    "confidence": 0.99,

    // NEW — discloses which path resolved the verdict.
    "resolution_path": "deterministic" | "probabilistic" | "hybrid",

    // NEW — present only when resolution_path is deterministic or hybrid.
    // Names the structural check or set of checks that produced the verdict.
    "deterministic_check": {
      "kind": "field_lookup" | "comparison" | "set_membership" | "range" | "citation_existence",
      "source_uri": "https://...",
      "source_hash": "sha256-...",                 // hash of the fetched source as-of resolution
      "field_path": "$.patient.labs.hba1c",        // JSONPath / JMESPath / CSS / XPath as appropriate
      "expected_value": "7.2",
      "observed_value": "7.2",
      "match": true
    }
  }
}
```

When `resolution_path` is `probabilistic`, `deterministic_check` is absent and the existing LLM-backed pipeline produced the verdict — same as today.

When `resolution_path` is `hybrid`, both ran: deterministic lookup succeeded AND probabilistic re-check confirmed. The `confidence` is the joint score.

Verifiers ignore unknown fields (per JWS general serialization rules), so existing clients see no breakage.

## Resolution algorithm

```
function resolve(claim, citation):
    1. Parse the claim into structured form.
       - If parser fails -> resolution_path = "probabilistic", run LLM.
    2. Attempt to fetch the citation source. Hash the bytes.
       - If fetch fails or source is unreachable -> "probabilistic", run LLM.
    3. Classify the structured claim against the taxonomy.
       - Field lookup, comparison, set membership, range, citation existence.
       - If none match -> "probabilistic", run LLM.
    4. Execute the deterministic check.
       - If check returns match -> verdict = "act", confidence = 0.99,
         deterministic_check populated.
       - If check returns mismatch -> verdict = "halt", confidence = 0.99,
         deterministic_check populated.
       - If check is inconclusive -> escalate to "hybrid": run LLM as
         secondary, take the LLM verdict, mark resolution_path = "hybrid".
    5. Sign the verdict block and return.
```

Step 3's classifier is itself deterministic — pattern-matching on structured claim shape. No LLM in the classifier.

## What this changes about AVeriTeC

The AVeriTeC dataset is labelled into four categories: Supported / Refuted / Not Enough Evidence / Conflicting Evidence. Mapping the per-category accuracy we publish today onto the deterministic-first path:

| AVeriTeC label | Expected path under deterministic-first |
|---|---|
| Supported | Mostly deterministic if the cited source resolves; remainder probabilistic |
| Refuted | Same — deterministic when the value lookup disagrees with the claim |
| Not Enough Evidence | Probabilistic. Deterministic lookup that returns "field not present" maps to NEE only when classified properly. |
| Conflicting Evidence | Probabilistic by definition — multiple sources, no single check resolves. |

We should re-run the harness after implementation and publish two new columns:

| Label | Overall accuracy | Deterministic accuracy | Probabilistic accuracy | % resolved deterministically |
|---|---|---|---|---|
| Supported | X% | Y% | Z% | N% |
| Refuted | X% | Y% | Z% | N% |
| Not Enough Evidence | X% | Y% | Z% | N% |
| Conflicting Evidence | X% | Y% | Z% | N% |

The deterministic accuracy should be at or near 100% for the slice it resolves — by construction, a structural field-match is right when the field is present and matches, and wrong when the field is present and doesn't match. The probabilistic accuracy on the remaining slice is the existing AVeriTeC number.

This gives every claim a calibrated confidence with an explicit source. The receipt no longer says "trust us, an LLM looked at it." It says "the field at JSONPath $.patient.labs.hba1c in the source at https://... with hash sha256-... reads 7.2, claimed value is 7.2, match=true."

## Latency impact

Deterministic resolution is bounded by source-fetch latency, not LLM inference. For sources with low-latency public endpoints (FHIR servers, structured JSON APIs, public datasets) a deterministic verdict resolves in approximately the same time as a single HTTP round-trip. That should land in the 100-300 ms range — substantially below the LLM-tier pipeline today.

Probabilistic verdicts continue to carry the existing LLM-tier latency. The mix shift to mostly-deterministic on real agent workloads is where the latency win lives.

## Conformance fixtures

The composed envelope conformance suite (TKCollective/agentoracle-receipt-spec) must be extended with two new accept vectors:

- `det-001` — deterministic path, field-lookup match, verdict=act, full `deterministic_check` block populated.
- `det-002` — deterministic path, field-lookup mismatch, verdict=halt, full block populated.

And one new reject vector:

- `det-r01` — `resolution_path: "deterministic"` declared but `deterministic_check` block absent. Verifiers must reject.

Both verifiers (Node + Python) must accept the new vectors byte-identically.

## Risks and edge cases

1. **Source mutability.** Cited sources can change between resolution and verification. The `source_hash` field captures the bytes at resolution time — verifiers SHOULD re-fetch and compare hashes when possible, and SHOULD accept hash mismatches with a warning, not a hard reject. The deterministic check is a snapshot, not a continuous claim.
2. **Adversarial citations.** A bad-faith agent can cite a source it controls. The deterministic path doesn't escape this — it shifts the trust assumption from "the agent's reasoning is correct" to "the cited source is what it claims to be." This is a strictly lower trust requirement, not a free lunch. Downstream policy may require AO to only accept citations from a trusted source allowlist for high-stakes verdicts.
3. **Classifier errors.** A claim that should be deterministic but gets misclassified as probabilistic produces a strictly worse verdict (LLM tier instead of high-confidence structural). The reverse — probabilistic misclassified as deterministic — produces a false-confident verdict. The classifier must be conservative: when in doubt, route to probabilistic.

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 | This spec doc | shipped |
| 1 | Implement classifier + field-lookup + comparison checks | scoped, not started |
| 2 | Add set-membership + range + citation-existence checks | scoped, not started |
| 3 | Hybrid mode + escalation logic | scoped, not started |
| 4 | AVeriTeC re-run with per-path columns | depends on Phase 1+2 |
| 5 | Conformance fixture extensions (det-001/002/r01) | depends on Phase 1 |

## Open questions for review

1. Should `resolution_path` be a normative field in `draft-krausz-verification-state-02`, or kept as an AgentOracle-issuer extension only? Either is defensible; the standardization case is stronger if AgentTrust and Presidio also want a deterministic option.
2. Should the `source_hash` field be required when `resolution_path != "probabilistic"`, or just SHOULD? Required is cleaner; SHOULD is more pragmatic for sources that don't return stable bytes.
3. Should the classifier itself be open-source from day one? Probably yes — same posture as the conformance suite. Anyone can inspect what gets routed where.

This document is the design under review. Implementation work has not begun.
