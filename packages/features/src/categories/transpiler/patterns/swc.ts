import { Page } from 'playwright';

export const swc = [
  {
    name: 'swcRuntime' as const,
    score: 0.3,
    scripts: [
      // SWC's unique runtime initialization blocks
      /"use strict";(?:\s*var\s+__create\s*=\s*Object\.create;\s*var\s+__defProp\s*=\s*Object\.defineProperty;\s*var\s+__getOwnPropDesc\s*=\s*Object\.getOwnPropertyDescriptor;)/,

      // SWC's unique module init pattern
      /var\s+__defNormalProp\s*=\s*\(\w+,\s*\w+,\s*\w+\)\s*=>\s*\w+\s+in\s+\w+\s*\?\s*__defProp/,

      // SWC's private field declaration pattern (unique to SWC)
      /var\s+_\w+\s*=\s*\/\*#__PURE__\*\/\s*new\s+WeakMap\(\);/,
    ],
  },
  {
    name: 'swcDecorators' as const,
    score: 0.3,
    scripts: [
      // SWC's unique decorator implementation
      /var\s+__decorateClass\s*=\s*\(\[\s*decorators,\s*target,\s*key,\s*kind\s*\]\)\s*=>/,

      // SWC's metadata helper (different from other transpilers)
      /var\s+__metadata\s*=\s*\(\[\s*metadataKey,\s*metadataValue\s*\]\)\s*=>/,

      // SWC's unique decorator application
      /return\s*\(\w+\s*=\s*class\s+extends\s*\w+\s*\{\}\s*,\s*__decorateClass\(\[\w+\],\s*\w+\.prototype,\s*["']\w+["']/,
    ],
  },
  {
    name: 'swcTransforms' as const,
    score: 0.3,
    scripts: [
      // SWC's unique async/await transform
      /var\s+__async\s*=\s*\(__this,\s*__arguments,\s*generator\)\s*=>\s*\{/,

      // SWC's unique class field transform
      /(?:var|let)\s+(_\w+)\s*=\s*class\s+extends\s+\w+\s*\{\s*constructor\(\)\s*\{\s*super\(\);\s*_\w+\.set\(this,\s*void\s*0\)/,

      // SWC's enum implementation (unique pattern)
      /\(\s*function\s*\(\w+\)\s*\{\s*\w+\[\w+\["[^"]+"\]\s*=\s*\d+\]\s*=\s*"[^"]+";\s*\}\)\(\w+\s*\|\|\s*\(\w+\s*=\s*\{\}\)\);/,
    ],
  },
  {
    name: 'swcInterop' as const,
    score: 0.3,
    scripts: [
      // SWC's unique module interop patterns
      /var\s+__toESM\s*=\s*\(\w+,\s*\w+\)\s*=>\s*\{\s*return\s+__reExport\(/,

      // SWC's import handling
      /var\s+__reExport\s*=\s*\(\w+,\s*\w+,\s*\w+\)\s*=>\s*Object\.keys\(\w+\)/,

      // SWC's export handling
      /Object\.defineProperty\(\w+,\s*"__esModule",\s*\{\s*value:\s*true\s*\}\);\s*__reExport\(exports,/,
    ],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.6,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Detect Next.js version where SWC is enabled by default (Next.js 12 and above)
        const nextVersion = window.next?.version;
        const isNextWithSWC = nextVersion
          ? parseInt(nextVersion.split('.')[0], 10) >= 12
          : false;

        return isNextWithSWC;
      });
    },
  },
];
