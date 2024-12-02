import { Page } from "playwright";

export const reactIntl = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core FormatJS/react-intl imports and components
      /IntlProvider/,
      /FormattedMessage/,
      /useIntl/,
      /injectIntl/,

      // Message descriptors
      /defineMessages\s*\(/,
      /id:\s*["'][^"']+["']/,
      /defaultMessage:\s*["'][^"']+["']/,

      // Common formatters
      /FormattedNumber/,
      /FormattedDate/,
      /FormattedTime/,
      /FormattedRelativeTime/,
      /FormattedPlural/,

      // ICU message syntax
      /\{[^}]+,\s*(?:select|plural|number|date|time)\s*,/,
      /\{[\w]+,\s*(?:select|plural)\s*,\s*(?:[^{}]*\{[^{}]+\})+[^{}]*\}/,

      // Hook patterns
      /useIntl\(\)\.formatMessage/,
      /useIntl\(\)\.format(?:Number|Date|Time|RelativeTime)/
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for React Intl globals
          hasIntl: !!(window as any).ReactIntl,

          // Check for formatters
          hasFormatters: !!(window as any).ReactIntl?.FormattedMessage,

          // Check for hooks
          hasHooks: !!(window as any).ReactIntl?.useIntl,

          // Check for provider
          hasProvider: !!(window as any).ReactIntl?.IntlProvider,

          // Check for messages
          hasMessages: !!(window as any).ReactIntl?.defineMessages
        };
        return Object.values(markers).some(Boolean);
      });
    }
  },
  {
    name: 'formatting' as const,
    score: 0.2,
    runtime: [
      // Number formatting
      /style:\s*["'](?:decimal|currency|percent|unit)["']/,
      /minimumFractionDigits/,
      /maximumFractionDigits/,

      // Date/Time formatting
      /year:\s*["'](?:numeric|2-digit)["']/,
      /timeZone:\s*["'][^"']+["']/,
      /hour12:\s*(?:true|false)/,

      // Plural/Select formatting
      /selectordinal/,
      /\=(?:zero|one|two|few|many|other)\s*\{/,
      /offset:\s*\d+/
    ]
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /react-intl/,
      /@formatjs\/intl/,
      /compiled-lang\/[a-z-]+\.json$/,
      /messages\/[a-z-]+\.json$/,
      /intl\/[a-z-]+\.json$/
    ]
  }
 ];