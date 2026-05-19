# Square E-commerce Backend Migration

This document describes the Square e-commerce backend integration for the
Seagrass Boutique storefront, which runs **alongside** the existing Shopify
integration behind a feature flag. Switching backends is a one-line env change
and is fully rollback-safe.

## Status

- Branch: `square-backend`
- Default backend: **shopify** (unchanged — nothing flips until you set the flag)
- Build: `npx next build` passes
- Verified live against the Square sandbox (catalog, inventory, compare-at
  pricing, image joins, hosted checkout / payment link)

## Architecture

```
                          pages (src/app/*)
                                 │
                                 ▼
                  src/lib/commerce/data.ts   ← backend-agnostic FACADE
                       │                │
        COMMERCE_BACKEND=shopify   COMMERCE_BACKEND=square
                       │                │
                       ▼                ▼
        src/lib/shopify/data.ts   src/lib/square/data.ts
        (UNTOUCHED)               (new)
                       │                │
                       ▼                ▼
        Shopify Storefront API    Square REST API
                                  (Catalog / Inventory / Checkout)
```

The facade and both backends expose **identical function names, signatures and
return shapes**. Both ultimately produce the same `Product` / `Collection`
shape defined in `src/lib/products.ts`, so **zero UI components were changed**.

### Files added

| File | Purpose |
|------|---------|
| `src/lib/commerce/config.ts` | Central feature flag — reads `COMMERCE_BACKEND` |
| `src/lib/commerce/data.ts` | Backend-agnostic data facade (pages import this) |
| `src/lib/square/client.ts` | Square REST client — plain fetch, bearer token, no SDK |
| `src/lib/square/types.ts` | Square API response types |
| `src/lib/square/queries.ts` | Catalog / inventory / location request helpers |
| `src/lib/square/normalize.ts` | Square → `Product`/`Collection` normalizer (critical layer) |
| `src/lib/square/data.ts` | Square data layer — mirrors `shopify/data.ts` |
| `src/lib/square/cart.ts` | Client-side Square cart + checkout helpers |
| `src/app/api/square-checkout/route.ts` | Creates a Square hosted payment link |
| `src/app/api/square-product/route.ts` | Resolves cart line display data |
| `docs/SQUARE-MIGRATION.md` | This document |

### Files modified (additively / non-destructively)

| File | Change |
|------|--------|
| `src/app/page.tsx` | Import data from the facade instead of `shopify/data` |
| `src/app/browse/[category]/page.tsx` | Same import swap |
| `src/app/collections/[slug]/page.tsx` | Same import swap |
| `src/lib/cart-context.tsx` | Split into a Shopify provider (unchanged logic) + a Square provider, dispatched by the flag |
| `next.config.ts` | Added Square image CDN hostnames to `remotePatterns` |
| `.env.local` | Added Square credentials + the feature flag vars |

**No file in `src/lib/shopify/` was modified or deleted.** The Shopify cart
logic in `cart-context.tsx` was preserved verbatim inside `ShopifyCartProvider`.

## The feature flag

`src/lib/commerce/config.ts` reads two env vars:

- `COMMERCE_BACKEND` — read server-side (data layer, API routes)
- `NEXT_PUBLIC_COMMERCE_BACKEND` — read client-side (cart context)

Both accept `"shopify"` (default) or `"square"`. **Keep them in sync.** An
unknown value falls back safely to `"shopify"` with a console warning.

## How to switch backends

Edit `.env.local` and set **both** vars:

```env
# Use Square:
COMMERCE_BACKEND=square
NEXT_PUBLIC_COMMERCE_BACKEND=square

# Roll back to Shopify (default):
COMMERCE_BACKEND=shopify
NEXT_PUBLIC_COMMERCE_BACKEND=shopify
```

Restart the dev server / redeploy. No code changes, no rebuild logic — the
swap is purely environmental. `NEXT_PUBLIC_` vars are inlined at build time, so
a production deploy must be rebuilt after changing the flag.

## Switching Square sandbox ↔ production

`SQUARE_ENVIRONMENT` (`sandbox` | `production`) selects the API base URL in
`src/lib/square/client.ts`:

- `sandbox` → `https://connect.squareupsandbox.com`
- `production` → `https://connect.squareup.com`

For production, also replace `SQUARE_ACCESS_TOKEN` and
`NEXT_PUBLIC_SQUARE_APPLICATION_ID` with production credentials. The pinned
`Square-Version` header is `2025-04-16`.

## Slug / handle strategy

Shopify products have a native `handle`. **Square has no handle field.** The
storefront's `/browse` and `/collections` routes need stable URL-safe slugs.

Strategy (`productSlug()` in `normalize.ts`):

1. **Preferred** — a `url_slug` STRING custom attribute on the ITEM. This lets
   a merchant pin a slug that survives a product rename. The reseed script
   `square-spike/04-reseed-categories.js` sets this attribute on every item.
2. **Fallback** — `slugify(item name)` (lowercase, non-alphanumeric → hyphens).

Collections use `slugify(category name)`.

**Caveat:** if two products slugify to the same string, the later one wins in
`getProductByHandle`. For a small boutique catalog this is not a concern;
the `url_slug` custom attribute is the escape hatch if it ever is.

## Compare-at price strategy

Square has no native `compareAtPrice` (MSRP) field. The proven workaround
(validated in `square-spike/FINDINGS.md`):

- A STRING `CUSTOM_ATTRIBUTE_DEFINITION` with key `compare_at_price`, allowed
  on `ITEM_VARIATION`.
- The MSRP is stored **in cents, as a string** on each variation's
  `custom_attribute_values`.
- `variationCompareAt()` in `normalize.ts` reads it back, parses the integer,
  divides by 100, and only surfaces it when it exceeds the sale price.

The product-level `compareAtPrice` is the lowest qualifying compare-at across
variations, matching the existing Shopify normalizer's behaviour.

## Other normalization details

- **Price conversion** — Square stores integer minor units (cents);
  `centsToDollars()` divides by 100. Product `price` = min variation price.
- **Images** — `item_data.image_ids[]` are ID references only, **not nested**.
  The catalog search is called with `include_related_objects=true`; IMAGE
  objects are resolved from `related_objects[]` via an ID-join (`buildContext`).
- **Availability** — Square inventory is keyed per variation.
  `BatchRetrieveInventoryCounts` is OR-reduced: a product is `availableForSale`
  if **any** variation has on-hand stock (or does not track inventory).
- **Categories** — Square 2025-04-16 stores categories in an `item_data.categories[]`
  array (plus `reporting_category`); `resolveCategoryId()` also falls back to
  the legacy `category_id`. Category names are mapped to the storefront's
  category slugs.
- **Backend IDs** — Square catalog object IDs are stored in the `shopifyId` /
  `shopifyVariantId` fields of `Product`. These are treated as opaque
  backend identifiers by the UI and cart, so reusing the field names avoids
  any type/UI change. (A future cleanup could rename them to `backendId`.)

## Cart & checkout

Square has no server-side persistent cart object like Shopify's `Cart`. The
implemented flow (recommended by the spike):

- **Client-side cart** — `SquareCartProvider` in `cart-context.tsx` holds an
  array of `{ variationId, quantity }`, persisted to `localStorage`
  (`seagrass_square_cart`).
- **Line item display** — `/api/square-product` resolves title / vendor /
  image / price for the cart drawer.
- **Checkout** — `/api/square-checkout` calls Square's `CreatePaymentLink`
  with the cart's catalog line items. Square prices the order server-side from
  the catalog and returns a hosted payment-link URL
  (`https://sandbox.square.link/u/...`). This is **directly analogous to
  Shopify's `cart.checkoutUrl`** — the cart drawer's Checkout button is
  unchanged.
- The Square access token is **server-only**; it never reaches the browser.

The Square cart context produces a `ShopifyCart`-shaped object so
`CartDrawer` and `CartLineItem` render identically for either backend. The
payment link is regenerated whenever cart contents change, so `checkoutUrl` is
ready by the time the user clicks Checkout.

## Gaps & caveats

- **Sandbox product images** — only the Coastal Linen Midi Dress has a seeded
  image. Products without an image fall back to the existing gradient
  placeholder, exactly as static products do. Seeding more images requires
  real (non-placeholder) image files — Square rejects tiny/placeholder PNGs.
- **Single image per product (sandbox)** — the seeded catalog has one image
  per item; the normalizer fully supports multiple (`image_ids[]` → `images[]`).
- **`COMING_SOON` mode** — the storefront is still in coming-soon mode, so
  `/browse` and `/collections` redirect and the homepage renders the
  coming-soon component. The Square data layer was verified directly (catalog,
  normalize, inventory, compare-at, image join, category/collection filtering,
  hosted checkout) — all confirmed working against the live sandbox.
- **No on-site card form** — checkout uses Square's hosted payment page (Payment
  Links). The Square Web Payments SDK is not integrated; add it later only if
  on-site card entry is wanted.
- **Webhooks / order sync** — out of scope. The payment link's `redirect_url`
  returns the customer to `/?checkout=complete`; there is no post-purchase
  order webhook handler yet.
- **`getTrendingProducts`** — Square has no native "trending" concept; it
  currently returns all catalog items. A "trending" Square category or custom
  attribute could refine this later.
- **Vendor field** — Square items have no brand/vendor field; all Square
  products normalize to vendor `"Seagrass Boutique"`.
- The field names `shopifyId` / `shopifyVariantId` now also carry Square IDs.
  Functionally correct but a naming cleanup (`backendId`) would be clearer.

## Reseeding the sandbox

The original spike scripts live in `C:\Users\Darren\square-spike\`:

- `01-seed.js` — creates categories, 5 items, variations, inventory, compare-at
  attribute.
- `04-reseed-categories.js` — links items to their categories
  (`item_data.categories[]`) and adds the `url_slug` custom attribute.
  Idempotent — safe to re-run.

If the sandbox catalog is empty, run `node 01-seed.js` then
`node 04-reseed-categories.js` from that directory.
