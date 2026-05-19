// Square Catalog + Inventory + Location query functions.
// Square is REST (not GraphQL), so this file holds request helpers rather
// than query strings — the analogue of src/lib/shopify/queries.ts.
// All request shapes are proven in square-spike/02-catalog.js.

import { squareFetch } from "./client";
import type {
  SquareSearchResponse,
  SquareRetrieveResponse,
  SquareInventoryResponse,
  SquareLocationsResponse,
} from "./types";

const CATALOG_REVALIDATE = 300; // 5 min ISR, matches the Shopify data layer

let cachedLocationId: string | null = null;

/**
 * Resolve the Square location ID.
 * Uses SQUARE_LOCATION_ID if set, else the first ACTIVE location.
 * Cached per-process after the first lookup.
 */
export async function getLocationId(): Promise<string> {
  const pinned = process.env.SQUARE_LOCATION_ID?.trim();
  if (pinned) return pinned;
  if (cachedLocationId) return cachedLocationId;

  const res = await squareFetch<SquareLocationsResponse>("/v2/locations");
  const locations = res.locations || [];
  const active = locations.find((l) => l.status === "ACTIVE") || locations[0];
  if (!active) throw new Error("No Square location available");
  cachedLocationId = active.id;
  return active.id;
}

/** Search all ITEM objects, including related IMAGE/CATEGORY objects for ID-joins. */
export async function searchItems(): Promise<SquareSearchResponse> {
  return squareFetch<SquareSearchResponse>(
    "/v2/catalog/search",
    "POST",
    { object_types: ["ITEM"], include_related_objects: true },
    { revalidate: CATALOG_REVALIDATE }
  );
}

/** Retrieve a single ITEM by Square catalog object ID, with related objects. */
export async function retrieveItem(itemId: string): Promise<SquareRetrieveResponse> {
  return squareFetch<SquareRetrieveResponse>(
    `/v2/catalog/object/${encodeURIComponent(itemId)}?include_related_objects=true`,
    "GET",
    undefined,
    { revalidate: CATALOG_REVALIDATE }
  );
}

/** List all CATEGORY objects. */
export async function searchCategories(): Promise<SquareSearchResponse> {
  return squareFetch<SquareSearchResponse>(
    "/v2/catalog/search",
    "POST",
    { object_types: ["CATEGORY"] },
    { revalidate: CATALOG_REVALIDATE }
  );
}

/**
 * Retrieve inventory counts for a set of variation IDs.
 * Returns [] when the list is empty (Square rejects empty batches).
 */
export async function batchRetrieveInventory(
  variationIds: string[]
): Promise<SquareInventoryResponse> {
  if (variationIds.length === 0) return { counts: [] };
  const locationId = await getLocationId();
  return squareFetch<SquareInventoryResponse>(
    "/v2/inventory/counts/batch-retrieve",
    "POST",
    { catalog_object_ids: variationIds, location_ids: [locationId] }
  );
}
