var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Resources {
    constructor(page) {
        this.resourcesMap = new Map();
        this.scriptsMap = new Map();
        this.page = page;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.route('**/*', (route) => __awaiter(this, void 0, void 0, function* () {
                const request = route.request();
                const resourceType = request.resourceType();
                let content = null;
                // Intercept JS content
                if (resourceType === 'script') {
                    const response = yield route.fetch();
                    content = yield response.text();
                }
                this.set({ url: request.url(), size: 0, timing: Date.now(), type: resourceType }, content);
                yield route.continue();
            }));
            // Setup response handling
            this.page.on('response', (response) => __awaiter(this, void 0, void 0, function* () {
                const request = response.request();
                const url = request.url();
                if (this.has(url)) {
                    const resource = this.get(url);
                    if (!resource) {
                        return;
                    }
                    if (resource.size > 0 && resource.status) {
                        this.set(Object.assign(Object.assign({}, resource), { size: (yield response.body()).length, status: response.status(), timing: Date.now() - resource.timing }));
                    }
                }
            }));
        });
    }
    set(resource, content) {
        var _a, _b, _c;
        this.resourcesMap.set(resource.url, {
            type: resource.type,
            url: resource.url,
            size: (_a = resource.size) !== null && _a !== void 0 ? _a : 0,
            status: (_b = resource.status) !== null && _b !== void 0 ? _b : 0,
            timing: (_c = resource.timing) !== null && _c !== void 0 ? _c : Date.now(),
        });
        if (content) {
            this.scriptsMap.set(resource.url, content);
        }
    }
    has(url) {
        return this.resourcesMap.has(url);
    }
    get(url) {
        return this.resourcesMap.get(url);
    }
    getAll() {
        return this.resourcesMap.values();
    }
    getScript(url) {
        return this.scriptsMap.get(url);
    }
    hasScript(url) {
        return this.scriptsMap.has(url);
    }
    getAllScripts() {
        return this.scriptsMap.values();
    }
    getAllScriptsNames() {
        return this.scriptsMap.keys();
    }
    getAllScriptsContent() {
        return Array.from(this.getAllScripts()).join('\n');
    }
    analyze() {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = Array.from(this.resourcesMap.values());
            const jsResources = resources.filter((r) => r.type === 'script');
            const cssResources = resources.filter((r) => r.type === 'stylesheet');
            const imageResources = resources.filter((r) => r.type === 'image');
            const fontResources = resources.filter((r) => r.type === 'font');
            return {
                js: {
                    count: jsResources.length,
                    size: jsResources.reduce((sum, r) => sum + r.size, 0),
                    external: jsResources.filter((r) => !r.url.includes(this.page.url())).length,
                    inline: yield this.countInlineScripts(),
                },
                css: {
                    count: cssResources.length,
                    size: cssResources.reduce((sum, r) => sum + r.size, 0),
                    external: cssResources.filter((r) => !r.url.includes(this.page.url())).length,
                    inline: yield this.countInlineStyles(),
                },
                images: {
                    count: imageResources.length,
                    size: imageResources.reduce((sum, r) => sum + r.size, 0),
                    optimized: yield this.countOptimizedImages(),
                },
                fonts: {
                    count: fontResources.length,
                    size: fontResources.reduce((sum, r) => sum + r.size, 0),
                    preloaded: yield this.countPreloadedFonts(),
                },
            };
        });
    }
    calculateConfidence(patterns) {
        let matches = 0;
        const scriptsArr = Array.from(this.scriptsMap.keys());
        for (const pattern of patterns) {
            for (const script of scriptsArr) {
                if (script.includes(pattern)) {
                    matches++;
                    break;
                }
            }
        }
        return matches / patterns.length;
    }
    countInlineScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => document.querySelectorAll('script:not([src])').length);
        });
    }
    countInlineStyles() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => document.querySelectorAll('style').length);
        });
    }
    countOptimizedImages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => document.querySelectorAll('img[srcset], img[loading="lazy"], picture source').length);
        });
    }
    countPreloadedFonts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.evaluate(() => document.querySelectorAll('link[rel="preload"][as="font"]').length);
        });
    }
}
//# sourceMappingURL=resources.js.map