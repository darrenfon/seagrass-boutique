// Shopify Storefront API GraphQL queries

const PRODUCT_FIELDS = `
  id
  handle
  title
  vendor
  description
  descriptionHtml
  productType
  tags
  availableForSale
  priceRange {
    minVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    minVariantPrice { amount currencyCode }
  }
  images(first: 5) {
    edges { node { url altText } }
  }
  variants(first: 10) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        image { url altText }
      }
    }
  }
`;

export const PRODUCTS_QUERY = `
  query AllProducts($first: Int = 100, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = `
  query CollectionByHandle($handle: String!, $first: Int = 50) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url altText }
      products(first: $first) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($first: Int = 20) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image { url altText }
        }
      }
    }
  }
`;
