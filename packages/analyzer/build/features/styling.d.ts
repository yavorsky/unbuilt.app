import { Page } from 'playwright';
import { Resources } from '../resources.js';
export interface StylingFeatures {
    preprocessor: string | null;
    frameworks: {
        tailwind: boolean;
        bootstrap: boolean;
        mui: boolean;
        styledComponents: boolean;
    };
    features: {
        hasModules: boolean;
        hasCssInJs: boolean;
        hasUtilityClasses: boolean;
    };
}
export declare class StylingFeaturesDetector {
    private page;
    private resources;
    constructor(page: Page, resources: Resources);
    detect(): Promise<StylingFeatures>;
    private detectPreprocessor;
    private detectTailwind;
    private detectBootstrap;
    private detectMUI;
    private detectStyledComponents;
    private detectCSSModules;
    private detectCSSInJS;
    private detectUtilityClasses;
}
//# sourceMappingURL=styling.d.ts.map