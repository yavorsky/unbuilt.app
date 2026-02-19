export const sse = [
  {
    name: 'coreUsage' as const,
    score: 0.8,
    scripts: [/new\s+EventSource\s*\(/, /text\/event-stream/, /eventsource/],
  },
];
