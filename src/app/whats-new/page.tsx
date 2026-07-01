// "What's New" — Kevin's requested page. Auto-populated from Square: shows items
// created in the last 30 days (newest first), driven by Square's created_at.
// Redirects to Shoptiques while the site is in coming-soon mode, matching /browse.
import { COMING_SOON, SHOPTIQUES_URL } from "@/lib/site-config";
import { redirect } from "next/navigation";
import { getNewArrivals } from "@/lib/commerce/data";
import BrowsePage from "@/components/BrowsePage";

export const metadata = {
  title: "What's New — Seagrass Boutique",
  description: "The latest arrivals at Seagrass Boutique.",
};

// Renders per-request from the live Square catalog.
export const dynamic = "force-dynamic";

export default async function WhatsNewPage() {
  if (COMING_SOON) {
    redirect(SHOPTIQUES_URL);
  }

  const products = await getNewArrivals(30);

  return <BrowsePage products={products} category="new-arrivals" />;
}
