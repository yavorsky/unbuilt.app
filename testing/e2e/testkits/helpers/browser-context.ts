import { BrowserManager } from '@unbuilt/helpers';
import { Browser, BrowserContext } from 'playwright';

let browser: Browser | null = null;
let context: BrowserContext | null = null;

export async function getBrowserContext() {
  if (!context) {
    const browserManager = new BrowserManager();
    // We want to have 1 instance per process. In the future, we'll run parrallel tests and can have more instances.
    await browserManager.initialize(1);
    context = await browserManager.getBrowserContext();
    browser = context.browser();
  }
  return context;
}

export function getBrowser() {
  return browser;
}

export async function closeBrowser() {
  await browser?.close();
  browser = null;
}
