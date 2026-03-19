// Shopify-first data fetchers with static fallback
// Checks SHOPIFY_STORE_LIVE flag — when false, skips Shopify entirely

import { shopifyFetch } from "./client";
import { PRODUCTS_QUERY, COLLECTION_PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from "./queries";
import { normalizeProduct, normalizeCollection } from "./normalize";
import type { ProductsResponse, CollectionResponse, ProductResponse } from "./types";
import type { Product, Collection } from "../products";
import {
  getProductsByCollection as getStaticByCollection,
  getProductsByCategory as getStaticByCategory,
  getTrendingProducts as getStaticTrending,
  getProductByHandle as getStaticByHandle,
  getCollectionByHandle as getStaticCollection,
  collections as staticCollections,
} from "../products";

const isShopifyLive = process.env.SHOPIFY_STORE_LIVE === "true";

// Fetch products from a Shopify collection, falling back to static data
export async function getProductsByCollection(handle: string): Promise<Product[]> {
  if (!isShopifyLive) return getStaticByCollection(handle);

  try {
    const data = await shopifyFetch<CollectionResponse>(
      COLLECTION_PRODUCTS_QUERY,
      { handle, first: 50 },
      { revalidate: 300 }
    );
    const products = data.collection?.products.edges.map((e) => normalizeProduct(e.node)) || [];
    if (products.length > 0) return products;
  } catch (e) {
    console.warn(`Shopify fetch failed for collection "${handle}", using static data:`, e);
  }
  return getStaticByCollection(handle);
}

// Fetch products by category — tries Shopify collection handle first, then product_type query
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isShopifyLive) return getStaticByCategory(categorySlug);

  try {
    // First try as a Shopify collection
    const data = await shopifyFetch<CollectionResponse>(
      COLLECTION_PRODUCTS_QUERY,
      { handle: categorySlug, first: 100 },
      { revalidate: 300 }
    );
    const products = data.collection?.products.edges.map((e) => normalizeProduct(e.node)) || [];
    if (products.length > 0) return products;

    // Fallback: query by product_type
    const typeData = await shopifyFetch<ProductsResponse>(
      PRODUCTS_QUERY,
      { first: 100, query: `product_type:${categorySlug}` },
      { revalidate: 300 }
    );
    const typeProducts = typeData.products.edges.map((e) => normalizeProduct(e.node));
    if (typeProducts.length > 0) return typeProducts;
  } catch (e) {
    console.warn(`Shopify fetch failed for category "${categorySlug}", using static data:`, e);
  }
  return getStaticByCategory(categorySlug);
}

// Fetch trending/featured products
export async function getTrendingProducts(): Promise<Product[]> {
  if (!isShopifyLive) return getStaticTrending();

  try {
    // Try a "trending" or "featured" collection first
    const data = await shopifyFetch<CollectionResponse>(
      COLLECTION_PRODUCTS_QUERY,
      { handle: "trending", first: 12 },
      { revalidate: 300 }
    );
    const products = data.collection?.products.edges.map((e) => normalizeProduct(e.node)) || [];
    if (products.length > 0) return products;

    // Fallback: get the newest products
    const allData = await shopifyFetch<ProductsResponse>(
      PRODUCTS_QUERY,
      { first: 12 },
      { revalidate: 300 }
    );
    const allProducts = allData.products.edges.map((e) => normalizeProduct(e.node));
    if (allProducts.length > 0) return allProducts;
  } catch (e) {
    console.warn("Shopify fetch failed for trending products, using static data:", e);
  }
  return getStaticTrending();
}

// Fetch a single product by handle
export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  if (!isShopifyLive) return getStaticByHandle(handle);

  try {
    const data = await shopifyFetch<ProductResponse>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle },
      { revalidate: 300 }
    );
    if (data.product) return normalizeProduct(data.product);
  } catch (e) {
    console.warn(`Shopify fetch failed for product "${handle}", using static data:`, e);
  }
  return getStaticByHandle(handle);
}

// Fetch a collection by handle
export async function getCollectionByHandle(handle: string): Promise<Collection | undefined> {
  if (!isShopifyLive) return getStaticCollection(handle);

  try {
    const data = await shopifyFetch<CollectionResponse>(
      COLLECTION_PRODUCTS_QUERY,
      { handle, first: 1 },
      { revalidate: 300 }
    );
    if (data.collection) return normalizeCollection(data.collection);
  } catch (e) {
    console.warn(`Shopify fetch failed for collection "${handle}", using static data:`, e);
  }
  return getStaticCollection(handle);
}

// Get featured collections
export async function getFeaturedCollections(): Promise<Collection[]> {
  if (!isShopifyLive) return staticCollections.filter((c) => c.featured);
  // For now, return static collections — Shopify collection listing can be added later
  return staticCollections.filter((c) => c.featured);
}
