// Server component — redirects to Shoptiques in coming-soon mode, otherwise loads from Shopify
import { COMING_SOON, SHOPTIQUES_URL } from "@/lib/site-config";
import { redirect } from "next/navigation";
import { getCollectionByHandle, getProductsByCollection } from "@/lib/shopify/data";
import CollectionPage from "@/components/CollectionPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  if (COMING_SOON) {
    redirect(SHOPTIQUES_URL);
  }

  const { slug } = await params;
  const [collection, products] = await Promise.all([
    getCollectionByHandle(slug),
    getProductsByCollection(slug),
  ]);

  return <CollectionPage collection={collection} products={products} slug={slug} />;
}
