var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PerformanceFeaturesDetector {
    constructor(page, resources) {
        this.page = page;
        this.resources = resources;
    }
    detect() {
        return __awaiter(this, void 0, void 0, function* () {
            const performanceMetrics = yield this.page.evaluate(() => {
                const resources = performance.getEntriesByType('resource');
                return {
                    resourceCount: resources.length,
                    // TODO: Use PerformanceObserver
                    // eslint-disable-next-line
                    totalSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
                    scriptMetrics: {
                        async: document.querySelectorAll('script[async]').length,
                        defer: document.querySelectorAll('script[defer]').length,
                        modules: document.querySelectorAll('script[type="module"]').length,
                    },
                    imageMetrics: {
                        lazyLoaded: document.querySelectorAll('img[loading="lazy"]').length,
                        total: document.querySelectorAll('img').length,
                    },
                };
            });
            return performanceMetrics;
        });
    }
}
//# sourceMappingURL=performance.js.map