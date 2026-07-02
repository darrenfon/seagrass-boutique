// Square checkout API route.
//
// Backend-agnostic analogue of the Shopify cart route's checkoutUrl: the client
// posts its cart line items (Square catalog variation IDs + quantities) and the
// server calls Square's CreatePaymentLink. Square prices the order server-side
// from the catalog — the client never sends prices. The hosted payment-link URL
// is returned, directly analogous to Shopify's cart.checkoutUrl.
//
// Proven request shape: square-spike/03-checkout.js.
// The access token stays server-only — never exposed to the browser.

import { NextRequest, NextResponse } from "next/server";
import { squareFetch, squareUuid } from "@/lib/square/client";
import { getLocationId } from "@/lib/square/queries";
import type { SquarePaymentLinkResponse } from "@/lib/square/types";

interface CheckoutLine {
  catalogObjectId: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  // Preview-safety gate: the preview deployment is publicly reachable and wired
  // to the LIVE Square account, so checkout is disabled there via a Preview-scoped
  // env var (CHECKOUT_DISABLED=true). Production never sets it. Temporarily unset
  // it on preview to run a supervised real test purchase.
  if (process.env.CHECKOUT_DISABLED === "true") {
    return NextResponse.json(
      { error: "Checkout isn't open yet on this preview site." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const lines: CheckoutLine[] = Array.isArray(body?.lines) ? body.lines : [];

    if (lines.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const locationId = await getLocationId();
    const origin = request.nextUrl.origin;

    const res = await squareFetch<SquarePaymentLinkResponse>(
      "/v2/online-checkout/payment-links",
      "POST",
      {
        idempotency_key: squareUuid(),
        order: {
          location_id: locationId,
          line_items: lines.map((l) => ({
            catalog_object_id: l.catalogObjectId,
            quantity: String(Math.max(1, Math.floor(l.quantity || 1))),
          })),
        },
        checkout_options: {
          redirect_url: `${origin}/?checkout=complete`,
          ask_for_shipping_address: true,
        },
      }
    );

    const link = res.payment_link;
    if (!link?.url) {
      return NextResponse.json(
        { error: "Square did not return a payment link" },
        { status: 502 }
      );
    }

    const order = res.related_resources?.orders?.[0];
    return NextResponse.json({
      checkoutUrl: link.url,
      paymentLinkId: link.id,
      orderId: link.order_id,
      total: order?.total_money ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Square checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
