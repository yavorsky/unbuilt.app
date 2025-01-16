import { Browser, BrowserContext, chromium } from 'playwright';

interface BrowserInstance {
  browser: Browser;
  context: BrowserContext;
}

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
          '--disable-gpu',
        ],
      });

      const context = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      });

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
    const context = await instance.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    });

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
