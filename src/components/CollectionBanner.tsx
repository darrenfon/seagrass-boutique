"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Collection } from "@/lib/products";

// Fallback gradients for collections without real photos
const collectionGradients: Record<string, string> = {
  voluspa: "from-rose-300 via-pink-200 to-amber-100",
  "riddle-oil": "from-stone-700 via-stone-500 to-amber-200",
  "spring-fashion": "from-emerald-200 via-sky-100 to-rose-100",
  "summer-fashion": "from-amber-200 via-orange-100 to-sky-200",
  // Square-category collections
  dress: "from-rose-200 via-pink-100 to-amber-100",
  tops: "from-sky-200 via-cyan-100 to-teal-100",
  denim: "from-indigo-300 via-blue-200 to-sky-100",
  jewelry: "from-amber-200 via-yellow-100 to-stone-100",
  shoes: "from-stone-300 via-stone-200 to-amber-100",
  handbags: "from-teal-200 via-emerald-100 to-lime-100",
  sweater: "from-orange-200 via-amber-100 to-rose-100",
};

interface CollectionBannerProps {
  collection: Collection;
  index: number;
  layout?: "hero" | "compact" | "large" | "small";
}

export function CollectionBanner({ collection, index, layout = "compact" }: CollectionBannerProps) {
  const isHero = layout === "hero";
  const isLarge = layout === "large";
  const hasRealImage = collection.image.startsWith("/");

  const aspectClass = isHero
    ? "aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-full min-h-[300px]"
    : isLarge
    ? "aspect-[4/5] sm:aspect-[3/4]"
    : "aspect-[3/4] sm:aspect-[4/5]";

  return (
    <motion.div className="h-full">
      <Link
        href={`/collections/${collection.handle}`}
        className={`group block relative overflow-hidden rounded-2xl h-full ${aspectClass}`}
      >
        {/* Background — real photo or gradient fallback */}
        {hasRealImage ? (
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              collectionGradients[collection.handle] || "from-stone-200 to-gray-300"
            } transition-transform duration-700 ease-out group-hover:scale-[1.06]`}
          />
        )}

        {/* Dark overlay for text readability */}
        <div className={`absolute inset-0 ${
          isHero
            ? "bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10"
            : "bg-gradient-to-t from-ink/65 via-ink/20 to-ink/5"
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
