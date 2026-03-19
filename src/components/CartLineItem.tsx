"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import type { ShopifyCartLine } from "@/lib/shopify/types";

interface CartLineItemProps {
  line: ShopifyCartLine;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCart();
  const { merchandise, quantity } = line;
  const price = parseFloat(merchandise.price.amount);
  const imageUrl = merchandise.image?.url;

  return (
    <div className="flex gap-4 py-3 border-b border-driftwood/20 last:border-0">
      {/* Thumbnail */}
      <div className="w-20 h-24 rounded-lg overflow-hidden bg-shell flex-shrink-0 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-gray-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-ink-light/70 tracking-[0.1em] uppercase font-medium">
          {merchandise.product.vendor}
        </p>
        <p className="text-sm font-medium text-ink leading-snug truncate">
          {merchandise.product.title}
        </p>
        {merchandise.title !== "Default Title" && (
          <p className="text-xs text-ink-light mt-0.5">{merchandise.title}</p>
        )}
        <p className="text-sm font-semibold text-ink mt-1">
          ${(price * quantity).toFixed(2)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(line.id, quantity - 1)}
            disabled={isLoading}
            className="w-7 h-7 rounded-full border border-driftwood/40 flex items-center justify-center
                       text-ink-light hover:text-ink hover:border-ink/30 transition-colors disabled:opacity-40"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="text-sm font-medium text-ink w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(line.id, quantity + 1)}
            disabled={isLoading}
            className="w-7 h-7 rounded-full border border-driftwood/40 flex items-center justify-center
                       text-ink-light hover:text-ink hover:border-ink/30 transition-colors disabled:opacity-40"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>

          {/* Remove */}
          <button
            onClick={() => removeItem(line.id)}
            disabled={isLoading}
            className="ml-auto text-ink-light/50 hover:text-coral transition-colors disabled:opacity-40"
            aria-label="Remove item"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
