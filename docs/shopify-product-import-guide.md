# Shopify Product Import Guide — Seagrass Boutique

Step-by-step instructions to get products live on the website.

---

## Step 1: Install the Faire Buy Wholesale App (Faire orders only)

Faire syncs your Faire catalog directly to Shopify — no CSV needed for those products.

1. Log in to **seagrass-boutique.myshopify.com/admin**
2. Go to **Apps → Search apps**
3. Search for **"Faire: Buy Wholesale"**
4. Click **Install** (it's free)
5. Connect your Faire account when prompted
6. The app will sync your Faire products automatically

> **Verify:** After connecting, place a **test order** on Faire to confirm prices and variants import correctly before trusting the sync.

---

## Step 2: Import JOOR / NuOrder Products via CSV

JOOR and NuOrder don't have Shopify apps, so you import them manually with a spreadsheet.

### 2a. Export from JOOR or NuOrder

- In JOOR: **Orders → Export → Product CSV**
- In NuOrder: **Catalog → Export → Excel/CSV**

### 2b. Fill out the Shopify Import Template

Open `docs/JOOR-NuOrder-shopify-import-template.csv` in Excel or Google Sheets.

Map your JOOR/NuOrder export columns to the template columns:

| JOOR/NuOrder Field | Shopify CSV Column |
|---|---|
| Style Name | `Title` |
| Brand | `Vendor` |
| Description | `Body (HTML)` |
| Style Number | `Variant SKU` |
| Retail Price | `Variant Price` |
| Wholesale Price | `Cost per item` |
| Color | `Option1 Value` |
| Size | `Option2 Value` |
| Category / Type | `Type` |
| Season / Tags | `Tags` |
| Image URL | `Image Src` |

> **Tip:** If a product has multiple sizes, you need one row per size. Keep `Handle` and `Title` the same across all rows for the same product — Shopify groups them.

### 2c. Import to Shopify

1. In Shopify admin: **Products → Import**
2. Upload your completed CSV
3. Check **"Overwrite existing products with matching handles"** only if re-importing
4. Click **Import products**

---

## Step 3: Set Vercel Environment Variables (one-time)

Once you confirm products are in Shopify, set these in [Vercel dashboard](https://vercel.com) under **Settings → Environment Variables**:

| Variable | Value | Where to find it |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | `seagrass-boutique.myshopify.com` | Your Shopify URL |
| `SHOPIFY_STOREFRONT_TOKEN` | `your-token-here` | Shopify Admin → Apps → Develop apps → your app → Storefront API token |
| `SHOPIFY_STORE_LIVE` | `true` | Set this only when products are ready |

> **Storefront API token:** Go to Shopify Admin → **Settings → Apps and sales channels → Develop apps**. Create an app, enable the Storefront API, and copy the public access token.

---

## Step 4: Launch (flip the coming-soon switch)

Once products are live in Shopify and env vars are set:

1. In the repo, open `src/lib/site-config.ts`
2. Change line 3 from `export const COMING_SOON = true;` to `export const COMING_SOON = false;`
3. Commit and push — Vercel will redeploy automatically

> The full website will go live within ~2 minutes after the push.

---

## Checklist

- [ ] Faire Buy Wholesale app installed and connected
- [ ] Test Faire order confirmed (prices + variants sync correctly)
- [ ] JOOR/NuOrder products imported via CSV
- [ ] Vercel env vars set (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`, `SHOPIFY_STORE_LIVE=true`)
- [ ] Confirmed products appear at seagrass-boutique.myshopify.com
- [ ] `COMING_SOON` flipped to `false` and pushed
- [ ] seagrassboutique.com shows live products ✓
