import { Page } from 'playwright';

export interface UrlCheckResult {
  isAvailable: boolean;
  finalUrl: string;
  wasRedirected: boolean;
}

export async function checkUrlAvailability(
  page: Page,
  url: string
): Promise<UrlCheckResult> {
  // Default result structure
  const result: UrlCheckResult = {
    isAvailable: false,
    finalUrl: url,
    wasRedirected: false,
  };

  try {
    // First check with HEAD request for efficiency
    let needsNavigate = true;

    try {
      const apiResponse = await page.request.head(url, {
        timeout: 3000, // 3 second timeout
        failOnStatusCode: false, // Don't throw on non-200 status codes
      });

      // Get response's final URL to detect redirects
      const finalHeadUrl = apiResponse.url();
      result.wasRedirected = finalHeadUrl !== url;
      result.finalUrl = finalHeadUrl;
      result.isAvailable = apiResponse.ok();

      // If the HEAD request was successful and we've detected a redirect,
      // we can avoid a full navigation
      if (result.isAvailable) {
        needsNavigate = false;
      }
    } catch (headError) {
      console.log('[HEAD request error]', headError);
      // Continue to full navigation if HEAD request fails
    }

    // If HEAD request failed or wasnt conclusive, do a full navigation
    if (needsNavigate) {
      const response = await page.goto(url, {
        timeout: 10000, // Increase timeout for full navigation
        waitUntil: 'networkidle', // Wait for network to be idle to catch all redirects
      });

      if (response) {
        const status = response.status();
        result.isAvailable = status >= 200 && status < 400;

        // Check if we were redirected by comparing current URL to the original
        const currentUrl = page.url();
        result.wasRedirected = currentUrl !== url;
        result.finalUrl = currentUrl;
      }
    }

    return result;
  } catch (error) {
    console.log('[checkUrlAvailability error]', error);

    // Even if we hit an error, check if the page loaded and was redirected
    try {
      const currentUrl = page.url();
      if (currentUrl && currentUrl !== 'about:blank' && currentUrl !== url) {
        result.wasRedirected = true;
        result.finalUrl = currentUrl;
        // If we're on a valid page despite the error, we might consider it available
        result.isAvailable =
          !currentUrl.includes('error') && !currentUrl.includes('not-found');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (urlErrorer) {
      // Ignore errors when trying to get the current URL
    }

    return result;
  }
}
