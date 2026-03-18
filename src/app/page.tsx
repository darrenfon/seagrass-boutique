"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { collections, getTrendingProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { CollectionBanner } from "@/components/CollectionBanner";
import { Newsletter } from "@/components/Newsletter";
import { BrandMarquee } from "@/components/BrandMarquee";

const trending = getTrendingProducts();

// The hero headline — each line staggers in separately.
// The italic "Fashion" is the deliberate surprise that breaks the pattern.
const heroLines = [
  { text: "Coastal", className: "text-ink" },
  { text: "Fashion", className: "text-ink italic" },
  { text: "with a Modern", className: "text-ocean" },
  { text: "Bohemian Flare", className: "text-ink" },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <>
      {/* ── Hero — almost-too-big type, asymmetric mosaic, organic wave exit ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sand to-shell" />

        {/* Sea-glass blobs */}
        <div className="absolute top-10 right-[10%] w-[500px] h-[500px] rounded-full bg-ocean/[0.04] blur-[100px]" />
        <div className="absolute -bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-coral/[0.06] blur-[80px]" />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] rounded-full bg-sage/[0.05] blur-[60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm tracking-[0.35em] uppercase text-ocean/80 mb-6 font-medium"
            >
              752 Asbury Ave &bull; Ocean City, NJ
            </motion.p>

            <h1 className="font-serif leading-[0.95] mb-8">
              {heroLines.map((line, i) => (
                <motion.span
                  key={line.text}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className={`block text-[clamp(3rem,8vw,5.5rem)] ${line.className}`}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-ink-light text-lg max-w-md mb-10 leading-relaxed"
            >
              Hand-curated pieces for the free-spirited and the endlessly chic.
              California-inspired, shore-town rooted.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/browse/new-arrivals"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-ocean text-white rounded-full font-medium
                           hover:bg-ocean-deep transition-all duration-300 btn-breathe text-[15px]"
              >
                Shop New Arrivals
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/collections/spring-fashion"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-ink/10 text-ink rounded-full font-medium
                           hover:border-ocean hover:text-ocean transition-all duration-300 text-[15px]"
              >
                Spring Collection
              </Link>
            </motion.div>
          </div>

          {/* Mosaic with parallax drift — overlapping grid for tension */}
          <motion.div
            style={{ y: heroImageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:grid grid-cols-12 grid-rows-12 gap-3 h-[600px]"
          >
            <div className="col-span-7 row-span-7 rounded-2xl bg-gradient-to-br from-rose-200 via-pink-200 to-amber-100 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-ink/5 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">New Collection</span>
                <p className="text-white font-serif text-2xl mt-1">Spring Edit</p>
              </div>
              <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/10 transition-colors duration-500" />
            </div>

            <div className="col-span-5 row-span-5 col-start-8 rounded-2xl bg-gradient-to-br from-sky-200 to-ocean/30 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">Tops</span>
                <p className="text-white font-serif text-lg mt-0.5">Effortless Layers</p>
              </div>
            </div>

            <div className="col-span-5 row-span-5 row-start-8 rounded-2xl bg-gradient-to-br from-amber-100 via-orange-200 to-coral-warm/40 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">Body</span>
                <p className="text-white font-serif text-lg mt-0.5">Riddle Oil</p>
              </div>
            </div>

            <div className="col-span-7 row-span-7 col-start-6 row-start-6 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-gold/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">Candles</span>
                <p className="text-white font-serif text-2xl mt-1">Voluspa</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider — organic exit from hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,60 C240,90 480,20 720,50 C960,80 1200,30 1440,60 L1440,100 L0,100 Z" fill="var(--sg-sand)" />
          </svg>
        </div>
      </section>

      {/* ── Brand Marquee ────────────────────────────────────────── */}
      <BrandMarquee />

      {/* ── Featured Collections — asymmetric: 1 hero + 3 stacked ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm tracking-[0.25em] uppercase text-ocean/70 mb-3 font-medium"
            >
              Curated for you
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl sm:text-[3.25rem] text-ink leading-tight"
            >
              Shop Collections
            </motion.h2>
          </div>
          <Link href="/browse/clothing" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-ocean hover:text-ocean-deep transition-colors">
            View All
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 lg:row-span-2">
            <CollectionBanner collection={collections[0]} index={0} layout="hero" />
          </div>
          <div className="lg:col-span-5">
            <CollectionBanner collection={collections[1]} index={1} layout="compact" />
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-5">
            <CollectionBanner collection={collections[2]} index={2} layout="compact" />
            <CollectionBanner collection={collections[3]} index={3} layout="compact" />
          </div>
        </div>
      </section>

      {/* ── Trending Now ─────────────────────────────────────────── */}
      <section className="bg-shell py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-sm tracking-[0.25em] uppercase text-coral/70 mb-3 font-medium">Just dropped</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-serif text-4xl sm:text-[3.25rem] text-ink leading-tight">Trending Now</motion.h2>
            </div>
            <Link href="/browse/new-arrivals" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-ocean hover:text-ocean-deep transition-colors">
              View All
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {trending.slice(0, 8).map((product, i) => (
              <ProductCard key={product.handle} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Personal Shopper — THE BOLD MOMENT. Full-bleed coral that breaks the grid. ── */}
      <section className="relative bg-gradient-to-br from-coral via-coral-warm to-coral overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-white/[0.06] blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-ocean-deep/10 blur-[60px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm tracking-[0.25em] uppercase text-white/60 mb-4 font-medium">Personal Shopping</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.1] mb-6">
              Not sure where<br />to start?
              <span className="italic block mt-1">Let us help.</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
              Our personal shopper Kelli Conway will put together a look that&apos;s perfectly you.
              Beach wedding, boardwalk date night, or wardrobe refresh — we&apos;ve got you.
            </p>
            <a
              href="mailto:seagrassboutique@gmail.com?subject=Personal%20Shopping%20Request"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-coral rounded-full font-semibold
                         hover:bg-sand hover:shadow-lg transition-all duration-300 text-[15px]"
            >
              Book a Session
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-10 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                  <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <p className="font-serif text-3xl text-white leading-snug mb-4">
                  &ldquo;Style is a way to say who you are without having to speak.&rdquo;
                </p>
                <p className="text-white/50 text-sm">— Every piece tells your story</p>
              </div>
              <div className="pt-8 border-t border-white/15">
                <p className="text-white/90 font-medium">Kelli Conway</p>
                <p className="text-white/50 text-sm">Personal Shopper</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────── */}
      <Newsletter />
    </>
  );
}
