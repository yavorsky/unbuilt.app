import { Page } from 'playwright';

export const emotion = [
  {
    name: 'compilation' as const,
    score: 1,
    scripts: [
      // Emotion's unique style tag data attribute
      /<style\s+data-emotion="[^"]*"/,

      // Emotion's specific class naming pattern with hash
      /css-[a-zA-Z0-9]+-[a-zA-Z0-9]{8}/,

      // Emotion's unique style composition
      /styles\.concat\(emotion\.css\([^)]+\)\)/,

      // Emotion's specific keyframes naming
      /keyframes-[a-zA-Z0-9]+-[a-zA-Z0-9]{8}/,

      // Emotion's unique style object serialization
      /emotion\.serializeStyles\(\[/,

      // Emotion's specific cache usage
      /cache\.registered\[/,

      // Emotion's unique styled component pattern
      /emotion\.styled\([^)]+\)\([^)]+\)/,

      // Emotion's unique css prop handling
      /css:\s*emotion\.css\(`[^`]+`\)/,
    ],
  },
  {
    name: 'runtime' as const,
    score: 1,
    scripts: [
      // Emotion's specific theme context usage
      /ThemeContext\._currentValue/,

      // Emotion's unique style insertion
      /insertStyles\(cache,\s*serialized,\s*isStringTag\)/,

      // Emotion's specific label pattern
      /label:\s*"[^"]+",\s*target:\s*"[^"]+"/,

      // Emotion's unique memoization pattern
      /__emotion_memoize__/,

      // Emotion's specific style registration
      /registerStyles\(cache,\s*serialized,\s*isStringTag\)/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1.4,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const evidence = {
          // Check for Emotion's specific style tags
          hasEmotionStyles: !!document.querySelector('style[data-emotion]'),

          // Check for Emotion's unique class pattern
          hasEmotionClasses: Array.from(
            document.querySelectorAll('[class]')
          ).some((el) =>
            el.className?.match?.(/css-[a-zA-Z0-9]+-[a-zA-Z0-9]{8}/)
          ),

          // Check for Emotion's keyframes
          hasEmotionKeyframes: Array.from(document.styleSheets).some(
            (sheet) => {
              try {
                return Array.from(sheet.cssRules).some((rule) => {
                  if (rule instanceof CSSKeyframesRule) {
                    return rule.name.startsWith('keyframes-');
                  }
                  return false;
                });
              } catch {
                return false;
              }
            }
          ),

          // Check for Emotion's cache in window
          hasEmotionCache: !!(
            window.__emotion_cache__ ||
            Object.keys(window).some(
              (key) => key.includes('__emotion_') || key.includes('__EMOTION_')
            )
          ),

          // Check for Emotion's specific data attributes
          hasEmotionAttributes: !!document.querySelector('[data-emotion-css]'),
        };

        return Object.values(evidence).some(Boolean);
      });
    },
  },
];
