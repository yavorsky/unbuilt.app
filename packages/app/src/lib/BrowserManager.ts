import { Browser, BrowserContext, chromium } from 'playwright';

export class BrowserManager {
  private browser: Browser | null = null;
  private contexts: BrowserContext[] = [];

  async initialize(maxContexts: number) {
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    for (let i = 0; i < maxContexts; i++) {
      const context = await this.browser.newContext();
      this.contexts.push(context);
    }
  }

  getBrowser() {
    return this.browser;
  }

  async getContext(): Promise<BrowserContext> {
    const context = this.contexts.find(ctx => ctx.pages().length === 0);
    if (context) return context;

    if (!this.browser) throw new Error('Browser not initialized');
    return this.browser.newContext();
  }

  async cleanup() {
    await Promise.all(this.contexts.map(ctx => ctx.close()));
    if (this.browser) await this.browser.close();
  }
}