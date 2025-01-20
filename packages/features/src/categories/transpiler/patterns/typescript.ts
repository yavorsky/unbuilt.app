export const typescript = [
  {
    name: 'decorators' as const,
    score: 0.3,
    scripts: [
      // TSC's specific decorator implementation
      /var\s+__decorate\s*=\s*\(this\s*&&\s*this\.__decorate\)\s*\|\|\s*function\s*\(decorators,\s*target[^)]*\)\s*\{/,
      /var\s+__metadata\s*=\s*\(this\s*&&\s*this\.__metadata\)\s*\|\|\s*function\s*\(k,\s*v\)\s*\{/,
      /var\s+__param\s*=\s*\(this\s*&&\s*this\.__param\)\s*\|\|\s*function\s*\(paramIndex,\s*decorator\)\s*\{/,

      // Property decorators (tsc specific)
      /__decorate\(\[\s*\w+(?:\([^)]*\))?\s*\],\s*\w+\.prototype,\s*["'][^"']+["']/,

      // Parameter decorators
      /__param\(\d+,\s*\w+(?:\([^)]*\))?\)/,
    ],
  },
  {
    name: 'metadataHelpers' as const,
    score: 0.3,
    scripts: [
      // TSC's specific metadata helpers
      /var\s+__awaiter\s*=\s*\(this\s*&&\s*this\.__awaiter\)\s*\|\|\s*function/,
      /var\s+__generator\s*=\s*\(this\s*&&\s*this\.__generator\)\s*\|\|\s*function/,
      /var\s+__spreadArray\s*=\s*\(this\s*&&\s*this\.__spreadArray\)\s*\|\|\s*function/,
      /var\s+__extends\s*=\s*\(this\s*&&\s*this\.__extends\)\s*\|\|\s*function/,

      // Specific helper assignments
      /var\s+__assign\s*=\s*\(this\s*&&\s*this\.__assign\)\s*\|\|\s*function\s*\(\)\s*\{\s*__assign\s*=\s*Object\.assign/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 0.25,
    scripts: [
      // TSC's module implementation
      /Object\.defineProperty\(exports,\s*["']__esModule["'],\s*\{\s*value:\s*true\s*\}\)/,

      // TSC's specific import helpers
      /var\s+__importDefault\s*=\s*\(this\s*&&\s*this\.__importDefault\)\s*\|\|\s*function\s*\(mod\)\s*\{/,
      /var\s+__importStar\s*=\s*\(this\s*&&\s*this\.__importStar\)\s*\|\|\s*function\s*\(mod\)\s*\{/,

      // Export assignments (tsc specific)
      /exports\.\w+\s*=\s*void\s*0;/,
      /exports\.\w+\s*=\s*\{\s*__proto__:\s*null\s*\};/,
    ],
  },
  {
    name: 'classFeatures' as const,
    score: 0.25,
    scripts: [
      // TSC's class feature implementation
      /var\s+\w+\s*=\s*\/\*\*\s*\*\s*@class\s*\*\/\s*\(function\s*\(\)\s*\{/,

      // TSC's private field implementation
      /var\s+_\w+\s*=\s*new\s+WeakMap\(\);/,

      // TSC's get/set accessors
      /Object\.defineProperty\(\w+\.prototype,\s*["'][^"']+["'],\s*\{\s*(?:get|set):\s*function\s*\(\)\s*\{/,

      // Abstract class check
      /if\s*\(this\s+instanceof\s+\w+\)\s*{\s*throw\s+new\s+TypeError\("Abstract\s+class/,
    ],
  },
  {
    name: 'enumCompilation' as const,
    score: 0.2,
    scripts: [
      // TSC's enum implementation (unique pattern)
      /var\s+\w+\s*;\s*\(\s*function\s*\(\w+\)\s*\{\s*\w+\[\w+\["\w+"\]\s*=\s*\d+\]\s*=\s*"\w+"/,

      // Const enum inlining
      /\b\d+\s*\/\*\s*\w+\.\w+\s*\*\//,

      // String enum implementation
      /\w+\[\w+\["\w+"\]\s*=\s*"\w+"\]\s*=\s*"\w+"/,

      // Computed enum members
      /\w+\[\w+\[\w+\s*=\s*\w+\.\w+\]\s*=\s*\w+\]/,
    ],
  },
];
