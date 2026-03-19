// Shopify Storefront API GraphQL response types

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProduct }[];
  };
}

// Cart types
export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      vendor: string;
    };
    image: ShopifyImage | null;
    price: ShopifyMoney;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
}

// GraphQL response wrappers
export interface ProductsResponse {
  products: { edges: { node: ShopifyProduct }[] };
}

export interface CollectionResponse {
  collection: ShopifyCollection | null;
}

export interface ProductResponse {
  product: ShopifyProduct | null;
}

export interface CartResponse {
  cart: ShopifyCart | null;
  userErrors?: { field: string[]; message: string }[];
}

export interface CartCreateResponse {
  cartCreate: CartResponse;
}

export interface CartLinesAddResponse {
  cartLinesAdd: CartResponse;
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: CartResponse;
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: CartResponse;
}

export interface CartQueryResponse {
  cart: ShopifyCart | null;
}
