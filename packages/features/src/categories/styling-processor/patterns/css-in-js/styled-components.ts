export const styledComponents = [
  {
    name: 'uniqueMarkers' as const,
    score: 0.3,
    scripts: [
      // Styled-components unique runtime markers (survives minification)
      /\[\$\$typeof\]=Symbol\.for\(["']sc_element["']\)/,
      /\.__sc-[\da-zA-Z]{8}-[\da-zA-Z]{4}={/,
      /\.styledComponentId=["']sc-[\da-zA-Z]{8}-[\da-zA-Z]{4}["']/,
    ],
  },
  {
    name: 'runtimeFeatures' as const,
    score: 0.3,
    scripts: [
      // Styled-components specific internal APIs
      /\.withConfig\(\{"componentId":["']sc-[\da-zA-Z]{8}-[\da-zA-Z]{4}["']\}\)/,
      /\.attrs\(\{["']data-sc-[\da-zA-Z]{8}["']:/,
      /sc_createGlobalStyle\(/,
    ],
  },
  {
    name: 'cssGeneration' as const,
    score: 0.3,
    stylesheets: [
      // Styled-components specific class patterns
      /\.sc-[\da-zA-Z]{8}-[\da-zA-Z]{4}\[data-sc-[\da-zA-Z]{8}\]/,

      // Styled-components keyframes pattern
      /@keyframes\s+sc-keyframes-[\da-zA-Z]{8}/,

      // Styled-components global styles marker
      /sc-global-[\da-zA-Z]{8}/,
    ],
  },
  {
    name: 'cssProperties' as const,
    score: 0.3,
    stylesheets: [
      // Styled-components unique prop interpolation
      /\[data-sc-[\da-zA-Z]{8}\]{/,

      // Styled-components themed props pattern
      /--sc-[\da-zA-Z]{8}-[\da-zA-Z]{4}/,

      // Styled-components dynamic interpolation
      /content:var\(--sc-[\da-zA-Z]{8}-[\da-zA-Z]{4}\)/,
    ],
  },
];
