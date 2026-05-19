"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
} from "./shopify/mutations";
import type {
  ShopifyCart,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  CartQueryResponse,
} from "./shopify/types";
import { CLIENT_COMMERCE_BACKEND } from "./commerce/config";
import {
  type SquareCartEntry,
  type SquareLineDisplay,
  loadEntries as loadSquareEntries,
  saveEntries as saveSquareEntries,
  fetchLineDisplays as fetchSquareDisplays,
  buildShopifyShapedCart,
  createSquareCheckout,
} from "./square/cart";

// ─── Shared context shape — identical regardless of backend ──────
// The `cart` value is always a ShopifyCart-shaped object so the cart drawer
// and line-item components stay unchanged for either backend.
interface CartContextValue {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
  itemCount: number;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "seagrass_cart_id";
const isSquare = CLIENT_COMMERCE_BACKEND === "square";

// All Shopify cart mutations go through the API route to keep the token server-only.
async function cartFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Cart request failed" }));
    throw new Error(err.error || "Cart request failed");
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
// Shopify cart provider — UNCHANGED behaviour from the original file.
// ═══════════════════════════════════════════════════════════════
function ShopifyCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemCount = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCartId) return;

    cartFetch<CartQueryResponse>(CART_QUERY, { cartId: savedCartId })
      .then((data) => {
        if (data.cart) {
          setCart(data.cart);
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(CART_STORAGE_KEY);
      });
  }, []);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!variantId) return;
      setIsLoading(true);

      try {
        if (!cart) {
          const data = await cartFetch<CartCreateResponse>(CART_CREATE_MUTATION, {
            input: {
              lines: [{ merchandiseId: variantId, quantity }],
            },
          });
          const newCart = data.cartCreate.cart;
          if (newCart) {
            setCart(newCart);
            localStorage.setItem(CART_STORAGE_KEY, newCart.id);
          }
        } else {
          const data = await cartFetch<CartLinesAddResponse>(CART_LINES_ADD_MUTATION, {
            cartId: cart.id,
            lines: [{ merchandiseId: variantId, quantity }],
          });
          const updatedCart = data.cartLinesAdd.cart;
          if (updatedCart) setCart(updatedCart);
        }
        setIsOpen(true);
      } catch (e) {
        console.error("Failed to add to cart:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);

      try {
        if (quantity <= 0) {
          const data = await cartFetch<CartLinesRemoveResponse>(CART_LINES_REMOVE_MUTATION, {
            cartId: cart.id,
            lineIds: [lineId],
          });
          if (data.cartLinesRemove.cart) setCart(data.cartLinesRemove.cart);
        } else {
          const data = await cartFetch<CartLinesUpdateResponse>(CART_LINES_UPDATE_MUTATION, {
            cartId: cart.id,
            lines: [{ id: lineId, quantity }],
          });
          if (data.cartLinesUpdate.cart) setCart(data.cartLinesUpdate.cart);
        }
      } catch (e) {
        console.error("Failed to update cart:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);

      try {
        const data = await cartFetch<CartLinesRemoveResponse>(CART_LINES_REMOVE_MUTATION, {
          cartId: cart.id,
          lineIds: [lineId],
        });
        if (data.cartLinesRemove.cart) setCart(data.cartLinesRemove.cart);
      } catch (e) {
        console.error("Failed to remove from cart:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  return (
    <CartContext value={{
      cart,
      isOpen,
      isLoading,
      itemCount,
      addToCart,
      updateQuantity,
      removeItem,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext>
  );
}

// ═══════════════════════════════════════════════════════════════
// Square cart provider — client-side cart of catalog variation IDs.
// Produces ShopifyCart-shaped values so the UI is identical.
// Checkout uses a Square hosted Payment Link (analogous to checkoutUrl).
// ═══════════════════════════════════════════════════════════════
function SquareCartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SquareCartEntry[]>([]);
  const [displays, setDisplays] = useState<Record<string, SquareLineDisplay>>({});
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Guards against stale async results overwriting newer cart state.
  const requestSeq = useRef(0);

  // Restore entries from localStorage on mount.
  useEffect(() => {
    const restored = loadSquareEntries();
    if (restored.length > 0) setEntries(restored);
  }, []);

  // Whenever entries change: persist, hydrate display data, regenerate the
  // payment link so checkoutUrl is ready by the time the user clicks Checkout.
  useEffect(() => {
    saveSquareEntries(entries);
    const seq = ++requestSeq.current;

    if (entries.length === 0) {
      setDisplays({});
      setCheckoutUrl("");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const variationIds = entries.map((e) => e.variationId);
        const [hydrated, url] = await Promise.all([
          fetchSquareDisplays(variationIds),
          createSquareCheckout(entries).catch((e) => {
            console.error("Square checkout link failed:", e);
            return "";
          }),
        ]);
        if (cancelled || seq !== requestSeq.current) return;
        setDisplays(hydrated);
        setCheckoutUrl(url);
      } catch (e) {
        if (!cancelled) console.error("Failed to refresh Square cart:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [entries]);

  const cart: ShopifyCart | null =
    entries.length > 0 ? buildShopifyShapedCart(entries, displays, checkoutUrl) : null;
  const itemCount = entries.reduce((sum, e) => sum + e.quantity, 0);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    if (!variantId) return;
    setIsLoading(true);
    try {
      setEntries((prev) => {
        const existing = prev.find((e) => e.variationId === variantId);
        if (existing) {
          return prev.map((e) =>
            e.variationId === variantId
              ? { ...e, quantity: e.quantity + quantity }
              : e
          );
        }
        return [...prev, { variationId: variantId, quantity }];
      });
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    setEntries((prev) =>
      quantity <= 0
        ? prev.filter((e) => e.variationId !== lineId)
        : prev.map((e) => (e.variationId === lineId ? { ...e, quantity } : e))
    );
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setEntries((prev) => prev.filter((e) => e.variationId !== lineId));
  }, []);

  return (
    <CartContext value={{
      cart,
      isOpen,
      isLoading,
      itemCount,
      addToCart,
      updateQuantity,
      removeItem,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext>
  );
}

// Dispatches to the active backend's cart provider via the feature flag.
export function CartProvider({ children }: { children: ReactNode }) {
  return isSquare ? (
    <SquareCartProvider>{children}</SquareCartProvider>
  ) : (
    <ShopifyCartProvider>{children}</ShopifyCartProvider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
