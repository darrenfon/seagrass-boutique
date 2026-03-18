# Seagrass Boutique — Dependencies & Configuration

## Hosting
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **Repo:** `C:\Users\Darren\seagrass-boutique` (local, not yet pushed)
- **Planned hosting:** Vercel or Shopify Hydrogen (TBD based on Shopify integration approach)

## Third-Party Services

| Service | Purpose | Status | Notes |
|---------|---------|--------|-------|
| **Shopify** | E-commerce (products, cart, checkout) | **Pending integration** | Will replace static product data in `src/lib/products.ts` with Shopify Storefront API |
| **Google Fonts** | Typography (Playfair Display + DM Sans) | Active | Loaded via `next/font/google` — no API key needed |
| **Framer Motion** | Animations | Active | npm dependency, no account needed |

## Shopify Integration Plan

When integrating Shopify, the data layer in `src/lib/products.ts` is designed for easy migration:

1. **Product shape** already mirrors Shopify's product object (handle, title, vendor, price, tags, collections)
2. **Query helpers** (`getProductsByCollection`, `getProductsByCategory`, etc.) map directly to Shopify Storefront API queries
3. **"Add to Cart" buttons** are placeholder — connect to Shopify Buy SDK or Storefront API cart mutations
4. **Newsletter signup** — connect to Shopify customer marketing or a third-party email service (Klaviyo, Mailchimp)
5. **Product images** — currently using CSS gradient placeholders; swap for Shopify CDN image URLs

## Domain
- **Current:** N/A (local development)
- **Target:** seagrassboutique.com (currently on Material Retail — will need DNS migration)

## Environment Variables

| Variable | Purpose | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Shopify store URL | Pending |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Storefront API access | Pending |

## Social Links
- **Facebook:** https://www.facebook.com/SeagrassBoutique/
- **Instagram:** https://www.instagram.com/seagrassboutique/

## Open Questions
- [ ] Shopify store — has one been created yet, or is this a new store setup?
- [ ] Email marketing — Klaviyo, Mailchimp, or Shopify's built-in email?
- [ ] Domain transfer — who currently manages seagrassboutique.com DNS?
- [ ] Product photography — are original product images available, or will they come from Shopify?
