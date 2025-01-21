export const stitches = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    scripts: [
      // Stitches global object pattern
      /__stitches=\{prefix:"[\w-]+",insertionMethod:[\d]+/,

      // Stitches runtime config pattern
      /insertionMethod:[\d]+,[\w]+:"[\w-]+-(?:keyframes|global|themed)"/,

      // Stitches unique theme creation
      /createTheme\(["'](?:light|dark|[\w-]+)_theme["']\)/,

      // Stitches unique configuration object
      /\{media:\{[^}]+\},theme:\{[^}]+\},utils:\{[^}]+\},prefix:["'][\w-]+["']\}/,
    ],
  },
  {
    name: 'componentPatterns' as const,
    score: 0.3,
    scripts: [
      // Stitches unique component creation with configuration
      /styled\([^)]+,\{variants:\{[\w-]+:\{[\w-]+:\{transform:/,

      // Stitches compound variants pattern
      /compoundVariants:\[\{variants:\{[\w-]+:["'][\w-]+["']\}/,

      // Stitches specific prop type definitions
      /type\s+\w+Props=ComponentProps<typeof\s+\w+>&\{variants:\{/,
    ],
  },
  {
    name: 'uniqueMarkers' as const,
    score: 0.3,
    stylesheets: [
      // Stitches CSS Classes Pattern
      /\.sxtchs[\w-]*[\da-f]{4,8}/,

      // Stitches keyframes pattern
      /@keyframes\s+sxtchs-[\da-f]{4,8}-anim/,

      // Stitches variant class pattern
      /\.sxtchs[\w-]*[\da-f]{4,8}-variant/,
    ],
  },
  {
    name: 'cssProperties' as const,
    score: 0.3,
    stylesheets: [
      // Stitches unique CSS variable pattern
      /--sxtchs-[\da-f]{4,8}-[\w-]+/,

      // Stitches theme variables pattern
      /var\(--sxtchs-[\da-f]{4,8}-themed-[\w-]+\)/,

      // Stitches computed styles pattern
      /calc\(var\(--sxtchs-[\da-f]{4,8}-[\w-]+\)[^)]*\)/,
    ],
  },
];
