import { Page } from 'playwright';

// XState internal types
interface StateMachine {
  __xstate_machine?: boolean;
  initialState: object;
  transition: (state: object, event: string | object) => object;
  getInitialState: () => object;
}

interface Interpreter {
  __xstate_interpreter?: boolean;
  send: (event: string | object) => void;
  subscribe: (observer: () => void) => () => void;
  start: () => void;
  stop: () => void;
}

interface XStateGlobals {
  __XSTATE__?: {
    machines: Map<string, StateMachine>;
    services: Map<string, Interpreter>;
  };
}

export const xState = [
  {
    name: 'coreRuntime' as const,
    score: 0.4,
    runtime: [
      // XState's unique machine creation pattern
      /function\s+createMachine\s*\(\s*config\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+machine\s*=\s*new\s+StateNode\s*\(/,

      // XState's specific state node implementation
      /function\s+StateNode\s*\(\s*config\s*,\s*options\s*\)\s*\{\s*(?:this\._transitions|this\.config|this\.machine)\s*=/,

      // XState's unique transition matcher
      /function\s+toTransitionObject\s*\(\s*[\w$]+\s*\)\s*\{\s*return\s*\{\s*target:\s*[\w$]+\s*,\s*source:\s*[\w$]+\s*,\s*actions:/,

      // XState's specific interpreter creation
      /function\s+interpret\s*\(\s*machine\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+service\s*=\s*new\s+Interpreter\s*\(/,
    ],
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const isStateMachine = (obj: unknown): obj is StateMachine => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const machine = obj as Partial<StateMachine>;

          return !!(
            typeof machine.transition === 'function' &&
            typeof machine.getInitialState === 'function' &&
            machine.initialState !== undefined
          );
        };

        const isInterpreter = (obj: unknown): obj is Interpreter => {
          if (!obj || typeof obj !== 'object') {
            return false;
          }

          const interpreter = obj as Partial<Interpreter>;

          return !!(
            typeof interpreter.send === 'function' &&
            typeof interpreter.subscribe === 'function' &&
            typeof interpreter.start === 'function' &&
            typeof interpreter.stop === 'function'
          );
        };

        const globalObj = window as Window & XStateGlobals;
        const xstateGlobal = globalObj.__XSTATE__;

        return !!(
          xstateGlobal?.machines?.size ||
          xstateGlobal?.services?.size ||
          Object.values(globalObj).some(
            (obj) => isStateMachine(obj) || isInterpreter(obj)
          )
        );
      });
    },
  },
  {
    name: 'stateMachine' as const,
    score: 0.3,
    runtime: [
      // XState's unique state matching implementation
      /function\s+matchState\s*\(\s*state\s*,\s*patterns\s*,\s*defaultValue\s*\)\s*\{\s*(?:const|let|var)\s+resolvedState\s*=\s*toStateValue\s*\(/,

      // XState's specific action execution
      /function\s+executeActionObject\s*\(\s*action\s*,\s*context\s*,\s*_event\s*\)\s*\{\s*(?:const|let|var)\s+(?:exec|actionFunction)\s*=/,

      // XState's unique state resolution
      /function\s+resolveState\s*\(\s*state\s*,\s*context\s*\)\s*\{\s*(?:const|let|var)\s+configuration\s*=\s*getConfiguration\s*\(/,
    ],
  },
  {
    name: 'actorSystem' as const,
    score: 0.3,
    runtime: [
      // XState's specific actor implementation
      /function\s+createActor\s*\(\s*behavior\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+actor\s*=\s*new\s+Actor\s*\(/,

      // XState's unique spawning system
      /function\s+spawnBehavior\s*\(\s*behavior\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+actor\s*=\s*createActor\s*\(/,

      // XState's specific invoked service handling
      /function\s+createInvocableActor\s*\(\s*src\s*,\s*options\s*\)\s*\{\s*(?:const|let|var)\s+actor\s*=\s*createActor\s*\(/,
    ],
  },
];
