import { Page } from 'playwright';
import { Resources } from '../resources.js';
interface MinifierResult {
    name: string;
    confidence: number;
    features?: {
        mangling: boolean;
        compression: boolean;
        deadCodeElimination: boolean;
        sourceMap: boolean;
    };
}
interface TranspilerResult {
    name: string;
    confidence: number;
    version?: string;
    features: {
        typescript: boolean;
        decorators: boolean;
        classProperties: boolean;
        asyncAwait: boolean;
        optionalChaining?: boolean;
        nullishCoalescing?: boolean;
        privateMembers?: boolean;
    };
    target?: {
        ecmaVersion: string;
        modules: 'esm' | 'commonjs' | 'amd' | 'umd';
    };
}
export interface BuildFeatures {
    bundler: {
        name: string;
        confidence: number;
    };
    transpiler: TranspilerResult;
    minifier: MinifierResult;
    optimization: {
        codeModularity: boolean;
        treeShaking: boolean;
        codeSplitting: boolean;
    };
}
export declare class BuildFeaturesDetector {
    private page;
    private resources;
    constructor(page: Page, resources: Resources);
    detect(): Promise<BuildFeatures>;
    private detectBundler;
    private detectTranspiler;
    private detectModuleSystem;
    private detectMinifier;
    private detectOptimizations;
}
export {};
//# sourceMappingURL=build.d.ts.map