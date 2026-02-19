import { Page } from 'playwright';

// Verified against minified bundle: cdn.jsdelivr.net/npm/antd@5.22.0/dist/antd.min.js
// CSS class prefix "ant-" survives everywhere. Unique strings: "ant-design-icons", "ant-sider-", etc.
export const antDesign = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/antd[.\-@/]/, /ant-design[.\-@/]/],
    stylesheets: [/antd/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.9,
    // Ant Design uses "ant-" prefixed classes extensively — verified in minified CSS
    documents: [/class="[^"]*ant-btn/, /class="[^"]*ant-layout/, /class="[^"]*ant-table/, /class="[^"]*ant-modal/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      /"ant-design-icons"/, // Verified in minified bundle
    ],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Check for ant- prefixed class names in the DOM
        return document.querySelector('[class*="ant-"]') !== null;
      });
    },
  },
];
