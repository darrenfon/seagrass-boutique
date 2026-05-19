// Square client-side cart.
//
// Square has no server-side persistent cart object like Shopify's Cart. The
// recommended flow (square-spike/FINDINGS.md) is a client-side cart that holds
// Square catalog variation IDs, with a Payment Link created only at checkout.
//
// To avoid ANY UI changes, this module builds objects that match the exact
// ShopifyCart shape the cart drawer / line-item components already consume.
// `checkoutUrl` starts empty and is filled by calling /api/square-checkout.

import type { ShopifyCart, ShopifyCartLine } from "../shopify/types";

// What the client cart actually persists: variation ID + quantity.
export interface SquareCartEntry {
  variationId: string;
  quantity: number;
}

// Display data hydrated from /api/square-product, keyed by variation ID.
export interface SquareLineDisplay {
  variationId: string;
  variationTitle: string;
  productTitle: string;
  vendor: string;
  handle: string;
  price: number;
  image: string | null;
}

export const SQUARE_CART_STORAGE_KEY = "seagrass_square_cart";

/** Read the persisted Square cart entries from localStorage. */
export function loadEntries(): SquareCartEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SQUARE_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.variationId === "string")
      .map((e) => ({ variationId: e.variationId, quantity: Number(e.quantity) || 1 }));
  } catch {
    return [];
  }
}

/** Persist the Square cart entries to localStorage. */
export function saveEntries(entries: SquareCartEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SQUARE_CART_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

/** Hydrate variation display data via the server lookup route. */
export async function fetchLineDisplays(
  variationIds: string[]
): Promise<Record<string, SquareLineDisplay>> {
  if (variationIds.length === 0) return {};
  const res = await fetch("/api/square-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variationIds }),
  });
  if (!res.ok) return {};
  const json = await res.json();
  return (json.items as Record<string, SquareLineDisplay>) || {};
}

/**
 * Build a ShopifyCart-shaped object from Square cart entries + display data.
 * `checkoutUrl` is supplied separately (empty until /api/square-checkout runs).
 */
export function buildShopifyShapedCart(
  entries: SquareCartEntry[],
  displays: Record<string, SquareLineDisplay>,
  checkoutUrl: string
): ShopifyCart {
  const lines: { node: ShopifyCartLine }[] = entries
    .map((entry) => {
      const d = displays[entry.variationId];
      if (!d) return null;
      const node: ShopifyCartLine = {
        // Line ID = variation ID; the Square cart has one line per variation.
        id: entry.variationId,
        quantity: entry.quantity,
        merchandise: {
          id: entry.variationId,
          title: d.variationTitle,
          product: {
            title: d.productTitle,
            handle: d.handle,
            vendor: d.vendor,
          },
          image: d.image ? { url: d.image, altText: d.productTitle } : null,
          price: { amount: d.price.toFixed(2), currencyCode: "USD" },
        },
      };
      return { node };
    })
    .filter((l): l is { node: ShopifyCartLine } => l !== null);

  const totalQuantity = lines.reduce((sum, l) => sum + l.node.quantity, 0);
  const subtotal = lines.reduce(
    (sum, l) => sum + parseFloat(l.node.merchandise.price.amount) * l.node.quantity,
    0
  );
  const money = { amount: subtotal.toFixed(2), currencyCode: "USD" };

  return {
    id: "square-client-cart",
    checkoutUrl,
    totalQuantity,
    cost: { totalAmount: money, subtotalAmount: money },
    lines: { edges: lines },
  };
}

/** Create a Square hosted payment link for the current cart entries. */
export async function createSquareCheckout(entries: SquareCartEntry[]): Promise<string> {
  const res = await fetch("/api/square-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lines: entries.map((e) => ({
        catalogObjectId: e.variationId,
        quantity: e.quantity,
      })),
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.checkoutUrl) {
    throw new Error(json.error || "Square checkout failed");
  }
  return json.checkoutUrl as string;
}
