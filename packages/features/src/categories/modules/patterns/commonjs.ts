export const commonjs = [
  {
    name: 'staticRequires' as const,
    score: 0.3,
    runtime: [
      // Standard require calls
      /require\s*\(\s*["'][^"']+["']\s*\)/, // require("module")
      /require\s*\(\s*`[^`]+`\s*\)/, // require(`module`)
      /(?:const|let|var)\s*\{[^}]+\}\s*=\s*require\s*\([^)]+\)/, // const { something } = require()
      /(?:const|let|var)\s+\w+\s*=\s*require\s*\([^)]+\)/, // const something = require()

      // Minified variants
      /=require\(["'][^"']+["']\)/,
      /=require\([^)]+\)/,
      /require\(["'][^"']+["']\)/,
    ],
  },
  {
    name: 'dynamicRequires' as const,
    score: 0.3,
    runtime: [
      // Dynamic require patterns
      /require\s*\(\s*\w+\s*\)/, // require(variable)
      /require\s*\(\s*\w+\s*\+\s*["'][^"']*["']\)/, // require(variable + "string")
      /require\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`\s*\)/, // require(`template${string}`)

      // require.resolve patterns
      /require\.resolve\s*\(/, // require.resolve()
      /require\.cache\b/, // require.cache
      /require\.main\b/, // require.main
    ],
  },
  {
    name: 'exports' as const,
    score: 0.3,
    runtime: [
      // module.exports assignments
      /module\.exports\s*=\s*[^;]+/, // module.exports = something
      /module\s*\[\s*["']exports["']\s*\]\s*=/, // module['exports'] =
      /module\.exports\s*=\s*\{/, // module.exports = {

      // exports property assignments
      /exports\.\w+\s*=/, // exports.something =
      /exports\[["']\w+["']\]\s*=/, // exports['something'] =

      // Object.defineProperty exports
      /Object\.defineProperty\s*\(\s*exports\s*,\s*["']\w+["']\s*,/,
      /Object\.defineProperties\s*\(\s*exports\s*,/,

      // Common patterns
      /exports\s*=\s*module\.exports\s*=/, // exports = module.exports =
      /module\.exports\s*=\s*exports\s*=/, // module.exports = exports =

      // Minified variants
      /exports\.\w+=/,
      /exports=module\.exports=/,
      /module\.exports=\{/,

      // Default assignment patterns
      /exports\s*\[\s*["']default["']\s*\]\s*=/, // exports['default'] =
      /module\.exports\s*\[\s*["']default["']\s*\]\s*=/, // module.exports['default'] =
    ],
  },
];
