import Queue, { Job, Queue as QueueType } from 'bull';
import { chromium } from 'playwright';

interface AnalysisJob {
  url: string;
  timestamp: string;
}

class AnalysisWorker {
  private queue: QueueType;

  constructor() {
    this.queue = new Queue('website-analysis', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    });

    this.initialize();
  }

  private async initialize() {
    this.queue.process('analyze-website', async (job: Job<AnalysisJob>) => {
      console.log(`Processing job ${job.id} for URL: ${job.data.url}`);
      return this.analyzeWebsite(job.data.url);
    });

    console.log('Analysis worker initialized');
  }

  private async analyzeWebsite(url: string) {
    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Store detected technologies
      const technologies = {
        frameworks: new Set<string>(),
        libraries: new Set<string>(),
        tools: new Set<string>()
      };

      // Intercept network requests to analyze loaded resources
      await page.route('**/*', async route => {
        const request = route.request();
        const url = request.url();

        // Analyze JavaScript files
        if (url.endsWith('.js')) {
          try {
            const response = await route.fetch();
            const text = await response.text();
            this.detectTechnologies(text, technologies);
          } catch (e) {
            console.error('Error analyzing JS:', e);
          }
        }

        await route.continue();
      });

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Analyze page content
      const pageContent = await page.content();
      this.detectTechnologies(pageContent, technologies);

      // Get meta information
      const metaInfo = await page.evaluate(() => {
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
        };
      });

      return {
        url,
        meta: metaInfo,
        technologies: {
          frameworks: Array.from(technologies.frameworks),
          libraries: Array.from(technologies.libraries),
          tools: Array.from(technologies.tools)
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private detectTechnologies(content: string, technologies: any) {
    const patterns = {
      frameworks: {
        'React': /react|createElement|ReactDOM/i,
        'Vue.js': /Vue|createApp|defineComponent/i,
        'Angular': /angular|ng\-|ngModule/i,
        'Next.js': /next\/|__NEXT_DATA__|useRouter/i,
        'Nuxt.js': /nuxt|__NUXT__|useNuxt/i,
      },
      libraries: {
        'jQuery': /jQuery|\$\(document\)/i,
        'Lodash': /\_\.|lodash/i,
        'Moment.js': /moment\(|moment\.js/i,
        'Axios': /axios\.|axios\(/i,
      },
      tools: {
        'Webpack': /webpack|__webpack_/i,
        'Babel': /babel|transform\-runtime/i,
        'TypeScript': /typescript|tsc\-/i,
        'Tailwind': /tailwind|tw\-/i,
      }
    };

    for (const [category, items] of Object.entries(patterns)) {
      for (const [tech, pattern] of Object.entries(items)) {
        if (pattern.test(content)) {
          technologies[category].add(tech);
        }
      }
    }
  }
}

// Start the worker if this file is run directly
if (require.main === module) {
  new AnalysisWorker();
}

export default AnalysisWorker;
