import { Page } from 'playwright';

export const mobx = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // MobX's unique Symbol properties that survive minification
      /Symbol\.for\(["']mobx-stored-annotations["']\)/,

      // MobX's specific error messages
      /"Since strict-mode is enabled, changing observed observable values outside actions is not allowed"/,
      /"[ComputedValue] It is not allowed to create or access other observables or computeds while computing a computed value"/,

      // MobX's unique global state property that survives minification
      // MobX's unique Symbol and administration property
      /Symbol\(["']mobx administration["']\)/,
      /mobx stored-annotations/,

      // MobX's unique internal flags from globals
      /\.__mobxInstanceCount/,
      /\.__mobxGlobals/,
      /mobxGuid/,
      /\[MobX\] minified error nr:/,

      // MobX's unique error URL pattern
      /https:\/\/github\.com\/mobxjs\/mobx\/blob\/main\/packages\/mobx\/src\/errors\.ts/,
    ],
  },
  {
    name: 'browser' as const,
    score: 1,
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
          // Check for MobX stores
          Object.values(window).some(isMobXStore)
        );
      });
    },
  },
  {
    name: 'browser' as const,
    score: 1.2,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        return !!(
          window['$mobx'] ||
          window['__mobxGlobals'] ||
          typeof window['__mobxInstanceCount'] !== 'undefined'
        );
      });
    },
  },
  {
    name: 'actionImplementation' as const,
    score: 0.9,
    scripts: [
      // MobX's unique action markers that survive minification
      /\.isMobxAction\s*=\s*true/,
      /\.isMobXFlow\s*=\s*true/,

      // MobX's specific property flags
      /\{allowStateChanges:\s*false,\s*allowStateReads:\s*true\}/,
      /enforceActions:\s*true/,
    ],
  },
  {
    name: 'observableMarkers' as const,
    score: 0.9,
    scripts: [
      // MobX's internal property format in production builds
      /\["?__mobxDecorators"?\]/,
      /\["?__mobxInstanceAdmin"?\]/,
      /\["?__mobxDidRunLazyInitializers"?\]/,
    ],
  },
  {
    name: 'strictModeImplementation' as const,
    score: 0.8,
    scripts: [
      // MobX's specific strict mode error messages
      /"Since strict-mode is enabled, changing (observed )?observable values outside actions is not allowed"/,
      /"[mobx] Since strict-mode is enabled, changing observed observable values outside actions is not allowed"/,
    ],
  },
];
