// ═══════════════════════════════════════════════════════════════════
//  classifier.js — Phase 1 deterministic-grounding claim classifier
//
//  Maps a structured claim to one of:
//    - 'field_lookup'         a cited source has a field that matches a value
//    - 'comparison'           two looked-up values, compared by an operator
//    - 'range'                a looked-up value falls in a numeric range
//    - 'set_membership'       a value belongs to (or is absent from) a set
//    - 'citation_existence'   a cited document contains a specified section
//    - 'probabilistic'        none of the above; route to LLM tier
//
//  The classifier is itself deterministic — no LLM. Conservative: when in
//  doubt, route to probabilistic. False routing to deterministic is a
//  worse failure than false routing to probabilistic (confident-wrong
//  vs. expensive-right).
//
//  Spec: /docs/deterministic-first-grounding.md
// ═══════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} StructuredClaim
 * @property {string} kind                  declared shape — caller hint, optional
 * @property {string} [source_uri]          URI of the cited source
 * @property {string} [field_path]          JSONPath / JMESPath / dotted selector
 * @property {string|number|boolean} [expected_value]
 * @property {Array<string>} [field_paths]  for comparison: [left, right]
 * @property {string} [operator]            ==  !=  <  <=  >  >=  in  not_in  contains  exists
 * @property {[number,number]} [range]      for range kind
 * @property {Array<string|number>} [set]   for set_membership kind
 * @property {string} [section]             for citation_existence
 */

const SUPPORTED_KINDS = new Set([
  "field_lookup",
  "comparison",
  "range",
  "set_membership",
  "citation_existence",
]);

const NUMERIC_OPERATORS = new Set(["==", "!=", "<", "<=", ">", ">="]);
const SET_OPERATORS = new Set(["in", "not_in"]);

/**
 * classify(claim) → { kind, reason } | { kind: 'probabilistic', reason }
 *
 * Caller MAY hint `claim.kind`; the classifier validates the hint against
 * the claim's actual structural shape. If the hint contradicts the shape,
 * the claim is routed to probabilistic — the hint is not authoritative.
 */
function classify(claim) {
  if (!claim || typeof claim !== "object") {
    return { kind: "probabilistic", reason: "claim_not_object" };
  }

  // ── citation_existence ──────────────────────────────────────────
  if (claim.kind === "citation_existence" || claim.section) {
    if (typeof claim.source_uri !== "string" || !claim.source_uri) {
      return { kind: "probabilistic", reason: "citation_existence_missing_source_uri" };
    }
    if (typeof claim.section !== "string" || !claim.section) {
      return { kind: "probabilistic", reason: "citation_existence_missing_section" };
    }
    return { kind: "citation_existence", reason: "ok" };
  }

  // ── range ───────────────────────────────────────────────────────
  if (claim.kind === "range" || (Array.isArray(claim.range) && claim.range.length === 2)) {
    if (!Array.isArray(claim.range) || claim.range.length !== 2) {
      return { kind: "probabilistic", reason: "range_missing_two_element_array" };
    }
    if (!Number.isFinite(claim.range[0]) || !Number.isFinite(claim.range[1])) {
      return { kind: "probabilistic", reason: "range_endpoints_not_finite" };
    }
    if (claim.range[0] > claim.range[1]) {
      return { kind: "probabilistic", reason: "range_lo_greater_than_hi" };
    }
    if (typeof claim.field_path !== "string" || !claim.field_path) {
      return { kind: "probabilistic", reason: "range_missing_field_path" };
    }
    if (typeof claim.source_uri !== "string" || !claim.source_uri) {
      return { kind: "probabilistic", reason: "range_missing_source_uri" };
    }
    return { kind: "range", reason: "ok" };
  }

  // ── set_membership ──────────────────────────────────────────────
  if (claim.kind === "set_membership" || SET_OPERATORS.has(claim.operator)) {
    if (!Array.isArray(claim.set) || claim.set.length === 0) {
      return { kind: "probabilistic", reason: "set_membership_missing_set" };
    }
    if (!SET_OPERATORS.has(claim.operator)) {
      return { kind: "probabilistic", reason: "set_membership_missing_operator" };
    }
    if (typeof claim.field_path !== "string" || !claim.field_path) {
      return { kind: "probabilistic", reason: "set_membership_missing_field_path" };
    }
    if (typeof claim.source_uri !== "string" || !claim.source_uri) {
      return { kind: "probabilistic", reason: "set_membership_missing_source_uri" };
    }
    return { kind: "set_membership", reason: "ok" };
  }

  // ── comparison ──────────────────────────────────────────────────
  if (claim.kind === "comparison" || Array.isArray(claim.field_paths)) {
    if (!Array.isArray(claim.field_paths) || claim.field_paths.length !== 2) {
      return { kind: "probabilistic", reason: "comparison_needs_two_field_paths" };
    }
    if (!NUMERIC_OPERATORS.has(claim.operator)) {
      return { kind: "probabilistic", reason: "comparison_missing_or_invalid_operator" };
    }
    if (typeof claim.source_uri !== "string" || !claim.source_uri) {
      return { kind: "probabilistic", reason: "comparison_missing_source_uri" };
    }
    return { kind: "comparison", reason: "ok" };
  }

  // ── field_lookup (most common) ──────────────────────────────────
  if (
    typeof claim.field_path === "string" &&
    claim.field_path &&
    typeof claim.source_uri === "string" &&
    claim.source_uri &&
    claim.expected_value !== undefined
  ) {
    if (
      typeof claim.expected_value !== "string" &&
      typeof claim.expected_value !== "number" &&
      typeof claim.expected_value !== "boolean"
    ) {
      return { kind: "probabilistic", reason: "field_lookup_expected_value_not_scalar" };
    }
    return { kind: "field_lookup", reason: "ok" };
  }

  // ── default: probabilistic ──────────────────────────────────────
  return { kind: "probabilistic", reason: "no_deterministic_shape_matched" };
}

export { classify, SUPPORTED_KINDS };
