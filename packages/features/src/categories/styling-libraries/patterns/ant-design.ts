import { Page } from 'playwright';

export const antDesign = [
  {
    name: 'core' as const,
    score: 0.9,
    scripts: [
      // Ant Design CSS-in-JS theme error message
      /\[Ant Design CSS-in-JS\] Theme should have at least one derivative function/,

      // Ant Design cache path data attribute
      /["']data-ant-cssinjs-cache-path["']/,

      // Ant Design fast-color error
      /@ant-design\/fast-color: unsupported input/,

      // Ant Design Icons package reference
      /@ant-design-icons/,

      // Ant Design icon class name
      /["']anticon["']/,

      // Ant Design icon display name
      /\.displayName\s*=\s*["']AntdIcon["']/,

      // Ant Design package name declaration
      /name:\s*["']antd["']/,

      // Ant Design class name concatenation pattern
      /antCls:\s*["']\.["']\.concat\(/,

      // RC component order data attribute (specific to Ant Design ecosystem)
      /["']data-rc-order["']:\s*["']prependQueue["']/,

      // Ant Design icon definition error
      /icon should be icon definiton, but got/,
    ],
  },
  {
    name: 'compilation' as const,
    score: 0.9,
    scripts: [
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
    name: 'imports' as const,
    score: 0.5,
    scripts: [
      /import\s+(?:\{[^}]*\}|[^{}\s]+)\s+from\s+['"]antd(?:\/[^'"]*)?['"]/,
    ],
  },
  {
    name: 'cssVars' as const,
    score: 0.9,
    stylesheets: [
      /--ant-primary-color:\s*[^;]*/,
      /--ant-font-size-base:\s*[^;]*/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.9,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasAntClasses: (() => {
            const antClasses = [
              'ant-btn',
              'ant-input',
              'ant-select',
              'ant-form',
              'ant-table',
              'ant-modal',
              'ant-menu',
              'ant-layout',
            ];

            for (const cls of antClasses) {
              if (document.querySelector(`.${cls}`)) {
                return true;
              }
            }
            return false;
          })(),

          // Check for Ant Design data attributes
          hasAntDataAttributes: (() => {
            return (
              !!document.querySelector('[data-ant-cssinjs-cache-path]') ||
              !!document.querySelector('[data-rc-order="prependQueue"]') ||
              !!document.querySelector('[data-rc-priority]')
            );
          })(),

          // Check for anticon classes
          hasAntIcons: (() => {
            return (
              !!document.querySelector('.anticon') ||
              !!document.querySelector('[role="img"].anticon')
            );
          })(),
        };

        return Object.values(markers).some(Boolean);
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
