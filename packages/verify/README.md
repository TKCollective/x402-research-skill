# @agentoracle/verify

Trust verification SDK for AI agents. Verify claims before your agent acts on them.

[![npm](https://img.shields.io/npm/v/@agentoracle/verify)](https://www.npmjs.com/package/@agentoracle/verify)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Install

```bash
npm install @agentoracle/verify
```

## Quick Start

```javascript
import { verify } from "@agentoracle/verify";

// One line — verify any claim
const result = await verify("Bitcoin was created by Satoshi Nakamoto in 2009");
console.log(result.evaluation.overall_confidence); // 0.97
console.log(result.evaluation.recommendation);     // "act"
```

## Full Client

```javascript
import { AgentOracle } from "@agentoracle/verify";

const oracle = new AgentOracle();

// Evaluate claims
const eval = await oracle.evaluate("SKALE charges $0.05 per transaction");
// → { evaluation_id, evaluation: { confidence, claims[], recommendation } }

// Free preview
const preview = await oracle.preview("What is x402?");

// Database stats
const stats = await oracle.fingerprints();
// → { database_stats: { total_keys: 374, feedback_count: 0 } }

// Submit feedback
await oracle.feedback("eval_123", "accurate");
```

## Verification Gate Middleware

Embed trust verification into any Express API. Incoming data gets auto-verified before your handler processes it.

```javascript
import express from "express";
import { createVerificationGate } from "@agentoracle/verify/middleware";

const app = express();
app.use(express.json());

// Block submissions below 0.6 confidence
app.post("/api/submit",
  createVerificationGate({ minConfidence: 0.6 }),
  (req, res) => {
    // Only reaches here if content passes verification
    console.log(req.verification.confidence); // >= 0.6
    res.json({ accepted: true, verification: req.verification });
  }
);

// Annotate but don't block
app.post("/api/ingest",
  createVerificationGate({ block: false }),
  (req, res) => {
    // Handler decides what to do with low confidence
    if (req.verification.confidence < 0.3) {
      return res.status(422).json({ error: "Unverifiable" });
    }
    res.json({ processed: true });
  }
);
```

### Middleware Options

| Option | Default | Description |
|--------|---------|-------------|
| `minConfidence` | `0.5` | Minimum confidence to pass (0-1) |
| `field` | `"body"` | What to verify: `"body"`, `"query"`, or a body key |
| `block` | `true` | Block requests below threshold, or just annotate |
| `baseUrl` | `agentoracle.co` | API endpoint |
| `extractContent` | — | Custom function `(req) => string` |

## Standalone Verification

For non-Express environments:

```javascript
import { verifyContent } from "@agentoracle/verify/middleware";

const { pass, confidence, recommendation } = await verifyContent(
  "The earth is flat",
  { minConfidence: 0.7 }
);
// pass: false, confidence: 0.03, recommendation: "reject"
```

## API Methods

| Method | Description | Cost |
|--------|-------------|------|
| `evaluate(content)` | Per-claim verification with confidence scoring | $0.02 |
| `preview(query)` | Free truncated research preview | Free |
| `research(query)` | Full research with sources | $0.02 |
| `deepResearch(query)` | Extended analysis via Sonar Pro | $0.10 |
| `feedback(id, outcome)` | Report evaluation accuracy | Free |
| `reputation()` | Source reputation scores | Free |
| `fingerprints()` | Database stats (374+ claims) | Free |
| `health()` | API status and endpoints | Free |
| `manifest()` | x402 payment manifest | Free |

## Payment (x402)

Paid methods return a 402 error with payment instructions:

```javascript
try {
  const result = await oracle.research("What is Stellar?");
} catch (err) {
  if (err.status === 402) {
    console.log(err.challenge);  // x402 payment challenge
    console.log(err.networks);   // ["eip155:8453", "stellar:testnet", ...]
    // Sign payment and retry with paymentHeader option
  }
}
```

Supports: **Base** (USDC), **SKALE** (gasless), **Stellar** (sponsored fees).

## Links

- Website: [agentoracle.co](https://agentoracle.co)
- Trust Docs: [agentoracle.co/trust](https://agentoracle.co/trust)
- GitHub: [TKCollective/x402-research-skill](https://github.com/TKCollective/x402-research-skill)
- Fingerprints: [agentoracle.co/fingerprints](https://agentoracle.co/fingerprints)

## License

MIT
