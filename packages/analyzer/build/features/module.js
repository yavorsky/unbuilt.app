var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ModuleFeaturesDetector {
    constructor(page, resources) {
        this.page = page;
        this.resources = resources;
    }
    detect() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                type: this.detectModuleType(),
                hasDynamicImports: this.detectDynamicImports(),
                hasTreeShaking: this.detectTreeShaking(),
                hasCodeSplitting: yield this.detectCodeSplitting()
            };
        });
    }
    detectModuleType() {
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
    detectDynamicImports() {
        return Array.from(this.resources.getAllScripts()).some(script => script.includes('import(') ||
            script.includes('require.ensure'));
    }
    detectTreeShaking() {
        return Array.from(this.resources.getAllScripts()).some(script => script.includes('/*#__PURE__*/') ||
            script.includes('/*@__PURE__*/'));
    }
    detectCodeSplitting() {
        return __awaiter(this, void 0, void 0, function* () {
            const chunks = new Set();
            yield this.page.route('**/*.js', route => {
                chunks.add(route.request().url());
                route.continue();
            });
            // Trigger some navigation or interaction
            yield this.page.evaluate(() => {
                window.history.pushState({}, '', '/test-route');
            });
            return chunks.size > 1;
        });
    }
}
;
//# sourceMappingURL=module.js.map