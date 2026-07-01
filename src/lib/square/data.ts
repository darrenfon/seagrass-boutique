// Square data-access layer.
//
// Exposes the SAME function names and signatures as src/lib/shopify/data.ts so
// the backend-agnostic facade (src/lib/commerce/data.ts) can dispatch to either
// backend transparently. Pages never import this file directly.
//
// On any Square API failure these fall back to the bundled static catalog,
// mirroring the Shopify data layer's resilience behaviour.

import { searchItems, retrieveItem, searchCategories, batchRetrieveInventory } from "./queries";
import {
  buildContext,
  normalizeProduct,
  normalizeCollection,
  slugify,
  resolveCategoryId,
} from "./normalize";
import type {
  SquareCatalogItem,
  SquareCatalogImage,
  SquareCatalogCategory,
  SquareInventoryCount,
} from "./types";
import type { Product, Collection } from "../products";
import {
  getProductsByCollection as getStaticByCollection,
  getProductsByCategory as getStaticByCategory,
  getTrendingProducts as getStaticTrending,
  getProductByHandle as getStaticByHandle,
  getCollectionByHandle as getStaticCollection,
  collections as staticCollections,
} from "../products";

// ─── Internal: fetch + normalize the whole Square catalog ────────
// One catalog search + one inventory batch covers the entire small boutique
// catalog; results are normalized into Product[] with category names attached.
interface SquareCatalogResult {
  products: Product[];
  // product handle -> Square category name (for category/collection filtering)
  categoryNameByHandle: Map<string, string>;
}

async function loadCatalog(): Promise<SquareCatalogResult> {
  const search = await searchItems();
  const items = (search.objects || []).filter(
    (o): o is SquareCatalogItem => o.type === "ITEM"
  );
  const related = search.related_objects || [];

  // Inventory for every variation across every item.
  const variationIds: string[] = [];
  for (const item of items) {
    for (const v of item.item_data.variations || []) variationIds.push(v.id);
  }
  const inv = await batchRetrieveInventory(variationIds);

  const ctx = buildContext(
    related as (SquareCatalogImage | SquareCatalogCategory | { type: string })[],
    (inv.counts || []) as SquareInventoryCount[]
  );

  const categoryNameByHandle = new Map<string, string>();
  const products = items.map((item) => {
    const p = normalizeProduct(item, ctx);
    const catId = resolveCategoryId(item);
    const catName = catId
      ? ctx.categoriesById.get(catId)?.category_data?.name
      : undefined;
    if (catName) categoryNameByHandle.set(p.handle, catName);
    return p;
  });

  return { products, categoryNameByHandle };
}

// ─── Public API — mirrors src/lib/shopify/data.ts ────────────────

/** Products belonging to a collection (matched by slugified Square category name). */
export async function getProductsByCollection(handle: string): Promise<Product[]> {
  try {
    const { products, categoryNameByHandle } = await loadCatalog();
    const matched = products.filter(
      (p) => slugify(categoryNameByHandle.get(p.handle) || "") === handle
    );
    if (matched.length > 0) return matched;
  } catch (e) {
    console.warn(`Square fetch failed for collection "${handle}", using static data:`, e);
  }
  return getStaticByCollection(handle);
}

/** Products in a category — Square category name slug, with static fallback. */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const { products, categoryNameByHandle } = await loadCatalog();
    if (categorySlug === "new-arrivals") {
      return sortByNewest(products);
    }
    const matched = products.filter((p) => {
      const catName = categoryNameByHandle.get(p.handle);
      // Match either the storefront category slug or the slugified Square name.
      return p.category === categorySlug || slugify(catName || "") === categorySlug;
    });
    if (matched.length > 0) return matched;
  } catch (e) {
    console.warn(`Square fetch failed for category "${categorySlug}", using static data:`, e);
  }
  return getStaticByCategory(categorySlug);
}

// Sort products newest-first by Square created_at; items without a timestamp
// sink to the bottom (preserving their relative order).
function sortByNewest(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return tb - ta;
  });
}

/**
 * "What's New" — products created in the last `days` days, newest first.
 * Kevin's requested feature: auto-populated from when items are added in Square.
 * Falls back to the newest-by-created-at items if none fall in the window,
 * so the page is never empty.
 */
export async function getNewArrivals(days = 30): Promise<Product[]> {
  try {
    const { products } = await loadCatalog();
    if (products.length > 0) {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const recent = sortByNewest(
        products.filter((p) => p.createdAt && Date.parse(p.createdAt) >= cutoff)
      );
      if (recent.length > 0) return recent;
      // Nothing in the window — show the newest items regardless of age.
      return sortByNewest(products).slice(0, 24);
    }
  } catch (e) {
    console.warn("Square fetch failed for new arrivals, using static data:", e);
  }
  return getStaticTrending();
}

/** Trending/featured products — Square has no native "trending"; returns all items. */
export async function getTrendingProducts(): Promise<Product[]> {
  try {
    const { products } = await loadCatalog();
    if (products.length > 0) return products;
  } catch (e) {
    console.warn("Square fetch failed for trending products, using static data:", e);
  }
  return getStaticTrending();
}

/** A single product by slug/handle. */
export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  try {
    const { products } = await loadCatalog();
    const found = products.find((p) => p.handle === handle);
    if (found) return found;
  } catch (e) {
    console.warn(`Square fetch failed for product "${handle}", using static data:`, e);
  }
  return getStaticByHandle(handle);
}

/** A collection by handle — built from the matching Square category. */
export async function getCollectionByHandle(handle: string): Promise<Collection | undefined> {
  try {
    const catRes = await searchCategories();
    const categories = (catRes.objects || []).filter(
      (o): o is SquareCatalogCategory => o.type === "CATEGORY"
    );
    const match = categories.find(
      (c) => slugify(c.category_data?.name || "") === handle
    );
    if (match) return normalizeCollection(match);
  } catch (e) {
    console.warn(`Square fetch failed for collection "${handle}", using static data:`, e);
  }
  return getStaticCollection(handle);
}

/** Featured collections — derived from Square categories, static fallback. */
export async function getFeaturedCollections(): Promise<Collection[]> {
  try {
    const catRes = await searchCategories();
    const categories = (catRes.objects || []).filter(
      (o): o is SquareCatalogCategory => o.type === "CATEGORY"
    );
    if (categories.length > 0) return categories.map(normalizeCollection);
  } catch (e) {
    console.warn("Square fetch failed for featured collections, using static data:", e);
  }
  return staticCollections.filter((c) => c.featured);
}

/** Used by the checkout route to resolve catalog object IDs server-side. */
export { retrieveItem };
