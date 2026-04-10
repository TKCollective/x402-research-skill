# AgentOracle — The Trust Layer for AI Agents

[![npm](https://img.shields.io/npm/v/agentoracle-mcp?label=agentoracle-mcp)](https://www.npmjs.com/package/agentoracle-mcp)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Base](https://img.shields.io/badge/chain-Base-0052FF?logo=coinbase)](https://base.org)
[![SKALE](https://img.shields.io/badge/chain-SKALE-gasless-00D395)](https://skale.space)
[![Stellar](https://img.shields.io/badge/chain-Stellar-7B48CC)](https://stellar.org)

AI agents hallucinate. AgentOracle doesn't let them act on it.

Every claim an agent produces passes through multi-source verification — Sonar, Sonar Pro, and an adversarial pass — before it gets a `"recommendation": "act"`. No API keys. No accounts. Pay per call via [x402](https://x402.org).

**[agentoracle.co](https://agentoracle.co) · [Trust docs](https://agentoracle.co/trust)**

---

## What it does

- **Evaluates any data before an agent acts on it.** Submit a payload with claims; get back per-claim confidence scores and `act / verify / reject` recommendations.
- **Per-claim verification, not per-query.** A single `POST /evaluate` call decomposes your input, checks each claim independently across multiple sources, then scores the whole response 0–1.
- **The moat compounds over time.** Every verified claim is fingerprinted and stored. Source reputation updates with every feedback cycle. The longer it runs, the better the scores get.

---

## Quick Start

No wallet? Hit `/preview` for free. With a wallet, `/evaluate` costs $0.02 USDC and returns per-claim verdicts.

```bash
curl -X POST https://agentoracle.co/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "claims": [
      "The x402 protocol was built by Coinbase",
      "Base is an Ethereum L2",
      "SKALE charges $0.05 per transaction"
    ]
  }'
```

```json
{
  "confidence": 0.71,
  "recommendation": "verify",
  "claims": [
    {
      "claim": "The x402 protocol was built by Coinbase",
      "verdict": "supported",
      "confidence": 0.97,
      "recommendation": "act",
      "sources": ["https://x402.org", "https://docs.cdp.coinbase.com/x402/welcome"]
    },
    {
      "claim": "Base is an Ethereum L2",
      "verdict": "supported",
      "confidence": 0.99,
      "recommendation": "act",
      "sources": ["https://base.org"]
    },
    {
      "claim": "SKALE charges $0.05 per transaction",
      "verdict": "refuted",
      "confidence": 0.12,
      "recommendation": "reject",
      "sources": ["https://skale.space/"]
    }
  ],
  "metadata": {
    "claims_evaluated": 3,
    "supported": 2,
    "refuted": 1,
    "model": "sonar-pro+adversarial",
    "price_paid": "$0.02"
  }
}
```

---

## Endpoints

| Method | Path | Price | Description |
|--------|------|-------|-------------|
| `POST` | `/evaluate` | $0.02 USDC | Per-claim verification with confidence scoring and act/verify/reject recommendations |
| `POST` | `/research` | $0.02 USDC | Real-time research query — summary, key facts, sources, confidence score |
| `POST` | `/deep-research` | $0.10 USDC | Deep analysis via Sonar Pro — extended context, higher confidence |
| `POST` | `/compare` | $0.05 USDC | Side-by-side comparison of two claims or data points |
| `GET` | `/preview` | Free | Truncated summary + confidence score — no wallet needed |
| `POST` | `/verify-gate` | Free (beta) | Bi-directional verification gate — embed trust into any API |
| `POST` | `/feedback` | Free | Report agent outcomes to improve source reputation scores |
| `GET` | `/reputation` | Free | Source reputation scores from the persistent trust graph |
| `GET` | `/fingerprints` | Free | Claim fingerprint database stats (374+ keys) |
| `GET` | `/.well-known/x402-manifest.json` | Free | x402 discovery manifest — pricing, networks, pay-to addresses |

---

## How `/evaluate` works

```
1. Extract claims
   Input is decomposed into discrete, checkable assertions.

2. Multi-source verify
   Each claim is checked against Sonar (real-time web), Sonar Pro (extended
   context), and an adversarial pass designed to find contradicting evidence.

3. Score
   Each claim gets a confidence score from 0 (no support) to 1 (strong
   consensus). The overall response score is the weighted aggregate.

4. Recommend
   act     → confidence ≥ 0.85, consistent support across sources
   verify  → confidence 0.50–0.84, or sources conflict
   reject  → confidence < 0.50, or actively refuted
```

---

## Response Example

Full `/evaluate` response with mixed claims:

```json
{
  "confidence": 0.61,
  "recommendation": "verify",
  "claims": [
    {
      "claim": "Stellar completed its first x402 payment on April 6, 2026",
      "verdict": "supported",
      "confidence": 0.94,
      "recommendation": "act",
      "sources": [
        "https://agentoracle.co/trust",
        "https://github.com/TKCollective/x402-research-skill"
      ]
    },
    {
      "claim": "x402 requires API keys to function",
      "verdict": "refuted",
      "confidence": 0.08,
      "recommendation": "reject",
      "sources": [
        "https://x402.org",
        "https://docs.cdp.coinbase.com/x402/welcome"
      ]
    }
  ],
  "metadata": {
    "claims_evaluated": 2,
    "supported": 1,
    "refuted": 1,
    "cached_claims": 1,
    "model": "sonar-pro+adversarial",
    "response_time_ms": 3120,
    "price_paid": "$0.02"
  }
}
```

---

## Multi-Chain

AgentOracle accepts payment on three networks. Same endpoints — the agent picks the cheapest chain.

| Network | Details |
|---------|---------|
| **Base** | EVM mainnet (eip155:8453) — $0.02 USDC, ~$0.001 gas |
| **SKALE** | Gasless EVM (eip155:1187947933) — zero gas cost, USDC.e |
| **Stellar** | Soroban smart contracts, sponsored fees — first x402 Stellar payment: April 6, 2026 |

Auto-discover payment parameters:

```bash
curl https://agentoracle.co/.well-known/x402-manifest.json
```

---

## SDK: @agentoracle/verify

Embed trust verification into any agent or API.

```bash
npm install @agentoracle/verify
```

```javascript
import { verify } from "@agentoracle/verify";

// One line — verify any claim
const result = await verify("Bitcoin was created in 2009");
console.log(result.evaluation.overall_confidence); // 0.97
```

### Verification Gate Middleware

Protect any Express API endpoint with automatic trust verification:

```javascript
import { createVerificationGate } from "@agentoracle/verify/middleware";

app.post("/api/submit",
  createVerificationGate({ minConfidence: 0.6 }),
  (req, res) => {
    // Only reaches here if content is verified above 0.6 confidence
    res.json({ accepted: true, verification: req.verification });
  }
);
```

This is the bi-directional shift: agents don't just consume verification — any API can embed it.

---

## MCP

Use AgentOracle inside Claude, Cursor, or any MCP-compatible client:

```bash
npx agentoracle-mcp
```

```json
{
  "mcpServers": {
    "agentoracle": {
      "command": "npx",
      "args": ["agentoracle-mcp"],
      "env": {
        "AGENTORACLE_WALLET_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

Payment is handled transparently. Set the private key once; the MCP server signs x402 payments on every call.

---

## Testing

36 tests across 12 suites. CI runs on Node 18/20/22 via GitHub Actions.

```bash
npm test
```

Covers: health, discovery, preview, paid endpoints, x402 payment flow validation (Base + SKALE + Stellar), trust layer, fingerprints, cache, error handling, CORS, and static assets.

---

## The Moat

AgentOracle gets more accurate the more it's used. Four compounding mechanisms:

**Persistent claim storage (Redis / Upstash)**
Verified claims are fingerprinted and stored. Repeated claims return instantly — no re-verification cost — and confidence scores improve as more sources confirm them over time. State survives deploys.

**Claim fingerprinting**
Semantically equivalent claims resolve to the same fingerprint. "Base is a Coinbase L2" and "Base is built by Coinbase" hit the same cache entry. Agents don't pay to re-verify known facts.

**Source reputation**
Each source has a persistent reputation score updated after every verification. Sources that consistently support claims that later prove correct get higher weight. Sources that misfire get downweighted.

**Feedback flywheel (`POST /feedback`)**
Agents report outcomes for free. Did acting on a `"recommendation": "act"` claim succeed or fail? That signal flows back into source reputation, improving future recommendations for everyone.

---

## Traction

- **$4.32 USDC** received on-chain across 30+ paid transactions (Base mainnet)
- **374+ claim fingerprints** in persistent Redis database, growing daily
- **Live since March 2026** — production API at agentoracle.co
- **3 chains** — Base, SKALE (gasless), Stellar (sponsored fees)
- **MCP server** on npm — works in Claude, Cursor
- **Product Hunt** launched April 8, 2026
- **36 tests**, CI on Node 18/20/22

---

## Links

- Website: [agentoracle.co](https://agentoracle.co)
- Trust docs: [agentoracle.co/trust](https://agentoracle.co/trust)
- SDK: [packages/verify](./packages/verify)
- x402 manifest: [agentoracle.co/.well-known/x402-manifest.json](https://agentoracle.co/.well-known/x402-manifest.json)
- Fingerprints: [agentoracle.co/fingerprints](https://agentoracle.co/fingerprints)
- Verify Gate: [agentoracle.co/verify-gate](https://agentoracle.co/verify-gate)
- GitHub: [TKCollective/x402-research-skill](https://github.com/TKCollective/x402-research-skill)
- Product Hunt: [AgentOracle on PH](https://www.producthunt.com/posts/agentoracle)
- npm (MCP): [agentoracle-mcp](https://www.npmjs.com/package/agentoracle-mcp)

---

MIT License
