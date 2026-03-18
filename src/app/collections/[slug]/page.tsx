"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCollectionByHandle, getProductsByCollection } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";

const collectionGradients: Record<string, string> = {
  voluspa: "from-rose-300 via-pink-200 to-amber-100",
  "riddle-oil": "from-stone-700 via-stone-500 to-amber-200",
  "spring-fashion": "from-emerald-200 via-sky-100 to-rose-100",
  "summer-fashion": "from-amber-200 via-orange-100 to-sky-200",
};

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const collection = getCollectionByHandle(slug);
  const products = getProductsByCollection(slug);

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="font-serif text-4xl text-ink mb-4">Collection not found</h1>
        <Link href="/" className="text-ocean hover:text-ocean-deep transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Collection hero */}
      <section className="relative py-24 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${collectionGradients[slug] || "from-stone-200 to-gray-300"}`} />
        <div className="absolute inset-0 bg-ink/20" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="text-sm text-white/60 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{collection.title}</span>
            </nav>
            <h1 className="font-serif text-5xl sm:text-6xl text-white mb-4">{collection.title}</h1>
            <p className="text-white/70 text-lg max-w-lg mx-auto">{collection.description}</p>
            <p className="text-white/50 text-sm mt-4">{products.length} products</p>
          </motion.div>
        </div>
      </section>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, i) => (
              <ProductCard key={product.handle} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-ink-light text-lg">No products in this collection yet.</p>
            <Link href="/" className="text-ocean hover:text-ocean-deep mt-4 inline-block">
              Browse all products
            </Link>
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}
