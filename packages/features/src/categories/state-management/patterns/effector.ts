import { Page } from 'playwright';

// Effector internal types
interface Store<T = unknown> {
  getState: () => T;
  subscribe: (listener: (state: T) => void) => () => void;
  updates: {
    watch: (watcher: (update: T) => void) => () => void;
  };
  sid?: string | number;
  shortName?: string;
}

interface Event<T = void> {
  (payload: T): T;
  watch: (watcher: (payload: T) => void) => () => void;
  sid?: string | number;
  shortName?: string;
}

interface Domain {
  onCreateStore: (store: Store) => void;
  onCreateEvent: (event: Event) => void;
  onCreateEffect: (effect: Effect) => void;
}

interface Effect<Params = unknown, Done = unknown, Fail = Error> {
  (payload: Params): Promise<Done>;
  pending: Store<boolean>;
  done: Event<{ params: Params; result: Done }>;
  fail: Event<{ params: Params; error: Fail }>;
  sid?: string | number;
}

export const effector = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    scripts: [
      // Effector's unique store creation pattern
      /function\s+createStore\s*\(\s*defaultState\s*,\s*config\s*\)\s*\{\s*(?:const|let|var)\s+store\s*=\s*\{\s*subscribers:/,

      // Effector's specific event creation
      /function\s+createEvent\s*\(\s*name\s*\)\s*\{\s*(?:const|let|var)\s+event\s*=\s*\(\s*payload\s*\)\s*=>\s*\{/,

      // Effector's unique effect implementation
      /function\s+createEffect\s*\(\s*handler\s*,\s*config\s*\)\s*\{\s*(?:const|let|var)\s+effect\s*=\s*function/,

      // Effector's specific domain pattern
      /function\s+createDomain\s*\(\s*name\s*\)\s*\{\s*(?:const|let|var)\s+domain\s*=\s*\{\s*onCreateStore:/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isEffectorUnit = (obj: unknown): boolean => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          // Check for Effector's unique identifiers
          return !!(
            (obj as { sid?: string | number }).sid !== undefined ||
            (obj as { shortName?: string }).shortName !== undefined
          );
        };

        const isEffectorStore = (obj: unknown): obj is Store => {
          if (!isEffectorUnit(obj)) return false;

          const store = obj as Partial<Store>;
          return !!(
            typeof store.getState === 'function' &&
            typeof store.subscribe === 'function' &&
            store.updates?.watch !== undefined
          );
        };

        const isEffectorDomain = (obj: unknown): obj is Domain => {
          if (!obj || typeof obj !== 'object') return false;

          const domain = obj as Partial<Domain>;
          return !!(
            typeof domain.onCreateStore === 'function' &&
            typeof domain.onCreateEvent === 'function' &&
            typeof domain.onCreateEffect === 'function'
          );
        };

        return Object.values(window).some(
          (obj) => isEffectorStore(obj) || isEffectorDomain(obj)
        );
      });
    },
  },
  {
    name: 'combines' as const,
    score: 0.3,
    scripts: [
      // Effector's unique store combination pattern
      /function\s+combine\s*\(\s*stores\s*,\s*fn\s*\)\s*\{\s*(?:const|let|var)\s+target\s*=\s*createStore\s*\(/,

      // Effector's specific store merging
      /function\s+merge\s*\(\s*events\s*\)\s*\{\s*(?:const|let|var)\s+result\s*=\s*createEvent\s*\(/,

      // Effector's unique sample implementation
      /function\s+sample\s*\(\s*\{\s*clock\s*,\s*source\s*,\s*target\s*,\s*fn\s*\}\s*\)\s*\{/,
    ],
  },
  {
    name: 'reactBindings' as const,
    score: 0.3,
    scripts: [
      // Effector's specific React integration
      /function\s+useStore\s*\(\s*store\s*,\s*defaultState\s*\)\s*\{\s*(?:const|let|var)\s+\[\s*state\s*,\s*setState\s*\]\s*=/,

      // Effector's unique gate implementation
      /function\s+createGate\s*\(\s*config\s*\)\s*\{\s*(?:const|let|var)\s+options\s*=\s*\{\s*domain:/,

      // Effector's specific scope handling
      /function\s+createScope\s*\(\s*values\s*\)\s*\{\s*(?:const|let|var)\s+scope\s*=\s*new\s+Scope\s*\(/,
    ],
  },
];
