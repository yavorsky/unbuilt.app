import { AnalysisFeatures } from '../../../types/analysis.js';

export const emberRouter = [
  {
    name: 'coreRuntime' as const,
    score: 0.9,
    scripts: [
      // Ember router import
      /@ember\/routing\/[a-zA-Z-]+/,
      // Active transition usage
      /\._routerMicrolib\.activeTransition/,
      // Recognize method
      /\._routerMicrolib\.recognize/,
      // Transition abourted state
      /['"]TransitionAborted['"].*activeTransition/,
    ],
  },
  {
    name: 'isEmber' as const,
    score: 0.4,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.uiLibrary.name === 'ember';
    },
  },
];
