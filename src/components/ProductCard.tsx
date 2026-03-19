"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
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
          /* Gradient placeholder with initials */
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${product.image} product-image-placeholder`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-5xl sm:text-6xl text-white/[0.15] select-none">
                {initials}
              </span>
            </div>
          </>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/95 backdrop-blur-sm text-ink text-[13px] font-medium px-7 py-2.5 rounded-full
                       translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                       transition-all duration-300 delay-75
                       shadow-lg hover:bg-ocean hover:text-white"
          >
            Add to Cart
          </motion.button>
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
