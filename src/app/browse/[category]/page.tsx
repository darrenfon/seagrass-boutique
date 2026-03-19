// Server component — fetches category products from Shopify with static fallback
import { getProductsByCategory } from "@/lib/shopify/data";
import BrowsePage from "@/components/BrowsePage";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const products = await getProductsByCategory(category);

  return <BrowsePage products={products} category={category} />;
}
