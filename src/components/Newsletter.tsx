"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      {/* Layered gradient background — ocean to sage with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep via-ocean to-sage/80" />

      {/* Animated wave layers — organic movement, different speeds */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-[200%] h-auto animate-wave" preserveAspectRatio="none">
          <path fill="white" d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z" />
        </svg>
      </div>
      <div className="absolute inset-0 opacity-[0.05]">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-[200%] h-auto animate-wave-slow" preserveAspectRatio="none">
          <path fill="white" d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,240C672,235,768,245,864,250.7C960,256,1056,256,1152,245.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L0,320Z" />
        </svg>
      </div>

      <div className="relative max-w-xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4 font-medium">
            Join the Seagrass family
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-white mb-5 leading-tight">
            Get 10% Off
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-sm mx-auto leading-relaxed">
            Your first order, plus early access to new arrivals and exclusive sales.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <p className="text-white text-xl font-serif mb-2">Welcome!</p>
              <p className="text-white/60 text-sm">
                Use code <strong className="text-coral-warm font-semibold">WELCOME10</strong> at checkout.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-6 py-4 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/15
                           text-white placeholder:text-white/30 text-sm
                           focus:outline-none focus:ring-2 focus:ring-coral-warm/40 focus:border-transparent
                           transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-8 py-4 rounded-full bg-coral-warm text-white font-medium text-sm
                           hover:bg-coral transition-colors duration-300 shadow-lg shadow-black/10
                           whitespace-nowrap"
              >
                Get 10% Off
              </motion.button>
            </form>
          )}

          <p className="text-white/25 text-xs mt-5">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
