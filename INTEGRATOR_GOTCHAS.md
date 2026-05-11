# Integrator Gotchas — x402 + CDP Bazaar

Real things that broke when shipping `agentoracle.co/research` on Coinbase x402 / Bazaar between March and May 2026. Each one cost us between 30 minutes and 2 days. Listed in rough order of how brutal they were to diagnose.

If you hit one of these and it isn't enough detail, open an issue at https://github.com/TKCollective/x402-research-skill or ping @AgentOracle_AI on X — happy to share full diffs.

---

## 1. `paymentPayload.resource` is "optional" but the indexer requires it

**Symptom:** All `/settle` calls return 200 + `success: true` + valid Base mainnet tx hash, but the resource is **never indexed** in CDP `/discovery/resources`. EXTENSION-RESPONSES decodes to:
```json
{"bazaar":{"status":"rejected","rejectedReason":"discovery request validation failed"}}
```

**Root cause:** Per x402 V2 spec §5.2, `paymentPayload.resource = {url, description, mimeType}` is required for the indexer to tag a settle to a listing. The schema marks it optional (`@x402/core@2.11.0/schemas/index.d.mts:315-389`), so most buyer SDKs (including `@x402/client`) omit it.

**Fix (server-side, ~15 lines of middleware):** decode `X-PAYMENT`, inject `resource` from a per-route map if absent, re-encode before forwarding to facilitator. See [`d972aa0a`](https://github.com/TKCollective/x402-research-skill/commit/d972aa0a) and [issue #2207](https://github.com/x402-foundation/x402/issues/2207).

**Why server-side:** patching one buyer doesn't fix the ecosystem. Fixing it on the seller makes you robust to every v1-shaped buyer that hits you.

---

## 2. v1/v2 schema conflation in 402 challenge body

**Symptom:** `agentic.market/validate` shows 6/6 transport, 8/8 payment, but Bazaar Extension fails. CDP indexer silently drops you.

**Root cause:** `@x402/express` ships the challenge in a `payment-required` HTTP header (base64 JSON), but **aggregator crawlers parse the response BODY**, not headers. If you don't mirror the header into the body, you appear unindexable. Worse, if you write a v1-shaped body (with `maxAmountRequired`, `resource`/`description`/`mimeType` inlined into `accepts[]`) when the indexer expects v2, you're rejected with `discovery request validation failed`.

**v2 canonical shape:**
```json
{
  "x402Version": 2,
  "resource": { "url": "...", "description": "...", "mimeType": "application/json" },
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:8453",
    "amount": "20000",
    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "payTo": "0x...",
    "maxTimeoutSeconds": 300,
    "extra": { "name": "USD Coin", "version": "2" }
  }],
  "extensions": { "bazaar": { "info": {...}, "schema": {...} } }
}
```

`accepts[]` has NO `resource`/`description`/`mimeType` — those live at the top level only. `amount` (not `maxAmountRequired`). `network` is CAIP-2 (`eip155:8453`), not the label `"base"`.

**Fix:** wrap your payment middleware with a body mirror. See [`0387615f`](https://github.com/TKCollective/x402-research-skill/commit/0387615f).

---

## 3. `extensions.bazaar.bazaar` double-wrap

**Symptom:** Bazaar extension present in the body but indexer rejects it.

**Root cause:** `declareDiscoveryExtension()` returns `{ bazaar: { info, schema } }`. If you set `extensions: { bazaar: declareDiscoveryExtension(...) }`, you get `extensions.bazaar.bazaar.info` — double-wrapped. Crawler can't find `info` at the expected path.

**Fix:** spread, don't nest:
```js
extensions: { ...declareDiscoveryExtension({...}) }
```
Or defensively un-wrap in your body mirror. See [`64943351`](https://github.com/TKCollective/x402-research-skill/commit/64943351).

---

## 4. CDP facilitator silently accepts label-form network but indexer needs CAIP-2

*(See also gotcha #12 — V2 facilitator-client requirements MUST use CAIP-2 to match `paymentPayload.accepted.network`.)*


**Symptom:** `/verify` and `/settle` both return 200, on-chain tx confirms, but indexer never sees you.

**Root cause:** CDP `/verify` and `/settle` accept both `network: "base"` and `network: "eip155:8453"`. The indexer only accepts CAIP-2 form on the **wire challenge body**. The facilitator API itself is more lenient — so you'll think your code is right, because settles work.

**Fix:** wire body uses `eip155:8453`, facilitator client requirements use `"base"` (label form). They are NOT the same surface. Don't try to unify them.

---

## 5. `paymentRequirements` schema rejects legacy `amount` field

**Symptom:** Direct `cdpFacilitatorClient.verify()` call rejects with schema validation error mentioning unknown field `amount`.

**Root cause:** The CDP facilitator's strict canonical x402 schema for `paymentRequirements` (passed as the second arg to verify/settle) uses `maxAmountRequired`, NOT `amount`. The wire challenge body uses `amount`. Two schemas, two field names.

**Fix:**
- Wire challenge body → `amount`
- `cdpFacilitatorClient.verify(payload, requirements)` requirements → `maxAmountRequired`

See [`57f361e7`](https://github.com/TKCollective/x402-research-skill/commit/57f361e7).

---

## 6. SDK 2.11.0 is NOT actually breaking — misattribution gotcha

> **Updated May 10, 2026 — status: retracted as a real gotcha, kept as a misattribution warning.**

**What we originally thought:** `@x402/express@2.11.0` (released 2026-04-27) shipped breaking `PaymentRequirementsV2Schema` changes. A `npm install` upgrade in late April left `paymentMiddleware` throwing at construction time, so we reverted to `^2.8.0` with [`0c5c232d`](https://github.com/TKCollective/x402-research-skill/commit/0c5c232d).

**What actually happened:** when we did the focused upgrade session on May 10 (commits Stage A/B/C: [`e3337504`](https://github.com/TKCollective/x402-research-skill/commit/e3337504), [`473a4014`](https://github.com/TKCollective/x402-research-skill/commit/473a4014), [`2769cff2`](https://github.com/TKCollective/x402-research-skill/commit/2769cff2)), the 2.8 → 2.11 diff turned out to be **field-ordering changes only** plus one new optional `error?` field on `PaymentRequirements`. No required fields added. No fields removed. No semantic surface changes. All used exports (`paymentMiddleware`, `x402ResourceServer`, `declareDiscoveryExtension`) have identical signatures and behavior.

The April 27 "the SDK broke" symptom was almost certainly caused by **gotchas #2 / #11 / #12** in this doc — the v1↔v2 transport-spec migration boundary that took 4 days of public debugging on [x402-foundation/x402#2207](https://github.com/x402-foundation/x402/issues/2207) to fully resolve. The schema-validation errors at construction time were structurally similar enough that a quick npm rollback masked the real issue and we lost 2 weeks pinned to 2.8.

**If you see schema errors after a 2.x → 2.11 upgrade:** before pinning back, check whether your route configs are emitting **v1-shape** fields (`maxAmountRequired`, inlined `resource`/`description`/`mimeType` in `accepts[]`, label-form `network: "base"`). 2.11's stricter zod schemas surface those v1 bugs that 2.8 was silently tolerating. The fix is the v2 wire-format work (gotcha #2), not the SDK version pin.

**Migration path that worked for us:** staged upgrade with deploy verification at each step. Stage A: `@x402/express` only. Stage B: `@x402/core` + `@x402/extensions`. Stage C: `@x402/evm` + `@x402/fetch` + `@x402/stellar`. Run all 15 of your wire-shape checks after each stage. Rollback per-stage is single-commit revert. Total time: 15 minutes.

---

## 7. CDP env keys appear empty in Vercel UI but work via API

**Symptom:** `CDP_API_KEY_ID` shows empty in Vercel dashboard environment variables. You set it; it still shows empty. Production calls fail with 401.

**Root cause:** Vercel UI bug — values containing certain characters render as empty in the dashboard but ARE present in the deployed environment. Or weren't, depending on which way the bug is biting today.

**Fix:** set environment variables via the Vercel CLI, not the UI:
```bash
echo "$CDP_API_KEY_ID" | vercel env add CDP_API_KEY_ID production
```
Verify with `vercel env ls production`. If output looks empty, redeploy and check `process.env.CDP_API_KEY_ID` from a `/health` endpoint.

---

## 8. Bazaar extension MUST include `info.input.method`

**Symptom:** Extension declared, body mirror correct, still no indexing.

**Root cause:** `info.input.method` is required by the Bazaar discovery schema for HTTP resources. If your `declareDiscoveryExtension()` call omits it, the extension validates locally but the indexer rejects.

**Fix:**
```js
declareDiscoveryExtension({
  info: {
    input: { type: "http", method: "POST", bodyType: "json", body: {...} },
    output: { type: "json", example: {...} },
  },
  schema: {...},
})
```
See [`6b56d3bd`](https://github.com/TKCollective/x402-research-skill/commit/6b56d3bd).

---

## 9. CDP facilitator schema length caps on description fields

**Symptom:** `cdpFacilitatorClient.verify()` rejects with a generic schema error after you've added a detailed `description` to your route config.

**Root cause:** CDP enforces a length cap (~250 chars in our experience) on the `description` field in route configs. Aggregator crawlers happily ingest long descriptions in the wire body, but CDP's facilitator-side schema is stricter.

**Fix:** keep route-level `description` short (< 250 chars). Put detail in the `bazaar.info` block, which doesn't have the same cap. See [`ea1b4492`](https://github.com/TKCollective/x402-research-skill/commit/ea1b4492).

---

## 10. Multi-network resource server: don't put SKALE in `accepts[]` if your facilitator doesn't support it

**Symptom:** `RouteConfigurationError` at server boot with mention of unsupported network.

**Root cause:** xpay facilitator supports Base only. If you put SKALE (`eip155:1187947933`) in your `accepts[]` and use xpay as your sole facilitator, `syncFacilitatorOnStart` validation fails before you even serve a request.

**Fix:** Use PayAI (supports Base + SKALE) as your EVM facilitator, or split: Base-only routes go through CDP, SKALE-only routes go through PayAI. Use `x402ResourceServer` with a facilitator array and `register()` per scheme. See [`579923c2`](https://github.com/TKCollective/x402-research-skill/commit/579923c2).

---

## 11. `X-PAYMENT` (V1) vs `PAYMENT-SIGNATURE` (V2) request header rename

**Symptom:** Buyer SDK signs and sends `X-PAYMENT` correctly. Server SDK returns a fresh 402 with `error: "Payment required"` that looks identical to the original challenge. No `EXTENSION-RESPONSES` header on the 402 because `/settle` is never called.

**Root cause:** `@x402/express` V2 reads the buyer's payload from the **`PAYMENT-SIGNATURE`** request header (V2 spec name). Every buyer SDK we tested (`@x402/client`, `@x402/fetch`, AsaiShota's, hyperD's) ships the V1 name `X-PAYMENT`. Server SDK calls `extractPayment(req)` — returns `null` because it can't find `PAYMENT-SIGNATURE` — and the entire request flow goes down the unpaid-request path. You get a 402 that looks exactly like the initial challenge, with no diagnostic header to tell you the SDK silently dropped your X-PAYMENT.

**Fix (server-side, ~3 lines of pre-middleware):**
```js
app.use((req, res, next) => {
  const xpay = req.headers["x-payment"];
  if (xpay) {
    req.headers["payment-signature"] = xpay;
    req.headers["PAYMENT-SIGNATURE"] = xpay;
  }
  next();
});
```

See [`8e7426d3`](https://github.com/TKCollective/x402-research-skill/commit/8e7426d3). Symmetrical fix to gotcha #2 (response side `payment-required` → `PAYMENT-REQUIRED`/`PAYMENT-REQUIREMENTS`). Both ends of the wire need the V1→V2 rename for backward compat with the SDK fleet.

---

## 12. CDP facilitator client expects V2 `PaymentRequirementsV2Schema` shape, not V1

**Symptom:** `cdpFacilitatorClient.verify(payload, requirements)` returns HTTP 500 `invalid_payload` on every call, even when the on-chain authorization signature is valid and the buyer's `paymentPayload` looks correct.

**Root cause:** `@x402/core/schemas`'s `PaymentRequirementsV2Schema` is exactly:
```ts
{ scheme, network, amount, asset, payTo, maxTimeoutSeconds, extra? }
```
No `maxAmountRequired`. No `resource`/`description`/`mimeType`. Those live on the **top-level** `PaymentRequiredV2` envelope (the 402 response body), not on the per-route requirements you pass to `verify()`/`settle()`. Mixing V1 and V2 names on the same call (the V1 shape uses `maxAmountRequired` and inlines `resource`/`description`/`mimeType`) gets you a strict-validation rejection from CDP that surfaces only as `invalid_payload` — no field-specific diagnostic.

Also: `network` must be CAIP-2 (`eip155:8453`) when calling V2 verify/settle, **and** must match `paymentPayload.accepted.network` from the buyer SDK exactly. Label form (`base`) silently fails strict-eq checks even though CDP accepts both forms in some contexts.

**Fix:** canonical V2 requirements shape:
```js
const requirements = {
  scheme: "exact",
  network: "eip155:8453",
  amount: "20000",
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  payTo: PAY_TO,
  maxTimeoutSeconds: 300,
  extra: { name: "USD Coin", version: "2" },
};
await cdpFacilitatorClient.verify(paymentPayload, requirements);
```
See [`6c1c6dc6`](https://github.com/TKCollective/x402-research-skill/commit/6c1c6dc6). This was the last gate before our resource indexed in CDP discovery on May 8, 2026 — every other layer was correct and we were silently 500ing on every settle.

---

## 13. Buyer must echo `paymentPayload.extensions` (the silent opt-out)

> **CRITICAL UPDATE — May 11, 2026:** Server-side injection of `paymentPayload.extensions.bazaar` is **necessary but not sufficient**. The CDP facilitator's Bazaar-listing-match step keys off **the buyer-signed paymentPayload contents**, NOT the post-sign X-PAYMENT header as it arrives at `/settle`. Per @ethanoroshiba on x402-foundation/x402#2207 (May 11 22:11 UTC): *"Payment payloads must continue to be discoverable in order to match existing Bazaar entries to corresponding facilitator settlements."*
>
> **What this means:** a server-side rewrite of the X-PAYMENT header (the fix described below) is enough to avoid the silent `EXTENSION-RESPONSES: bazaar.status=rejected` failure mode and produce a 200 success, but the settle will NOT be matched to the merchant's Bazaar listing and `quality.l30DaysTotalCalls`/`l30DaysUniquePayers` will NOT increment.
>
> **The complete fix is buyer-side.** The buyer SDK must read the bazaar extension reference from the 402 challenge body at challenge-decode time and include it in the `paymentPayload.extensions` block before signing. Server-side injection covers v1-shaped buyers that hit you, but only buyer-side echo drives the listing-side quality metrics.
>
> See thread for the ongoing buyer-side spec discussion.


**Symptom:** Every other fix on this list is correct. On-chain settles succeed (HTTP 200). The merchant `/discovery/resources` endpoint stays at `404`. `EXTENSION-RESPONSES` response header from CDP is **completely absent** — not `rejected`, not `processing`, just missing. The `rejected → processing → indexed` state machine never starts.

**Root cause** (per [@0xdespot on x402#2207 May 10 2026](https://github.com/x402-foundation/x402/issues/2207)): `PaymentPayloadV2Schema.extensions` is marked `Optional`. The CDP bazaar handler treats omission as **opt-out** and skips bazaar processing entirely. Most buyer SDKs (`@x402/client`, `@x402/fetch`, AsaiShota's pre-fix, hyperD's pre-fix) don't echo the `extensions: {bazaar: {info, schema}}` block from the 402 challenge back into the buyer's signed paymentPayload. The result: a successful $0.02 settle that the indexer never sees as a bazaar listing event.

**Fix (server-side, ~10 lines of pre-middleware):**
```js
if (!decoded.extensions?.bazaar?.info) {
  const bazaarExt = ROUTE_TO_BAZAAR_EXTENSION[req.path];
  if (bazaarExt) {
    decoded.extensions = { ...bazaarExt };
    // re-encode and rewrite X-PAYMENT header
  }
}
```
Same defensive-injection pattern as gotcha #1 (paymentPayload.resource). Idempotent if buyer already echoed it. After this fix landed in hyperD, their discovery endpoint flipped `404 → 200 with 1 resource` within 75 seconds of the next settle. See [our commit landing this fix](https://github.com/TKCollective/x402-research-skill/commits/main).

**Why this is the most insidious of the 13:** every other gotcha gives you SOME signal — a 402 bounce, a 500, a wire-validation error, a `rejected` extension header. This one gives you a clean 200 success and silently disables indexing. You can ship a perfectly-working paid API for weeks and have zero discoverability because no buyer SDK in the wild echoes extensions by default.

---

## Useful links

- x402 V2 spec: https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md
- agentic.market validator: https://agentic.market/validate
- CDP discovery API: `GET https://api.cdp.coinbase.com/platform/v2/x402/discovery/merchant?payTo=<address>`
- This repo: https://github.com/TKCollective/x402-research-skill
- Live reference implementation: https://agentoracle.co/research

If you've fixed one of these differently and your fix is more elegant, please open a PR. The point of this doc is to reduce ecosystem-wide pain, not to enshrine our hacks.

## Acknowledgments

This list exists because three independent merchants (AgentOracle / @TKCollective, [x402-market / @AsaiShota](https://github.com/AsaiShota/x402-market), [hyperD / @0xdespot](https://github.com/hyperd-ai/hyperd-mcp)) debugged the v1↔v2 transport boundary in public on [x402-foundation/x402#2207](https://github.com/x402-foundation/x402/issues/2207) between May 6 and May 10, 2026, with technical input from [@ethanoroshiba](https://github.com/ethanoroshiba) (Coinbase). Gotchas #1, #2, #3, #11, #13 surfaced collaboratively across that thread. #12 (V2 `PaymentRequirementsV2Schema` shape) and #4 (canonical-vs-label network) we found ourselves. #6 (canonical resource URL stripping) we dodge by construction; @0xdespot caught it first.
