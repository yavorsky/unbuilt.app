import { Page } from 'playwright';

export const antDesign = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Core Ant Design classes and prefixes
      /ant-(?:btn|modal|form|input|select|table|menu|layout|card|tabs|list)/,
      /antd?-/,
      /ant-v\d-/,

      // Common component patterns
      /(?:^|\s)(?:ant-(?:row|col|space|divider|avatar|badge|switch|radio|checkbox))/,

      // Ant Design icons
      /@ant-design\/icons/,
      /anticon(?:-\w+)?/,
      /anticon-spin/,

      // Theme and customization
      /ConfigProvider/,
      /ant-[\w-]*-rtl/,
      /ant-[\w-]*-dark/,
      /data-theme="dark"/,

      // Form and validation
      /ant-form-item/,
      /ant-form-explain/,
      /validateMessages/,
      /validateStatus/,

      // Common minified patterns
      /-enter(?:-active)?/,
      /-leave(?:-active)?/,
      /-appear/,
      /ant-motion-/,

      // React specific patterns
      /antd\/(?:lib|es)\//,
      /from\s+["']antd["']/,

      // Specific component attributes
      /data-row-key/,
      /data-menu-id/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Core class checks
          hasAntClasses: document.querySelector('[class*="ant-"]') !== null,

          // Icon checks
          hasAntIcons:
            document.querySelector('.anticon, [class*="anticon-"]') !== null,

          // Component structure checks
          hasComponents: !!(
            document.querySelector('.ant-btn') ||
            document.querySelector('.ant-input') ||
            document.querySelector('.ant-form') ||
            document.querySelector('.ant-modal') ||
            document.querySelector('.ant-table')
          ),

          // Modal/Popup container checks
          hasPortals: !!document.querySelector(
            '.ant-popup-container, .ant-modal-root'
          ),

          // Message/Notification container
          hasMessageContainer: !!document.querySelector(
            '.ant-message, .ant-notification'
          ),

          // Theme checks
          hasThemeAttributes:
            document.querySelector(
              '[data-theme], [ant-click-animating-without-extra-node]'
            ) !== null,
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Package files
      /antd/,
      /@ant-design/,

      // Common build outputs
      /antd\.[\w-]+\.css$/,
      /antd\.[\w-]+\.js$/,

      // Chunk names
      /vendors~antd\.[a-f0-9]+\.js$/,
      /chunk-antd-[\w-]+\.js$/,

      // Icons package
      /@ant-design\/icons/,
      /icons-[\w-]+\.js$/,
    ],
  },
];
