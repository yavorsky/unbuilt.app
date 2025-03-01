import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const emotion = [
  {
    name: 'core' as const,
    score: 1,
    scripts: [
      // Emotion's unique cache setup (survives minification)
      /\.getAttribute\(["']data-emotion["']\)/,

      // Emotion's unique cache setup (survives minification)
      /\w+\.setAttribute\(["']data-emotion["']\s*,\s*\w+(?:\.\w+)?(?:\s*\+\s*[^\)]+)?\)/,

      // Emotion's unique cache setup (survives minification)
      /\.querySelectorAll\(["']style\[data-emotion\]:not\(\[data-s\]\)["']\)/,

      // Emotion's unique cache setup (survives minification)
      /\{"key":"[\w-]+","nonce":"[\w-]*","insertionPoint":[\w\s\."]+\}/,

      // Emotion's styles prop
      /\w+\.__emotion_styles\b/,

      // Emotion's styles prop
      /\w+\.__emotion_real\b/,

      // Emotion's specific prop forwarding
      /\w+\.__emotion_forwardProp\b/,

      // Emotion's specific component wrapping
      /\.withComponent=function\([\w$]+\)\{return[\w$]+\([\w$]+,\{target:[\w$]+\.target\}\)\}/,

      // Emotion's unique symbol registration
      /Symbol\.for\(["']emotion-[\w-]+["']\)/,
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
    score: 0.4,
    // Higher confidence when MUI is present as it uses Emotion by default
    dependencies: (analysis: AnalysisFeatures) => {
      // TODO: Imrpove this check to be more accurate based on MUI version (5+). Add 4 to jss.
      return (
        analysis.stylingLibraries.items.mui?.confidence > 0.5 ||
        analysis.stylingLibraries.items.chakra?.confidence > 0.5
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
  {
    name: 'runtime' as const,
    score: 1,
    browser: (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          emotion: document.querySelector('style[data-emotion]'),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
];
