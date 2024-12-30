import { Page } from 'playwright';

interface ProxyObject {
  $$valtioProxy?: boolean;
  $$valtioTarget?: object;
}

interface ValtioRef<T = unknown> extends ProxyObject {
  current: T;
  subscribe: (callback: (nextValue: T) => void) => () => void;
}

export const valtio = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Valtio's unique proxy creation pattern
      /function\s+proxy\s*\([^)]*\)\s*\{\s*(?:const|let|var)\s+notifyUpdate\s*=\s*createNotifyUpdate\s*\([^)]*\)/,

      // Valtio's specific snapshot implementation
      /function\s+snapshot\s*\([^)]*\)\s*\{\s*(?:const|let|var)\s+snapValue\s*=\s*getUntracked\s*\([^)]*\)/,

      // Valtio's unique subscription system
      /function\s+subscribe\s*\(\s*proxy\s*,\s*callback\s*,\s*notifyInSync\s*\)\s*\{\s*(?:const|let|var)\s+listeners/,

      // Valtio's specific proxy handler implementation
      /createProxyHandler\s*=\s*\(\s*notifyUpdate\s*,\s*isRoot\s*\)\s*=>\s*\(\s*\{\s*get\s*,\s*set\s*,\s*deleteProperty/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isValtioProxy = (obj: unknown): obj is ProxyObject => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          return !!(
            (obj as ProxyObject).$$valtioProxy ||
            (obj as ProxyObject).$$valtioTarget ||
            // Check for hidden Valtio properties
            Object.getOwnPropertyDescriptor(obj, '__handlers') ||
            Object.getOwnPropertyDescriptor(obj, '__listeners')
          );
        };

        const isValtioRef = (obj: unknown): obj is ValtioRef => {
          if (!isValtioProxy(obj)) return false;

          return (
            'current' in obj &&
            typeof (obj as ValtioRef).subscribe === 'function'
          );
        };

        return Object.values(window).some(
          (obj) => isValtioProxy(obj) || isValtioRef(obj)
        );
      });
    },
  },
  {
    name: 'derivedState' as const,
    score: 0.3,
    scripts: [
      // Valtio's unique derived state implementation
      /function\s+derive\s*\(\s*fn\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+pending\s*=\s*false/,

      // Valtio's specific proxyWithComputed implementation
      /function\s+proxyWithComputed\s*\(\s*target\s*,\s*computedFns\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+computedTarget/,

      // Valtio's unique ref implementation
      /function\s+ref\s*\(\s*value\s*\)\s*\{\s*return\s*proxy\s*\(\s*\{\s*current:\s*value\s*\}\s*\)/,
    ],
  },
  {
    name: 'reactBindings' as const,
    score: 0.3,
    scripts: [
      // Valtio's specific useSnapshot implementation
      /function\s+useSnapshot\s*\(\s*proxyObject\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+\[\s*,\s*forceUpdate\s*\]\s*=\s*useReducer/,

      // Valtio's unique subscribeKey implementation
      /function\s+subscribeKey\s*\(\s*proxy\s*,\s*key\s*,\s*callback\s*\)\s*\{\s*return\s*subscribe\s*\(\s*proxy\s*,\s*\(\s*ops\s*\)/,

      // Valtio's specific devtools integration
      /function\s+devtools\s*\(\s*proxyObject\s*,\s*name\s*\)\s*\{\s*(?:const|let|var)\s+extension\s*=\s*window\.__REDUX_DEVTOOLS_EXTENSION__/,
    ],
  },
];
