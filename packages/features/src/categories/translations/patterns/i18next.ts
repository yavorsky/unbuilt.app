import { Page } from 'playwright';

export const i18next = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Core i18next object and initialization
      /i18next\./,
      /\.use\((?:Backend|LanguageDetector|initReactI18next)\)/,
      /i18next\.init\(/,
      /(?:import|require)\s+i18next/,

      // Common namespaces and keys
      /\.t\(['"][^'"]+:[^'"]+['"]\)/, // namespace:key pattern
      /\.t\(['"][^'"]+\.[^'"]+['"]\)/, // nested key pattern
      /i18next\.exists\(/,
      /i18next\.getFixedT\(/,

      // Translation function patterns
      /useTranslation\(\s*['"]\w+['"]\s*\)/,
      /withTranslation\(\s*['"]\w+['"]\s*\)/,
      /Trans\s+[^>]*i18nKey=/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for global i18next
          hasI18next: typeof window.i18next !== 'undefined',

          // Check for core methods
          hasTranslation: typeof window.i18next?.t === 'function',

          // Check for language handling
          hasLanguage: !!window.i18next?.language,

          // Check for plugins
          hasBackend: !!window.i18next?.services?.backendConnector,

          // Check for store
          hasStore: !!window.i18next?.store?.data,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'plugins' as const,
    score: 0.2,
    scripts: [
      // Common plugins
      /i18nextHttpBackend/,
      /i18nextBrowserLanguageDetector/,
      /i18next-http-backend/,
      /i18next-browser-languagedetector/,

      // Framework integrations
      /react-i18next/,
      /next-i18next/,
      /vue-i18next/,
      /angular-i18next/,

      // Plugin initialization
      /\.use\([^)]+\)\.use\([^)]+\)/,
      /i18next\.modules\.external/,
    ],
  },
  {
    name: 'interpolation' as const,
    score: 0.2,
    scripts: [
      // Interpolation patterns
      /\{\{[^}]+\}\}/,
      /\$t\([^)]+\)/,
      /__\([^)]+\)/,

      // Plurals and contexts
      /_plural|_zero|_one|_other/,
      /_male|_female/,
      /\{\{count\}\}/,

      // Formatting
      /interpolation:\s*\{/,
      /formatSeparator/,
      /format:\s*["']\w+["']/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /i18next(?:\.min)?\.js$/,
      /i18next\.[a-f0-9]+\.js$/,
      /locales\/[a-z-]+\.json$/,
      /translations\/[a-z-]+\.json$/,
      /i18n\/[a-z-]+\.json$/,
    ],
  },
];
