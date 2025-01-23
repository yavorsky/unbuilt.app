import { AnalysisFeatures } from '../../../types/analysis.js';

export const nextServerActions = [
  {
    name: 'serverActionProtocol' as const,
    score: 0.9,
    scripts: [
      // Next.js Server Actions specific header combinations
      /headers:\s*\{[^}]*(?:"Accept":\s*[^,}]*RSC_CONTENT_TYPE_HEADER|\[ACTION\]:|\[NEXT_ROUTER_STATE_TREE\]:)/,

      // Server Actions specific response header parsing
      /"x-action-redirect"/,
      /"x-action-revalidated"/,

      // Specific error handling format for revalidation
      /JSON\.parse\([^)]*\.get\("x-action-revalidated"\)/,

      // Form submission handling
      /"__next_form_action__"/,
    ],
  },
  {
    name: 'serverActionErrors' as const,
    score: 0.4,
    scripts: [
      // Server Actions binding markers
      /"Server Actions must be bound to a server component"/,
      /"Cannot pass a Server Action to a Client Component"/,
      // Server Actions specific error state
      /"Server Action failed with"/,
      // Server Actions state updates
      /"Server Action application state update failed"/,
    ],
  },
  {
    name: 'responseProcessing' as const,
    score: 0.5,
    scripts: [
      // Server Actions specific response structure
      /\{paths:\s*(?:\[\]|e\[0\]),\s*tag:\s*!!e\[1\],\s*cookie:\s*(?:e\[2\]|false)\}/,
    ],
  },
  {
    name: 'headers' as const,
    score: 0.9,
    headers: {
      // Server Actions specific response headers
      'x-action-redirect': /.*/,
      'x-action-revalidated': /\[\[.*\],\d+,\d+\]/,
    },
  },
  {
    name: 'isNextJs' as const,
    score: 0.4,
    dependencies: (analysis: AnalysisFeatures) => {
      return analysis.framework.name === 'next';
    },
  },
];
