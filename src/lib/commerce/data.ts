// Backend-agnostic commerce data facade.
//
// Pages import from here instead of a specific backend. This module dispatches
// every call to either the Shopify or the Square data layer based on the
// COMMERCE_BACKEND feature flag. Both backends expose identical function names,
// signatures and return shapes, so callers are byte-for-byte identical.
//
// The Shopify data layer is NOT modified — this facade sits above it.

import { isSquareBackend } from "./config";
import * as shopify from "../shopify/data";
import * as square from "../square/data";
import type { Product, Collection } from "../products";

const backend = isSquareBackend ? square : shopify;

export function getProductsByCollection(handle: string): Promise<Product[]> {
  return backend.getProductsByCollection(handle);
}

export function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return backend.getProductsByCategory(categorySlug);
}

export function getTrendingProducts(): Promise<Product[]> {
  return backend.getTrendingProducts();
}

export function getProductByHandle(handle: string): Promise<Product | undefined> {
  return backend.getProductByHandle(handle);
}

export function getCollectionByHandle(handle: string): Promise<Collection | undefined> {
  return backend.getCollectionByHandle(handle);
}

export function getFeaturedCollections(): Promise<Collection[]> {
  return backend.getFeaturedCollections();
}
