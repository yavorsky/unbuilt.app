import { Browser, BrowserContext, chromium } from 'playwright';

interface BrowserInstance {
  browser: Browser;
  context: BrowserContext;
}

const contextOptions = {
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 },
  screen: { width: 1920, height: 1080 },
  isMobile: false,
  hasTouch: false,
  javaScriptEnabled: true,
  bypassCSP: true,
  ignoreHTTPSErrors: true,
} as const;

export class BrowserManager {
  private instances: BrowserInstance[] = [];

  async initialize(maxInstances: number) {
    for (let i = 0; i < maxInstances; i++) {
      const browser = await chromium.launch({
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
      });

      const context = await browser.newContext(contextOptions);

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

      this.instances.push({ browser, context });
    }

    console.log(
      `[BrowserManager] Initialized ${maxInstances} browser instances`
    );
  }

  async getBrowserContext(): Promise<BrowserContext> {
    // Get instance by round-robin
    const instanceIndex =
      this.instances.length > 0
        ? Math.floor(Math.random() * this.instances.length)
        : 0;

    const instance = this.instances[instanceIndex];
    if (!instance) {
      throw new Error('No browser instances available');
    }

    // Create fresh context for this job
    const context = await instance.browser.newContext(contextOptions);

    return context;
  }

  async cleanup() {
    await Promise.all(
      this.instances.map(async ({ browser, context }) => {
        try {
          await context.close();
          await browser.close();
        } catch (error) {
          console.error('[BrowserManager] Error during cleanup:', error);
        }
      })
    );
    this.instances = [];
    console.log('[BrowserManager] Cleanup completed');
  }
}
