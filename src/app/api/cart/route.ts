// Cart API route handler — proxies cart mutations to Shopify Storefront API
// Keeps the Storefront token server-only

import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "";
const API_VERSION = "2026-01";

const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      return NextResponse.json(
        { error: "Shopify not configured" },
        { status: 503 }
      );
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      return NextResponse.json(
        { error: json.errors?.[0]?.message || "Shopify API error" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(json.data);
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
