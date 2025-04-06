import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = (
  ...args: Parameters<typeof Sentry.captureRequestError>
) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  return Sentry.captureRequestError(...args);
};
