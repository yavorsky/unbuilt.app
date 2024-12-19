export const esbuild = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // esbuild's unique module conversion helpers
      /var\s*__toESM\s*=\s*\((?:mod|module)\)\s*=>\s*\{\s*return\s*mod\s*&&\s*mod\.__esModule\s*\?\s*mod\s*:\s*\{\s*default:\s*mod\s*\}\s*\};?/,

      // esbuild's specific CommonJS implementation
      /var\s*__commonJS\s*=\s*\(cb,\s*mod\)\s*=>\s*\(\)\s*=>\s*\(mod\s*\|\|\s*cb\(\(\)\s*=>\s*mod\)\)\s*;?/,

      // esbuild-specific banner comment format
      /\/\*\s*esbuild-plugin(?::|-)[\w\-]+\s*\*\//,

      // esbuild's unique module namespace creation
      /var\s*__create_require\s*=\s*\(\)\s*=>\s*\{\s*var\s*e\s*=\s*\{\};\s*return\s*\(\w+\)\s*=>\s*\(e\[\w+\]\s*\|\|\s*\{\}\);\s*\};?/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 1.0,
    runtime: [
      // esbuild's specific CommonJS to ESM conversion
      /var\s*__toCommonJS\s*=\s*\(mod\)\s*=>\s*\{\s*return\s*\{\s*__proto__:\s*null,\s*\[\w+\]:\s*true,\s*default:\s*mod\s*\}\s*\};?/,

      // esbuild's unique export handling
      /var\s*__export\s*=\s*\(target,\s*all\)\s*=>\s*\{\s*for\s*\(var\s*name\s*in\s*all\)\s*__defProp\(target,\s*name,\s*\{\s*get:\s*\(\)\s*=>\s*all\[name\],\s*enumerable:\s*true\s*\}\)\s*\};?/,

      // esbuild's specific re-export implementation
      /var\s*__reExport\s*=\s*\(target,\s*mod,\s*secondary\)\s*=>\s*\{\s*for\s*\(var\s*key\s*in\s*mod\)\s*if\s*\(!secondary\s*&&\s*target\s*&&\s*target\.hasOwnProperty\(key\)\)/,
    ],
  },
  {
    name: 'jsxFeatures' as const,
    score: 1.0,
    runtime: [
      // esbuild's unique JSX fragment handling
      /\/\*\s*@jsxRuntime\s+automatic\s*\*\/\s*\/\*\s*@jsxImportSource\s+react\s*\*\//,

      // esbuild's specific JSX factory implementation
      /var\s*__jsx\s*=\s*\(\s*type,\s*props,\s*key,\s*source\)\s*=>\s*\{\s*return\s*\{\s*type,\s*props,\s*key,\s*__source:\s*source\s*\}\s*\};?/,

      // esbuild's JSX dev tools integration
      /\/\*\s*@jsxDevRuntime\s+development\s*\*\//,
    ],
  },
];
