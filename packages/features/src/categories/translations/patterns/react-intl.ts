import { AnalysisFeatures } from '../../../types/analysis.js';

export const reactIntl = [
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      // react-intl's specific class definition pattern
      /\[React Intl\] Could not find required `intl` object\. <IntlProvider> needs to exist in the component ancestry/,

      // IntlProvider displayName
      /\.displayName\s*=\s*["']IntlProvider["']/,

      // FormatJS error prefix
      /\[@formatjs\/intl Error/,

      // IntlMessageFormat parse error
      /TypeError\(["']IntlMessageFormat\.__parse must be set to process `message` of type `string`["']\)/,

      // Intl.PluralRules polyfill error message
      /Intl\.PluralRules is not available in this environment\.\nTry polyfilling it using "@formatjs\/intl-pluralrules"/,

      // Missing Intl API error constant
      /\.MISSING_INTL_API\s*=\s*["']MISSING_INTL_API["']/,

      // The intl string context variable
      /'The intl string context variable ["']/,

      // PluralRules selection pattern (highly specific to react-intl)
      /\.getPluralRules\(\s*\w+\s*,\s*\{\s*type:\s*\w+\.pluralType\s*\}\)\.select\(\s*\w+\s*-\s*\(\s*\w+\.offset\s*\|\|\s*0\s*\)\s*\)/,

      // useIntl hook usage
      /const\s+intl\s*=\s*useIntl\(\)/,

      // react-intl's specific mixin properties
      /ReactIntlMixin.*getMessageFormat.*getDateTimeFormat.*getNumberFormat/,

      // react-intl's unique component initialization
      /FormattedHTMLMessage.*FormattedNumber.*FormattedRelative/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.4,
    scripts: [
      // react-intl's specific component property validation
      /propTypes:\s*\{\s*tagName:\s*React\.PropTypes\.string,\s*message:\s*React\.PropTypes\.string\.isRequired\}/,

      // react-intl's unique format options specification
      /formatOptions:\s*\[["']localeMatcher["'],\s*["']timeZone["'],\s*["']hour12["']/,

      // react-intl's specific error handling
      /Could not find Intl message:\s*/,
    ],
  },
  {
    name: 'dependencies' as const,
    score: -1,
    dependencies: (analysis: AnalysisFeatures) => {
      // Rare case to use without react
      return analysis.uiLibrary.name !== 'react';
    },
  },
];
