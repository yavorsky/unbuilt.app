export const esbuild = [
  {
    name: 'moduleSystem' as const,
    score: 0.3,
    scripts: [
      // esbuild's specific import handling
      /module\.exports\s*=\s*__toCommonJS\(\w+_exports\)/,
      /__toESM\(require\([^)]+\),\s*1\)/,

      // esbuild's unique module marker
      /\/\*\s*esbuild-[a-z]+\s*\*\//,

      // esbuild's specific CJS wrapper
      /__commonJS\(\{\s*['"]\w+['"]:\s*\(module(?:,\s*exports)?\)\s*=>/,
    ],
  },
  {
    name: 'optimization' as const,
    score: 0.3,
    scripts: [
      // esbuild's unique chunk loading
      /esbuild_shims\s*=\s*\{[^}]+\}/,

      // esbuild's sourcemap handling
      /\/\/# sourceMappingURL=data:application\/json;base64,\w+;charset=utf-8;base64,/,

      // esbuild's unique banner/footer comments
      /\/\*\s*esbuild-banner\([^)]+\)\s*\*\//,
    ],
  },
  {
    name: 'cssHandling' as const,
    score: 0.2,
    scripts: [
      // esbuild's unique CSS handling
      /__esbuild_style_inject\(/,
      /__esbuild_css_inject\(/,
      /\.default\s*=\s*inject_style_tag\(/,
    ],
  },
];
