"use client";

import { useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const items = [
    "Free shipping on orders over $150",
    <>Use code <strong className="font-semibold">WELCOME10</strong> for 10% off</>,
    "752 Asbury Ave, Ocean City NJ",
  ];

  return (
    <div className="bg-ocean-deep text-white text-[13px] relative overflow-hidden">
      <div className="flex items-center justify-center py-2.5 px-10">
        <div className="overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-announce">
            {/* Duplicate for seamless loop */}
            {[...items, ...items].map((item, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="mx-5 sm:mx-8">{item}</span>
                <span className="text-coral-warm/60 text-[6px] mx-1">&bull;</span>
              </span>
            ))}
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
          aria-label="Close announcement"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
