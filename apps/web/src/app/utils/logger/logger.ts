import pino from 'pino';
import { createLogflareTransport } from './logflare';

// Define environment variables
const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL || 'info';
const isServer = typeof window === 'undefined';

const fallbackLogger = {
  error: (message: string, ...args: unknown[]) =>
    console.error(`[ERROR] ${message}`, ...args),
  warn: (message: string, ...args: unknown[]) =>
    console.warn(`[WARN] ${message}`, ...args),
  info: (message: string, ...args: unknown[]) =>
    console.info(`[INFO] ${message}`, ...args),
  debug: (message: string, ...args: unknown[]) =>
    console.debug(`[DEBUG] ${message}`, ...args),
};

// Create the logger based on environment
const logger = (() => {
  // For production, use Logflare
  if (isProduction && isServer) {
    const transport = createLogflareTransport();
    if (!transport) {
      return fallbackLogger;
    }

    return pino(
      {
        level: logLevel,
        base: {
          env: process.env.NODE_ENV,
          app: 'unbuilt.app',
        },
      },
      transport
    );
  }

  // For development, use pretty console logs
  return fallbackLogger;
})();

export default logger;
