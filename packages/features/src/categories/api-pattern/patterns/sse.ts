// SSE — detect event source usage via string patterns
export const sse = [
  {
    name: 'runtimeStrings' as const,
    score: 0.8,
    scripts: [
      /"text\/event-stream"/, // MIME type as string literal (always preserved)
      /"eventsource"/, // Package name reference
    ],
    filenames: [/eventsource[.\-@/]/],
  },
  {
    name: 'headerPatterns' as const,
    score: 0.7,
    headers: {
      'content-type': /text\/event-stream/,
    },
  },
];
