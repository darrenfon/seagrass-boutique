"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const { cart, isOpen, closeCart, itemCount } = useCart();
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const subtotal = cart?.cost.subtotalAmount;
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-sand z-[61] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-driftwood/30">
              <h2 className="font-serif text-xl text-ink">
                Your Cart
                {itemCount > 0 && (
                  <span className="text-sm font-sans text-ink-light ml-2">
                    ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-ink-light hover:text-ink transition-colors"
                aria-label="Close cart"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Line items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-driftwood mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <p className="font-serif text-lg text-ink mb-2">Your cart is empty</p>
                  <p className="text-ink-light text-sm mb-6">Looks like you haven&apos;t found anything yet.</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-ocean text-white text-sm font-medium rounded-full hover:bg-ocean-deep transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lines.map((line) => (
                    <CartLineItem key={line.id} line={line} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer — subtotal + checkout */}
            {lines.length > 0 && (
              <div className="border-t border-driftwood/30 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-ink-light text-sm">Subtotal</span>
                  <span className="font-semibold text-ink text-lg">
                    ${subtotal ? parseFloat(subtotal.amount).toFixed(2) : "0.00"}
                  </span>
                </div>
                <p className="text-xs text-ink-light">
                  Shipping and taxes calculated at checkout.
                </p>
                <a
                  href={checkoutUrl || "#"}
                  className="block w-full py-3.5 bg-ocean text-white text-center text-sm font-medium rounded-full
                             hover:bg-ocean-deep transition-colors shadow-lg shadow-ocean/20"
                >
                  Checkout
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
