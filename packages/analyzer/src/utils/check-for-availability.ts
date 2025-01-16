import { Page } from 'playwright';

export async function checkUrlAvailability(
  page: Page,
  url: string
): Promise<boolean> {
  try {
    const response = await page.request.head(url, {
      timeout: 2000, // 2 second timeout
      failOnStatusCode: false, // Don't throw on non-200 status codes
    });
    return response.ok();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Handle network errors, timeouts, etc.
    return false;
  }
}
