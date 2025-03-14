import { Page } from 'playwright';

export const navigateToPage = async (
  url: string,
  page: Page,
  onError?: (error: Error) => void
) => {
  try {
    // Initial domcontentloaded event. The main indicator page is ready to be analyzed.
    // We'll still need to ensure all scripts are loaded later.
    await page.goto(url, {
      waitUntil: 'domcontentloaded', // First wait for DOM
      timeout: 15000,
    });
  } catch (error) {
    onError?.(error as Error);
    throw new Error('Error loading resources');
  }

  try {
    // Here we are loading for page load event and network idle. Sometimes, some requests are stuck.
    // In this case, we assume that we wait for 10 seconds and start analysis ignoring stucked requests.
    await Promise.all([
      page.waitForLoadState('load', { timeout: 10000 }),
      page.waitForLoadState('networkidle', { timeout: 10000 }),
    ]);
  } catch (e: unknown) {
    // Skipping network idle
    console.log('Skipping network idle', e);
  }
};
