// Shopify Storefront API GraphQL client — server-only, uses native fetch

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || "";
const API_VERSION = "2026-01";

const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options?: { revalidate?: number }
): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    throw new Error("Shopify credentials not configured");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }

  return json.data as T;
}
