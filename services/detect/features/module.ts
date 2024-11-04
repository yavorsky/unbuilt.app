import { Page } from 'playwright';
import { Resources } from '../resources';

export interface ModuleFeatures {
  type: 'esm' | 'commonjs' | 'amd' | 'unknown';
  hasDynamicImports: boolean;
  hasTreeShaking: boolean;
  hasCodeSplitting: boolean;
}

export class ModuleFeaturesDetector {
  private page: Page;
  private resources: Resources;
  constructor(page: Page, resources: Resources) {
    this.page = page;
    this.resources = resources;
  }

  async detect(): Promise<ModuleFeatures> {
    return {
      type: this.detectModuleType(),
      hasDynamicImports: this.detectDynamicImports(),
      hasTreeShaking: this.detectTreeShaking(),
      hasCodeSplitting: await this.detectCodeSplitting()
    };
  }

  private detectModuleType() {
    const scripts = Array.from(this.resources.getAllScripts());
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
    }
    return 'unknown';
  }

  private detectDynamicImports() {
    return Array.from(this.resources.getAllScripts()).some(script =>
      script.includes('import(') ||
      script.includes('require.ensure')
    );
  }

  private detectTreeShaking() {
    return Array.from(this.resources.getAllScripts()).some(script =>
      script.includes('/*#__PURE__*/') ||
      script.includes('/*@__PURE__*/')
    );
  }

  private async detectCodeSplitting() {
    const chunks = new Set<string>();

    await this.page.route('**/*.js', route => {
      chunks.add(route.request().url());
      route.continue();
    });

    // Trigger some navigation or interaction
    await this.page.evaluate(() => {
      window.history.pushState({}, '', '/test-route');
    });

    return chunks.size > 1;
  }
};