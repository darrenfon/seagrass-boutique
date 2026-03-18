"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProductsByCategory, categories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";

const categoryDescriptions: Record<string, string> = {
  clothing: "Tops, bottoms, sweaters, and everything in between. Layers that feel as good as they look.",
  "new-arrivals": "Just in — the freshest picks from our favorite designers.",
  body: "Luxurious oils, lotions, and scents crafted from pure essential ingredients.",
  candles: "Hand-poured candles in beautiful vessels. Transform any room into a coastal retreat.",
  dresses: "From breezy maxis to embroidered minis — dresses for every shore-side occasion.",
  shoes: "Sandals, slides, and statement shoes to complete every outfit.",
  accessories: "Jewelry, bags, scarves, and finishing touches that make the look yours.",
};

export default function BrowsePage() {
  const { category } = useParams<{ category: string }>();
  const products = getProductsByCategory(category);
  const categoryInfo = categories.find((c) => c.slug === category);
  const title = categoryInfo?.name || category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      {/* Category header */}
      <section className="bg-shell py-16 border-b border-driftwood/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="text-sm text-ink-light mb-4">
              <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{title}</span>
            </nav>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink mb-4">{title}</h1>
            <p className="text-ink-light text-lg max-w-lg mx-auto">
              {categoryDescriptions[category] || "Explore our curated selection."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar placeholder — Shopify will power real filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-driftwood/20">
        <p className="text-sm text-ink-light">{products.length} products</p>
        <div className="flex items-center gap-4">
          <select className="text-sm text-ink-light bg-transparent border border-driftwood/40 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ocean/30">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, i) => (
              <ProductCard key={product.handle} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">&#10022;</div>
            <p className="text-ink-light text-lg mb-2">This category is being refreshed.</p>
            <p className="text-ink-light text-sm mb-6">Check back soon or browse our collections.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-ocean hover:text-ocean-deep"
            >
              Back to Home
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}
