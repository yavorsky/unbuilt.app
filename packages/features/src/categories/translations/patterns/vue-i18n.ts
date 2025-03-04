import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';
import { i18next } from './i18next.js';

export const vueI18n = [
  ...i18next,
  {
    name: 'coreRuntime' as const,
    score: 0.5,
    scripts: [
      // Vue I18n's unique build flags - specific to Vue I18n implementation
      /__VUE_I18N_FULL_INSTALL__/,
      /__VUE_I18N_LEGACY_API__/,
      /__INTLIFY_DROP_MESSAGE_COMPILER__/,

      // Vue I18n's unique component registration pattern
      /name:\s*["']i18n-(?:t|n|d)["']/,

      // Vue I18n's specific symbol declarations
      /Symbol\(["']__translateVNode["']\)/,
      /Symbol\(["']__datetimeParts["']\)/,
      /Symbol\(["']__numberParts["']\)/,
    ],
  },
  {
    name: 'runtime' as const,
    score: 1,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Vue I18n specific global flags
          hasVueI18nFlags: (() => {
            try {
              return (
                typeof window.__VUE_I18N_FULL_INSTALL__ === 'boolean' &&
                typeof window.__VUE_I18N_LEGACY_API__ === 'boolean'
              );
            } catch {
              return false;
            }
          })(),

          // Vue I18n's integration with Vue instance
          hasVueIntegration: (() => {
            try {
              const app = window.__vue_app__;
              if (!app?.config?.globalProperties) return false;
              // Check for Vue I18n's unique property combinations
              return (
                '$i18n' in app.config.globalProperties &&
                '$t' in app.config.globalProperties &&
                '$d' in app.config.globalProperties &&
                '$n' in app.config.globalProperties
              );
            } catch {
              return false;
            }
          })(),
        };

        return Object.values(markers).filter(Boolean).length >= 2;
      });
    },
  },
  {
    name: 'intlify' as const,
    score: 0.3,
    scripts: [
      // Vue I18n's unique @intlify integration patterns
      /["']@intlify\/vue-devtools["']/,
      /["']@intlify\/core-base["']/,

      // Vue I18n's specific error codes
      /CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN:\s*30/,
      /NOT_AVAILABLE_COMPOSITION_IN_LEGACY:\s*34/,
    ],
  },
  {
    name: 'dependencies' as const,
    score: -1,
    dependencies: (analysis: AnalysisFeatures) => {
      // Rare case to use without react
      return analysis.uiLibrary.name !== 'vue';
    },
  },
];
