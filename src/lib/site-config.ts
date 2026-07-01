// Site-wide feature flags.
// COMING_SOON defaults to true (storefront redirects to Shoptiques). Override per
// deployment with NEXT_PUBLIC_COMING_SOON: set "false" on a Preview deployment to
// exercise the real storefront (e.g. verifying the Square catalog) WITHOUT launching
// production. Production stays coming-soon until this default is flipped at launch.
export const COMING_SOON =
  process.env.NEXT_PUBLIC_COMING_SOON !== undefined
    ? process.env.NEXT_PUBLIC_COMING_SOON === "true"
    : true;

// External shop link while the site is in coming-soon mode
export const SHOPTIQUES_URL = "https://www.shoptiques.com/collections/seagrass-boutique";
