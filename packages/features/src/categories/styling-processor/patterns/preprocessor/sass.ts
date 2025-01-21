export const sass = [
  {
    name: 'sassCompilation' as const,
    score: 0.3,
    stylesheets: [
      // Sass-specific module export pattern
      /\[data-v-s-[\da-f]{8,}\]/, // Sass module hash format

      // Sass-specific namespacing in compiled output
      /\._[\da-f]{6,}(?:[\w-]+)?__[\da-f]{6,}/,

      // Sass-specific dynamic selector compilation
      /\[data-v-[\da-f]{8,}\]/,
    ],
  },
  {
    name: 'sassInterpolationMarkers' as const,
    score: 0.3,
    stylesheets: [
      // Sass-specific interpolation compilation
      /\$--[\da-f]{6,}-interpolation/,
      /--sass-interpolate-[\da-f]{6,}/,

      // Sass module reference pattern
      /\.sass-module-[\da-f]{8,}/,
    ],
  },
  {
    name: 'sassColorFunctions' as const,
    score: 0.3,
    stylesheets: [
      // Sass-specific color function compilation
      /\$--color-[\da-f]{6,}-adjust/,
      /--sass-color-[\da-f]{6,}/,

      // Sass color function result pattern
      /color:rgba\(var\(--sass-rgba-[\da-f]{6,}\)\)/,
    ],
  },
];
