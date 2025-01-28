import { Page } from 'playwright';

export const shopify = [
  // Let's try to be more focused on browser detection and move scripts back if it won't work out
  // {
  //   name: 'scripts' as const,
  //   score: 0.8,
  //   scripts: [
  //     // Shopify core scripts
  //     /shopify\.loadFeatures/,
  //     // Shopify payment scripts
  //     /shopify\.payment/,
  //   ],
  //   documents: [
  //     // Shopify meta tags
  //     /<meta\s+name="shopify-digital-wallet"/,
  //     /<meta\s+name="shopify-checkout-api-token"/,
  //     // Common Shopify markers
  //     /data-shopify/,
  //     /data-section-type="collection-template"/,
  //     /data-section-type="product-template"/,
  //   ],
  // },
  {
    name: 'isAdmin' as const,
    score: 2,
    browser: async (page: Page) => {
      const pathname = page.url();
      return (
        pathname.includes('.myshopify.com/admin') ||
        pathname.startsWith('https://admin.shopify.com')
      );
    },
  },
  {
    name: 'isStorefront' as const, // or isWebsite
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasShopifyGlobals: typeof window.Shopify !== 'undefined',
          hasStorefrontAPI: typeof window.Shopify?.shop !== 'undefined',
          hasShopifyXR: typeof window.ShopifyXR !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isCheckout' as const,
    score: 2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          noShopPresent: window.Shopify && !window.Shopify.shop,
          hasShopPayUI: typeof window.ShopPay !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'siteStructure' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Shopify sections
          hasSections: document.querySelector('[data-section-id]') !== null,
          // Check for Shopify templates
          hasTemplates: document.querySelector('[data-template]') !== null,
          // Check for Shopify product structure
          hasProductStructure:
            document.querySelector('[data-product-id], [data-variant-id]') !==
            null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.4,
    headers: {
      'x-shopify-stage': /.+/,
      'x-shopify-shop-api-call-limit': /.+/,
    },
    filenames: [
      /\.myshopify\.com\//,
      /\.shopify\.com\//,
      /cdn\.shopify\.com\//,
      /shopifycdn\.com\//,
    ],
  },
];
