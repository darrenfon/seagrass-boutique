// Convert Shopify GraphQL responses into the existing Product/Collection interfaces

import type { ShopifyProduct, ShopifyCollection } from "./types";
import type { Product, Collection } from "../products";

// Map Shopify product_type to our category slugs as a fallback
const PRODUCT_TYPE_TO_CATEGORY: Record<string, string> = {
  dress: "dresses",
  dresses: "dresses",
  top: "clothing",
  tops: "clothing",
  sweater: "clothing",
  sweaters: "clothing",
  pants: "clothing",
  shorts: "clothing",
  skirt: "clothing",
  skirts: "clothing",
  blouse: "clothing",
  jacket: "clothing",
  cardigan: "clothing",
  jeans: "clothing",
  denim: "clothing",
  candle: "candles",
  candles: "candles",
  "body care": "body",
  fragrance: "body",
  oil: "body",
  shoe: "shoes",
  shoes: "shoes",
  sandal: "shoes",
  sandals: "shoes",
  accessory: "accessories",
  accessories: "accessories",
  jewelry: "accessories",
  bag: "accessories",
  handbag: "accessories",
  sunglasses: "accessories",
  scarf: "accessories",
};

function inferCategory(product: ShopifyProduct): string {
  // Try product_type first
  const pt = product.productType?.toLowerCase().trim();
  if (pt && PRODUCT_TYPE_TO_CATEGORY[pt]) {
    return PRODUCT_TYPE_TO_CATEGORY[pt];
  }
  // Try tags
  for (const tag of product.tags) {
    const t = tag.toLowerCase();
    if (PRODUCT_TYPE_TO_CATEGORY[t]) return PRODUCT_TYPE_TO_CATEGORY[t];
  }
  return "clothing"; // default
}

export function normalizeProduct(shopifyProduct: ShopifyProduct): Product {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const compareAtAmount = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount;
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const compareAtPrice = compareAtAmount ? parseFloat(compareAtAmount) : undefined;

  // Extract color from variant options or tags
  let color = "";
  if (firstVariant?.selectedOptions) {
    const colorOption = firstVariant.selectedOptions.find(
      (o) => o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour"
    );
    if (colorOption) color = colorOption.value;
  }

  // All image URLs
  const allImages = shopifyProduct.images.edges.map((e) => e.node.url);

  return {
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    vendor: shopifyProduct.vendor || "Seagrass Boutique",
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    color,
    category: inferCategory(shopifyProduct),
    collections: [], // filled by the caller if needed
    tags: shopifyProduct.tags,
    image: "from-stone-200 to-gray-300", // gradient fallback (rarely used when Shopify provides images)
    realImage: allImages[0] || undefined,
    description: shopifyProduct.description || undefined,
    // Shopify-specific fields
    shopifyId: shopifyProduct.id,
    shopifyVariantId: firstVariant?.id,
    variants: shopifyProduct.variants.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      availableForSale: e.node.availableForSale,
      price: parseFloat(e.node.price.amount),
      selectedOptions: e.node.selectedOptions,
    })),
    images: allImages,
    availableForSale: shopifyProduct.availableForSale,
    descriptionHtml: shopifyProduct.descriptionHtml || undefined,
  };
}

export function normalizeCollection(shopifyCollection: ShopifyCollection): Collection {
  return {
    handle: shopifyCollection.handle,
    title: shopifyCollection.title,
    description: shopifyCollection.description || "",
    image: shopifyCollection.image?.url || `/images/collection-${shopifyCollection.handle}.jpg`,
    featured: true,
  };
}
