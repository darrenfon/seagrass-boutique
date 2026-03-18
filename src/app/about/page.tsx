"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { brands } from "@/lib/products";
import { Newsletter } from "@/components/Newsletter";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean/10 via-sand to-shell" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-coral/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-ocean/5 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-ocean mb-4">Our Story</p>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink mb-6">About Seagrass</h1>
            <p className="text-ink-light text-xl leading-relaxed max-w-2xl mx-auto">
              Coastal fashion with a modern bohemian flare — born at the Jersey Shore,
              inspired by California, curated with love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-sky-200 via-ocean/20 to-shell overflow-hidden relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-8xl opacity-15">&#127754;</span>
                <p className="font-serif text-ink-light text-xl mt-4">752 Asbury Ave</p>
                <p className="text-ink-light text-sm">Ocean City, NJ</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-6">
              From the Shore, With Love
            </h2>
            <div className="space-y-4 text-ink-light leading-relaxed">
              <p>
                Seagrass Boutique was founded by Kevin Heck and Justin Adams with a simple idea:
                bring the effortless, sun-drenched style of California to the Jersey Shore.
              </p>
              <p>
                Kevin grew up in Somers Point and spent his formative years on the Ocean City Boardwalk.
                After studying fashion marketing at the Art Institute of Philadelphia and honing his eye
                for visual design at H&M in New York and Sunglass Hut nationwide, he returned to
                Atlantic County with a vision.
              </p>
              <p>
                What started as a small shop in Linwood in 2016 quickly grew into a beloved destination
                for women seeking unique, high-quality pieces that feel as good as they look. Today,
                our Asbury Avenue location is a cornerstone of Ocean City&apos;s shopping scene.
              </p>
              <p>
                Every item in the boutique has been hand-selected to offer an assortment of clothing
                that is not only unique and of the highest quality, but bold, versatile, feminine,
                and edgy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-shell py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-4">Our Philosophy</h2>
            <p className="text-ink-light max-w-xl mx-auto">
              Whether you&apos;re a free-spirited wanderer, a present-day bohemian, a woman who
              embraces luxury and elegance, or someone who prefers simplicity at its finest —
              our collection lets you make a statement while staying comfortable.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: "&#10022;",
                title: "Hand-Curated",
                text: "Every piece is personally selected. We don't stock catalogs — we discover treasures.",
              },
              {
                icon: "&#127754;",
                title: "Coastal Soul",
                text: "California-inspired, shore-town rooted. Our style lives where the boardwalk meets the beach.",
              },
              {
                icon: "&#9825;",
                title: "For Every Woman",
                text: "Bold and edgy. Soft and feminine. Minimal and chic. We carry it all, because you are all of it.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border border-driftwood/20"
              >
                <span className="text-4xl mb-4 block" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <h3 className="font-serif text-xl text-ink mb-2">{item.title}</h3>
                <p className="text-ink-light text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-4">Our Designers</h2>
          <p className="text-ink-light">The brands we&apos;re proud to carry.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-shell rounded-xl p-6 text-center hover:bg-white hover:shadow-sm
                         border border-transparent hover:border-driftwood/30 transition-all"
            >
              <p className="font-serif text-lg text-ink">{brand.name}</p>
              <p className="text-xs text-ink-light capitalize mt-1">{brand.category}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="bg-ocean-deep text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl mb-6">Come Visit Us</h2>
            <address className="not-italic text-white/70 text-lg leading-relaxed mb-8">
              <p className="mb-2">752 Asbury Ave, Ocean City, NJ 08226</p>
              <p className="mb-4">
                <a href="tel:609-938-2398" className="hover:text-coral-warm transition-colors">(609) 938-2398</a>
                {" "}&bull;{" "}
                <a href="mailto:seagrassboutique@gmail.com" className="hover:text-coral-warm transition-colors">seagrassboutique@gmail.com</a>
              </p>
              <div className="text-white/50">
                <p>Monday – Saturday: 10am – 5pm</p>
                <p>Sunday: 11am – 4pm</p>
              </div>
            </address>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.facebook.com/SeagrassBoutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-coral-warm transition-colors text-sm"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/seagrassboutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-coral-warm transition-colors text-sm"
              >
                Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
