"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

interface AddToCartButtonProps {
  variantId?: string;
  className?: string;
}

export function AddToCartButton({ variantId, className }: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = async () => {
    if (!variantId) {
      // Static product — no Shopify variant yet
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }
    await addToCart(variantId);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isLoading}
      className={className || `bg-white/95 backdrop-blur-sm text-ink text-[13px] font-medium px-7 py-2.5 rounded-full
                 shadow-lg hover:bg-ocean hover:text-white transition-colors disabled:opacity-60`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Adding...
        </span>
      ) : showMessage ? (
        "Coming Soon!"
      ) : (
        "Add to Cart"
      )}
    </motion.button>
  );
}
