"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Newsletter } from "@/components/Newsletter";
import { BrandMarquee } from "@/components/BrandMarquee";

export default function ComingSoonHome() {
  return (
    <>
      {/* Hero — big, warm, seasonal excitement */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Layered coastal background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sand to-shell" />
        <div className="absolute top-10 right-[10%] w-80 h-80 rounded-full bg-ocean/5 blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-64 h-64 rounded-full bg-coral/5 blur-3xl" />
        <div className="absolute top-1/3 right-[30%] w-40 h-40 rounded-full bg-sage/5 blur-2xl" />

        {/* Wave bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,50 C240,70 480,20 720,45 C960,70 1200,25 1440,50 L1440,80 L0,80 Z" fill="var(--sg-sand)" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-ocean/70 mb-6 font-medium">
              752 Asbury Ave &bull; Ocean City, New Jersey
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.05] mb-8">
              <span className="block">Something</span>
              <span className="block text-ocean italic">Beautiful</span>
              <span className="block">Is Coming</span>
            </h1>

            <p className="text-ink-light text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              We&apos;re gearing up for summer with a brand new online shopping experience.
              Coastal fashion with a modern bohemian flare — coming to your screen soon.
            </p>

            {/* CTA to Shoptiques */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <motion.a
                href="https://www.shoptiques.com/collections/seagrass-boutique"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-ocean text-white rounded-full font-medium
                           hover:bg-ocean-deep transition-colors shadow-lg shadow-ocean/20 btn-breathe"
              >
                Shop Now on Shoptiques
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.a>
              <motion.a
                href="/about"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-ink/12 text-ink rounded-full font-medium
                           hover:border-ocean hover:text-ocean transition-colors"
              >
                Our Story
              </motion.a>
            </div>

            <p className="text-ink-light/50 text-sm">
              Can&apos;t wait? Browse our full collection on{" "}
              <a
                href="https://www.shoptiques.com/collections/seagrass-boutique"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean hover:text-ocean-deep underline underline-offset-2 transition-colors"
              >
                Shoptiques
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Marquee — shows we carry real designers */}
      <BrandMarquee />

      {/* Store image + what's coming */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/images/store-interior.jpg"
              alt="Inside Seagrass Boutique — turquoise walls, floral fitting room curtains, and the Seagrass sign"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-sand/30 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-coral mb-3 font-medium">What&apos;s Coming</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-6 leading-snug">
              A New Way to Shop Seagrass
            </h2>
            <div className="space-y-4 text-ink-light leading-relaxed">
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-sm mt-0.5">1</span>
                <div>
                  <p className="font-medium text-ink">Browse our full catalog online</p>
                  <p className="text-sm">Hand-curated pieces from designers like Current Air, Lost + Wander, Hatley, and more.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-sm mt-0.5">2</span>
                <div>
                  <p className="font-medium text-ink">Buy directly from our website</p>
                  <p className="text-sm">Secure checkout, shipping nationwide, and the same personal touch you get in-store.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-sm mt-0.5">3</span>
                <div>
                  <p className="font-medium text-ink">Shop from Instagram</p>
                  <p className="text-sm">Tap a product in our posts and buy it — coming soon to our Instagram and Facebook.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visit us / contact info */}
      <section className="bg-shell py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-ocean/60 mb-3 font-medium">In the meantime</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mb-4">Come See Us In Person</h2>
            <p className="text-ink-light text-lg mb-8 max-w-md mx-auto">
              Nothing beats browsing the racks with a coffee in hand. We&apos;d love to see you.
            </p>

            <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <p className="font-medium text-ink mb-1">Location</p>
                <p className="text-sm text-ink-light">752 Asbury Ave<br />Ocean City, NJ 08226</p>
              </div>
              <div>
                <p className="font-medium text-ink mb-1">Hours</p>
                <p className="text-sm text-ink-light">Mon – Sat: 10am – 5pm<br />Sunday: 11am – 4pm</p>
              </div>
              <div>
                <p className="font-medium text-ink mb-1">Contact</p>
                <p className="text-sm text-ink-light">
                  <a href="tel:609-938-2398" className="hover:text-ocean transition-colors">(609) 938-2398</a>
                  <br />
                  <a href="mailto:seagrassboutique@gmail.com" className="hover:text-ocean transition-colors">seagrassboutique@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <a
                href="https://www.facebook.com/SeagrassBoutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-light/40 hover:text-ocean transition-colors"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/seagrassboutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-light/40 hover:text-ocean transition-colors"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter — collect emails while they're here */}
      <Newsletter />
    </>
  );
}
