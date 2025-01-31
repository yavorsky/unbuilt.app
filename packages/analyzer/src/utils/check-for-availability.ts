import { Page } from 'playwright';

export async function checkUrlAvailability(
  page: Page,
  url: string
): Promise<boolean> {
  try {
    // Some services may require additional headers and prevent automated requests.
    // Here, we are trying to emulate a real browser request from real human, like you!

    const apiResponse = await page.request.head(url, {
      timeout: 3000, // 2 second timeout
      failOnStatusCode: false, // Don't throw on non-200 status codes
    });

    let isOk = apiResponse.ok();
    // Fallback in case service is blocking head requests.
    if (!isOk) {
      // Use actual page navigation instead of request API
      const fullResponse = await page.goto(url, {
        timeout: 4000,
        waitUntil: 'domcontentloaded',
      });
      const status = fullResponse?.status();
      isOk = Boolean(status && status >= 200 && status < 400);
    }
    return isOk;
  } catch (error) {
    console.log('[checkUrlAvailability error]', error);
    // Handle network errors, timeouts, etc.
    return false;
  }
}
