// First import webpack patterns as a base
import { webpack } from './webpack.js';

// Define Turbopack-specific patterns that are resilient to minification
export const turbopack = [
  ...webpack,
  {
    name: 'turbopack-core' as const,
    score: 1.0,
    scripts: [
      // Core structural patterns that survive minification
      /TURBOPACK/, // Constants usually preserved
      /\[\[SSR\]\]/, // Special syntax usually preserved
      // Match both full and potentially minified require patterns
      /(__turbopack_require__)[\s\n]*=/,
      /(__turbopack_external_require__)[\s\n]*=/,
      // Cache patterns with optional minification
      /(__turbopack_cache__)[\s\n]*=/,
    ],
  },
  {
    name: 'turbopack-modules' as const,
    score: 0.9,
    scripts: [
      // Module system patterns with minification variants
      /(__turbopack_export__)[\s\n]*=/,
      /(__turbopack_import__)[\s\n]*=/,
      /(turbopack_modules|_tm)[\s\n]*=/,
    ],
  },
  {
    name: 'turbopack-runtime' as const,
    score: 0.7,
    scripts: [
      // Runtime patterns focusing on structural elements
      /(turbopack\/runtime)/,
      /chunk_global_id/,
    ],
  },
  {
    name: 'turbopack-output' as const,
    score: 0.3,
    filenames: [
      // File patterns are usually not affected by minification
      /\[\d+\]\.entry\.[a-f0-9]{16}\.js$/,
      /chunks\/\[\d+\]\.[a-f0-9]{16}\.js$/,
      /chunks\/[a-zA-Z0-9_-]+\.[a-f0-9]{16}\.js$/,
      /static\/chunks\/[^/]+\.js$/,
      /static\/chunks\/app\/[^/]+\.js$/,
      /app-pages-browser\.js$/,
    ],
  },
];
