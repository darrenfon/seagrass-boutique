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

/**
 * Search ALL ITEM objects, paginating through Square's cursor.
 * Square caps a single search page at 1000 objects; the boutique catalog exceeds
 * that (~1,266 items), so a single request silently drops the tail — and Square
 * paginates newest-last, so the DROPPED page is the most recent arrivals. We must
 * loop the cursor to load the whole catalog. Related IMAGE/CATEGORY objects are
 * aggregated across pages for the ID-joins.
 */
export async function searchItems(): Promise<SquareSearchResponse> {
  const objects: NonNullable<SquareSearchResponse["objects"]> = [];
  const related: NonNullable<SquareSearchResponse["related_objects"]> = [];
  let cursor: string | undefined;
  let guard = 0;
  do {
    const body: Record<string, unknown> = {
      object_types: ["ITEM"],
      include_related_objects: true,
      limit: 1000,
    };
    if (cursor) body.cursor = cursor;
    const page = await squareFetch<SquareSearchResponse>(
      "/v2/catalog/search",
      "POST",
      body,
      { revalidate: CATALOG_REVALIDATE }
    );
    if (page.objects) objects.push(...page.objects);
    if (page.related_objects) related.push(...page.related_objects);
    cursor = page.cursor;
  } while (cursor && ++guard < 25);
  return { objects, related_objects: related };
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
 * Square caps catalog_object_ids per request (~1000) and paginates the response
 * with a cursor. The full catalog has thousands of variations, so we chunk the
 * IDs and drain each chunk's cursor, aggregating all counts.
 * Returns [] when the list is empty (Square rejects empty batches).
 */
export async function batchRetrieveInventory(
  variationIds: string[]
): Promise<SquareInventoryResponse> {
  if (variationIds.length === 0) return { counts: [] };
  const locationId = await getLocationId();
  const counts: NonNullable<SquareInventoryResponse["counts"]> = [];
  const CHUNK = 500;
  for (let i = 0; i < variationIds.length; i += CHUNK) {
    const chunk = variationIds.slice(i, i + CHUNK);
    let cursor: string | undefined;
    let guard = 0;
    do {
      const body: Record<string, unknown> = {
        catalog_object_ids: chunk,
        location_ids: [locationId],
      };
      if (cursor) body.cursor = cursor;
      const page = await squareFetch<SquareInventoryResponse>(
        "/v2/inventory/counts/batch-retrieve",
        "POST",
        body
      );
      if (page.counts) counts.push(...page.counts);
      cursor = page.cursor;
    } while (cursor && ++guard < 25);
  }
  return { counts };
}
