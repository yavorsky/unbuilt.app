import { Page, Browser } from 'playwright';
import { BuildFeatures } from './features/build.js';
import { ResourceAnalysis } from './resources.js';
import { ModuleFeatures } from './features/module.js';
import { PerformanceFeatures } from './features/performance.js';
import { FrameworkFeatures } from './features/framework.js';
import { StylingFeatures } from './features/styling.js';
interface AnalysisResult {
    url: string;
    build: BuildFeatures | null;
    framework: FrameworkFeatures | null;
    styling: StylingFeatures | null;
    performance: PerformanceFeatures | null;
    modules: ModuleFeatures | null;
    resources: ResourceAnalysis;
    timestamp: string;
}
export declare class Analyzer {
    private browser;
    private page;
    private resources;
    private buildFeaturesDetector;
    private stylingFeaturesDetector;
    private frameworkFeaturesDetector;
    private moduleFeaturesDetector;
    private performanceFeaturesDetector;
    constructor(page: Page, browser: Browser);
    initialize(): Promise<void>;
    initializeResources(): Promise<void>;
    initializeFeatures(): Promise<void>;
    analyze(url: string): Promise<AnalysisResult>;
    close(): Promise<void>;
    private calculateSimilarity;
}
export {};
//# sourceMappingURL=analyzer.d.ts.map