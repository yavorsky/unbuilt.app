import { AnalysisFeatures } from '../../../types/analysis.js';

export const reactI18next = [
  {
    name: 'coreRuntime' as const,
    score: 1,
    scripts: [
      // react-i18next's unique error handling pattern
      /react-i18next::/,

      /pass in an i18next instance by using initReactI18next/,

      /It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour/,

      // react-i18next's specific component patterns with unique prop combinations
      /displayName=`withI18nextTranslation\(/,

      // react-i18next's specific context initialization with namespace handling
      /reportNamespaces\s*=\s*new\s*[A-Za-z]+\(\)/,
    ],
  },
  {
    name: 'components' as const,
    score: 0.4,
    scripts: [
      // react-i18next's Trans component with its specific prop structure
      /useTranslation:\s*{[^}]*ns:.*defaultNS:.*i18n:/,

      // react-i18next's specific namespace management
      /addUsedNamespaces\(\s*\w+\s*\.\s*forEach/,

      // react-i18next's unique HTML node handling
      /transSupportBasicHtmlNodes.*transWrapTextNodes.*transKeepBasicHtmlNodesFor/,
    ],
  },
  {
    name: 'ssr' as const,
    score: 0.3,
    scripts: [
      // react-i18next's specific SSR patterns with unique property combinations
      /initialI18nStore:\s*{\s*[^}]*getResourceBundle\(/,
      /getInitialProps.*getUsedNamespaces.*initialI18nStore/,

      // react-i18next's unique server-side namespace reporting
      /reportNamespaces\.getUsedNamespaces\(\).*initialI18nStore/,
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
