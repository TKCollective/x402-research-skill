/**
 * @agentoracle/verify — Trust verification SDK for AI agents
 * ════════════════════════════════════════════════════════════
 *
 * Verify claims, research queries, and data before your agent acts on it.
 * One line of code. Per-claim confidence scoring. No API keys.
 *
 * Usage:
 *   import { AgentOracle } from "@agentoracle/verify";
 *   const oracle = new AgentOracle();
 *   const result = await oracle.evaluate("The sky is blue");
 */

const DEFAULT_BASE_URL = "https://agentoracle.co";

/**
 * AgentOracle client for trust verification.
 */
export class AgentOracle {
  #baseUrl;
  #timeout;

  /**
   * @param {Object} [options]
   * @param {string} [options.baseUrl] - API base URL (default: https://agentoracle.co)
   * @param {number} [options.timeout] - Request timeout in ms (default: 30000)
   */
  constructor(options = {}) {
    this.#baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.#timeout = options.timeout || 30000;
  }

  /**
   * Verify claims in any text. Returns per-claim verdicts and confidence scores.
   * Cost: $0.02 USDC via x402 (or free if endpoint is ungated).
   *
   * @param {string} content - Text containing claims to verify
   * @param {Object} [options]
   * @param {string} [options.source] - Source identifier for tracking
   * @param {number} [options.minConfidence] - Minimum confidence threshold (0-1)
   * @returns {Promise<EvaluationResult>}
   */
  async evaluate(content, options = {}) {
    const body = { content };
    if (options.source) body.source = options.source;
    if (options.minConfidence) body.min_confidence = options.minConfidence;

    return this.#request("POST", "/evaluate", body);
  }

  /**
   * Free preview — get a truncated research summary with confidence score.
   * No payment required.
   *
   * @param {string} query - Natural language research question
   * @returns {Promise<PreviewResult>}
   */
  async preview(query) {
    return this.#request("POST", "/preview", { query });
  }

  /**
   * Full research query. Requires x402 payment ($0.02 USDC).
   *
   * @param {string} query - Natural language research question
   * @param {Object} [options]
   * @param {string} [options.tier] - "standard" ($0.02) or "deep" ($0.10)
   * @param {string} [options.paymentHeader] - Base64 x402 payment proof
   * @returns {Promise<ResearchResult>}
   */
  async research(query, options = {}) {
    const body = { query };
    if (options.tier) body.tier = options.tier;
    const headers = {};
    if (options.paymentHeader) headers["X-PAYMENT"] = options.paymentHeader;
    return this.#request("POST", "/research", body, headers);
  }

  /**
   * Deep research via Sonar Pro. Requires x402 payment ($0.10 USDC).
   *
   * @param {string} query - Natural language research question
   * @param {Object} [options]
   * @param {string} [options.paymentHeader] - Base64 x402 payment proof
   * @returns {Promise<ResearchResult>}
   */
  async deepResearch(query, options = {}) {
    const headers = {};
    if (options.paymentHeader) headers["X-PAYMENT"] = options.paymentHeader;
    return this.#request("POST", "/deep-research", { query }, headers);
  }

  /**
   * Submit feedback on a previous evaluation to improve source reputation.
   *
   * @param {string} evaluationId - ID from a previous evaluate() call
   * @param {string} outcome - "accurate" | "inaccurate" | "partially_accurate"
   * @returns {Promise<Object>}
   */
  async feedback(evaluationId, outcome) {
    return this.#request("POST", "/feedback", {
      evaluation_id: evaluationId,
      outcome,
    });
  }

  /**
   * Get source reputation scores from the trust graph.
   * @returns {Promise<Object>}
   */
  async reputation() {
    return this.#request("GET", "/reputation");
  }

  /**
   * Get database stats — total fingerprinted claims and feedback count.
   * @returns {Promise<FingerprintsResult>}
   */
  async fingerprints() {
    return this.#request("GET", "/fingerprints");
  }

  /**
   * Get API health and endpoint info.
   * @returns {Promise<Object>}
   */
  async health() {
    return this.#request("GET", "/health");
  }

  /**
   * Fetch the x402 manifest — pricing, networks, payment addresses.
   * @returns {Promise<Object>}
   */
  async manifest() {
    return this.#request("GET", "/.well-known/x402-manifest.json");
  }

  // ── Internal ──────────────────────────────────────────────

  async #request(method, path, body = null, extraHeaders = {}) {
    const url = `${this.#baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeout);

    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "@agentoracle/verify/1.0.0",
        ...extraHeaders,
      },
      signal: controller.signal,
    };

    if (body && method !== "GET") {
      opts.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(url, opts);
      clearTimeout(timer);

      // Handle x402 payment required
      if (res.status === 402) {
        const paymentHeader = res.headers.get("payment-required");
        let challenge = null;
        if (paymentHeader) {
          try {
            challenge = JSON.parse(
              Buffer.from(paymentHeader, "base64").toString()
            );
          } catch {}
        }
        const error = new Error("Payment required (x402)");
        error.status = 402;
        error.challenge = challenge;
        error.networks = challenge?.accepts?.map((a) => a.network) || [];
        throw error;
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        const error = new Error(data.message || data.error || `HTTP ${res.status}`);
        error.status = res.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        const error = new Error(`Request to ${path} timed out after ${this.#timeout}ms`);
        error.code = "TIMEOUT";
        throw error;
      }
      throw err;
    }
  }
}

/**
 * Quick verify — one-liner for simple claim verification.
 *
 * @param {string} content - Text to verify
 * @param {Object} [options] - AgentOracle constructor options
 * @returns {Promise<EvaluationResult>}
 *
 * @example
 *   import { verify } from "@agentoracle/verify";
 *   const result = await verify("Bitcoin was created in 2009");
 *   console.log(result.evaluation.confidence); // 0.97
 */
export async function verify(content, options = {}) {
  const client = new AgentOracle(options);
  return client.evaluate(content);
}

/**
 * Quick preview — one-liner for free research preview.
 *
 * @param {string} query - Research question
 * @param {Object} [options] - AgentOracle constructor options
 * @returns {Promise<PreviewResult>}
 */
export async function quickPreview(query, options = {}) {
  const client = new AgentOracle(options);
  return client.preview(query);
}

export default AgentOracle;
