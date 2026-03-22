# AgentOracle — Pay-Per-Query Research API

A payable research API that gives AI agents instant, structured web research for **$0.02 USDC** per query. No API keys. No subscriptions. Just HTTP + crypto.

Built on [x402 protocol](https://docs.cdp.coinbase.com/x402/welcome) (Coinbase's open payment standard) and powered by [Perplexity Sonar](https://www.perplexity.ai).

**Live at [agentoracle.co](https://agentoracle.co)**

## How It Works

```
Agent → POST /research {"query": "..."} → 402 Payment Required
Agent → signs $0.02 USDC on Base → retries with payment header
Server → verifies payment → calls Perplexity → returns structured JSON
```

## Endpoints

| Method | Path | Price | Description |
|--------|------|-------|-------------|
| `POST` | `/preview` | Free (10/hr) | Live truncated preview — test before paying |
| `POST` | `/research` | $0.02 USDC | Standard research (Perplexity Sonar) |
| `POST` | `/deep-research` | $0.10 USDC | Deep research with analysis (Sonar Pro) |
| `GET` | `/health` | Free | Service health + feature flags |
| `GET` | `/.well-known/x402.json` | Free | x402 discovery manifest |
| `GET` | `/skale` | Free | SKALE gasless integration info |

## Quick Start — Try the Free Preview

```bash
curl -X POST https://agentoracle.co/preview \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the top DeFi protocols by TVL right now?"}'
```

Response:
```json
{
  "preview": true,
  "result": {
    "summary": "As of March 2026, the leading DeFi protocols by TVL are...",
    "key_facts": ["Aave leads with $28B TVL", "Lido holds $22B in staking"],
    "confidence_score": 0.88
  },
  "upgrade": {
    "standard": "POST /research — $0.02 USDC (Sonar)",
    "deep": "POST /deep-research — $0.10 USDC (Sonar Pro)"
  }
}
```

## Full Response (v1.3.0)

After x402 payment, you get the complete structured response:

```json
{
  "query": "Latest DeFi protocol TVL rankings and yield trends",
  "tier": "standard",
  "result": {
    "summary": "As of March 2026, DeFi TVL has reached...",
    "key_facts": [
      "Aave leads with $28B TVL across 12 chains",
      "Lido maintains $22B in liquid staking deposits",
      "Uniswap v4 holds $15B across L2 deployments",
      "Restaking protocols have grown 340% YoY",
      "Base L2 DeFi TVL surpassed $8B"
    ],
    "sources": [
      "https://defillama.com/...",
      "https://dune.com/...",
      "https://l2beat.com/..."
    ],
    "confidence_score": 0.92
  },
  "confidence": {
    "score": 0.92,
    "level": "high",
    "sources_count": 8,
    "facts_count": 5
  },
  "freshness": "recent",
  "metadata": {
    "model": "sonar",
    "api_version": "1.3.0",
    "response_time_ms": 2340,
    "timestamp": "2026-03-21T06:30:00.000Z",
    "network": "base",
    "price_paid": "$0.02"
  }
}
```

## Code Examples

### Python

```python
import requests

# Free preview — no payment needed
resp = requests.post("https://agentoracle.co/preview", json={
    "query": "What is the current ETH price and market sentiment?"
})
data = resp.json()
print(data["result"]["summary"])
print(f"Confidence: {data['result']['confidence_score']}")
```

### JavaScript / Node.js

```javascript
const axios = require("axios");

// Free preview
const { data } = await axios.post("https://agentoracle.co/preview", {
  query: "What are the latest developments in AI agent frameworks?"
});
console.log(data.result.summary);
console.log(`Confidence: ${data.result.confidence_score}`);
```

### With x402 Payment (full results)

```javascript
const { withPayment } = require("@x402/axios");
const { createWalletClient, http } = require("viem");
const { base } = require("viem/chains");
const { privateKeyToAccount } = require("viem/accounts");

const walletClient = createWalletClient({
  account: privateKeyToAccount("0xYOUR_KEY"),
  chain: base,
  transport: http(),
});

// Wrap axios — handles 402 → pay → retry automatically
const client = withPayment(axios, walletClient);

const { data } = await client.post("https://agentoracle.co/research", {
  query: "Top DeFi yields on Base right now"
});

console.log(data.result.summary);
console.log(`Sources: ${data.confidence.sources_count}`);
console.log(`Freshness: ${data.freshness}`);
```

See [`examples/`](./examples/) for complete Python and JavaScript examples.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PAY_TO_ADDRESS` | Yes | Your Base mainnet wallet (0x...) |
| `PERPLEXITY_API_KEY` | Yes | Perplexity API key (pplx-...) |
| `SERVER_PORT` | No | Server port (default: 3000) |
| `FACILITATOR_URL` | No | x402 facilitator (default: xpay.sh) |
| `SKALE_FACILITATOR_READY` | No | Set `true` to enable SKALE gasless payments |

## Deploy Your Own

```bash
# 1. Clone and install
git clone https://github.com/TKCollective/x402-research-skill.git
cd x402-research-skill
npm install

# 2. Configure
cp .env.example .env
# Add your wallet address and Perplexity API key

# 3. Run
node index.js
```

Works anywhere Node.js runs: **Vercel**, **Railway**, **Render**, **Cloudflare Workers**, **Docker**.

## SKALE Gasless Payments

AgentOracle supports [SKALE Network](https://skale.space/) for zero-gas-fee payments. Agents pay only the query price ($0.02 / $0.10) with no gas overhead.

Check status: `GET https://agentoracle.co/skale`

## x402 Discovery

The API publishes a standard x402 manifest at `/.well-known/x402.json` so agent frameworks can automatically discover pricing, endpoints, and payment requirements.

## Built With

- [x402 Protocol](https://github.com/coinbase/x402) — HTTP-native payments by Coinbase
- [Perplexity Sonar](https://docs.perplexity.ai/) — Real-time research AI
- [Base](https://base.org) — Ethereum L2 by Coinbase
- [SKALE](https://skale.space/) — Zero-gas L2 network

## License

Business Source License 1.1 (BSL 1.1) — see [LICENSE](./LICENSE).

---

**AgentOracle** — Real-time research for autonomous AI agents.
[agentoracle.co](https://agentoracle.co) · [@AgentOracle_AI](https://x.com/AgentOracle_AI)
