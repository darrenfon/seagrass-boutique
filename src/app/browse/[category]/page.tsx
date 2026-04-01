// Server component — redirects to Shoptiques in coming-soon mode, otherwise loads from Shopify
import { COMING_SOON, SHOPTIQUES_URL } from "@/lib/site-config";
import { redirect } from "next/navigation";
import { getProductsByCategory } from "@/lib/shopify/data";
import BrowsePage from "@/components/BrowsePage";

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  if (COMING_SOON) {
    redirect(SHOPTIQUES_URL);
  }

  const { category } = await params;
  const products = await getProductsByCategory(category);

  return <BrowsePage products={products} category={category} />;
}
