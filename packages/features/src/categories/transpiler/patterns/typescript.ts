export const typescript = [
  {
    name: 'core',
    score: 1,
    scripts: [
      // TSC-only class transformation with preserve flag
      /var\s+\w+\s*=\s*\/\*\*\s*@preserve\s*@class\s*\*\/\s*function/,

      // TypeScript's unique namespace IIFE pattern
      /var\s+(\w+);\s*\(\s*function\s*\(\1\)\s*\{[^}]*\}\s*\)\s*\(\1\s*\|\|\s*\(\1\s*=\s*\{\}\)\s*\);/,

      // TypeScript-only enum with reverse mapping (highly specific to TSC)
      /\}\)\(\w+\s*\|\|\s*\(\w+\s*=\s*\{\}\)\);\s*var\s+\w+;\s*\(\s*function\s*\(\w+\)\s*\{\s*\w+\[\w+\[\"\w+\"\]\s*=\s*\d+\]\s*=\s*\"\w+\";/,

      // TSC-specific static property initialization
      /Object\.defineProperty\(\w+,\s*\"\w+\",\s*\{\s*enumerable:\s*true,\s*configurable:\s*true,\s*writable:\s*true,\s*value:\s*\{\s*[^}]+\}\s*\}\);(?:\s*\/\*\*\s*@class\s*\*\/)?/,

      // TypeScript-only assignment pattern for namespaces
      /var\s+\w+\s*=\s*\{\};?\s*\(\s*function\s*\(\w+\)\s*\{[^}]*\}\s*\)\s*\(\w+\s*\|\|\s*\(\w+\s*=\s*\{\}\)\);/,

      // TypeScript-specific module augmentation pattern
      /\(\s*function\s*\(factory\)\s*\{\s*if\s*\(typeof\s*module\s*===\s*"object"\s*&&\s*typeof\s*module\.exports\s*===\s*"object"\)\s*{\s*var\s*v\s*=\s*factory\([^)]*\);\s*if\s*\(v\s*!==\s*undefined\)\s*module\.exports\s*=\s*v;\s*}\s*else\s*if\s*\(typeof\s*define\s*===\s*"function"\s*&&\s*define\.amd\)\s*{\s*define\([^)]*\);\s*}\s*}\)\s*\(/,
    ],
  },
  {
    name: 'decoratorsAndMetadata',
    score: 1,
    scripts: [
      // TypeScript-specific parameter decorator pattern (unique to tsc)
      /Reflect\.getMetadata\(\"design:paramtypes\"/,

      // TypeScript-only property decorator pattern
      /Reflect\.getMetadata\(\"design:type\"/,

      // TypeScript's unique metadata format
      /\[\s*__metadata\(\s*\"design:type\",\s*[^)]+\),\s*__metadata\(\s*\"design:paramtypes\",\s*\[[^\]]+\]\)\s*\]/,
    ],
  },
  {
    name: 'moduleSystem',
    score: 1,
    scripts: [
      // TypeScript's unique module interop pattern
      /if\s*\(typeof\s*module\s*===\s*\"object\"\s*&&\s*typeof\s*module.exports\s*===\s*\"object\"\)\s*{\s*var\s*v\s*=\s*factory\([^)]*typeof\s*require\s*===\s*\"function\"\s*\?\s*require\s*:\s*[^)]*\);\s*if\s*\(v\s*!==\s*undefined\)\s*module\.exports\s*=\s*v;\s*}/,

      // TypeScript-specific dynamic import handling
      /Promise\.resolve\(\)\.then\(\(\)\s*=>\s*__importStar\(require\([^)]+\)\)\)/,

      // TypeScript's namespace export pattern
      /exports\.\w+\s*=\s*void\s*0;\s*var\s+\w+\s*=\s*require\([^)]+\);\s*exports\.\w+\s*=\s*\w+\.default/,
    ],
  },
];
