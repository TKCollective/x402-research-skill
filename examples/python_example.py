"""
AgentOracle — Python SDK Example
Pay-per-query research API using x402 protocol on Base.
No API keys needed. Just USDC on Base.

pip install requests eth-account
"""

import requests
from eth_account import Account

# ─── Configuration ─────────────────────────────────────────────
AGENT_ORACLE_URL = "https://agentoracle.co"
PRIVATE_KEY = "0xYOUR_WALLET_PRIVATE_KEY"  # Base mainnet wallet with USDC


def preview_query(query: str) -> dict:
    """Free preview — test a query before paying (10/hr limit)."""
    resp = requests.post(
        f"{AGENT_ORACLE_URL}/preview",
        json={"query": query},
        timeout=20,
    )
    return resp.json()


def paid_research(query: str, tier: str = "standard") -> dict:
    """
    Full research query via x402 payment.
    
    tier: "standard" ($0.02) or "deep" ($0.10)
    
    Flow:
    1. Send query → get 402 with payment requirements
    2. Sign payment with your wallet
    3. Resubmit with payment header → get full results
    """
    endpoint = "/deep-research" if tier == "deep" else "/research"
    body = {"query": query}
    if tier != "deep":
        body["tier"] = tier

    # Step 1: Get payment requirements
    resp = requests.post(
        f"{AGENT_ORACLE_URL}{endpoint}",
        json=body,
        timeout=30,
    )

    if resp.status_code == 402:
        # Step 2: Parse payment header
        payment_required = resp.headers.get("PAYMENT-REQUIRED")
        print(f"Payment required: {payment_required}")

        # Step 3: Sign and pay using x402 client library
        # For production, use the x402 Python SDK:
        #   pip install x402
        #   from x402.client import create_payment_header
        #   payment_header = create_payment_header(payment_required, PRIVATE_KEY)
        #
        # Then resubmit:
        #   resp = requests.post(
        #       f"{AGENT_ORACLE_URL}{endpoint}",
        #       json=body,
        #       headers={"X-PAYMENT": payment_header},
        #       timeout=60,
        #   )
        raise Exception(
            "402 Payment Required — use x402 SDK to sign and submit payment. "
            "See https://github.com/coinbase/x402 for client libraries."
        )

    resp.raise_for_status()
    return resp.json()


# ─── Usage Examples ────────────────────────────────────────────

if __name__ == "__main__":
    # 1. Free preview (no payment needed)
    print("=== Free Preview ===")
    preview = preview_query("What is the current ETH price and market sentiment?")
    print(f"Summary: {preview['result']['summary']}")
    print(f"Confidence: {preview['result']['confidence_score']}")
    print(f"Previews remaining: {preview['preview_remaining']}")
    print()

    # 2. Paid research (requires USDC on Base)
    # Uncomment when wallet is funded:
    #
    # print("=== Standard Research ($0.02) ===")
    # result = paid_research("Latest DeFi protocol TVL rankings and trends")
    # print(f"Summary: {result['result']['summary']}")
    # print(f"Sources: {result['confidence']['sources_count']}")
    # print(f"Freshness: {result['freshness']}")
    # print(f"Response time: {result['metadata']['response_time_ms']}ms")
    #
    # print("=== Deep Research ($0.10) ===")
    # deep = paid_research("Comprehensive analysis of L2 scaling solutions", tier="deep")
    # print(f"Analysis: {deep['result']['analysis']}")
    # print(f"Key facts: {len(deep['result']['key_facts'])}")


# ─── Example Response (v1.3.0) ─────────────────────────────────
#
# {
#   "query": "Latest DeFi protocol TVL rankings",
#   "tier": "standard",
#   "result": {
#     "summary": "As of March 2026, the top DeFi protocols by TVL are...",
#     "key_facts": [
#       "Aave leads with $28B TVL across 12 chains",
#       "Lido maintains $22B in liquid staking",
#       "Uniswap v4 holds $15B across L2s"
#     ],
#     "sources": ["https://defillama.com/...", "..."],
#     "confidence_score": 0.92
#   },
#   "confidence": {
#     "score": 0.92,
#     "level": "high",
#     "sources_count": 8,
#     "facts_count": 5
#   },
#   "freshness": "recent",
#   "metadata": {
#     "model": "sonar",
#     "api_version": "1.3.0",
#     "response_time_ms": 2340,
#     "timestamp": "2026-03-21T...",
#     "network": "base",
#     "price_paid": "$0.02"
#   }
# }
