# x402 Research API

A payable API that lets AI agents pay **0.02 USDC on Base mainnet** for broad, real-time research powered by [Perplexity](https://www.perplexity.ai). Built on the [x402 protocol](https://docs.cdp.coinbase.com/x402/welcome) — Coinbase's open HTTP payment standard.

## How It Works

```
Agent → POST /research → 402 Payment Required
Agent → signs USDC payment → retries with PAYMENT-SIGNATURE header
Server → verifies via CDP facilitator → calls Perplexity → returns structured JSON
```

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd x402-research-api
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your wallet address and Perplexity API key

# 3. Run
node index.js
```

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/research` | x402 (0.02 USDC) | Real-time research — returns structured JSON |
| `GET` | `/health` | None | Service health check |
| `GET` | `/.well-known/x402.json` | None | x402 service manifest for agent discovery |

## Request / Response

**Request:**
```json
POST /research
{
  "query": "What are the latest developments in quantum computing?"
}
```

**Response (after payment):**
```json
{
  "query": "What are the latest developments in quantum computing?",
  "result": {
    "summary": "Recent breakthroughs include...",
    "key_facts": [
      "Google achieved 105-qubit processor milestone",
      "IBM launched 1000+ qubit Condor system"
    ],
    "sources": [
      "https://nature.com/articles/...",
      "https://arxiv.org/abs/..."
    ],
    "confidence_score": 0.91
  },
  "model": "sonar",
  "usage": { "prompt_tokens": 42, "completion_tokens": 380, "total_tokens": 422 }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PAY_TO_ADDRESS` | Yes | Your Base mainnet wallet (0x...) |
| `PERPLEXITY_API_KEY` | Yes | Perplexity API key (pplx-...) |
| `SERVER_PORT` | No | Server port (default: 3000) |
| `FACILITATOR_URL` | No | x402 facilitator (default: CDP mainnet) |

## Deployment

Works anywhere Node.js runs:

- **Vercel**: `vercel --prod`
- **Railway**: `railway up`
- **Render**: Connect repo, auto-deploys
- **Cloudflare Workers**: Adapt with `wrangler`
- **Docker**: `FROM node:20-slim` → `npm ci` → `node index.js`

## Bazaar Discovery

The Bazaar extension is included but commented out. To enable service discovery:

1. `npm i @x402/extensions`
2. Uncomment the Bazaar imports and registration in `index.js`
3. Your endpoint will appear in the [x402 Bazaar](https://docs.cdp.coinbase.com/x402/bazaar) registry

## License

This project is licensed under the Business Source License 1.1 (BSL 1.1).
See the [LICENSE](./LICENSE) file for details.


MIT
