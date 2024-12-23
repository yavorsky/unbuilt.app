import { Page } from 'playwright';

export const storybook = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // Storybook-specific globals and identifiers that survive minification
      /window\.__STORYBOOK_CLIENT_API__/,
      /window\.__STORYBOOK_STORY_STORE__/,
      /window\.__STORYBOOK_ADDONS_CHANNEL__/,
      /__STORYBOOK_PREVIEW__/,
      /storybook-preview-iframe/,
    ],
  },
  {
    name: 'dom-markers' as const,
    score: 0.9,
    runtime: [
      // Storybook-specific DOM markers and attributes
      /data-storybook(-.*)?/,
      /storybook-iframe/,
      /storybook-wrapper/,
      /sb-show-main/,
      /sb-previewBlock/,
      /class="sb-show/,
    ],
  },
  {
    name: 'hydration' as const,
    score: 0.8,
    runtime: [
      // Storybook state management and runtime markers
      /__STORYBOOK_STATE__/,
      /window\.__STORYBOOK_MANAGER__/,
      /window\.__STORYBOOK_COMPOSECONFIGS/,
      /STORYBOOK_HOOKS_CONTEXT/,
    ],
  },
  {
    name: 'browser-check' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Storybook-specific globals
          hasStorybookAPI:
            typeof window?.__STORYBOOK_CLIENT_API__ !== 'undefined',
          hasStoryStore:
            typeof window?.__STORYBOOK_STORY_STORE__ !== 'undefined',
          // Check for Storybook UI elements
          hasPreviewIframe: !!document.querySelector(
            '#storybook-preview-iframe'
          ),
          hasStorybookWrapper: !!document.querySelector('.storybook-wrapper'),
          // Check for Storybook classes
          hasSbClasses: !!document.querySelector('[class*="sb-"]'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    score: 0.3,
    name: 'addons' as const,
    runtime: [
      // Storybook addons patterns
      /STORYBOOK_ADDON_STATE/,
      /STORYBOOK_ADDON_ACTIONS/,
      /STORYBOOK_ADDON_BACKGROUNDS/,
      /STORYBOOK_ADDON_DOCS/,
      /storybook-addon-/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for common addons
          hasDocsAddon: !!document.querySelector('[id*="anchor-docs-"]'),
          hasActionsAddon: !!document.querySelector('[data-action-log]'),
          // Check for addon panels
          hasAddonPanel: !!document.querySelector('[class*="addon-panel"]'),
          // Check for controls
          hasControls: !!document.querySelector('[class*="sbcontrol"]'),
          // Check for common addon UI elements
          hasAddonUI: !!document.querySelector('[class*="sb-addon"]'),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
];
