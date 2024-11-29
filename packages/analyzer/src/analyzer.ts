import { chromium, Page, Browser } from 'playwright';
import { BuildFeatures, BuildFeaturesDetector } from './features/build.js';
import { ResourceAnalysis, Resources } from './resources.js';
import { ModuleResult, ModuleFeaturesDetector } from './features/module.js';
import { PerformanceFeatures, PerformanceFeaturesDetector } from './features/performance.js';
import { UILibFeatures, UILibFeaturesDetector } from './features/ui-lib.js';
import { MetaFrameworkFeatures, MetaFrameworkFeaturesDetector } from './features/framework/detect.js';
import { NoPageInitializedError } from './errors.js';
import { StylingFeatures, StylingFeaturesDetector } from './features/styling.js';

// {
//   framework: {
//     name: 'next',
//     // Next JS features
//     features: {},
//   },
//   uiLibrary: {
//     name: 'react',
//     features: {},
//   },
//   styling: {
//     name: 'styled-components' | 'tailwind',
//     features: {},
//   },
//   network: {
//     items: {
//       name: 'graphql' | 'rest' | 'grpc',
//       library: 'apollo' | 'relay' | 'fetch' | 'axios'
//     }
//   },
//   libs: {
//     stateManagement: ['redux'],
//     routing: ['react-router'],
//     dates: ['moment.js'],
//     // List of differnet libraries
//     other: ['lodash', 'lodash-es']
//   },
//   build: {
//     name: 'webpack',
//     features: {
//       modules: 'ESM',
//     },
//   },
//   transformer: {
//     name: 'babel',
//     features: {},
//   },
//   minifier: {
//     name: 'terser',
//     features: {},
//   },
// }


export interface AnalysisResult {
  url: string;
  build: BuildFeatures | null;
  uiLib: UILibFeatures | null;
  framework: MetaFrameworkFeatures | null;
  styling: StylingFeatures | null;
  performance: PerformanceFeatures | null;
  modules: ModuleResult | null;
  resources: ResourceAnalysis;
  timestamp: string;
}

export class Analyzer {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private resources: Resources | null = null;
  private buildFeaturesDetector: BuildFeaturesDetector | null = null;
  private stylingFeaturesDetector: StylingFeaturesDetector | null = null;
  private uiLibFeaturesDetector: UILibFeaturesDetector | null = null;
  private metaFameworkFeaturesDetector: MetaFrameworkFeaturesDetector | null = null;
  private moduleFeaturesDetector: ModuleFeaturesDetector | null = null;
  private performanceFeaturesDetector: PerformanceFeaturesDetector | null = null;

  constructor(page: Page, browser: Browser) {
    this.browser = browser;
    this.page = page;
  }

  async initialize() {
    await this.initializeResources();
    await this.initializeFeatures();
  }

  async initializeResources() {
    if (!this.page) {
      throw new NoPageInitializedError();
    }
    this.resources = new Resources(this.page);
    await this.resources.initialize();
  }

  async initializeFeatures() {
    if (!this.page || !this.resources || !this.browser) {
      throw new NoPageInitializedError();
    }
    this.buildFeaturesDetector = new BuildFeaturesDetector(this.page, this.resources);
    this.stylingFeaturesDetector = new StylingFeaturesDetector(this.page, this.resources);
    this.uiLibFeaturesDetector = new UILibFeaturesDetector(this.page, this.resources, this.browser);
    this.metaFameworkFeaturesDetector = new MetaFrameworkFeaturesDetector(this.page, this.resources, this.browser);
    this.moduleFeaturesDetector = new ModuleFeaturesDetector(this.page, this.resources);
    this.performanceFeaturesDetector = new PerformanceFeaturesDetector(this.page, this.resources);
  }

  async analyze(url: string): Promise<AnalysisResult> {
    if (!this.page || !this.resources) {
      throw new NoPageInitializedError();
    }

    try {
      await this.page!.goto(url, {
        waitUntil: 'networkidle',
        timeout: 40000,
      });

      console.log('WENT TO PAGE');

      const analysis: AnalysisResult = {
        url,
        build: await this.buildFeaturesDetector?.detect() ?? null,
        uiLib: await this.uiLibFeaturesDetector?.detect() ?? null,
        metaFramework: await this.metaFameworkFeaturesDetector?.detect() ?? null,
        styling: await this.stylingFeaturesDetector?.detect() ?? null,
        performance: await this.performanceFeaturesDetector?.detect() ?? null,
        modules: await this.moduleFeaturesDetector?.detect() ?? null,
        resources: await this.resources.analyze(),
        timestamp: new Date().toISOString(),
      };

      return analysis;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
