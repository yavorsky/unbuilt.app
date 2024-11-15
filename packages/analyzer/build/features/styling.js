var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class StylingFeaturesDetector {
    constructor(page, resources) {
        this.page = page;
        this.resources = resources;
    }
    detect() {
        return __awaiter(this, void 0, void 0, function* () {
            const stylingInfo = yield this.page.evaluate(() => {
                const getAllStyles = () => {
                    const styleSheets = Array.from(document.styleSheets);
                    const styles = new Set();
                    styleSheets.forEach((sheet) => {
                        try {
                            if (sheet.cssRules) {
                                Array.from(sheet.cssRules).forEach((rule) => {
                                    styles.add(rule.cssText);
                                });
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                    });
                    return Array.from(styles);
                };
                const styles = getAllStyles();
                const classes = Array.from(document.querySelectorAll('*')).flatMap((el) => Array.from(el.classList));
                const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
                return {
                    styles,
                    classes,
                    links: stylesheets.reduce((links, link) => {
                        const href = link.getAttribute('href');
                        if (href) {
                            return links.concat(href);
                        }
                        return links;
                    }, []),
                    styleElements: document.querySelectorAll('style').length,
                };
            });
            return {
                preprocessor: this.detectPreprocessor(stylingInfo.links),
                frameworks: {
                    tailwind: this.detectTailwind(stylingInfo.classes),
                    bootstrap: this.detectBootstrap(stylingInfo.classes),
                    mui: this.detectMUI(stylingInfo.classes),
                    styledComponents: this.detectStyledComponents(stylingInfo.classes),
                },
                features: {
                    hasModules: this.detectCSSModules(stylingInfo.links),
                    hasCssInJs: this.detectCSSInJS(stylingInfo.styles),
                    hasUtilityClasses: this.detectUtilityClasses(stylingInfo.classes),
                },
            };
        });
    }
    detectPreprocessor(links) {
        if (!links) {
            return null;
        }
        const patterns = {
            sass: /\.scss$|\.sass$/,
            less: /\.less$/,
            stylus: /\.styl$/,
        };
        for (const [name, pattern] of Object.entries(patterns)) {
            if (links.some((href) => href && pattern.test(href))) {
                return name;
            }
        }
        return null;
    }
    detectTailwind(classes) {
        const tailwindPatterns = [
            /^(bg|text|border|p|m|flex|grid|w|h)-/,
            /^(hover|focus|active|disabled):/,
            /^(sm|md|lg|xl)::/,
        ];
        return tailwindPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
    }
    detectBootstrap(classes) {
        const bootstrapPatterns = [
            /^(btn|col|row|container|nav|navbar|card|modal)/,
            /^(d-|p-|m-|bg-|text-)/,
        ];
        return bootstrapPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
    }
    detectMUI(classes) {
        return classes.some((cls) => cls.startsWith('Mui') || cls.startsWith('makeStyles-'));
    }
    detectStyledComponents(classes) {
        return classes.some((cls) => /^sc-[a-zA-Z0-9]{5,}/.test(cls));
    }
    detectCSSModules(links) {
        return links.some((href) => href && href.includes('.module.css'));
    }
    detectCSSInJS(styles) {
        return styles.some((style) => style.includes('emotion') || style.includes('styled-components') || /jsx-[0-9]+/.test(style));
    }
    detectUtilityClasses(classes) {
        const utilityPatterns = [/^(u|util)-/, /^(helper|h)-/, /^(_|--)/];
        return utilityPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
    }
}
//# sourceMappingURL=styling.js.map