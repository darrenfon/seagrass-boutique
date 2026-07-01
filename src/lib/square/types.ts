// Square Catalog / Inventory / Checkout API response types.
// Only the fields the storefront actually consumes are typed.

export interface SquareMoney {
  amount: number; // integer minor units (cents)
  currency: string;
}

export interface SquareCustomAttributeValue {
  name?: string;
  key?: string;
  string_value?: string;
  custom_attribute_definition_id?: string;
}

export interface SquareItemVariation {
  id: string;
  type: "ITEM_VARIATION";
  item_variation_data: {
    item_id?: string;
    name?: string;
    pricing_type?: string;
    price_money?: SquareMoney;
    track_inventory?: boolean;
  };
  custom_attribute_values?: Record<string, SquareCustomAttributeValue>;
}

export interface SquareCatalogItem {
  id: string;
  type: "ITEM";
  updated_at?: string;
  created_at?: string;
  item_data: {
    name?: string;
    description?: string;
    // Legacy single-category field (older Square versions).
    category_id?: string;
    // Square 2025-04-16: items carry a categories[] array.
    categories?: { id: string; ordinal?: number }[];
    reporting_category?: { id: string };
    image_ids?: string[];
    variations?: SquareItemVariation[];
  };
  custom_attribute_values?: Record<string, SquareCustomAttributeValue>;
}

export interface SquareCatalogCategory {
  id: string;
  type: "CATEGORY";
  category_data: {
    name?: string;
  };
}

export interface SquareCatalogImage {
  id: string;
  type: "IMAGE";
  image_data: {
    url?: string;
    caption?: string;
  };
}

export type SquareCatalogObject =
  | SquareCatalogItem
  | SquareCatalogCategory
  | SquareCatalogImage;

export interface SquareSearchResponse {
  objects?: SquareCatalogObject[];
  related_objects?: SquareCatalogObject[];
}

export interface SquareRetrieveResponse {
  object?: SquareCatalogObject;
  related_objects?: SquareCatalogObject[];
}

export interface SquareInventoryCount {
  catalog_object_id: string;
  state: string;
  location_id?: string;
  quantity: string;
}

export interface SquareInventoryResponse {
  counts?: SquareInventoryCount[];
}

export interface SquareLocation {
  id: string;
  name?: string;
  status?: string;
  currency?: string;
}

export interface SquareLocationsResponse {
  locations?: SquareLocation[];
}

// ─── Checkout / Payment Link ─────────────────────────────────────
export interface SquarePaymentLink {
  id: string;
  url: string;
  long_url?: string;
  order_id?: string;
}

export interface SquarePaymentLinkResponse {
  payment_link?: SquarePaymentLink;
  related_resources?: {
    orders?: SquareOrder[];
  };
}

export interface SquareOrderLineItem {
  uid?: string;
  catalog_object_id?: string;
  name?: string;
  quantity: string;
  base_price_money?: SquareMoney;
  total_money?: SquareMoney;
}

export interface SquareOrder {
  id?: string;
  location_id?: string;
  line_items?: SquareOrderLineItem[];
  total_money?: SquareMoney;
}
