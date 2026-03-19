"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
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

// All cart mutations go through our API route to keep the token server-only
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemCount = cart?.totalQuantity ?? 0;

  // Restore cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCartId) return;

    cartFetch<CartQueryResponse>(CART_QUERY, { cartId: savedCartId })
      .then((data) => {
        if (data.cart) {
          setCart(data.cart);
        } else {
          // Cart expired or invalid — clear it
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
          // Create a new cart with this item
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
          // Add to existing cart
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
          // Remove the line instead
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

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
