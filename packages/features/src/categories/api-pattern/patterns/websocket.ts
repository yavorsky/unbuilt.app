export const websocket = [
  {
    name: 'coreUsage' as const,
    score: 0.8,
    scripts: [/new\s+WebSocket\s*\(/, /socket\.io/, /\bsockjs\b/, /\bws:\/\//, /\bwss:\/\//],
    filenames: [/socket\.io/, /sockjs/],
  },
];
