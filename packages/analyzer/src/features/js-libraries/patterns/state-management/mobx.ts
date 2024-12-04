import { Page } from 'playwright';

export const mobx = [
  {
    name: 'coreRuntime' as const,
    score: 0.3,
    runtime: [
      // Core MobX imports
      /from\s+["']mobx["']/,
      /from\s+["']mobx-react(?:-lite)?["']/,
      /from\s+["']mobx-state-tree["']/,

      // Core MobX decorators and functions
      /@observable/,
      /@computed/,
      /@action/,
      /@observer/,

      // Modern MobX APIs
      /makeObservable\s*\(/,
      /makeAutoObservable\s*\(/,
      /observable\s*\(/,
      /computed\s*\(/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const markers = {
          hasMobx: !!window.mobx,
          hasInstances: !!window.__mobxInstanceCount,
          hasDevTools: !!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__,
          hasMobxReact: !!window.mobxReact,
        };
        return Object.values(markers).some(Boolean);
      });
    },
  },
  {
    name: 'patterns' as const,
    score: 0.2,
    runtime: [
      // MobX actions and reactions
      /runInAction\s*\(/,
      /reaction\s*\(/,
      /autorun\s*\(/,
      /when\s*\(/,

      // Configuration patterns
      /configure\(\{\s*enforceActions:/,
      /enforceActions:\s*["'](?:observed|always|never)["']/,

      // MST patterns
      /types\.\w+/,
      /\.actions\s*\(/,
      /\.views\s*\(/,

      // Common utility patterns
      /toJS\s*\(/,
      /isObservable\s*\(/,
      /observe\s*\(/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    filenames: [
      /mobx(?:\.min)?\.js$/,
      /mobx-react(?:-lite)?(?:\.min)?\.js$/,
      /mobx-state-tree(?:\.min)?\.js$/,
      /\bmobx\.[a-f0-9]+\.js$/,
      /store\.js$/,
      /stores?\//,
      /models?\//,
      /\.store\.js$/,
      /\.model\.js$/,
    ],
  },
];
