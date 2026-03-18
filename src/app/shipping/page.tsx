"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-shell py-16 border-b border-driftwood/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="text-sm text-ink-light mb-4">
              <Link href="/" className="hover:text-ocean transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">Returns & Shipping</span>
            </nav>
            <h1 className="font-serif text-5xl text-ink">Returns & Shipping</h1>
          </motion.div>
        </div>
      </section>

      {/* Policy content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-12"
        >
          {/* Returns */}
          <div>
            <h2 className="font-serif text-2xl text-ink mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-sm">1</span>
              Full-Price Merchandise
            </h2>
            <div className="pl-11 space-y-3 text-ink-light leading-relaxed">
              <p>
                Full-price merchandise may be returned for <strong className="text-ink">store credit</strong> or
                exchanged within <strong className="text-ink">14 days</strong> of purchase.
              </p>
              <p>Items must be in their original condition with tags attached.</p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-sm">2</span>
              Sale Merchandise
            </h2>
            <div className="pl-11 space-y-3 text-ink-light leading-relaxed">
              <p>
                Sale merchandise marked with a red line is a <strong className="text-ink">final sale</strong>.
                These items cannot be returned or exchanged.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-sm">3</span>
              Shoes
            </h2>
            <div className="pl-11 space-y-3 text-ink-light leading-relaxed">
              <p>
                Full-price shoes may be returned for store credit or exchanged within 14 days of purchase.
              </p>
              <p>
                Shoes must be in <strong className="text-ink">new and unworn condition</strong> and
                in the <strong className="text-ink">original shoe box</strong>.
              </p>
              <p>
                Sale shoes (red-line) are final sale.
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="border-t border-driftwood/30 pt-12">
            <h2 className="font-serif text-2xl text-ink mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage text-sm">&#10003;</span>
              Shipping
            </h2>
            <div className="pl-11 space-y-3 text-ink-light leading-relaxed">
              <p>
                We offer flat-rate shipping on all online orders. Free shipping on orders over $150.
              </p>
              <p>
                Orders are typically processed within 1–2 business days and delivered within 3–7 business days
                depending on your location.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-shell rounded-2xl p-8 text-center">
            <p className="text-ink-light mb-4">
              Questions about a return? We&apos;re happy to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:seagrassboutique@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ocean text-white rounded-full text-sm font-medium hover:bg-ocean-deep transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:609-938-2398"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-ink/15 text-ink rounded-full text-sm font-medium hover:border-ocean hover:text-ocean transition-colors"
              >
                Call (609) 938-2398
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
