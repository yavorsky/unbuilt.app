import { Page } from 'playwright';

export const swc = [
  {
    name: 'compilation' as const,
    score: 0.5,
    scripts: [
      // SWC minification specific patterns
      // Only matches patterns unique to SWC's minification, not transpilation

      // SWC minified class methods pattern
      // Example: _createClass(A,[{key:"m",value:function(){}}])
      /_createClass\([A-Z],\[\{key:"[a-z]",value:function\(\)\{\}\}\]\)/,

      // SWC's unique variable declaration merging in minification
      // Example: var a=1,b=2,c;
      /var [$_a-z]=\d+(?:,[$_a-z]=\d+){2,}/,

      // SWC's minified async function wrapper pattern
      // Example: async function(){try{await x()}catch(e){}}
      /async function\(\)\{try\{await [$_a-z]\(\)\}catch\([a-z]\)\{\}\}/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.3,
    filenames: [/\.swc\.min\.js$/, /\.min\.swc\.js$/],
  },
  {
    name: 'runtimeExecution' as const,
    score: 0.6,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Detect Next.js version where SWC is enabled by default (Next.js 12 and above)
        const nextVersion = window.next?.version;
        const isNextWithSWC = nextVersion
          ? parseInt(nextVersion.split('.')[0], 10) >= 12
          : false;

        return isNextWithSWC;
      });
    },
  },
];
