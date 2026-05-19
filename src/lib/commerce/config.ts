// Central commerce backend feature flag.
//
// Reads the COMMERCE_BACKEND env var and exports the active backend.
// Default is "shopify" so behaviour is unchanged until the flag is flipped.
// Switching backends is a one-line/env change — no code edits required.

export type CommerceBackend = "shopify" | "square";

function normalize(raw: string): CommerceBackend {
  const v = raw.trim().toLowerCase();
  if (v === "square") return "square";
  if (v === "shopify") return "shopify";
  // Unknown value — fall back to the safe default rather than crash.
  console.warn(`[commerce] Unknown commerce backend "${raw}", defaulting to "shopify".`);
  return "shopify";
}

// Server-side flag. Read in server components / API routes / data layer.
function resolveBackend(): CommerceBackend {
  return normalize(process.env.COMMERCE_BACKEND || "shopify");
}

// Client-safe flag. NEXT_PUBLIC_ vars are inlined at build time, so this is
// the value the browser-side cart context reads. Keep both env vars in sync.
function resolveClientBackend(): CommerceBackend {
  return normalize(
    process.env.NEXT_PUBLIC_COMMERCE_BACKEND ||
      process.env.COMMERCE_BACKEND ||
      "shopify"
  );
}

/** The active commerce backend for this process (server-side). */
export const COMMERCE_BACKEND: CommerceBackend = resolveBackend();

/** The active commerce backend as seen by client components. */
export const CLIENT_COMMERCE_BACKEND: CommerceBackend = resolveClientBackend();

/** True when the Square backend is active. */
export const isSquareBackend = COMMERCE_BACKEND === "square";

/** True when the Shopify backend is active. */
export const isShopifyBackend = COMMERCE_BACKEND === "shopify";
