"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function getInitials(title: string): string {
  return title
    .split(/[\s-]+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const initials = getInitials(product.title);
  const hasImage = !!product.realImage;

  // Entrance drop-in that plays on MOUNT (animate), not on scroll (whileInView).
  // whileInView previously left large grids stuck invisible when its observer
  // didn't fire; `animate` always resolves to opacity:1. Delay is taken modulo a
  // page so it staggers within each infinite-scroll batch without exploding.
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: (index % 24) * 0.045, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <motion.div
        whileHover={{ y: -6, rotate: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500"
      >
        {hasImage ? (
          /* Real product photo */
          <Image
            src={product.realImage!}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* Branded placeholder for products without a photo yet */
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-shell via-sand to-driftwood/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
              <span className="font-serif text-4xl sm:text-5xl text-ocean/25 select-none leading-none">
                {initials}
              </span>
              <span className="font-serif text-sm text-ink/45 leading-snug line-clamp-2 select-none">
                {product.title}
              </span>
            </div>
          </>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-5">
          <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
            <AddToCartButton
              variantId={product.shopifyVariantId}
              className="bg-white/95 backdrop-blur-sm text-ink text-[13px] font-medium px-7 py-2.5 rounded-full
                         shadow-lg hover:bg-ocean hover:text-white transition-colors"
            />
          </div>
        </div>

        {product.compareAtPrice && (
          <span className="absolute top-3 left-3 bg-coral text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
            Sale
          </span>
        )}
      </motion.div>

      <div className="space-y-0.5 px-0.5">
        <p className="text-[11px] text-ink-light/70 tracking-[0.1em] uppercase font-medium">{product.vendor}</p>
        <h3 className="text-sm font-medium text-ink group-hover:text-ocean transition-colors duration-200 leading-snug">
          {product.title}
        </h3>
        <p className="text-sm font-semibold text-ink pt-0.5">
          ${product.price.toFixed(2)}
          {product.compareAtPrice && (
            <span className="text-xs text-ink-light/60 line-through ml-2 font-normal">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </p>
      </div>
    </motion.article>
  );
}
