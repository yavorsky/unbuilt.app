import { Page } from 'playwright';
import { AnalysisFeatures } from '../../../types/analysis.js';

export const nextRouter = [
  {
    name: 'core' as const,
    score: 0.3,
    scripts: [
      /["'](?:next\/(?:navigation|router|link|dist\/client\/router)|n\/r)["']/,
      /__NEXT_(?:DATA|P|C|HAS_REWRITE|ROUTER|HISTORY|OPTIMISTIC)__/,
    ],
  },
  {
    name: 'runtime' as const,
    score: 0.3,
    scripts: [
      // Next.js Router internal markers (survive minification)
      /\$(?:Next|nr|N_)/,
      /window\.__N(?:_DATA|EXT|_P)/,

      // Next.js specific hooks (minified variants)
      /use(?:[RPSNLHCh]|Router|Pathname|Params|Navigation)\s*\(\s*\)/,
      /\[\w+\]=(?:useRouter|usePathname|useSearchParams|useParams)/,

      // Next.js specific navigation internals (minification resistant)
      /\[Symbol\.for\(\s*["']__next_(?:rsc|css|fcp|app|cross|hydrate)["']\s*\)\]/,
      /\[Symbol\.for\(\s*["']next\.(?:page|route|internal)["']\s*\)\]/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          // Check for Next.js globals (minification resistant)
          hasNextMarkers: Object.keys(window).some(
            (key) =>
              key.includes('__NEXT_') ||
              key.includes('__N_') ||
              key === '$N' ||
              key.match(/^\$n[r_]/)
          ),

          // Check for Next.js specific instance properties
          hasNextInstance: Object.values(window).some(
            (obj) =>
              obj &&
              typeof obj === 'object' &&
              // Router instance with minified property combinations
              ((obj.asPath && obj.isFallback && obj.isReady) ||
                (obj.events?._h && obj.components && obj.sdc) ||
                // App router specific properties
                (obj.kind === 'PUSH' && obj.mpaNavigation !== undefined) ||
                // Router state specific properties
                (obj.cache && obj.tree && obj.mpaNavigation !== undefined))
          ),

          // Check for Next.js build markers (minification resistant)
          hasNextBuild: !!(
            window.__NEXT_CROSS_ORIGIN ||
            window.__NEXT_HAS_REWRITE ||
            window.__NEXT_I18N_SUPPORT
          ),
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    scripts: [
      // Next.js internal patterns (minification resistant)
      /[A-Za-z]\.__N(?:=|ext)|__N_SSG|__N_SSP/,
      /window\.__N(?:_STATE|EXT_P|_CROSS)/,
      /\.\$N(?:_STATE|EXT|_RSC)/,

      // Router events (survive minification)
      /(?:hashChange|routeChange)(?:Start|Complete|Error)/,
      /beforeHistoryChange/,
      /beforePopState/,

      // App router specific patterns (minification resistant)
      /\{\s*(?:\w+:)*\s*(?:soft|shallow|scroll|prefetch):/,
      /initialEntry\.state\.options\.shallow/,
      /window\.history\.pushState\(\{url:/,
      /window\.history\.replaceState\(\{url:/,

      // Error patterns specific to Next.js (survive minification)
      /err\.digest.*NEXT_NOT_FOUND/,
      /NEXT_REDIRECT.*permanent/,
      /err\.cancelled.*routeChangeError/,
      /markAssetError.*unavailable/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      // Next.js specific build outputs (minification resistant)
      /static\/\w+\/pages\/_app\./,
      /static\/chunks\/(?:main|webpack|framework|react-refresh)/,
      /static\/(?:chunks|css|media)\/(?:[a-z0-9]{20,}|app-|pages-)/,
      /_next\/static\/chunks\/(?:app-|pages-|main-|webpack-|polyfills-)/,
      /next\/dist\/client\/router/,
      /next\/dist\/client\/components\/navigation/,
      /next\/dist\/compiled\/react-server/,
    ],
  },
  {
    name: 'isNextJs' as const,
    score: 0.7,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'next';
    },
  },
];
