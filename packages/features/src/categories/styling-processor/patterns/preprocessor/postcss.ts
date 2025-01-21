import { AnalysisFeatures } from '../../../../types/analysis.js';

export const postCSS = [
  {
    name: 'customPropertySyntax' as const,
    score: 0.3,
    stylesheets: [
      // PostCSS-specific custom property registration
      /@property\s+--[\w-]+\s*{[^}]*syntax:/,
      /@custom-media\s+--[\w-]+\s*\([^)]+\)/,
      /@custom-selector\s*:--[\w-]+/,
    ],
  },
  {
    name: 'nestingFeatures' as const,
    score: 0.3,
    stylesheets: [
      // PostCSS-specific nesting syntax
      /@nest\s*&/,
      /@nest\s+[^&]+&[^{]+{/,
      /&:matches\([^)]+\)/, // PostCSS-only :matches() syntax
    ],
  },
  {
    name: 'colorFeatures' as const,
    score: 0.3,
    stylesheets: [
      // PostCSS-specific color modifications
      /color\([^)]+(?:tint|shade|modify|adjust)\s+[\d.]+%?\)/,
      /color-mod\([^)]+\)/, // PostCSS-specific color-mod function
      /lab\([^)]+\/\s*[\d.]+%?\)/, // PostCSS lab() with alpha syntax
    ],
  },
  {
    name: 'customAtRules' as const,
    score: 0.3,
    stylesheets: [
      // PostCSS-specific at-rules
      /@custom-media[^{]+{/,
      /@custom-selector[^{]+{/,
      /@custom-property[^{]+{/,
    ],
  },
  {
    name: 'isNextJs' as const,
    score: 1,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'next';
    },
  },
  {
    name: 'isTailwind' as const,
    score: 0.3,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.stylingLibraries.items.tailwindCSS.confidence > 0.5;
    },
  },
];
