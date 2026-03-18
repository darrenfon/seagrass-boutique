"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Collection } from "@/lib/products";

// Each collection gets a unique gradient
const collectionGradients: Record<string, string> = {
  voluspa: "from-rose-300 via-pink-200 to-amber-100",
  "riddle-oil": "from-stone-700 via-stone-500 to-amber-200",
  "spring-fashion": "from-emerald-200 via-sky-100 to-rose-100",
  "summer-fashion": "from-amber-200 via-orange-100 to-sky-200",
};

interface CollectionBannerProps {
  collection: Collection;
  index: number;
  layout?: "hero" | "compact" | "large" | "small";
}

export function CollectionBanner({ collection, index, layout = "compact" }: CollectionBannerProps) {
  const isHero = layout === "hero";
  const isLarge = layout === "large";

  // Aspect ratio varies by layout to create visual tension
  const aspectClass = isHero
    ? "aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-full min-h-[300px]"
    : isLarge
    ? "aspect-[4/5] sm:aspect-[3/4]"
    : "aspect-[3/4] sm:aspect-[4/5]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/collections/${collection.handle}`}
        className={`group block relative overflow-hidden rounded-2xl h-full ${aspectClass}`}
      >
        {/* Background gradient with scale-on-hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            collectionGradients[collection.handle] || "from-stone-200 to-gray-300"
          } transition-transform duration-700 ease-out group-hover:scale-[1.06]`}
        />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient overlay — deeper for hero, lighter for compact */}
        <div className={`absolute inset-0 ${
          isHero
            ? "bg-gradient-to-t from-ink/60 via-ink/15 to-ink/5"
            : "bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"
        }`} />

        {/* Content */}
        <div className={`absolute inset-0 flex flex-col justify-end ${isHero ? "p-7 sm:p-10" : "p-5 sm:p-6"}`}>
          <h3 className={`font-serif text-white leading-tight mb-1.5 ${
            isHero ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-2xl"
          }`}>
            {collection.title}
          </h3>
          {(isHero || isLarge) && (
            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-3 max-w-sm">
              {collection.description}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white/80 group-hover:text-white transition-colors duration-300">
            Shop Now
            <svg
              width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              className="transform group-hover:translate-x-1.5 transition-transform duration-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
