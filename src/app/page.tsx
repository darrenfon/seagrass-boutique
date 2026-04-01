// Conditionally render coming-soon or full site based on feature flag
import { COMING_SOON } from "@/lib/site-config";
import { getTrendingProducts, getFeaturedCollections } from "@/lib/shopify/data";
import HomePage from "@/components/HomePage";
import ComingSoonHome from "@/components/ComingSoonHome";

export default async function Page() {
  if (COMING_SOON) {
    return <ComingSoonHome />;
  }

  const [trending, collections] = await Promise.all([
    getTrendingProducts(),
    getFeaturedCollections(),
  ]);

  return <HomePage trending={trending} collections={collections} />;
}
