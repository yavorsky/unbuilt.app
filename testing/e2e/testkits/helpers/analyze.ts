import { getBrowserContext } from './browser-context.js';
import { analyze } from '@unbuilt/analyzer';
import { Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';

export const analyzeApp = async (url: string) => {
  let page: Page | null = null;
  // Setup browser and page
  try {
    const context = await getBrowserContext();
    const browser = await context.browser();
    page = (await context?.newPage()) ?? null;

    if (!page || !browser) {
      throw new Error('Page is not defined');
    }

    const result = await analyze(url, uuidv4(), page, browser);

    return result?.analysis || null;
  } catch (error: unknown) {
    if (page) await page?.close();
    throw error;
  } finally {
    await page?.close();
  }
};
