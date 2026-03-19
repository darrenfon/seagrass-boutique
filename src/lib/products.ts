// Product data structured for easy Shopify migration.
// Each product mirrors Shopify's product object shape:
//   handle (slug), title, vendor, price, compareAtPrice, images, tags, variants, collections

export interface Product {
  handle: string;
  title: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  color: string;
  category: string;
  collections: string[];
  tags: string[];
  image: string; // gradient fallback for products without photos
  realImage?: string; // actual product photo path (local or Shopify CDN)
  description?: string;
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface Brand {
  name: string;
  slug: string;
  category: "fashion" | "body" | "candles";
}

// ─── Brands ──────────────────────────────────────────────────────
export const brands: Brand[] = [
  { name: "Current Air", slug: "current-air", category: "fashion" },
  { name: "dRA", slug: "dra", category: "fashion" },
  { name: "Lost + Wander", slug: "lost-wander", category: "fashion" },
  { name: "Vava by Joy Hahn", slug: "vava-by-joy-hahn", category: "fashion" },
  { name: "Design History", slug: "design-history", category: "fashion" },
  { name: "Lovestitch", slug: "lovestitch", category: "fashion" },
  { name: "Hatley", slug: "hatley", category: "fashion" },
  { name: "Sage the Label", slug: "sage-the-label", category: "fashion" },
  { name: "Rain + Rose", slug: "rain-rose", category: "fashion" },
  { name: "Just Black Denim", slug: "just-black-denim", category: "fashion" },
  { name: "Michael Stars", slug: "michael-stars", category: "fashion" },
  { name: "DH New York", slug: "dh-new-york", category: "fashion" },
  { name: "Riddle Oil", slug: "riddle-oil", category: "body" },
  { name: "Voluspa", slug: "voluspa", category: "candles" },
];

// ─── Collections ─────────────────────────────────────────────────
export const collections: Collection[] = [
  {
    handle: "voluspa",
    title: "Voluspa",
    description: "Hand-poured candles in sculptural glass vessels. Each scent is a tiny vacation.",
    image: "/images/collection-voluspa.jpg",
    featured: true,
  },
  {
    handle: "riddle-oil",
    title: "Riddle Oil",
    description: "Luxurious roll-on oils and spray lotions crafted from pure essential oils.",
    image: "/images/collection-riddle.jpg",
    featured: true,
  },
  {
    handle: "spring-fashion",
    title: "Spring Fashion",
    description: "Fresh layers, soft textures, and colors that catch the light. Spring on the shore.",
    image: "/images/collection-spring.jpg",
    featured: true,
  },
  {
    handle: "summer-fashion",
    title: "Summer Fashion",
    description: "Breezy silhouettes, bold prints, and effortless pieces made for salt air and sunshine.",
    image: "/images/collection-summer.jpg",
    featured: true,
  },
];

// ─── Categories ──────────────────────────────────────────────────
export const categories = [
  { name: "Clothing", slug: "clothing" },
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Body", slug: "body" },
  { name: "Candles", slug: "candles" },
  { name: "Dresses", slug: "dresses" },
  { name: "Shoes", slug: "shoes" },
  { name: "Accessories", slug: "accessories" },
] as const;

// Placeholder image gradients — each product gets a color-appropriate gradient
// These will be swapped for real Shopify CDN image URLs after integration
function colorGradient(color: string): string {
  const map: Record<string, string> = {
    Pink: "from-rose-200 to-pink-300",
    Blue: "from-sky-200 to-blue-300",
    Multicolor: "from-amber-200 via-rose-200 to-sky-200",
    White: "from-stone-100 to-gray-200",
    Black: "from-stone-600 to-gray-800",
    Yellow: "from-amber-200 to-yellow-300",
    Green: "from-emerald-200 to-teal-300",
    Teal: "from-teal-200 to-cyan-300",
    Tan: "from-amber-100 to-orange-200",
    Caper: "from-lime-200 to-emerald-200",
  };
  return map[color] || "from-stone-200 to-gray-300";
}

// ─── Products ────────────────────────────────────────────────────

// Trending / Homepage
const trendingProducts: Product[] = [
  { handle: "audrey-dress", title: "Audrey Dress", vendor: "dRA", price: 145, color: "Pink", category: "dresses", collections: ["trending"], tags: ["dress", "midi", "pink"], image: colorGradient("Pink"), realImage: "/images/products/audrey-dress.jpeg" },
  { handle: "bailey-mini-dress", title: "Bailey Mini Dress", vendor: "Current Air", price: 120, color: "Blue", category: "dresses", collections: ["trending"], tags: ["dress", "mini", "blue"], image: colorGradient("Blue"), realImage: "/images/products/bailey-mini-dress.png" },
  { handle: "calypso-dress", title: "Calypso Dress", vendor: "Seagrass Boutique", price: 185, color: "Multicolor", category: "dresses", collections: ["trending"], tags: ["dress", "maxi", "multicolor"], image: colorGradient("Multicolor"), realImage: "/images/products/calypso-dress.jpeg" },
  { handle: "bailey-top", title: "Bailey Top", vendor: "Current Air", price: 90, color: "Blue", category: "clothing", collections: ["trending"], tags: ["top", "blue"], image: colorGradient("Blue"), realImage: "/images/products/bailey-top.png" },
  { handle: "sami-eyelet-midi-dress", title: "Sami Eyelet Midi Dress", vendor: "Current Air", price: 130, color: "Multicolor", category: "dresses", collections: ["trending"], tags: ["dress", "midi", "eyelet"], image: colorGradient("Multicolor"), realImage: "/images/products/sami-eyelet-midi-dress.png" },
  { handle: "sammi-eyelet-sweater-top", title: "Sammi Eyelet Sweater Top", vendor: "Current Air", price: 90, color: "Multicolor", category: "clothing", collections: ["trending"], tags: ["top", "sweater", "eyelet"], image: colorGradient("Multicolor"), realImage: "/images/products/sammi-eyelet-sweater-top.png" },
  { handle: "eternal-spring-maxi-dress", title: "Eternal Spring Maxi Dress", vendor: "Lost + Wander", price: 128, color: "Blue", category: "dresses", collections: ["trending"], tags: ["dress", "maxi", "blue"], image: colorGradient("Blue"), realImage: "/images/products/eternal-spring-maxi-dress.png" },
  { handle: "eternal-spring-shift-dress", title: "Eternal Spring Shift Dress", vendor: "Lost + Wander", price: 108, color: "Blue", category: "dresses", collections: ["trending"], tags: ["dress", "shift", "blue"], image: colorGradient("Blue"), realImage: "/images/products/eternal-spring-shift-dress.png" },
  { handle: "cabrera-mist-midi-dress", title: "Cabrera Mist Midi Dress", vendor: "Lost + Wander", price: 118, color: "White", category: "dresses", collections: ["trending"], tags: ["dress", "midi", "white"], image: colorGradient("White"), realImage: "/images/products/cabrera-mist-midi-dress.png" },
  { handle: "fiesta-flora-maxi-dress", title: "Fiesta Flora Maxi Dress", vendor: "Lost + Wander", price: 108, color: "Multicolor", category: "dresses", collections: ["trending"], tags: ["dress", "maxi", "floral"], image: colorGradient("Multicolor") },
  { handle: "kalahari-watermelon-classic-candle", title: "Kalahari Watermelon Classic Candle", vendor: "Voluspa", price: 34, color: "Pink", category: "candles", collections: ["trending", "voluspa"], tags: ["candle", "voluspa", "classic"], image: colorGradient("Pink"), realImage: "/images/products/kalahari-watermelon-classic.jpeg" },
  { handle: "kalahari-watermelon-large-jar", title: "Kalahari Watermelon Large Jar Candle", vendor: "Voluspa", price: 38, color: "Pink", category: "candles", collections: ["trending", "voluspa"], tags: ["candle", "voluspa", "large-jar"], image: colorGradient("Pink"), realImage: "/images/products/kalahari-watermelon-large.jpeg" },
];

// Voluspa — all 20 candles with real product photos
const voluspaProducts: Product[] = [
  { handle: "mediterranean-lemon-classic", title: "Mediterranean Lemon - Classic Candle", vendor: "Voluspa", price: 34, color: "Yellow", category: "candles", collections: ["voluspa"], tags: ["candle", "classic", "citrus"], image: colorGradient("Yellow"), realImage: "/images/products/mediterranean-lemon-classic.jpeg" },
  { handle: "foraged-wildberry-classic", title: "Foraged Wildberry - Classic Candle", vendor: "Voluspa", price: 34, color: "Multicolor", category: "candles", collections: ["voluspa"], tags: ["candle", "classic", "berry"], image: colorGradient("Multicolor"), realImage: "/images/products/foraged-wildberry-classic.jpeg" },
  { handle: "foraged-wildberry-large-jar", title: "Foraged Wildberry - Large Jar Candle", vendor: "Voluspa", price: 38, color: "Multicolor", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "berry"], image: colorGradient("Multicolor"), realImage: "/images/products/foraged-wildberry-large.jpeg" },
  { handle: "jasmine-midnight-blooms-classic", title: "Jasmine Midnight Blooms - Classic Candle", vendor: "Voluspa", price: 34, color: "White", category: "candles", collections: ["voluspa"], tags: ["candle", "classic", "floral"], image: colorGradient("White"), realImage: "/images/products/jasmine-midnight-classic.jpeg" },
  { handle: "forbidden-fig-classic", title: "Forbidden Fig - Classic Candle", vendor: "Voluspa", price: 34, color: "Green", category: "candles", collections: ["voluspa"], tags: ["candle", "classic", "fig"], image: colorGradient("Green"), realImage: "/images/products/forbidden-fig-classic.jpeg" },
  { handle: "forbidden-fig-large-jar", title: "Forbidden Fig - Large Jar Candle", vendor: "Voluspa", price: 38, color: "Green", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "fig"], image: colorGradient("Green"), realImage: "/images/products/forbidden-fig-large.jpeg" },
  { handle: "milk-rose-textured", title: "Milk Rose - Textured Glass Candle", vendor: "Voluspa", price: 30, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "textured-glass", "rose"], image: colorGradient("Pink"), realImage: "/images/products/milk-rose-textured.jpeg" },
  { handle: "milk-rose-large-jar", title: "Milk Rose - Large Jar Candle", vendor: "Voluspa", price: 45, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "rose"], image: colorGradient("Pink"), realImage: "/images/products/milk-rose-large.jpeg" },
  { handle: "rose-otto-textured", title: "Rose Otto - Textured Glass Candle", vendor: "Voluspa", price: 30, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "textured-glass", "rose"], image: colorGradient("Pink"), realImage: "/images/products/rose-otto-textured.jpeg" },
  { handle: "rose-otto-large-jar", title: "Rose Otto - Large Glass Jar", vendor: "Voluspa", price: 45, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "rose"], image: colorGradient("Pink"), realImage: "/images/products/rose-otto-large.jpeg" },
  { handle: "blackberry-rose-oud-textured", title: "Blackberry Rose Oud - Textured Glass Candle", vendor: "Voluspa", price: 30, color: "Multicolor", category: "candles", collections: ["voluspa"], tags: ["candle", "textured-glass", "oud"], image: colorGradient("Multicolor"), realImage: "/images/products/blackberry-rose-oud-textured.jpeg" },
  { handle: "blackberry-rose-oud-large-jar", title: "Blackberry Rose Oud - Large Jar Candle", vendor: "Voluspa", price: 45, color: "Multicolor", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "oud"], image: colorGradient("Multicolor"), realImage: "/images/products/blackberry-rose-oud-large.jpeg" },
  { handle: "rose-petal-ice-cream-textured", title: "Rose Petal Ice Cream - Textured Glass Candle", vendor: "Voluspa", price: 30, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "textured-glass"], image: colorGradient("Pink"), realImage: "/images/products/rose-petal-ice-cream-textured.jpeg" },
  { handle: "rose-petal-ice-cream-large-jar", title: "Rose Petal Ice Cream - Large Jar Candle", vendor: "Voluspa", price: 45, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar"], image: colorGradient("Pink"), realImage: "/images/products/rose-petal-ice-cream-large.jpeg" },
  { handle: "rose-colored-glasses-textured", title: "Rose Colored Glasses - Textured Glass Candle", vendor: "Voluspa", price: 30, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "textured-glass"], image: colorGradient("Pink"), realImage: "/images/products/rose-colored-glasses-textured.jpeg" },
  { handle: "rose-colored-glasses-large-jar", title: "Rose Colored Glasses - Large Jar Candle", vendor: "Voluspa", price: 45, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar"], image: colorGradient("Pink"), realImage: "/images/products/rose-colored-glasses-large.jpeg" },
  { handle: "mokara-classic", title: "Mokara - Classic Candle", vendor: "Voluspa", price: 34, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "classic", "floral"], image: colorGradient("Pink"), realImage: "/images/products/mokara-classic.jpeg" },
  { handle: "mokara-large-jar", title: "Mokara - Large Jar Candle", vendor: "Voluspa", price: 38, color: "Pink", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "floral"], image: colorGradient("Pink"), realImage: "/images/products/mokara-large.jpeg" },
  { handle: "goji-tarocco-orange-classic", title: "Goji Tarocco Orange - Classic Candle", vendor: "Voluspa", price: 34, color: "Yellow", category: "candles", collections: ["voluspa"], tags: ["candle", "classic", "citrus"], image: colorGradient("Yellow"), realImage: "/images/products/goji-tarocco-classic.jpeg" },
  { handle: "goji-tarocco-orange-large-jar", title: "Goji Tarocco Orange - Large Jar Candle", vendor: "Voluspa", price: 38, color: "Yellow", category: "candles", collections: ["voluspa"], tags: ["candle", "large-jar", "citrus"], image: colorGradient("Yellow"), realImage: "/images/products/goji-tarocco-large.jpeg" },
];

// Riddle Oil
const riddleProducts: Product[] = [
  { handle: "riddle-kismet-spray-lotion", title: 'Riddle "Kismet" Scented Spray Lotion', vendor: "Riddle Oil", price: 50, color: "Black", category: "body", collections: ["riddle-oil"], tags: ["body", "spray", "lotion"], image: colorGradient("Black"), realImage: "/images/products/riddle-kismet-spray.png" },
  { handle: "riddle-santal-spray-lotion", title: 'Riddle "Santal" Scented Spray Lotion', vendor: "Riddle Oil", price: 44, color: "White", category: "body", collections: ["riddle-oil"], tags: ["body", "spray", "lotion"], image: colorGradient("White"), realImage: "/images/products/riddle-santal-spray.png" },
  { handle: "riddle-santal-roll-on", title: 'Riddle "Santal" Roll-On Oil 8ML', vendor: "Riddle Oil", price: 58, color: "White", category: "body", collections: ["riddle-oil"], tags: ["body", "roll-on", "oil"], image: colorGradient("White"), realImage: "/images/products/riddle-santal-roll-on.jpeg" },
  { handle: "riddle-muse-spray-lotion", title: 'Riddle "Muse" Scented Spray Lotion 4oz', vendor: "Riddle Oil", price: 44, color: "White", category: "body", collections: ["riddle-oil"], tags: ["body", "spray", "lotion"], image: colorGradient("White"), realImage: "/images/products/riddle-muse-spray.png" },
  { handle: "riddle-muse-roll-on", title: 'Riddle "Muse" Roll-On Oil 8ML', vendor: "Riddle Oil", price: 58, color: "White", category: "body", collections: ["riddle-oil"], tags: ["body", "roll-on", "oil"], image: colorGradient("White"), realImage: "/images/products/riddle-muse-roll-on.jpeg" },
  { handle: "riddle-original-spray-lotion", title: 'Riddle "Original" Scented Spray Lotion 4oz', vendor: "Riddle Oil", price: 44, color: "White", category: "body", collections: ["riddle-oil"], tags: ["body", "spray", "lotion"], image: colorGradient("White"), realImage: "/images/products/riddle-original-spray.png" },
];

// Spring Fashion
const springProducts: Product[] = [
  { handle: "trish-zip-peplum-top", title: "Trish Zip Peplum Top", vendor: "Vava by Joy Hahn", price: 80, color: "Yellow", category: "clothing", collections: ["spring-fashion", "summer-fashion"], tags: ["top", "peplum"], image: colorGradient("Yellow"), realImage: "/images/products/trish-zip-peplum-top.png" },
  { handle: "dewy-cardigan", title: "Dewy Cardigan", vendor: "Sage the Label", price: 90, color: "Multicolor", category: "clothing", collections: ["spring-fashion"], tags: ["cardigan", "knit"], image: colorGradient("Multicolor") },
  { handle: "lily-pond-midi-skirt", title: "Lily Pond Midi Skirt", vendor: "Sage the Label", price: 115, color: "White", category: "clothing", collections: ["spring-fashion"], tags: ["skirt", "midi"], image: colorGradient("White") },
  { handle: "tia-contour-zip-blouse", title: "Tia Contour Zip Blouse", vendor: "Vava by Joy Hahn", price: 85, color: "Green", category: "clothing", collections: ["spring-fashion"], tags: ["blouse", "zip"], image: colorGradient("Green") },
  { handle: "saylor-flutter-sleeve-sweater", title: "Saylor Flutter Sleeve Sweater", vendor: "Design History", price: 135, color: "Multicolor", category: "clothing", collections: ["spring-fashion"], tags: ["sweater", "flutter-sleeve"], image: colorGradient("Multicolor") },
  { handle: "sailor-dress", title: "Sailor Dress", vendor: "Vava by Joy Hahn", price: 120, color: "Blue", category: "dresses", collections: ["spring-fashion"], tags: ["dress", "nautical"], image: colorGradient("Blue") },
  { handle: "perla-sweater", title: "Perla Sweater", vendor: "Rain + Rose", price: 98, color: "Multicolor", category: "clothing", collections: ["spring-fashion"], tags: ["sweater"], image: colorGradient("Multicolor") },
  { handle: "samara-cardigan", title: "Samara Cardigan", vendor: "Rain + Rose", price: 98, color: "Blue", category: "clothing", collections: ["spring-fashion"], tags: ["cardigan"], image: colorGradient("Blue") },
  { handle: "coralie-sweater", title: "Coralie Sweater", vendor: "Rain + Rose", price: 98, color: "Multicolor", category: "clothing", collections: ["spring-fashion"], tags: ["sweater"], image: colorGradient("Multicolor") },
  { handle: "frayed-cropped-flare", title: "Frayed Cropped Flare", vendor: "Just Black Denim", price: 108, color: "Black", category: "clothing", collections: ["spring-fashion"], tags: ["jeans", "flare", "denim"], image: colorGradient("Black") },
  { handle: "marla-ruffle-dress", title: "Marla Ruffle Dress", vendor: "Seagrass Boutique", price: 72, color: "Multicolor", category: "dresses", collections: ["spring-fashion"], tags: ["dress", "ruffle"], image: colorGradient("Multicolor") },
  { handle: "mirabel-blouse", title: "Mirabel Blouse", vendor: "Lovestitch", price: 52, color: "Multicolor", category: "clothing", collections: ["spring-fashion"], tags: ["blouse"], image: colorGradient("Multicolor") },
  { handle: "jaden-mineral-wash-pant", title: "Jaden Mineral Wash Cropped Pant", vendor: "Michael Stars", price: 168, color: "Caper", category: "clothing", collections: ["spring-fashion"], tags: ["pants", "cropped"], image: colorGradient("Caper") },
  { handle: "marlow-mineral-wash-cardigan", title: "Marlow Mineral Wash Cardigan", vendor: "Michael Stars", price: 158, color: "Caper", category: "clothing", collections: ["spring-fashion"], tags: ["cardigan"], image: colorGradient("Caper") },
  { handle: "kaylie-top", title: "Kaylie Top", vendor: "DH New York", price: 158, color: "Tan", category: "clothing", collections: ["spring-fashion"], tags: ["top"], image: colorGradient("Tan") },
  { handle: "hr-tonal-crop-flare", title: "HR Tonal Crop Flare", vendor: "Just Black Denim", price: 108, color: "Blue", category: "clothing", collections: ["spring-fashion"], tags: ["jeans", "flare", "denim"], image: colorGradient("Blue") },
  { handle: "abigail-stripe-sweater", title: "Abigail Stripe Sweater", vendor: "Sage the Label", price: 100, color: "Multicolor", category: "clothing", collections: ["spring-fashion"], tags: ["sweater", "stripe"], image: colorGradient("Multicolor") },
  { handle: "deja-vu-bubble-maxi-skirt", title: "Deja Vu Bubble Maxi Skirt", vendor: "Sage the Label", price: 90, color: "White", category: "clothing", collections: ["spring-fashion"], tags: ["skirt", "maxi"], image: colorGradient("White") },
  { handle: "fountain-open-back-sweater", title: "Fountain Open Back Sweater", vendor: "Sage the Label", price: 85, color: "Blue", category: "clothing", collections: ["spring-fashion"], tags: ["sweater", "open-back"], image: colorGradient("Blue") },
  { handle: "precious-knit-top", title: "Precious Knit Top", vendor: "Sage the Label", price: 110, color: "White", category: "clothing", collections: ["spring-fashion"], tags: ["top", "knit"], image: colorGradient("White") },
];

// Summer Fashion — all 19 products with real photos
const summerProducts: Product[] = [
  { handle: "kelly-embroidered-mini-dress", title: "Kelly Embroidered Mini Dress", vendor: "Vava by Joy Hahn", price: 120, color: "Black", category: "dresses", collections: ["summer-fashion"], tags: ["dress", "mini", "embroidered"], image: colorGradient("Black"), realImage: "/images/products/kelly-embroidered-mini-dress.png" },
  { handle: "kelly-embroidered-smock-top", title: "Kelly Embroidered Smock Top", vendor: "Vava by Joy Hahn", price: 80, color: "Pink", category: "clothing", collections: ["summer-fashion"], tags: ["top", "embroidered"], image: colorGradient("Pink"), realImage: "/images/products/kelly-embroidered-smock-top.jpeg" },
  { handle: "sarah-embroidered-shirt", title: "Sarah Embroidered Shirt", vendor: "Design History", price: 90, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["shirt", "embroidered"], image: colorGradient("Blue"), realImage: "/images/products/sarah-embroidered-shirt.png" },
  { handle: "taylor-embroidered-short", title: "Taylor Embroidered Short", vendor: "Design History", price: 78, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["shorts", "embroidered"], image: colorGradient("Blue"), realImage: "/images/products/taylor-embroidered-short.png" },
  { handle: "pepper-eyelet-top", title: "Pepper Eyelet Top", vendor: "Lovestitch", price: 68, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["top", "eyelet"], image: colorGradient("Blue"), realImage: "/images/products/pepper-eyelet-top.png" },
  { handle: "laguna-short", title: "Laguna Short - Soft Blue Wash", vendor: "Hatley", price: 90, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["shorts", "denim"], image: colorGradient("Blue"), realImage: "/images/products/laguna-short.png" },
  { handle: "bella-dress-soft-ikat", title: "Bella Dress - Soft Ikat", vendor: "Hatley", price: 95, color: "Blue", category: "dresses", collections: ["summer-fashion"], tags: ["dress", "ikat"], image: colorGradient("Blue"), realImage: "/images/products/bella-dress-soft-ikat.png" },
  { handle: "simone-knit-tee", title: "Simone Knit Tee - Navy & White Stripe", vendor: "Hatley", price: 90, color: "Multicolor", category: "clothing", collections: ["summer-fashion"], tags: ["tee", "stripe"], image: colorGradient("Multicolor"), realImage: "/images/products/simone-knit-tee.png" },
  { handle: "jasmine-knit-top", title: "Jasmine 3/4 Sleeve Knit Top", vendor: "Hatley", price: 90, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["top", "knit"], image: colorGradient("Blue"), realImage: "/images/products/jasmine-knit-top.png" },
  { handle: "julia-shirt-dress", title: "Julia Shirt Dress", vendor: "Hatley", price: 140, color: "Multicolor", category: "dresses", collections: ["summer-fashion"], tags: ["dress", "shirt-dress", "stripe"], image: colorGradient("Multicolor"), realImage: "/images/products/julia-shirt-dress.png" },
  { handle: "velora-tank", title: "Velora Tank", vendor: "Lovestitch", price: 48, color: "Teal", category: "clothing", collections: ["summer-fashion"], tags: ["tank", "basic"], image: colorGradient("Teal"), realImage: "/images/products/velora-tank.png" },
  { handle: "sunset-promenade-mini-dress", title: "Sunset Promenade Mini Dress", vendor: "Lost + Wander", price: 88, color: "Multicolor", category: "dresses", collections: ["summer-fashion"], tags: ["dress", "mini"], image: colorGradient("Multicolor"), realImage: "/images/products/sunset-promenade-mini-dress.png" },
  { handle: "sunset-promenade-top", title: "Sunset Promenade Top", vendor: "Lost + Wander", price: 68, color: "Multicolor", category: "clothing", collections: ["summer-fashion"], tags: ["top"], image: colorGradient("Multicolor"), realImage: "/images/products/sunset-promenade-top.png" },
  { handle: "jenny-ruffle-sleeve-blouse", title: "Jenny Ruffle Sleeve Blouse", vendor: "Lovestitch", price: 56, color: "White", category: "clothing", collections: ["summer-fashion"], tags: ["blouse", "ruffle"], image: colorGradient("White"), realImage: "/images/products/jenny-ruffle-sleeve-blouse.png" },
  { handle: "lace-embroidered-mini-dress", title: "Lace Embroidered Mini Dress", vendor: "Current Air", price: 98, color: "Multicolor", category: "dresses", collections: ["summer-fashion"], tags: ["dress", "mini", "lace"], image: colorGradient("Multicolor"), realImage: "/images/products/lace-embroidered-mini-dress.png" },
  { handle: "eyelet-embroidered-shirt", title: "Eyelet Embroidered Shirt", vendor: "Current Air", price: 90, color: "White", category: "clothing", collections: ["summer-fashion"], tags: ["shirt", "eyelet"], image: colorGradient("White"), realImage: "/images/products/eyelet-embroidered-shirt.png" },
  { handle: "straight-leg-pant", title: "Straight Leg Pant - Soft Blue Wash", vendor: "Hatley", price: 125, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["pants", "denim"], image: colorGradient("Blue"), realImage: "/images/products/straight-leg-pant.png" },
  { handle: "sadie-vneck-tee", title: "Sadie V-Neck Tee", vendor: "Hatley", price: 45, color: "Black", category: "clothing", collections: ["summer-fashion"], tags: ["tee", "basic"], image: colorGradient("Black"), realImage: "/images/products/sadie-vneck-tee.png" },
  { handle: "tencel-jacket", title: "Tencel Jacket", vendor: "Hatley", price: 150, color: "Blue", category: "clothing", collections: ["summer-fashion"], tags: ["jacket", "tencel"], image: colorGradient("Blue"), realImage: "/images/products/tencel-jacket.png" },
];

// Additional filler products for categories that had empty data (shoes, accessories, body)
const shoesProducts: Product[] = [
  { handle: "isla-woven-sandal", title: "Isla Woven Sandal", vendor: "Seagrass Boutique", price: 78, color: "Tan", category: "shoes", collections: [], tags: ["sandal", "woven"], image: colorGradient("Tan") },
  { handle: "marina-slide", title: "Marina Slide", vendor: "Seagrass Boutique", price: 65, color: "White", category: "shoes", collections: [], tags: ["slide", "casual"], image: colorGradient("White") },
  { handle: "coastline-espadrille", title: "Coastline Espadrille Wedge", vendor: "Seagrass Boutique", price: 95, color: "Tan", category: "shoes", collections: [], tags: ["espadrille", "wedge"], image: colorGradient("Tan") },
  { handle: "driftwood-platform", title: "Driftwood Platform Sandal", vendor: "Seagrass Boutique", price: 88, color: "Black", category: "shoes", collections: [], tags: ["platform", "sandal"], image: colorGradient("Black") },
  { handle: "shoreline-flat", title: "Shoreline Braided Flat", vendor: "Seagrass Boutique", price: 72, color: "Tan", category: "shoes", collections: [], tags: ["flat", "braided"], image: colorGradient("Tan") },
  { handle: "sunset-mule", title: "Sunset Mule", vendor: "Seagrass Boutique", price: 85, color: "Pink", category: "shoes", collections: [], tags: ["mule"], image: colorGradient("Pink") },
];

const accessoriesProducts: Product[] = [
  { handle: "tide-pool-earrings", title: "Tide Pool Drop Earrings", vendor: "Seagrass Boutique", price: 38, color: "Blue", category: "accessories", collections: [], tags: ["earrings", "jewelry"], image: colorGradient("Blue") },
  { handle: "shell-pendant-necklace", title: "Shell Pendant Necklace", vendor: "Seagrass Boutique", price: 48, color: "White", category: "accessories", collections: [], tags: ["necklace", "jewelry"], image: colorGradient("White") },
  { handle: "dune-woven-tote", title: "Dune Woven Tote", vendor: "Seagrass Boutique", price: 68, color: "Tan", category: "accessories", collections: [], tags: ["tote", "bag", "woven"], image: colorGradient("Tan") },
  { handle: "ocean-mist-scarf", title: "Ocean Mist Silk Scarf", vendor: "Seagrass Boutique", price: 55, color: "Blue", category: "accessories", collections: [], tags: ["scarf", "silk"], image: colorGradient("Blue") },
  { handle: "boardwalk-sunglasses", title: "Boardwalk Oversized Sunglasses", vendor: "Seagrass Boutique", price: 42, color: "Black", category: "accessories", collections: [], tags: ["sunglasses"], image: colorGradient("Black") },
  { handle: "coral-cuff-bracelet", title: "Coral Cuff Bracelet", vendor: "Seagrass Boutique", price: 35, color: "Pink", category: "accessories", collections: [], tags: ["bracelet", "jewelry"], image: colorGradient("Pink") },
];

// ─── Combine & export ────────────────────────────────────────────
export const allProducts: Product[] = [
  ...trendingProducts,
  ...voluspaProducts,
  ...riddleProducts,
  ...springProducts,
  ...summerProducts,
  ...shoesProducts,
  ...accessoriesProducts,
];

// De-duplicate by handle (some products appear in multiple collections)
const seen = new Set<string>();
export const products: Product[] = allProducts.filter((p) => {
  if (seen.has(p.handle)) return false;
  seen.add(p.handle);
  return true;
});

// ─── Query helpers (mirrors what Shopify Storefront API would give you) ──
export function getProductsByCollection(collectionHandle: string): Product[] {
  return products.filter((p) => p.collections.includes(collectionHandle));
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === "new-arrivals") {
    // Show the most recently added products — for now, last 20
    return products.slice(-20).reverse();
  }
  return products.filter((p) => p.category === categorySlug);
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getCollectionByHandle(handle: string): Collection | undefined {
  return collections.find((c) => c.handle === handle);
}

export function getTrendingProducts(): Product[] {
  return trendingProducts;
}
