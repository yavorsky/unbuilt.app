import { sendGAEvent } from '@next/third-parties/google';
import { captureException } from '@sentry/nextjs';

// Define types for the event parameters
type EventParams = {
  [key: string]: string | number | boolean | null | undefined;
};

/**
 * Tracks an event in Google Analytics, but only in production environments.
 * In development, it logs the event to the console instead.
 *
 * @param eventName The name of the event to track
 * @param eventParams Additional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams: EventParams = {}
): void => {
  // In development, just log the event to the console
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // In production, send the actual event to Google Analytics
  try {
    sendGAEvent({
      event: eventName,
      ...eventParams,
    });
  } catch (error) {
    // Fail silently in production, but log to console
    captureException(error);
  }
};

/**
 * Tracks a page view in Google Analytics
 *
 * @param url The URL of the page being viewed
 * @param additionalParams Any additional parameters to include
 */
export const trackPageView = (
  url: string,
  additionalParams: EventParams = {}
): void => {
  trackEvent('page_view', {
    page_path: url,
    page_url: typeof window !== 'undefined' ? window.location.href : url,
    ...additionalParams,
  });
};

/**
 * Tracks a navigation click in Google Analytics
 *
 * @param destination The URL of the page being navigated to
 * @param isExternal Whether the navigation was external or internal
 */
export const trackNavigation = (destination: string, isExternal = false) => {
  trackEvent('navigation_click', {
    destination: destination,
    navigation_type: isExternal ? 'external' : 'internal',
    link_location: 'navigation_menu',
  });
};

export const trackAnalysisStart = (
  url: string,
  isRefreshingExisting: boolean
) => {
  trackEvent('analysis_started', {
    url,
    refreshing_existing: isRefreshingExisting,
  });
};
