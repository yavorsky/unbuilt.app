import { Browser, Page } from 'playwright';
import { Resources } from '../resources.js';
export interface FrameworkFeatures {
    name: string;
    version?: string;
    features: string[];
    confidence: number;
    meta: {
        isSSR: boolean;
        hasRouter: boolean;
        hasStateManagement: boolean;
    };
}
export declare class FrameworkFeaturesDetector {
    private page;
    private resources;
    private browser;
    constructor(page: Page, resources: Resources, browser: Browser);
    detect(): Promise<FrameworkFeatures>;
    private detectFrameworkFeatures;
    private hasRedux;
    private hasReactRouter;
    private detectFrameworkMeta;
    private hasRouting;
    private hasStateManagement;
    private hasReactStateManagement;
    private hasMobX;
    private hasRecoil;
    private hasZustand;
    private hasVueStateManagement;
    private hasPinia;
    private hasAngularStateManagement;
    private hasNgrx;
    private hasNgxs;
    private hasAkita;
    private hasAngularRouter;
    private detectSSR;
    private detectFrameworkSpecificSSR;
    private detectReactSSR;
    private detectVueSSR;
    private detectNextSSR;
    private detectNuxtSSR;
    private detectAngularSSR;
    private detectGeneralSSR;
    private collectSSRSignals;
    private evaluateSSRSignals;
    private hasStyleComponents;
    private hasVueRouter;
    private hasVuex;
    private hasNuxt;
}
//# sourceMappingURL=framework.d.ts.map