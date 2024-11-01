import { Page } from "playwright";

class FeatureDetector {
  async detectFeatures(page: Page): Promise<BuildFeatures> {
    const scripts = await this.getAllScripts(page);
    // const resources = await this.getResourceTimings(page);

    return {
      codeModularity: await this.detectModularityFeatures(scripts, page),
      // optimization: await this.detectOptimizationFeatures(scripts, resources),
      modern: this.detectModernFeatures(scripts),
      performance: await this.detectPerformanceFeatures(page, scripts)
    };
  }

  private async detectModularityFeatures(scripts: Set<string>, page: Page) {
    return {
      // Check for code splitting (multiple chunks)
      hasCodeSplitting: await this.detectCodeSplitting(page),

      // Look for dynamic import statements
      hasDynamicImports: Array.from(scripts).some(script =>
        script.includes('import(') ||
        script.includes('require.ensure') ||
        script.includes('webpack/runtime/load script')
      ),

      // Detect tree shaking by looking for patterns
      hasTreeShaking: scripts.some(script =>
        script.includes('/*#__PURE__*/') ||
        script.includes('/*@__PURE__*/')
      ),

      // Detect module system
      hasModuleSystem: this.detectModuleSystem(scripts)
    };
  }

  private async detectCodeSplitting(page: Page): Promise<boolean> {
    // Listen for dynamically loaded scripts
    const dynamicScripts = new Set<string>();

    await page.route('**/*.js', route => {
      dynamicScripts.add(route.request().url());
      route.continue();
    });

    // Check navigation triggers new chunks
    await page.evaluate(() => {
      window.history.pushState({}, '', '/some-route');
    });

    return dynamicScripts.size > 1;
  }

  private detectModuleSystem(scripts: Set<string>): 'esm' | 'commonjs' | 'amd' | 'umd' | 'none' {
    for (const script of scripts) {
      if (script.includes('export ') || script.includes('import ')) {
        return 'esm';
      }
      if (script.includes('require') && script.includes('module.exports')) {
        return 'commonjs';
      }
      if (script.includes('define.amd')) {
        return 'amd';
      }
      if (script.includes('typeof define') && script.includes('typeof exports')) {
        return 'umd';
      }
    }
    return 'none';
  }

  private async detectOptimizationFeatures(scripts: Set<string>, resources: any[]) {
    return {
      // Check for source maps
      hasSourceMaps: resources.some(r =>
        r.name.endsWith('.map') || scripts.some(s => s.includes('//# sourceMappingURL='))
      ),

      // Check for minification
      hasMinification: this.detectMinification(scripts),

      // Check for resource hints
      hasPrefetching: await this.detectPrefetching(),

      // Check for preloading
      hasPreloading: await this.detectPreloading()
    };
  }

  private detectMinification(scripts: Set<string>): boolean {
    for (const script of scripts) {
      // Check average line length
      const avgLineLength = script.length / (script.match(/\n/g)?.length || 1);
      if (avgLineLength > 100) {
        return true;
      }

      // Check for typical minification patterns
      if (/[;,]\w+[:=]\w+/.test(script)) {
        return true;
      }

      // Check for single-letter variables
      if (/\b[a-z]{1,2}\b/.test(script)) {
        return true;
      }
    }
    return false;
  }

  private async detectPrefetching(): Promise<boolean> {
    return this.page.evaluate(() => {
      return !!document.querySelector('link[rel="prefetch"]');
    });
  }

  private async detectPreloading(): Promise<boolean> {
    return this.page.evaluate(() => {
      return !!document.querySelector('link[rel="preload"]');
    });
  }

  private detectModernFeatures(scripts: Set<string>): ModernFeatures {
    return {
      // Check for modern syntax usage
      usesModernSyntax: Array.from(scripts).some(script =>
        /const |let |class /.test(script) ||
        /=>/.test(script)
      ),

      // Check for async/await
      usesAsyncAwait: Array.from(scripts).some(script =>
        /async |await /.test(script)
      ),

      // Check for optional chaining
      usesOptionalChaining: Array.from(scripts).some(script =>
        /\?\.[a-zA-Z$_]/.test(script)
      ),

      // Check for nullish coalescing
      useNullishCoalescing: Array.from(scripts).some(script =>
        /\?\?/.test(script)
      )
    };
  }

  private async detectPerformanceFeatures(page: Page, scripts: Set<string>) {
    return {
      // Check for caching headers and service workers
      hasCaching: await this.detectCaching(page),

      // Check for lazy loading
      hasLazyLoading: await this.detectLazyLoading(page),

      // Check for web workers
      hasWorkers: Array.from(scripts).some(script =>
        script.includes('new Worker(') ||
        script.includes('navigator.serviceWorker')
      )
    };
  }

  private async detectCaching(page: Page): Promise<boolean> {
    const response = await page.goto(page.url());
    const headers = response?.headers();
    if (!headers) {
      return false;
    }
    return !!(
      headers['cache-control'] ||
      headers['expires'] ||
      headers['etag'] ||
      await page.evaluate(() => !!navigator.serviceWorker?.controller)
    );
  }

  private async detectLazyLoading(page: Page): Promise<boolean> {
    return page.evaluate(() => {
      return !!document.querySelector('img[loading="lazy"]') ||
             !!document.querySelector('iframe[loading="lazy"]');
    });
  }

  private async getAllScripts(page: Page): Promise<Set<string>> {
    const scripts = new Set<string>();

    // Intercept and store all JS
    await page.route('**/*.js', async route => {
      const response = await route.fetch();
      const content = await response.text();
      scripts.add(content);
      await route.continue();
    });

    // Also get inline scripts
    const inlineScripts = await page.evaluate(() => {
      return Array.from(document.getElementsByTagName('script'))
        .map(script => script.innerHTML)
        .filter(Boolean);
    });

    inlineScripts.forEach(script => scripts.add(script));
    return scripts;
  }
}