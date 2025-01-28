import { Page } from 'playwright';

export const wordpress = [
  {
    name: 'scripts' as const,
    score: 0.8,
    scripts: [
      // WordPress core scripts
      /wp-content\/themes\//,
      /wp-includes\/js\//,
      /wp-content\/plugins\//,
      // Common WP libraries and initializations
      /wp-emoji-release\.min\.js/,
      /wp-embed\.min\.js/,
      /jquery\/jquery-migrate\./,
      // WP admin scripts
      /wp-admin\/js\//,
    ],
    documents: [
      // WordPress meta tags
      /<meta\s+name="generator"\s+content="WordPress/i,
      // WordPress specific comment markers
      /<!-- This site is optimized with the Yoast/,
      /<!-- WP Rocket/,
      // Common WP body/post classes
      /class="[^"]*(?:wordpress|wp-)[^"]*"/,
      /wp-block-/,
      /--wp--preset--/,
    ],
  },
  {
    name: 'isAdmin' as const,
    score: 1,
    browser: async (page: Page) => {
      const pathname = page.url();
      if (
        pathname.includes('/wp-admin/') ||
        pathname.includes('/wp-login.php')
      ) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          // Check for WP admin environment
          hasWPAdmin: typeof window.adminpage !== 'undefined',
          hasWPSettings: typeof window.wp?.settings !== 'undefined',
          // Common admin markers
          hasAdminBar: document.getElementById('wpadminbar') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isWordPressCom' as const,
    score: 1,
    browser: async (page: Page) => {
      const pathname = page.url();
      if (
        pathname.includes('.wordpress.com') ||
        pathname.startsWith('https://wordpress.com')
      ) {
        return true;
      }
      return page.evaluate(() => {
        const markers = {
          hasWPComGlobals: typeof window.wpcom !== 'undefined',
          hasWPComFeatures: typeof window.wpcomFeaturesGlobals !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isWebsite' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for frontend-only WordPress features
          hasWPGlobals:
            typeof window.wp !== 'undefined' &&
            typeof window.adminpage === 'undefined',
          // Common frontend structure
          hasFrontendStructure:
            document.querySelector('body.home, body.single, body.archive') !==
            null,
          // Common frontend classes
          hasEmojiConfig: typeof window._wpemojiSettings !== 'undefined',
          hasPublicView:
            document.querySelector('.site, .wp-site-blocks') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isGutenberg' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Gutenberg editor
          hasGutenberg: typeof window.wp?.blocks !== 'undefined',
          hasBlockEditor:
            document.querySelector('.block-editor__container') !== null,
          // Gutenberg specific globals
          hasGutenbergData:
            typeof window.wp?.data?.select?.('core/editor') !== 'undefined',
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'isWooCommerce' as const,
    score: 0.8,
    scripts: [/woocommerce\/assets/, /wc-cart-fragments/, /wc-add-to-cart/],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasWooCommerce: typeof window.wc_add_to_cart_params !== 'undefined',
          hasWooStructure:
            document.querySelector('.woocommerce, .wc-block-grid') !== null,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'networking' as const,
    score: 0.6,
    headers: {
      'x-pingback': /xmlrpc\.php/,
      'x-powered-by': /WordPress/i,
    },
    filenames: [
      /\.wordpress\.com\//,
      /wp-content\//,
      /wp-includes\//,
      /wp-json\//,
    ],
  },
];
