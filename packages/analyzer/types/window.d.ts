/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window extends (Window & typeof globalThis) {
    // Since we are huge variation of properties, we can't define them all.
    // TODO: Reconsider this approach after development phase.
    [key: string]: any;
  }
}

// Export empty object to make it a module
export {};