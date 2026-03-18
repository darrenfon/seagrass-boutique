"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/products";

const navLinks = [
  ...categories.map((c) => ({ label: c.name, href: `/browse/${c.slug}` })),
  { label: "About Us", href: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll to add shadow + bg opacity shift
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-sand/98 backdrop-blur-lg shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-transparent"
          : "bg-sand/90 backdrop-blur-md border-b border-driftwood/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 text-ink hover:text-ocean transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          {/* Logo — centered on mobile, left-ish on desktop with nav */}
          <Link href="/" className="flex flex-col items-center group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <span className="font-serif text-[22px] sm:text-[26px] tracking-[0.08em] text-ink group-hover:text-ocean transition-colors duration-300">
              SEAGRASS
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.4em] text-ink-light/70 uppercase -mt-0.5">
              Boutique
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-[13px] tracking-wide text-ink-light/80 hover:text-ocean transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[1.5px] bg-ocean scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <button
            className="p-2 -mr-2 text-ink hover:text-ocean transition-colors relative group"
            aria-label="Shopping cart"
          >
            <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="transition-transform duration-200 group-hover:scale-105">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu with staggered item reveal */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-sand border-t border-driftwood/30"
          >
            <nav className="px-4 py-5 space-y-0.5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-[15px] tracking-wide text-ink-light hover:text-ocean hover:bg-shell/60 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
