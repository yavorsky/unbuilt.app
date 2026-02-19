import { Page } from 'playwright';

// WebSocket — detect actual WS connections, not just the API reference
export const websocket = [
  {
    name: 'libraries' as const,
    score: 1,
    filenames: [/socket\.io[.\-@/]/, /sockjs[.\-@/]/, /ws[.\-@/]/],
    scripts: [
      /"socket\.io"/, // Package self-reference
      /"sockjs"/, // Package self-reference
    ],
  },
  {
    name: 'urlPatterns' as const,
    score: 0.7,
    // WebSocket URLs in code
    scripts: [/["']wss?:\/\//],
  },
  {
    name: 'browser-check' as const,
    score: 1.5,
    browser: async (page: Page) => {
      return page.evaluate(() => {
        // Check if any WebSocket connections are active
        // Socket.IO adds an io global
        return typeof (window as Record<string, unknown>).io !== 'undefined';
      });
    },
  },
];
