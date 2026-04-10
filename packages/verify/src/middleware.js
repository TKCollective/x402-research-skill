/**
 * @agentoracle/verify/middleware — Verification gate for Express APIs
 * ═══════════════════════════════════════════════════════════════════
 *
 * Embed trust verification into any API endpoint. Incoming data gets
 * auto-verified before your handler processes it.
 *
 * Usage:
 *   import { createVerificationGate } from "@agentoracle/verify/middleware";
 *   app.post("/api/data", createVerificationGate(), (req, res) => {
 *     // req.verification contains the trust analysis
 *     console.log(req.verification.confidence); // 0.87
 *   });
 */

import { AgentOracle } from "./index.js";

/**
 * Express middleware that verifies incoming request data through AgentOracle.
 * Rejects requests below the confidence threshold.
 *
 * @param {Object} [options]
 * @param {number} [options.minConfidence=0.5] - Minimum confidence to pass (0-1)
 * @param {string} [options.field="body"] - Which field to verify ("body", "query", or a specific body key)
 * @param {boolean} [options.block=true] - Block requests below threshold (true) or just annotate (false)
 * @param {string} [options.baseUrl] - AgentOracle API base URL
 * @param {Function} [options.extractContent] - Custom function to extract content from req
 * @returns {Function} Express middleware
 *
 * @example
 *   // Block any submission with confidence below 0.6
 *   app.post("/submit",
 *     createVerificationGate({ minConfidence: 0.6 }),
 *     (req, res) => {
 *       // Only reaches here if content is verified
 *       res.json({ status: "accepted", verification: req.verification });
 *     }
 *   );
 *
 * @example
 *   // Annotate but don't block — let the handler decide
 *   app.post("/ingest",
 *     createVerificationGate({ block: false }),
 *     (req, res) => {
 *       if (req.verification.confidence < 0.3) {
 *         return res.status(422).json({ error: "Unverifiable content" });
 *       }
 *       // Process with confidence context
 *     }
 *   );
 */
export function createVerificationGate(options = {}) {
  const {
    minConfidence = 0.5,
    field = "body",
    block = true,
    baseUrl,
    extractContent,
  } = options;

  const oracle = new AgentOracle({ baseUrl });

  return async (req, res, next) => {
    try {
      // Extract content to verify
      let content;
      if (extractContent) {
        content = extractContent(req);
      } else if (field === "body") {
        content =
          typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body);
      } else if (field === "query") {
        content = JSON.stringify(req.query);
      } else {
        content =
          typeof req.body?.[field] === "string"
            ? req.body[field]
            : JSON.stringify(req.body?.[field]);
      }

      if (!content || content === "{}" || content === "null") {
        // Nothing to verify — pass through
        req.verification = { skipped: true, reason: "no content to verify" };
        return next();
      }

      // Call AgentOracle /evaluate
      const result = await oracle.evaluate(content, {
        source: `verification-gate:${req.path}`,
      });

      // Attach verification result to request
      req.verification = {
        evaluationId: result.evaluation_id,
        confidence: result.evaluation?.overall_confidence ?? result.confidence ?? 0,
        recommendation: result.evaluation?.recommendation ?? "unknown",
        claims: result.evaluation?.claims ?? [],
        meta: result.meta ?? {},
        verified: true,
      };

      // Block if below threshold
      if (block && req.verification.confidence < minConfidence) {
        return res.status(422).json({
          error: "Verification Failed",
          message: `Content confidence (${req.verification.confidence.toFixed(2)}) is below the required threshold (${minConfidence.toFixed(2)}).`,
          verification: req.verification,
          recommendation: req.verification.recommendation,
          upgrade: "Improve the accuracy of the submitted content and retry.",
        });
      }

      next();
    } catch (err) {
      if (err.status === 402) {
        // x402 payment required — pass through but annotate
        req.verification = {
          skipped: true,
          reason: "x402 payment required for verification",
          networks: err.networks,
        };
        return next();
      }

      // Verification service unavailable — don't block the request
      req.verification = {
        skipped: true,
        reason: `verification service error: ${err.message}`,
      };
      next();
    }
  };
}

/**
 * Standalone verification function for non-Express environments.
 * Verifies content and returns a pass/fail result.
 *
 * @param {string} content - Content to verify
 * @param {Object} [options]
 * @param {number} [options.minConfidence=0.5] - Minimum confidence threshold
 * @param {string} [options.baseUrl] - AgentOracle API URL
 * @returns {Promise<{pass: boolean, confidence: number, result: Object}>}
 */
export async function verifyContent(content, options = {}) {
  const { minConfidence = 0.5, baseUrl } = options;
  const oracle = new AgentOracle({ baseUrl });

  try {
    const result = await oracle.evaluate(content);
    const confidence =
      result.evaluation?.overall_confidence ?? result.confidence ?? 0;
    return {
      pass: confidence >= minConfidence,
      confidence,
      recommendation: result.evaluation?.recommendation ?? "unknown",
      evaluationId: result.evaluation_id,
      result,
    };
  } catch (err) {
    return {
      pass: false,
      confidence: 0,
      recommendation: "error",
      error: err.message,
    };
  }
}

export default createVerificationGate;
