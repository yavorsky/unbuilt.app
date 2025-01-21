import { AnalysisFeatures } from '../../../../types/analysis.js';

export const emotion = [
  {
    name: 'uniqueMarkers' as const,
    score: 0.3,
    scripts: [
      // Emotion's unique cache setup (survives minification)
      /\{"key":"[\w-]+","nonce":"[\w-]*","insertionPoint":[\w\s\."]+\}/,

      // Emotion's specific component wrapping
      /\.withComponent=function\([\w$]+\)\{return[\w$]+\([\w$]+,\{target:[\w$]+\.target\}\)\}/,

      // Emotion's unique symbol registration
      /Symbol\.for\(["']emotion-[\w-]+["']\)/,
    ],
  },
  {
    name: 'componentPatterns' as const,
    score: 0.3,
    scripts: [
      // Emotion's specific component creation (with minification)
      /\.withComponent\(["'][\w-]+["']\)\.withConfig\(\{["']label["']:/,

      // Emotion's unique prop handling
      /\.defaultProps=\{className:["']css-[\w-]+["']\}/,

      // Emotion's specific theme consumer
      /ThemeContext\._currentValue2?\.[\w$]+/,
    ],
  },
  {
    name: 'cssGeneration' as const,
    score: 0.3,
    stylesheets: [
      // Emotion's specific class patterns
      /\.css-[\w-]+-EmotionCSS-[\w-]+\[data-emotion-[\w-]+\]/,

      // Emotion's keyframes pattern
      /@keyframes\s+emotion-[\w-]+-[\w-]+/,

      // Emotion's global styles marker
      /\[data-emotion-global-[\w-]+\]/,
    ],
  },
  {
    name: 'dependencies' as const,
    score: 0.5,
    // Higher confidence when MUI is present as it uses Emotion by default
    dependencies: (analysis: AnalysisFeatures) => {
      // TODO: Imrpove this check to be more accurate based on MUI version (5+). Add 4 to jss.
      return (
        analysis.stylingLibraries.items.mui.confidence > 0.5 ||
        analysis.stylingLibraries.items.chakra.confidence > 0.5
      );
    },
  },
  {
    name: 'packageMarkers' as const,
    score: 0.3,
    scripts: [
      // Emotion's package-specific markers
      /\[@emotion\/styled\]/,
      /\[@emotion\/react\]/,
      /\[@emotion\/css\]/,

      // Emotion's unique import pattern
      /import\s*\{\s*css\s*\}\s*from\s*["']@emotion\/react["']/,
    ],
  },
];
