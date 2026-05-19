// Square product lookup route — used by the client-side Square cart to hydrate
// cart line items (title, vendor, image, price) from a variation ID.
//
// The Square client cart only stores catalog variation IDs + quantities; this
// route resolves the display data the cart drawer needs. Token stays server-only.

import { NextRequest, NextResponse } from "next/server";
import { searchItems, batchRetrieveInventory } from "@/lib/square/queries";
import { buildContext, normalizeProduct } from "@/lib/square/normalize";
import type {
  SquareCatalogItem,
  SquareCatalogImage,
  SquareCatalogCategory,
  SquareInventoryCount,
} from "@/lib/square/types";

// Returns, for each requested variation ID, the display fields the cart needs.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const variationIds: string[] = Array.isArray(body?.variationIds)
      ? body.variationIds
      : [];
    if (variationIds.length === 0) {
      return NextResponse.json({ items: {} });
    }

    const search = await searchItems();
    const items = (search.objects || []).filter(
      (o): o is SquareCatalogItem => o.type === "ITEM"
    );
    const allVarIds: string[] = [];
    for (const item of items) {
      for (const v of item.item_data.variations || []) allVarIds.push(v.id);
    }
    const inv = await batchRetrieveInventory(allVarIds);
    const ctx = buildContext(
      (search.related_objects || []) as (
        | SquareCatalogImage
        | SquareCatalogCategory
        | { type: string }
      )[],
      (inv.counts || []) as SquareInventoryCount[]
    );

    // variationId -> display payload
    const result: Record<
      string,
      {
        variationId: string;
        variationTitle: string;
        productTitle: string;
        vendor: string;
        handle: string;
        price: number;
        image: string | null;
      }
    > = {};

    for (const item of items) {
      const product = normalizeProduct(item, ctx);
      for (const v of item.item_data.variations || []) {
        if (!variationIds.includes(v.id)) continue;
        result[v.id] = {
          variationId: v.id,
          variationTitle: v.item_variation_data.name || "Regular",
          productTitle: product.title,
          vendor: product.vendor,
          handle: product.handle,
          price: (v.item_variation_data.price_money?.amount || 0) / 100,
          image: product.realImage || null,
        };
      }
    }

    return NextResponse.json({ items: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    console.error("Square product lookup error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
