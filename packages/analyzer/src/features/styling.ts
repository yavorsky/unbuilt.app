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

export class StylingFeaturesDetector {
  private page: Page;
  private resources: Resources;
  constructor(page: Page, resources: Resources) {
    this.page = page;
    this.resources = resources;
  }

  async detect(): Promise<StylingFeatures> {
    const stylingInfo = await this.page!.evaluate(() => {
      const getAllStyles = () => {
        const styleSheets = Array.from(document.styleSheets);
        const styles = new Set<string>();

        styleSheets.forEach((sheet) => {
          try {
            if (sheet.cssRules) {
              Array.from(sheet.cssRules).forEach((rule) => {
                styles.add(rule.cssText);
              });
            }
          } catch (e) {
            console.error(e);
          }
        });

        return Array.from(styles);
      };

      const styles = getAllStyles();
      const classes = Array.from(document.querySelectorAll('*')).flatMap((el) =>
        Array.from(el.classList)
      );

      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

      return {
        styles,
        classes,
        links: stylesheets.reduce<string[]>((links, link) => {
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
  }

  private detectPreprocessor(links: string[] | null): string | null {
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

  private detectTailwind(classes: string[]): boolean {
    const tailwindPatterns = [
      /^(bg|text|border|p|m|flex|grid|w|h)-/,
      /^(hover|focus|active|disabled):/,
      /^(sm|md|lg|xl)::/,
    ];

    return tailwindPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
  }

  private detectBootstrap(classes: string[]): boolean {
    const bootstrapPatterns = [
      /^(btn|col|row|container|nav|navbar|card|modal)/,
      /^(d-|p-|m-|bg-|text-)/,
    ];

    return bootstrapPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
  }

  private detectMUI(classes: string[]): boolean {
    return classes.some((cls) => cls.startsWith('Mui') || cls.startsWith('makeStyles-'));
  }

  private detectStyledComponents(classes: string[]): boolean {
    return classes.some((cls) => /^sc-[a-zA-Z0-9]{5,}/.test(cls));
  }

  private detectCSSModules(links: string[]): boolean {
    return links.some((href) => href && href.includes('.module.css'));
  }

  private detectCSSInJS(styles: string[]): boolean {
    return styles.some(
      (style) =>
        style.includes('emotion') || style.includes('styled-components') || /jsx-[0-9]+/.test(style)
    );
  }

  private detectUtilityClasses(classes: string[]): boolean {
    const utilityPatterns = [/^(u|util)-/, /^(helper|h)-/, /^(_|--)/];

    return utilityPatterns.some((pattern) => classes.some((cls) => pattern.test(cls)));
  }
}
