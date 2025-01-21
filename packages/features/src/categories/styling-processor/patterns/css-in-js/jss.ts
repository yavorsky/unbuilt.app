export const jss = [
  {
    name: 'uniqueMarkers' as const,
    score: 0.3,
    scripts: [
      // JSS unique sheet registration
      /jss-[\da-f]{4,8}-[\da-f]{4}/,

      // JSS's specific rule creation
      /createRule\(["']@(?:media|keyframes)["'],\{/,

      // JSS's unique class generation format
      /\.[\w-]+-[\da-f]{4,8}-[\da-f]{4}\s*{/,
    ],
  },
  {
    name: 'sheetPatterns' as const,
    score: 0.3,
    scripts: [
      // JSS's sheet management (survives minification)
      /\{registry:\[\],plugins:\[\],index:0,sheet:[\w$]+,rules:\{/,

      // JSS's unique sheet options
      /\{generateId:[\w$]+,jss:[\w$]+,Renderer:[\w$]+,insertionPoint:/,

      // JSS's specific plugin application
      /\.use\(\{onCreateRule:[\w$]+,onProcessRule:[\w$]+\}\)/,
    ],
  },
  {
    name: 'cssGeneration' as const,
    score: 0.3,
    stylesheets: [
      // JSS's unique selector format
      /\.jss[\da-f]{4,8}-[\da-f]{4}/,

      // JSS's dynamic property pattern
      /--jss-[\da-f]{4,8}-[\da-f]{4}:/,

      // JSS's keyframes naming
      /@keyframes jss-keyframe-[\da-f]{4,8}/,
    ],
  },
  {
    name: 'pluginSystem' as const,
    score: 0.3,
    scripts: [
      // JSS's plugin system markers
      /jss-plugin-[\w-]+/,

      // JSS's rule processing
      /onProcessStyle:\s*function\([\w$]+,[\w$]+,[\w$]+\)\{/,

      // JSS's specific rule creation
      /onCreateRule:\s*function\([\w$]+,[\w$]+,[\w$]+\)\{/,
    ],
  },
];
