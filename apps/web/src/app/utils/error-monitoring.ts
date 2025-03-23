import { captureException } from '@sentry/nextjs';
import { trackEvent } from './analytics';
import logger from './logger/logger';
const isProduction = process.env.NODE_ENV === 'production';

export const trackError = (
  error: Error,
  context: Record<string, unknown> = {}
) => {
  // Log to Logflare
  logger.error(`Error: ${error.message}`, {
    error: error.message,
    stack: error.stack,
    context,
  });

  // Track in Analytics
  trackEvent('error', {
    error_message: error.message,
    error_type: error.name,
  });

  // Track in Sentry if it's production
  if (isProduction) {
    try {
      captureException(error, {
        extra: context,
      });
    } catch (sentryError) {
      logger.error('Error sending to Sentry:', {
        error: (sentryError as Error).message,
        stack: (sentryError as Error).stack,
      });
    }
  }
};
