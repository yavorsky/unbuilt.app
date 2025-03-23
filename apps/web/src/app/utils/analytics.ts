import { captureException } from '@sentry/nextjs';
import clarity from '@microsoft/clarity';
import logger from './logger/logger';

// Define types for the event parameters
type TagParams = Record<string, string>;

/**
 * Tracks an event in Analytics, but only in production environments.
 * In development, it logs the event to the console instead.
 *
 * @param eventName The name of the event to track
 * @param tagParams Additional parameters for the event
 */
export const trackEvent = (eventName: string, tagParams?: TagParams): void => {
  // In development, just log the event to the console
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // In production, send the actual event to Analytics
  try {
    clarity.event(eventName);
    if (tagParams) {
      Object.entries(tagParams).forEach(([key, value]) => {
        clarity.setTag(key, value);
      });
    }
    clarity.upgrade(eventName);
  } catch (error) {
    // Fail silently in production, but log to console
    captureException(error);
  }

  // Log to Logflare (will use console in development)
  logger.info(`Event tracked: ${eventName}`, {
    event: eventName,
    params: tagParams,
  });
};

/**
 * Tracks a page view in Analytics
 *
 * @param url The URL of the page being viewed
 * @param additionalParams Any additional parameters to include
 */
export const trackPageView = (url: string): void => {
  trackEvent('page_view', { current_page: url });
};

/**
 * Tracks a navigation click in Analytics
 *
 * @param destination The URL of the page being navigated to
 */
export const trackNavigation = (destination: string) => {
  trackEvent('navigation_click', { destination });
};

/**
 * Tracks a start of a new analysis in Analytics
 *
 * @param url The URL of the page being analyzed
 */
export const trackAnalysisStart = (url: string) => {
  trackEvent('analysis_started', { analysis_url: url });
};

/**
 * Tracks a start of a new analysis in Analytics
 *
 * @param url The URL of the page being analyzed
 */
export const trackAnalysisEnd = (url: string) => {
  trackEvent('analysis_ended', { analysis_url: url });
};

/**
 * Tracks a navigation to an existing analysis in Analytics
 *
 * @param id The ID of the existing analysis
 * @param url The URL of the page being analyzed
 */
export const trackNavigateToExisting = (id: string, url: string) => {
  trackEvent('navigate_to_existing', { id, url });
};
