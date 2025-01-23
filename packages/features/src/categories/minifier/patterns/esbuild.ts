import { AnalysisFeatures } from '../../../types/analysis.js';

export const esbuild = [
  {
    name: 'compilation' as const,
    score: 0.5,
    scripts: [
      // esbuild minification specific patterns
      // Looks for combinations of patterns that only occur in minified output

      // esbuild minified class pattern
      // Example: class A{constructor(){this.x=1}}
      /class [A-Z]\{constructor\(\)\{this\.[a-z]=\d+\}\}/,

      // esbuild minified async function pattern
      // Example: async function f(a,b){await(a+b)}
      /async function [$_a-z]\([^)]{0,10}\)\{await\([^)]+\)\}/,

      // esbuild's specific object property minification
      // Example: {a(){},b(){}}
      /\{[$_a-z]\(\)\{\}(?:,[$_a-z]\(\)\{\}){1,}\}/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.esbuild\.min\.js$/],
  },
  {
    name: 'isEsbuild' as const,
    score: 0.4,
    dependencies: (analysis: AnalysisFeatures) => {
      // There's option to set terser as minifier for esbuild or vite.
      return (
        analysis.bundler.name === 'esbuild' || analysis.bundler.name === 'vite'
      );
    },
  },
];
