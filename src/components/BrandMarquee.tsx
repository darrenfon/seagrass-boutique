"use client";

import { brands } from "@/lib/products";

// The marquee — clean separator dots between brand names, seamless loop, pauses on hover
export function BrandMarquee() {
  const allBrands = brands.filter((b) => b.category === "fashion");

  // Build the brand list with separators
  const BrandList = () => (
    <>
      {allBrands.map((brand) => (
        <span key={brand.slug} className="inline-flex items-center">
          <span className="mx-6 sm:mx-10 text-[17px] sm:text-[19px] font-serif text-ink-light/40 hover:text-ocean transition-colors duration-300 cursor-default whitespace-nowrap">
            {brand.name}
          </span>
          <span className="text-driftwood/40 text-[8px]">&bull;</span>
        </span>
      ))}
    </>
  );

  return (
    <section className="py-10 bg-sand overflow-hidden border-y border-driftwood/20">
      <p className="text-center text-[10px] tracking-[0.4em] uppercase text-ink-light/50 mb-5 font-medium">
        Our Designers
      </p>
      <div className="relative">
        {/* Fade edges so the marquee feels infinite */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-sand to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-sand to-transparent z-10" />

        <div className="flex whitespace-nowrap animate-marquee">
          {/* Duplicate content for seamless loop */}
          <BrandList />
          <BrandList />
        </div>
      </div>
    </section>
  );
}
