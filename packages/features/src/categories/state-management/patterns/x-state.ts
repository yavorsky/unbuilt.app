import { Page } from 'playwright';

export const xState = [
  {
    name: 'coreEvents' as const,
    score: 0.9,
    scripts: [
      // XState's unique internal event types with exact prefixes
      /"@xstate\.snapshot"/,
      /"@xstate\.event"/,
      /"@xstate\.microstep"/,

      // XState's core lifecycle events
      /"xstate\.init"/,
      /"xstate\.stop"/,
      /"xstate\.spawnChild"/,

      // XState's unique internal type marker
      /xstate\$\$type:\s*1/,
    ],
  },
  {
    name: 'actorSystem' as const,
    score: 0.9,
    scripts: [
      // XState's actor done/error patterns
      /xstate\.done\.actor\.\${[^}]+}/,
      /xstate\.done\.state\.\${[^}]+}/,
      /xstate\.error\.actor/,

      // XState's invoke patterns
      /xstate\.invoke\.\${[^}]+}/,

      // XState's specific observable events
      /"xstate\.observable\.next"/,
      /"xstate\.observable\.error"/,
      /"xstate\.observable\.complete"/,
    ],
  },
  {
    name: 'internalActions' as const,
    score: 0.8,
    scripts: [
      // XState's promise resolution events
      /"xstate\.promise\.resolve"/,
      /"xstate\.promise\.reject"/,

      // XState's action enqueueing
      /"xstate\.enqueueActions"/,

      // XState's logging specifics
      /\.type="xstate\.log"/,
    ],
  },
  {
    name: 'browser' as const,
    score: 0.8,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        const xstateGlobal = window.__XSTATE__ || window.__xstate__;

        return !!xstateGlobal;
      });
    },
  },
];
