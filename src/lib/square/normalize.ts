// Normalize Square Catalog responses into the storefront's Product / Collection
// shape (src/lib/products.ts). This is the critical interop layer: it produces
// the EXACT shape the UI components already consume, so zero UI changes are needed.
//
// Handles, per square-spike/FINDINGS.md:
//  - cents -> decimal price conversion (Square stores integer minor units)
//  - image ID-joins: item_data.image_ids are refs; resolved from related_objects
//  - per-variant inventory -> product-level availability boolean (OR-reduce)
//  - compare-at price read from the `compare_at_price` STRING custom attribute
//  - slug/handle strategy: Square has no native handle -> slugify(name)

import type { Product, Collection } from "../products";
import type {
  SquareCatalogItem,
  SquareCatalogImage,
  SquareCatalogCategory,
  SquareItemVariation,
  SquareCustomAttributeValue,
} from "./types";

// ─── Slug / handle strategy ──────────────────────────────────────
// Square has no native "handle" field (Shopify does). The site needs stable,
// URL-safe slugs for /browse and /collections routes. Strategy:
//   1. Preferred: a `url_slug` STRING custom attribute on the ITEM, if present
//      (lets the merchant pin a slug that survives a product rename).
//   2. Fallback: slugify(item name).
// Documented in docs/SQUARE-MIGRATION.md.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Read a named/keyed custom attribute value off any catalog object.
function readCustomAttr(
  values: Record<string, SquareCustomAttributeValue> | undefined,
  match: { name?: string; key?: string }
): string | undefined {
  if (!values) return undefined;
  for (const v of Object.values(values)) {
    if (match.key && v.key === match.key) return v.string_value;
    if (match.name && v.name === match.name) return v.string_value;
  }
  return undefined;
}

function productSlug(item: SquareCatalogItem): string {
  const pinned = readCustomAttr(item.custom_attribute_values, {
    key: "url_slug",
    name: "URL Slug",
  });
  if (pinned) return slugify(pinned);
  return slugify(item.item_data.name || item.id);
}

// cents (integer minor units) -> decimal dollars
function centsToDollars(cents: number | undefined): number {
  return cents ? cents / 100 : 0;
}

// compare-at price: STRING custom attribute on a variation, value is cents.
function variationCompareAt(variation: SquareItemVariation): number | undefined {
  const raw = readCustomAttr(variation.custom_attribute_values, {
    key: "compare_at_price",
    name: "Compare At Price",
  });
  if (!raw) return undefined;
  const cents = parseInt(raw, 10);
  if (!Number.isFinite(cents) || cents <= 0) return undefined;
  return cents / 100;
}

// Coarse Square-category-name -> storefront-category-slug mapping.
const CATEGORY_NAME_TO_SLUG: Record<string, string> = {
  dresses: "dresses",
  dress: "dresses",
  tops: "clothing",
  top: "clothing",
  clothing: "clothing",
  accessories: "accessories",
  accessory: "accessories",
  shoes: "shoes",
  candles: "candles",
  body: "body",
};

function inferCategory(categoryName: string | undefined): string {
  if (!categoryName) return "clothing";
  return CATEGORY_NAME_TO_SLUG[categoryName.toLowerCase().trim()] || "clothing";
}

/**
 * Resolve an item's category ID across Square API versions: the 2025-04-16
 * categories[] array, the reporting_category, then the legacy category_id.
 */
export function resolveCategoryId(item: SquareCatalogItem): string | undefined {
  const d = item.item_data;
  if (d.categories && d.categories.length > 0) return d.categories[0].id;
  if (d.reporting_category?.id) return d.reporting_category.id;
  return d.category_id;
}

export interface SquareNormalizeContext {
  /** IMAGE objects from related_objects, keyed by image ID. */
  imagesById: Map<string, SquareCatalogImage>;
  /** CATEGORY objects from related_objects, keyed by category ID. */
  categoriesById: Map<string, SquareCatalogCategory>;
  /** Inventory: variation ID -> on-hand quantity. */
  inventoryByVariationId: Map<string, number>;
}

/** Build a lookup context from related_objects + inventory counts. */
export function buildContext(
  related: (SquareCatalogImage | SquareCatalogCategory | { type: string })[],
  inventory: { catalog_object_id: string; quantity: string; state: string }[]
): SquareNormalizeContext {
  const imagesById = new Map<string, SquareCatalogImage>();
  const categoriesById = new Map<string, SquareCatalogCategory>();
  for (const obj of related) {
    if (obj.type === "IMAGE") {
      const img = obj as SquareCatalogImage;
      imagesById.set(img.id, img);
    } else if (obj.type === "CATEGORY") {
      const cat = obj as SquareCatalogCategory;
      categoriesById.set(cat.id, cat);
    }
  }
  const inventoryByVariationId = new Map<string, number>();
  for (const c of inventory) {
    // Sum across states so multiple IN_STOCK rows for one variation accumulate.
    const prev = inventoryByVariationId.get(c.catalog_object_id) || 0;
    const qty = Number(c.quantity) || 0;
    inventoryByVariationId.set(c.catalog_object_id, prev + qty);
  }
  return { imagesById, categoriesById, inventoryByVariationId };
}

/**
 * Normalize one Square ITEM into the storefront Product shape.
 *
 * Square catalog object IDs are stored in `shopifyId` / `shopifyVariantId`.
 * Those fields are backend-agnostic identifiers as far as the UI is concerned —
 * the cart and AddToCartButton just pass them through opaquely. Reusing the
 * existing field names means zero UI/type changes.
 */
export function normalizeProduct(
  item: SquareCatalogItem,
  ctx: SquareNormalizeContext
): Product {
  const data = item.item_data;
  const variations = data.variations || [];

  // Prices: min variation price, in dollars.
  const variationPrices = variations
    .map((v) => centsToDollars(v.item_variation_data.price_money?.amount))
    .filter((p) => p > 0);
  const price = variationPrices.length ? Math.min(...variationPrices) : 0;

  // Compare-at: lowest compare-at across variations that exceeds the sale price.
  const compareAtCandidates = variations
    .map((v) => variationCompareAt(v))
    .filter((c): c is number => typeof c === "number" && c > price);
  const compareAtPrice = compareAtCandidates.length
    ? Math.min(...compareAtCandidates)
    : undefined;

  // Availability: OR-reduce across variation inventory. A product is available
  // if ANY variation has on-hand stock. Variations that don't track inventory
  // are treated as available.
  const availableForSale = variations.some((v) => {
    if (v.item_variation_data.track_inventory === false) return true;
    const qty = ctx.inventoryByVariationId.get(v.id);
    if (qty === undefined) return true; // no inventory record -> assume available
    return qty > 0;
  });

  // Images: image_ids are refs; resolve URLs via the related_objects join.
  const images = (data.image_ids || [])
    .map((id) => ctx.imagesById.get(id)?.image_data?.url)
    .filter((u): u is string => Boolean(u));

  // Color: pull from a variation name like "S / Sand" (token after " / ").
  let color = "";
  const firstVarName = variations[0]?.item_variation_data.name || "";
  const colorPart = firstVarName.split("/").map((s) => s.trim());
  if (colorPart.length > 1) color = colorPart[colorPart.length - 1];

  const categoryId = resolveCategoryId(item);
  const categoryName = categoryId
    ? ctx.categoriesById.get(categoryId)?.category_data?.name
    : undefined;

  const handle = productSlug(item);

  return {
    handle,
    title: data.name || "Untitled",
    vendor: "Seagrass Boutique",
    price,
    compareAtPrice,
    color,
    category: inferCategory(categoryName),
    collections: [],
    tags: [],
    image: "from-stone-200 to-gray-300", // gradient fallback
    realImage: images[0] || undefined,
    description: data.description || undefined,
    // Backend identifiers — Square catalog object IDs reuse the Shopify field
    // names so the UI / cart consume them with zero changes.
    shopifyId: item.id,
    shopifyVariantId: variations[0]?.id,
    variants: variations.map((v) => {
      const vQty = ctx.inventoryByVariationId.get(v.id);
      const vAvailable =
        v.item_variation_data.track_inventory === false ||
        vQty === undefined ||
        vQty > 0;
      return {
        id: v.id,
        title: v.item_variation_data.name || "Regular",
        availableForSale: vAvailable,
        price: centsToDollars(v.item_variation_data.price_money?.amount),
        selectedOptions: [],
      };
    }),
    images,
    availableForSale,
    descriptionHtml: undefined,
  };
}

/** Normalize a Square CATEGORY into the storefront Collection shape. */
export function normalizeCollection(category: SquareCatalogCategory): Collection {
  const name = category.category_data?.name || "Collection";
  const handle = slugify(name);
  return {
    handle,
    title: name,
    description: "",
    image: `/images/collection-${handle}.jpg`,
    featured: true,
  };
}
