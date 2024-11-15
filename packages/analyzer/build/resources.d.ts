import { Page } from 'playwright';
export interface ResourceAnalysis {
    js: {
        count: number;
        size: number;
        external: number;
        inline: number;
    };
    css: {
        count: number;
        size: number;
        external: number;
        inline: number;
    };
    images: {
        count: number;
        size: number;
        optimized: number;
    };
    fonts: {
        count: number;
        size: number;
        preloaded: number;
    };
}
export type ResourceType = 'document' | 'stylesheet' | 'image' | 'media' | 'font' | 'script' | 'texttrack' | 'xhr' | 'fetch' | 'eventsource' | 'websocket' | 'manifest' | 'other';
export type Resource = {
    type: ResourceType;
    size: number;
    url: string;
    timing: number;
    status?: number;
};
export declare class Resources {
    private page;
    private resourcesMap;
    private scriptsMap;
    constructor(page: Page);
    initialize(): Promise<void>;
    set(resource: Resource, content?: string | null): void;
    has(url: string): boolean;
    get(url: string): Resource | undefined;
    getAll(): MapIterator<Resource>;
    getScript(url: string): string | undefined;
    hasScript(url: string): boolean;
    getAllScripts(): MapIterator<string>;
    getAllScriptsNames(): MapIterator<string>;
    getAllScriptsContent(): string;
    analyze(): Promise<ResourceAnalysis>;
    calculateConfidence(patterns: string[]): number;
    private countInlineScripts;
    private countInlineStyles;
    private countOptimizedImages;
    private countPreloadedFonts;
}
//# sourceMappingURL=resources.d.ts.map