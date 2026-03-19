// Server component — fetches data from Shopify (with static fallback), passes to client
import { getTrendingProducts, getFeaturedCollections } from "@/lib/shopify/data";
import HomePage from "@/components/HomePage";

export default async function Page() {
  const [trending, collections] = await Promise.all([
    getTrendingProducts(),
    getFeaturedCollections(),
  ]);

  return <HomePage trending={trending} collections={collections} />;
}
