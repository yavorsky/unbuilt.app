import { Page } from 'playwright';

export const antDesign = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      // Unique Ant Design message/notification system
      /ant-message-(?:notice|loading|success|error|warning|info)(?:-content)?/,
      /ant-notification-(?:notice|info|success|error|warning|close|btn)/,

      // Unique Ant Design modal/drawer structure
      /ant-modal-(?:confirm|confirm-body|confirm-btns|confirm-title|wrap)/,
      /ant-drawer-(?:wrapper-body|header-title|content-wrapper|mask)/,

      // Form validation patterns unique to Ant Design
      /ant-form-item-(?:control-input|explain-connected|explain-error|required-mark)/,
      /ant-form-item-(?:margin|with-help|feedback-icon|extra)/,

      // Unique Ant Design select/dropdown structure
      /ant-select-(?:selection-overflow|selection-placeholder|selection-search|dropdown)/,
      /ant-dropdown-menu-(?:submenu-title|submenu-expand-icon|title-content)/,

      // Calendar/DatePicker patterns specific to Ant Design
      /ant-picker-(?:super-prev-icon|super-next-icon|header-super-prev-btn|datetime-panel)/,
      /ant-calendar-picker-(?:clear|separator|input|icon|container)/,

      // Table-specific patterns unique to Ant Design
      /ant-table-(?:filter-trigger-container|column-sorter-up|column-sorter-down)/,
      /ant-table-(?:selection-extra|fixed-right|fixed-left|placeholder|measure-row)/,

      // Icon patterns specific to Ant Design's implementation
      /anticon-(?:spin-dot-spin|loading-3-quarters|step-forward|step-backward)/,

      // Config provider and locale specific patterns
      /antd\/(?:es|lib)\/locale\/[a-z]{2}_[A-Z]{2}/,
      /ConfigProvider\.config\(\{\s*theme:\s*\{[^}]*token:/,

      // Specific data attributes unique to Ant Design
      /data-row-key="ant-table-row-[0-9]+"/,
      /data-node-key="ant-tree-treenode-[0-9]+"/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for unique Ant Design message/notification containers
          hasMessageSystem: [
            '.ant-message-notice-content',
            '.ant-notification-notice-message',
            '.ant-notification-notice-description',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Ant Design's unique modal structure
          hasModalStructure: [
            '.ant-modal-confirm-body-wrapper',
            '.ant-modal-confirm-paragraph',
            '.ant-modal-wrap-rtl',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Ant Design's unique table features
          hasTableFeatures: [
            '.ant-table-filter-trigger-container-open',
            '.ant-table-column-sorter-inner',
            '.ant-table-selection-extra',
          ].some((selector) => document.querySelector(selector) !== null),

          // Check for Ant Design's unique select features
          hasSelectFeatures: [
            '.ant-select-selection-overflow-item-suffix',
            '.ant-select-selection-search-mirror',
            '.ant-select-item-option-grouped',
          ].some((selector) => document.querySelector(selector) !== null),
        };

        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Core Ant Design dist files
      /antd\/(?:es|lib)\/(?:[^/]+)\/style\/index\.[jt]s$/,
      /antd\/dist\/(?:antd|reset)\.(?:css|less)$/,

      // Specific component chunks
      /antd\/(?:es|lib)\/(?:message|notification|modal|table|form|select)\/[^/]+\.js$/,

      // Locale files
      /antd\/(?:es|lib)\/locale\/[a-z]{2}_[A-Z]{2}\.js$/,

      // Theme files
      /antd\/(?:es|lib)\/style\/themes\/(?:default|dark|compact)\.less$/,

      // Icon package specific files
      /@ant-design\/icons\/lib\/icons\/[A-Z][^/]+\.js$/,
      /@ant-design\/icons-svg\/inline-namespaced\/$/,
    ],
  },
];
