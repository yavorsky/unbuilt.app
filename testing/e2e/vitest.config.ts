import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000,
    hookTimeout: 30000,
    threads: true,
    retry: 2,
    sequence: {
      shuffle: true,
    },
  },
});
