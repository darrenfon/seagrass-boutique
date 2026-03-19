// Server component — fetches collection data from Shopify with static fallback
import { getCollectionByHandle, getProductsByCollection } from "@/lib/shopify/data";
import CollectionPage from "@/components/CollectionPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [collection, products] = await Promise.all([
    getCollectionByHandle(slug),
    getProductsByCollection(slug),
  ]);

  return <CollectionPage collection={collection} products={products} slug={slug} />;
}
