import { AnalysisFeatures } from '../../../types/analysis.js';

export const reactIntl = [
  {
    name: 'coreRuntime' as const,
    score: 0.5,
    scripts: [
      // react-intl's specific class definition pattern
      /displayName:\s*["']FormattedMessage["']/,

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
