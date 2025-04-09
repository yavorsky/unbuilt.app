import { Browser, BrowserContext, chromium } from 'playwright';
import { contextOptions } from './context-options.js';
import { runWithProfileCopy } from './run-with-profile.js';

interface BrowserInstance {
  browser: Browser;
  context: BrowserContext;
}

const launchOptions = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    // No need to preserve web security in headless mode without any session
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-gpu',
  ],
};

export class BrowserManager {
  private instances: BrowserInstance[] = [];
  private onError?: (error: Error) => void;

  async initialize(
    maxInstances: number,
    onError: (error: Error) => void,
    debug: boolean = false,
    withSession: boolean = false
  ) {
    this.onError = onError;

    for (let i = 0; i < maxInstances; i++) {
      let browser: Browser;
      let context: BrowserContext;

      if (withSession) {
        const contextInfoWithProfile = await runWithProfileCopy();
        browser = contextInfoWithProfile.browser!;
        context = contextInfoWithProfile.context;
      } else {
        browser = await chromium.launch(launchOptions);

        context = await browser.newContext(contextOptions);

        await context.addInitScript(`
          // Overwrite navigator properties
          Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
          Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });

          // Add language preferences
          Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

          // Modify Chrome properties
          window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {},
          };
        `);
      }

      this.instances.push({ browser, context });
    }

    if (debug) {
      console.log(
        `[BrowserManager] Initialized ${maxInstances} browser instances`
      );
    }
  }

  async getBrowserContext(
    withSession: boolean = false
  ): Promise<{ context: BrowserContext; browser: Browser }> {
    // Get instance by round-robin
    const instanceIndex =
      this.instances.length > 0
        ? Math.floor(Math.random() * this.instances.length)
        : 0;

    const instance = this.instances[instanceIndex];
    if (!instance) {
      throw new Error('No browser instances available');
    }

    if (withSession) {
      return { context: instance.context, browser: instance.browser };
    }

    // Create fresh context for this job
    const context = await instance.browser.newContext(contextOptions);

    return { context, browser: instance.browser };
  }

  async cleanup() {
    await Promise.all(
      this.instances.map(async ({ browser, context }) => {
        try {
          await context.close();
          await browser.close();
        } catch (error) {
          this.onError?.(error as Error);
        }
      })
    );
    this.instances = [];
  }
}
