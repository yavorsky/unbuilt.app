import { Page } from 'playwright';

export const mobx = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // MobX's unique observable creation implementation
      /function\s+createAtom\s*\(\s*name\s*,\s*onBecomeObserved(?:Handler)?\s*,\s*onBecomeUnobserved(?:Handler)?\)\s*\{\s*return\s*new\s+Atom\s*\(/,

      // MobX's specific proxy trap implementation
      /function\s+createObservableProperty\s*\([^)]*\)\s*\{\s*(?:var|const|let)\s+atom\s*=\s*createAtom\s*\([^)]*\)/,

      // MobX's unique reaction scheduling system
      /function\s+propagateChanged\s*\(observable\)\s*\{\s*(?:var|const|let)\s+observers\s*=\s*observable\.observers_\.slice\(\)/,

      // MobX's specific computed value implementation
      /function\s+createComputedValue\s*\([^)]*\)\s*\{\s*(?:var|const|let)\s+(?:options|scope)\s*=\s*(?:arguments\.length\s*>\s*1|[^;]+);\s*(?:var|const|let)\s+derivation\s*=/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- No need to typecheck window keys
        const isMobXStore = (obj: any) => {
          return (
            obj &&
            typeof obj === 'object' &&
            // MobX specific symbols and properties
            (!!obj['$mobx'] || !!obj['__mobxDidRunLazyInitializers__']) &&
            // Check for observable array administration
            (obj['$mobx']?.atom_ || obj['$mobx']?.values_)
          );
        };

        return !!(
          // Check for MobX's specific global markers
          (
            window['$mobx'] ||
            window['__mobxGlobal'] ||
            window['__mobxInstanceCount'] > 0 ||
            // Check for MobX stores
            Object.values(window).some(isMobXStore)
          )
        );
      });
    },
  },
  {
    name: 'decorators' as const,
    score: 0.3,
    runtime: [
      // MobX's specific decorator implementation
      /function\s+createPropDecorator\s*\(\s*[^)]*\)\s*\{\s*(?:return\s+)?function\s+decorator\s*\([^)]*\)\s*\{\s*(?:var|const|let)\s+descriptor\s*=\s*arguments/,

      // MobX's unique property decorator pattern
      /(?:makeObservable|extendObservable)\s*\(\s*target\s*,\s*\{\s*[^:]+:\s*(?:observable|computed|action)(?:\.(?:ref|shallow|deep|struct))?\s*\}/,

      // MobX's action decorator implementation
      /function\s+createAction\s*\(\s*actionName\s*,\s*fn\s*,\s*(?:autoAction|ref|scope)\s*\)\s*\{\s*(?:var|const|let)\s+res\s*=\s*function/,
    ],
  },
  {
    name: 'reactIntegration' as const,
    score: 0.3,
    runtime: [
      // MobX-React's specific observer implementation
      /function\s+makeComponentReactive\s*\(\s*(?:render|target|baseComponent)\s*\)\s*\{\s*(?:var|const|let)\s+(?:reaction|dispose|rendering|isRenderingPending)\s*=/,

      // MobX-React's unique component wrapping pattern
      /if\s*\(\s*component\['[$]mobx'\]\s*\)\s*\{\s*throw\s+new\s+Error\s*\(['"][^'"]*observer[^'"]*['"]\s*\)\s*\}/,

      // MobX-React's specific reaction handling
      /function\s+observerComponentNameFor\s*\(\s*component\s*\)\s*\{\s*return\s*['"]\w+\(observer\)\(['"][\s\S]*?\)/,
    ],
  },
];
