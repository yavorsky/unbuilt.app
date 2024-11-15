import { Page } from 'playwright';
import { Resources } from '../resources.js';
export interface ModuleFeatures {
    type: 'esm' | 'commonjs' | 'amd' | 'unknown';
    hasDynamicImports: boolean;
    hasTreeShaking: boolean;
    hasCodeSplitting: boolean;
}
export declare class ModuleFeaturesDetector {
    private page;
    private resources;
    constructor(page: Page, resources: Resources);
    detect(): Promise<ModuleFeatures>;
    private detectModuleType;
    private detectDynamicImports;
    private detectTreeShaking;
    private detectCodeSplitting;
}
//# sourceMappingURL=module.d.ts.map