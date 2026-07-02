# Faire Rollback Runbook — Square → back to Shopify

**Purpose:** Exact steps to reverse the Faire connection from Square back to Shopify if the
controlled Faire→Square test reveals bad sync data, or if Square proves unworkable post-cutover.

**SuperOps ticket:** #1668

## When to use this
- The Faire→Square test shows products syncing badly (broken images, wrong prices, mangled variants)
- Square proves unworkable during the post-launch soak period

## Pre-conditions that keep rollback cheap
- Site is still in `COMING_SOON` mode (no customers), OR within the post-launch soak window
- Shopify subscription is still ACTIVE (do not cancel until soak clears)
- The Faire "Buy Wholesale" Shopify app is still installed on the Shopify store
- A pre-test Square catalog baseline exists. As of 2026-05-22 the baseline is two files in
  `docs/`:
    - `square-baseline-2026-05-22.xlsx` — the full Square Dashboard export Kevin's account
      produced (4,213 variations across 1,260 items, prices + on-hand quantities included).
    - `square-baseline-2026-05-22.tokens.json` — sidecar with the 4,213 baseline catalog
      object IDs ("Tokens" in Square's exporter) used for diffing.
  Any catalog object whose Token is NOT in `tokens_set` was created during the test window
  and is a cleanup candidate. (The API-based scripts in `square-spike/` are kept as
  alternates but were not used — the Developer Console blocked production token issuance.)

## Biggest risk — read this first
The website side of rollback is trivial (one env var). The real blast radius is **Kevin's
live Square catalog** — the same catalog his in-store register uses. When Faire connects to
Square it can write products into that catalog. Cleaning those out on rollback is the slow,
careful part. Always diff against the baseline; never bulk-delete by guess.

## Rollback steps

1. **Faire side — disconnect Square.** In the Faire account → Settings → POS integrations →
   disconnect Square. (Faire allows only one POS per account.)

2. **Faire side — reconnect Shopify.** Reconnect Faire to Shopify. The Faire "Buy Wholesale"
   app should still be installed on the Shopify store — confirm it. If it was removed,
   reinstall from apps.shopify.com/faire-buy-wholesale. Re-authorize with Kevin's Faire login.

3. **Website — flip the flag.** In the repo, set `COMMERCE_BACKEND` back to `shopify` in the
   Vercel env vars (and `.env.local` for local). Redeploy. This is a one-variable change —
   the Shopify integration code was never removed.

4. **Verify.** Confirm the site renders from Shopify and the Faire app shows "connected" on
   the Shopify side.

5. **Clean up Square.** Identify what Faire added by diffing the current Square catalog
   against the pre-test baseline. Re-export the Item Library from Kevin's Square Dashboard
   (same path as the original baseline), then compare its `Token` column against
   `tokens_set` in `square-baseline-2026-05-22.tokens.json`. Any Token in the new export but
   NOT in `tokens_set` was created during the test window. Review that list, then
   archive/delete only those objects from Square so they don't clutter Kevin's in-store
   register catalog. Never delete an object whose Token exists in the baseline.

6. **Confirm the register is untouched.** Kevin's in-store Square register is a separate
   concern and is unaffected by any of this — verify nothing changed there.

## Time estimate
- Caught pre-launch (zero customers): ~15–30 minutes, fully clean
- Post-launch within soak: longer — add manual reconciliation of any real orders/inventory
  that occurred on Square during the window

## Notes
- The website's Shopify integration code (`src/lib/shopify/`) is never deleted — it stays
  behind the feature flag permanently. Code rollback is always a one-variable change.
- The hard point of no return is cancelling the Shopify subscription — never do that until
  the soak period has cleared cleanly.
