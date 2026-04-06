# AgentOracle — Real-Time Research API for AI Agents

Pay-per-query research API for autonomous AI agents using the [x402 protocol](https://x402.org). Agents discover pricing, query for free, then pay $0.02 USDC per result. No API keys. No accounts. No subscriptions.

**Live at [agentoracle.co](https://agentoracle.co)**

---

## How It Works

```
1. Agent discovers pricing
   GET /.well-known/x402-manifest.json

2. Agent previews for free
   POST /preview → truncated summary + confidence score

3. Agent pays and gets full results
   POST /research → HTTP 402 → agent signs $0.02 USDC → retry → full JSON
```

The x402 protocol handles all payment logic. No API key management, no billing setup, no human in the loop.

---

## Endpoints

| Method | Path | Price | Description |
|--------|------|-------|-------------|
| `POST` | `/preview` | Free (20/hr) | Truncated summary + confidence score — test before paying |
| `POST` | `/research` | $0.02 USDC | Full research: summary, key facts, sources, confidence score |
| `POST` | `/deep-research` | $0.10 USDC | Deep analysis using Sonar Pro — extended context, higher confidence |
| `POST` | `/research/batch` | $0.10 USDC | Up to 5 queries in parallel for the price of one deep query |
| `GET` | `/health` | Free | Service status, version, network info |
| `GET` | `/.well-known/x402-manifest.json` | Free | Standard x402 discovery manifest |
| `GET` | `/.well-known/x402.json` | Free | x402 manifest (alias) |

---

## Supported Networks

| Network | Chain ID | Gas | Currency |
|---------|----------|-----|----------|
| **Base** | eip155:8453 | ~$0.001 | USDC |
| **SKALE** | eip155:1187947933 | **$0.00 (gasless)** | USDC.e |
| **Stellar** | stellar:testnet | Sponsored | USDC |

Same endpoint. Agent picks the cheapest chain.

---

## Quick Start

### 1. Free Preview (no wallet needed)

```bash
curl -X POST https://agentoracle.co/preview \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the x402 payment protocol?"}'
```

```json
{
  "result": {
    "summary": "The x402 protocol is an open standard...",
    "key_facts": ["Built by Coinbase", "Uses HTTP 402 status code"],
    "confidence_score": 0.92
  },
  "truncated": { "shown_key_facts": 2, "total_key_facts": 6 },
  "upgrade": { "standard": "POST /research — $0.02 USDC" }
}
```

### 2. Paid Research — Node.js (Base mainnet)

```javascript
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(process.env.EVM_PRIVATE_KEY);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const paid = wrapFetchWithPayment(fetch, client);

const res = await paid("https://agentoracle.co/research", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "Latest Base ecosystem developments" }),
});

const data = await res.json();
console.log(data.result.summary);
console.log(`Confidence: ${data.result.confidence_score}`);
console.log(`Sources: ${data.result.sources.length}`);
```

### 3. Paid Research — Stellar testnet

```javascript
import { Transaction, TransactionBuilder } from "@stellar/stellar-sdk";
import { x402Client, x402HTTPClient } from "@x402/fetch";
import { createEd25519Signer, getNetworkPassphrase } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";

const signer = createEd25519Signer(process.env.STELLAR_SECRET_KEY, "stellar:testnet");
const rpcConfig = { url: "https://soroban-testnet.stellar.org" };
const client = new x402Client().register(
  "stellar:*",
  new ExactStellarScheme(signer, rpcConfig)
);
const httpClient = new x402HTTPClient(client);

// Step 1: Get 402
const firstRes = await fetch("https://agentoracle.co/research", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "What is Stellar's role in agent payments?" }),
});

const paymentRequired = httpClient.getPaymentRequiredResponse(
  (n) => firstRes.headers.get(n)
);

// Step 2: Create payment payload (Stellar-only)
const stellarOnly = { ...paymentRequired, accepts: [paymentRequired.accepts.find(a => a.network?.includes("stellar"))] };
let paymentPayload = await client.createPaymentPayload(stellarOnly);

// Step 3: Apply testnet fee fix
const networkPassphrase = getNetworkPassphrase("stellar:testnet");
const tx = new Transaction(paymentPayload.payload.transaction, networkPassphrase);
const sorobanData = tx.toEnvelope().v1()?.tx()?.ext()?.sorobanData();
if (sorobanData) {
  paymentPayload = {
    ...paymentPayload,
    payload: {
      ...paymentPayload.payload,
      transaction: TransactionBuilder.cloneFrom(tx, { fee: "1", sorobanData, networkPassphrase }).build().toXDR(),
    },
  };
}

// Step 4: Send paid request
const paidRes = await fetch("https://agentoracle.co/research", {
  method: "POST",
  headers: { "Content-Type": "application/json", ...httpClient.encodePaymentSignatureHeader(paymentPayload) },
  body: JSON.stringify({ query: "What is Stellar's role in agent payments?" }),
});

const data = await paidRes.json();
console.log(data.result.summary);
```

### 4. Batch Research

```javascript
// 5 queries for $0.10 total — same as one deep query
const res = await paid("https://agentoracle.co/research/batch", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    queries: [
      "Latest ETH price and market cap",
      "Top DeFi protocols by TVL",
      "Recent Base ecosystem announcements",
      "AI agent frameworks comparison 2026",
      "x402 protocol adoption metrics"
    ]
  }),
});
```

---

## Response Format

```json
{
  "query": "What is the x402 payment protocol?",
  "tier": "standard",
  "result": {
    "summary": "The x402 protocol is an open standard...",
    "key_facts": [
      "Built by Coinbase, now under the Linux Foundation",
      "Uses HTTP 402 to trigger stablecoin micropayments",
      "Supported on Base, SKALE, Solana, Stellar, and more",
      "Enables AI agents to pay per API call without API keys"
    ],
    "sources": [
      "https://x402.org",
      "https://docs.cdp.coinbase.com/x402/welcome"
    ],
    "confidence_score": 0.94
  },
  "confidence": {
    "score": 0.94,
    "level": "high",
    "sources_count": 6,
    "facts_count": 4
  },
  "metadata": {
    "model": "sonar",
    "api_version": "1.9.0",
    "response_time_ms": 5840,
    "network": "base",
    "price_paid": "$0.02"
  }
}
```

---

## x402 Discovery Manifest

Agents can auto-discover pricing and payment requirements at the standard path:

```bash
curl https://agentoracle.co/.well-known/x402-manifest.json
```

```json
{
  "name": "AgentOracle Research API",
  "x402Version": 2,
  "endpoints": [
    { "method": "POST", "path": "/preview",          "price": "0.00", "currency": "USDC" },
    { "method": "POST", "path": "/research",          "price": "0.02", "currency": "USDC" },
    { "method": "POST", "path": "/deep-research",     "price": "0.10", "currency": "USDC" },
    { "method": "POST", "path": "/research/batch",    "price": "0.10", "currency": "USDC" }
  ],
  "networks": {
    "base":       { "network": "eip155:8453",        "payTo": "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109" },
    "skale_base": { "network": "eip155:1187947933",   "payTo": "0xdF90200B0031051BbF7a66BB9387d2Ecf599e109", "gasless": true },
    "stellar":    { "network": "stellar:testnet",     "payTo": "GBRA7RJZXA5PE5EFDSSUAFDHLAOBXOGY2X3TKCKJ53CLEBEMV3S23VKO" }
  }
}
```

---

## MCP Server

Use AgentOracle directly in Claude, Cursor, or any MCP client:

```bash
npx agentoracle-mcp
```

**Claude Desktop config:**
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

When `AGENTORACLE_WALLET_PRIVATE_KEY` is set, the MCP server handles x402 payments automatically. Your agent calls the `research` tool and results come back — payment happens transparently.

Available tools: `preview` (free), `research` ($0.02), `deep-research` ($0.10), `batch-research` ($0.10), `check-health`, `get-manifest`.

---

## On-Chain Payment Proof

All payments settle on Base mainnet. Fully transparent and verifiable:

**Receiving wallet:** `0xdF90200B0031051BbF7a66BB9387d2Ecf599e109`

[View all transactions on BaseScan](https://basescan.org/address/0xdF90200B0031051BbF7a66BB9387d2Ecf599e109)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PAY_TO_ADDRESS` | Yes | Base mainnet wallet for receiving payments |
| `PERPLEXITY_API_KEY` | Yes | Perplexity API key (`pplx-...`) |
| `STELLAR_PAY_TO` | No | Stellar receiving address for Stellar payments |
| `STELLAR_NETWORK` | No | `stellar:testnet` or `stellar:pubnet` |
| `SKALE_FACILITATOR_READY` | No | Set `true` to enable SKALE gasless |
| `STELLAR_ENABLED` | No | Set `false` to disable Stellar middleware |

---

## Deploy Your Own

```bash
git clone https://github.com/TKCollective/x402-research-skill.git
cd x402-research-skill
npm install
cp .env.example .env
# Add PAY_TO_ADDRESS and PERPLEXITY_API_KEY
node index.js
```

Deploys on Vercel, Railway, Render, or any Node.js host.

---

## Hackathon Submissions

- **OWS Hackathon** (MoonPay / OpenWallet Standard) — Track 03: Pay-Per-Call Services & API Monetization — *April 3, 2026*
- **Stellar Hacks: Agents** (Stellar Development Foundation) — x402 on Stellar — *April 2026*

---

## Built With

- [x402 Protocol](https://x402.org) — Open HTTP-native payment standard (Coinbase / Linux Foundation)
- [Perplexity Sonar](https://docs.perplexity.ai/) — Real-time research AI
- [Base](https://base.org) — Ethereum L2 (Coinbase)
- [SKALE](https://skale.space/) — Zero-gas EVM network
- [Stellar](https://stellar.org) — Fast, low-cost payment blockchain
- [PayAI](https://payai.network) — x402 facilitator for Base + SKALE
- [x402.org Facilitator](https://x402.org) — x402 facilitator for Stellar

---

## License

Business Source License 1.1 — see [LICENSE](./LICENSE).

---

**AgentOracle** — The default research layer for the agent economy.
[agentoracle.co](https://agentoracle.co) · [@AgentOracle_AI](https://x.com/AgentOracle_AI) · [GitHub](https://github.com/TKCollective/x402-research-skill)
