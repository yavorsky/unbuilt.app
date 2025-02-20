// NgRx store internal type
export const ngrx = [
  {
    name: 'coreRuntime' as const,
    score: 0.9,
    scripts: [
      // Init action
      /@ngrx\/store\/init/,

      // Injection tokens
      /new\s+[a-zA-Z.]*nKC\(\s*["']@ngrx\/[^"']+["']\)/,

      // Internal messages
      /"@ngrx\/store\s+Internal[^"]+"/,

      // Runtime checks
      /https:\/\/ngrx\.io\/guide\/store\/configuration\/runtime-checks/,

      // NgRx's unique injection tokens that survive minification
      /"@ngrx\/store Internal Root Guard"/,
      /"@ngrx\/store Internal Initial State"/,
      /"@ngrx\/store Initial State"/,

      // NgRx's specific update action type
      /"@ngrx\/store\/update-reducers"/,

      // NgRx's internal state property names
      /\["\$\$isNgrxMockEnvironment"\]/,
      /\["\$ngrxMockState"\]/,

      // NgRx's unique error messages
      /"The root Store has been provided more than once. Feature modules should provide feature states instead."/,
    ],
  },
  {
    name: 'storeFeatures' as const,
    score: 0.8,
    scripts: [
      // NgRx's unique store feature injection tokens
      /"@ngrx\/store Store Features"/,
      /"@ngrx\/store Internal Store Features"/,
      /"@ngrx\/store Feature Reducers"/,

      // NgRx's unique metadata keys
      /"@ngrx\/store\/metaReducers"/,
      /"@ngrx\/store\/reducers"/,
    ],
  },
  {
    name: 'moduleImports' as const,
    score: 0.7,
    scripts: [
      // NgRx module imports
      /["']\@ngrx\/store["']/,
      /["']\@ngrx\/effects["']/,
      /["']\@ngrx\/entity["']/,
      /["']\@ngrx\/store-devtools["']/,
    ],
  },
];
