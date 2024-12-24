import { Page } from 'playwright';

export const antDesign = [
  {
    name: 'compilation' as const,
    score: 0.6,
    runtime: [
      // Optimized message/notification system - combined patterns with non-capturing groups
      /ant-message-(?:notice|loading|success|error|warning|info)(?:-content)?/,
      /ant-notification-(?:notice|info|success|error|warning|close|btn)/,

      // Optimized modal/drawer structure - added length limits and boundaries
      /ant-modal-(?:confirm|confirm-body|confirm-btns|confirm-title|wrap)\b/,
      /ant-drawer-(?:wrapper-body|header-title|content-wrapper|mask)\b/,

      // Optimized form validation - combined patterns
      /ant-form-item-(?:control-input|explain-(?:connected|error)|required-mark|margin|with-help|feedback-icon|extra)\b/,

      // Optimized select/dropdown - consolidated patterns
      /ant-select-(?:selection-(?:overflow|placeholder|search)|dropdown)\b/,
      /ant-dropdown-menu-(?:submenu-(?:title|expand-icon)|title-content)\b/,

      // Optimized Calendar/DatePicker - bounded search
      /ant-picker-(?:super-(?:prev|next)-icon|header-super-prev-btn|datetime-panel)\b/,
      /ant-calendar-picker-(?:clear|separator|input|icon|container)\b/,

      // Optimized Table patterns - consolidated and bounded
      /ant-table-(?:filter-trigger-container|column-sorter-(?:up|down)|selection-extra|fixed-(?:right|left)|placeholder|measure-row)\b/,

      // Optimized Icon patterns
      /anticon-(?:spin-dot-spin|loading-3-quarters|step-(?:forward|backward))\b/,

      // Optimized locale pattern - more specific boundaries
      /antd\/(?:es|lib)\/locale\/[a-z]{2}_[A-Z]{2}\b/,

      // Optimized config provider - added length limit
      /ConfigProvider\.config\(\{\s*theme:\s*\{[^}]{0,500}token:/,

      // Optimized data attributes - added length limits
      /data-row-key="ant-table-row-[0-9]{1,10}"/,
      /data-node-key="ant-tree-treenode-[0-9]{1,10}"/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.7,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Optimized selectors - using more specific classes
          hasMessageSystem:
            document.querySelector(
              '.ant-message-notice-content, .ant-notification-notice-message, .ant-notification-notice-description'
            ) !== null,

          // Combined modal structure checks
          hasModalStructure:
            document.querySelector(
              '.ant-modal-confirm-body-wrapper, .ant-modal-confirm-paragraph, .ant-modal-wrap-rtl'
            ) !== null,

          // Combined table feature checks
          hasTableFeatures:
            document.querySelector(
              '.ant-table-filter-trigger-container-open, .ant-table-column-sorter-inner, .ant-table-selection-extra'
            ) !== null,

          // Combined select feature checks
          hasSelectFeatures:
            document.querySelector(
              '.ant-select-selection-overflow-item-suffix, .ant-select-selection-search-mirror, .ant-select-item-option-grouped'
            ) !== null,
        };

        try {
          return Object.values(markers).some(Boolean);
        } catch (error) {
          console.warn(error);
          return false;
        }
      });
    },
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Optimized core files pattern - more specific boundaries
      /antd\/(?:es|lib)\/[^/]{1,50}\/style\/index\.[jt]s$/,
      /antd\/dist\/(?:antd|reset)\.(?:css|less)$/,

      // Optimized component chunks - added length limit
      /antd\/(?:es|lib)\/(?:message|notification|modal|table|form|select)\/[^/]{1,50}\.js$/,

      // Optimized locale files - more specific
      /antd\/(?:es|lib)\/locale\/[a-z]{2}_[A-Z]{2}\.js$/,

      // Optimized theme files - bounded paths
      /antd\/(?:es|lib)\/style\/themes\/(?:default|dark|compact)\.less$/,

      // Optimized icon patterns - added length limits
      /@ant-design\/icons\/lib\/icons\/[A-Z][^/]{1,50}\.js$/,
      /@ant-design\/icons-svg\/inline-namespaced\/$/,
    ],
  },
];
