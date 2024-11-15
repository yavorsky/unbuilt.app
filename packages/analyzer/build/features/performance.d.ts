import { Page } from 'playwright';
import { Resources } from '../resources.js';
export interface PerformanceFeatures {
    resourceCount: number;
    totalSize: number;
    scriptMetrics: {
        async: number;
        defer: number;
        modules: number;
    };
    imageMetrics: {
        lazyLoaded: number;
        total: number;
    };
}
export declare class PerformanceFeaturesDetector {
    private page;
    private resources;
    constructor(page: Page, resources: Resources);
    detect(): Promise<PerformanceFeatures>;
}
//# sourceMappingURL=performance.d.ts.map