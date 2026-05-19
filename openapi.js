// openapi.js
//
// OpenAPI 3.1.0 document for AgentCash discovery (https://agentcash.dev/docs/discovery).
//
// AgentCash crawls `/openapi.json` and indexes our paid endpoints for
// Claude/Cursor/Codex/Hermes/Gemini-CLI agents to discover. The spec is a
// superset of the IETF API-payment standard, so this document is also
// useful for any other OpenAPI consumer.
//
// Source of truth: code in index.js (PRICE = $0.02, DEEP_PRICE = $0.10,
// BATCH_PRICE = $0.10). If those constants change in index.js, update this
// file in the same commit.

export const openapiDocument = {
  openapi: "3.1.0",
  info: {
    title: "AgentOracle Verification API",
    version: "2.2.0",
    description:
      "Pay-per-query verification API for AI agents. Every /research call returns a structured summary with key facts, citation URLs, and a confidence score. Every /evaluate call returns a per-claim verdict (ACT / VERIFY / REJECT) with confidence scoring. /deep-research uses Sonar Pro for multi-step deep analysis with extended context. Settled in USDC via x402 on Base mainnet. v0.2 receipt spec going to IETF early June 2026.",
    "x-guidance":
      "Use POST /preview (free, truncated) to evaluate the API before paying. Use POST /research ($0.02 per call) for single-query verification with confidence + sources. Use POST /evaluate ($0.02 per call) when you have a specific factual claim to verify and need a per-claim verdict. Use POST /deep-research ($0.10 per call) for multi-step analysis that needs a more capable model. All paid endpoints settle in USDC on Base mainnet via x402; agents should follow the 402 challenge to authorize payment.",
    contact: {
      name: "AgentOracle",
      url: "https://agentoracle.co",
    },
    license: {
      name: "Business Source License 1.1",
      url: "https://agentoracle.co/license",
    },
  },
  servers: [
    {
      url: "https://agentoracle.co",
      description: "Production",
    },
  ],
  "x-discovery": {
    // ownershipProofs left as an empty array for now; AgentCash registration
    // step is what populates this with a registration token they hand us.
    ownershipProofs: [],
  },
  paths: {
    "/preview": {
      post: {
        operationId: "preview",
        summary: "Preview — Free truncated verification",
        description:
          "Truncated verification response (top sources only, confidence score, no exhaustive key-fact list). Free during beta. Rate limited to 20 req/hr per IP.",
        tags: ["Verification"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    minLength: 1,
                    description:
                      "Natural-language claim or question to verify. Example: 'What is the current price of Bitcoin?'",
                  },
                },
                required: ["query"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Truncated verification response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    preview: { type: "boolean", const: true },
                    result: {
                      type: "object",
                      properties: {
                        summary: { type: "string" },
                        confidence_score: { type: "number", minimum: 0, maximum: 1 },
                        sources: { type: "array", items: { type: "string", format: "uri" } },
                      },
                      required: ["summary", "confidence_score"],
                    },
                  },
                  required: ["preview", "result"],
                },
              },
            },
          },
          429: { description: "Rate limit exceeded (20 req/hr per IP)" },
        },
      },
    },
    "/research": {
      post: {
        operationId: "research",
        summary: "Research — Single-query verification with sources",
        description:
          "Full verification response: summary, key_facts array, source URLs, confidence score, metadata. Powered by Sonar. Settled in USDC on Base via x402.",
        tags: ["Verification"],
        "x-payment-info": {
          price: { mode: "fixed", currency: "USD", amount: "0.020000" },
          protocols: [
            {
              x402: {
                scheme: "exact",
                network: "eip155:8453",
                asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                payTo: "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109",
                amount: "20000",
              },
            },
          ],
        },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    minLength: 1,
                    description:
                      "Natural-language claim or question to verify",
                  },
                },
                required: ["query"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Verified response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    tier: { type: "string", enum: ["standard"] },
                    result: {
                      type: "object",
                      properties: {
                        summary: { type: "string" },
                        key_facts: { type: "array", items: { type: "string" } },
                        sources: {
                          type: "array",
                          items: { type: "string", format: "uri" },
                        },
                        confidence_score: {
                          type: "number",
                          minimum: 0,
                          maximum: 1,
                        },
                      },
                      required: ["summary", "key_facts", "sources", "confidence_score"],
                    },
                    confidence: {
                      type: "object",
                      properties: {
                        score: { type: "number" },
                        level: {
                          type: "string",
                          enum: ["low", "medium", "high"],
                        },
                        sources_count: { type: "integer" },
                        facts_count: { type: "integer" },
                      },
                    },
                  },
                  required: ["query", "result", "confidence"],
                },
              },
            },
          },
          402: {
            description:
              "Payment Required. The response includes a PAYMENT-REQUIRED header containing the x402 challenge body. Pay $0.02 USDC on Base via x402, then retry the request with the X-PAYMENT header.",
          },
        },
      },
    },
    "/evaluate": {
      post: {
        operationId: "evaluate",
        summary: "Evaluate — Per-claim verdict (ACT / VERIFY / REJECT)",
        description:
          "Multi-source verification of a specific factual claim. Returns per-claim verdicts, evidence, and a confidence threshold recommendation. Currently free in v2.2 beta; paid tiers turn on after the AVeriTeC benchmark numbers publish.",
        tags: ["Verification"],
        "x-payment-info": {
          price: { mode: "fixed", currency: "USD", amount: "0.000000" },
          protocols: [
            {
              x402: {
                scheme: "exact",
                network: "eip155:8453",
                asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                payTo: "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109",
                amount: "0",
              },
            },
          ],
        },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    minLength: 1,
                    description: "The claim text to verify",
                  },
                  min_confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 1,
                    description: "Minimum confidence threshold for ACT recommendation",
                  },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Evaluation response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    evaluation_id: { type: "string" },
                    evaluation: {
                      type: "object",
                      properties: {
                        overall_confidence: { type: "number" },
                        recommendation: {
                          type: "string",
                          enum: ["act", "verify", "reject"],
                        },
                        recommendation_text: { type: "string" },
                        threshold_applied: { type: "number" },
                        total_claims: { type: "integer" },
                        verified_claims: { type: "integer" },
                      },
                    },
                  },
                  required: ["evaluation_id", "evaluation"],
                },
              },
            },
          },
        },
      },
    },
    "/deep-research": {
      post: {
        operationId: "deepResearch",
        summary: "Deep Research — Multi-step analysis with extended context",
        description:
          "Multi-step deep analysis powered by Sonar Pro. Higher confidence scoring, extended context window, comprehensive source verification. Settled in USDC on Base via x402.",
        tags: ["Verification"],
        "x-payment-info": {
          price: { mode: "fixed", currency: "USD", amount: "0.100000" },
          protocols: [
            {
              x402: {
                scheme: "exact",
                network: "eip155:8453",
                asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                payTo: "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109",
                amount: "100000",
              },
            },
          ],
        },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    minLength: 1,
                    description: "Natural-language research question",
                  },
                },
                required: ["query"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Deep research response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    tier: { type: "string", enum: ["deep"] },
                    result: {
                      type: "object",
                      properties: {
                        summary: { type: "string" },
                        key_facts: { type: "array", items: { type: "string" } },
                        sources: {
                          type: "array",
                          items: { type: "string", format: "uri" },
                        },
                        confidence_score: { type: "number" },
                      },
                    },
                  },
                  required: ["query", "result"],
                },
              },
            },
          },
          402: {
            description:
              "Payment Required. The response includes a PAYMENT-REQUIRED header containing the x402 challenge body. Pay $0.10 USDC on Base via x402, then retry with the X-PAYMENT header.",
          },
        },
      },
    },
    "/research/batch": {
      post: {
        operationId: "researchBatch",
        summary: "Research (Batch) — Up to 5 queries in one call",
        description:
          "Run up to 5 research queries in parallel in a single call. Same per-claim citation + confidence output as /research. Single flat $0.10 charge.",
        tags: ["Verification"],
        "x-payment-info": {
          price: { mode: "fixed", currency: "USD", amount: "0.100000" },
          protocols: [
            {
              x402: {
                scheme: "exact",
                network: "eip155:8453",
                asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                payTo: "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109",
                amount: "100000",
              },
            },
          ],
        },
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  queries: {
                    type: "array",
                    items: { type: "string", minLength: 1 },
                    minItems: 1,
                    maxItems: 5,
                    description: "Array of 1 to 5 query strings",
                  },
                },
                required: ["queries"],
              },
            },
          },
        },
        responses: {
          200: { description: "Batch verification response" },
          402: {
            description:
              "Payment Required. Pay $0.10 USDC on Base via x402.",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      x402: {
        type: "http",
        scheme: "x402",
        description:
          "x402 micropayments. Pay per-call in USDC on Base mainnet (eip155:8453). See PAYMENT-REQUIRED response header on 402 responses for the challenge body.",
      },
    },
  },
  tags: [
    {
      name: "Verification",
      description:
        "AI claim verification endpoints. All return source URLs and confidence scores.",
    },
  ],
};
