import { AnalysisFeatures } from '../../../types/analysis.js';

export const svelteRouter = [
  {
    name: 'routeInitializer' as const,
    score: 0.9,
    scripts: [
      /[a-zA-Z0-9_$]+\s*=\s*["']sveltekit:navigation["']/,

      /a\s+load\s+function\s+related\s+to\s+route\s+['"`]\$\{[\w.]+\}['"`]\s+returned/,

      /history\.(?:pushState|replaceState).*?conflict with SvelteKit['"]s router/,

      /__SVELTEKIT_CLIENT_ROUTING__/,

      /throw\s+new\s+Error\([^)]*Page\s+options\s+are\s+ignored\s+when[^)]*router\.type\s+===\s+['"]hash['"][^)]*\)/,
    ],
  },
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Navigation cancelled error
      /\.reject\(new Error\("navigation cancelled"\)\)/,

      // Navigation aborted error
      /\.reject\(new Error\("navigation aborted"\)\)/,

      // SvelteKit Router specific imports (minification resistant)
      /["']@sveltejs\/kit(?:\/navigation|\/routing|\/runtime\/client)["']/,
      /["']sveltejs\/kit(?:\/package\.json|\/client\.js)["']/,

      // SvelteKit's internal markers (survive minification)
      /\[Symbol\.for\(["']sveltekit-routing["']\)\]/,
    ],
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // SvelteKit specific data loading (minification resistant)
      /load\s*\(\s*\{\s*(?:params|url|route|depends)\s*\}/,
      /handle\s*\(\s*\{\s*event\s*,\s*resolve\s*\}\s*\)/,
      /handleError\s*\(\s*\{\s*error\s*,\s*event\s*\}\s*\)/,
      /setupLoadContext\(/,

      // SvelteKit internal routing patterns
      /goto\(\s*(?:url|delta):/,
      /pushState\(\s*\{\s*[^}]*sveltekit:/,
      /invalidateAll\(\s*\{\s*soft:\s*true\s*\}\)/,
      /preloadData\(\s*\{\s*type:\s*["']link["']/,

      // SvelteKit-specific error handling
      /handleMissingId\(/,
      /handleDataError\(/,
      /redirect\((?:\d{3}|\w+\.status)\s*,\s*(?:url|location):/,
    ],
  },
  {
    name: 'withSvelte' as const,
    score: 0.7,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'sveltekit';
    },
  },
];
