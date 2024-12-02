import { Page } from 'playwright';

export const vueI18n = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core Vue I18n initialization and imports
      /createI18n\(/,
      /vue-i18n/,
      /useI18n\(/,
      /\$t\(['"][^'"]+['"]\)/,

      // Vue specific i18n directives and components
      /v-t=/,
      /<i18n>/,
      /<i18n-t/,
      /\$tc\(/,

      // Component name patterns
      /i18n\.global/,
      /i18n\.locale/,
      /i18n\.fallbackLocale/,

      // Common configuration patterns
      /availableLocales/,
      /datetimeFormats/,
      /numberFormats/,
      /silentTranslationWarn/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Vue I18n global
          hasVueI18n: typeof (window as any).VueI18n !== 'undefined',

          // Check for modern composition API
          hasComposition: !!(window as any).createI18n,

          // Check for legacy instance
          hasLegacy: !!(window as any).Vue?.prototype?.$i18n,

          // Check for translations
          hasTranslations: !!(window as any).$i18n?.messages,

          // Check for number/datetime formats
          hasFormatting: !!(window as any).$i18n?.numberFormats ||
                        !!(window as any).$i18n?.datetimeFormats
        };
        return Object.values(markers).some(Boolean);
      });
    }
  },
  {
    name: 'formats' as const,
    score: 0.2,
    runtime: [
      // Translation syntax patterns
      /\{\s*\$t\([^)]+\)\s*\}/,
      /\{\s*count\s*\}/,
      /\|/,  // plural delimiter

      // Named formatting
      /named\(/,
      /list\(/,
      /linked\(/,

      // Number and datetime formatting
      /\$n\(/,
      /\$d\(/,
      /setNumberFormat/,
      /setDateTimeFormat/,

      // Common patterns in translation files
      /"@.+?"/,  // meta information
      /"pluralization"/,
      /"pluralRules"/
    ]
  },
  {
    name: 'components' as const,
    score: 0.2,
    runtime: [
      // SFC i18n custom blocks
      /<i18n\s+lang=["']json["']>/,
      /<i18n\s+locale=["'][a-z-]+["']>/,

      // Component interpolation
      /<i18n-t.+?keypath=/,
      /<i18n-t.+?tag=/,

      // Composition API usage
      /useI18n\(\{[^}]*\}\)/,
      /defineI18nConfig/,

      // Legacy component options
      /i18n:\s*\{/,
      /i18nOptions:/
    ]
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /vue-i18n(?:\.min)?\.js$/,
      /vue-i18n\.[a-f0-9]+\.js$/,
      /i18n\/[a-z-]+\.json$/,
      /locales\/[a-z-]+\.json$/,
      /messages\/[a-z-]+\.yml$/
    ]
  }
 ];