import { Page } from "playwright";

interface ResourceTiming {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  initiatorType: string;
  nextHopProtocol: string;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  responseStatus?: number;
  extension?: string;
  isScript?: boolean;
  isStyle?: boolean;
  isFont?: boolean;
  isImage?: boolean;
  timing?: {
    dns: number;
    connection: number;
    ssl?: number;
    waiting: number;
    downloading: number;
  };
}


class ResourceTimingAnalyzer {
  constructor(private page: Page) {}

  async getResourceTimings(): Promise<ResourceTiming[]> {
    // Get Performance entries from the page
    const timings = await this.page.evaluate(() => {
      return JSON.parse(JSON.stringify(
        performance.getEntriesByType('resource')
      ));
    });

    // Get response status codes through Playwright
    const responses = new Map<string, number>();

    // Set up response listener
    this.page.on('response', response => {
      responses.set(response.url(), response.status());
    });

    // Process and enhance the timing data
    const enhancedTimings: ResourceTiming[] = timings.map((entry: any) => {
      const url = new URL(entry.name);
      const extension = url.pathname.split('.').pop()?.toLowerCase();

      return {
        name: entry.name,
        entryType: entry.entryType,
        startTime: entry.startTime,
        duration: entry.duration,
        initiatorType: entry.initiatorType,
        nextHopProtocol: entry.nextHopProtocol,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize,
        responseStatus: responses.get(entry.name),
        extension,

        // Determine resource type
        isScript: this.isScript(entry.name, extension),
        isStyle: this.isStyle(entry.name, extension),
        isFont: this.isFont(entry.name, extension),
        isImage: this.isImage(entry.name, extension),

        // Calculate detailed timing breakdown
        timing: this.calculateTimingBreakdown(entry)
      };
    });

    return this.addAdditionalMetrics(enhancedTimings);
  }

  private isScript(url: string, extension?: string): boolean {
    return extension === 'js' ||
           extension === 'mjs' ||
           extension === 'jsx' ||
           url.includes('script');
  }

  private isStyle(url: string, extension?: string): boolean {
    return extension === 'css' ||
           url.includes('style');
  }

  private isFont(url: string, extension?: string): boolean {
    const fontExtensions = ['woff', 'woff2', 'ttf', 'eot', 'otf'];
    return fontExtensions.includes(extension || '') ||
           url.includes('font');
  }

  private isImage(url: string, extension?: string): boolean {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    return imageExtensions.includes(extension || '') ||
           url.includes('image');
  }

  private calculateTimingBreakdown(entry: any) {
    return {
      // DNS lookup time
      dns: entry.domainLookupEnd - entry.domainLookupStart,

      // Initial connection time
      connection: entry.connectEnd - entry.connectStart,

      // SSL negotiation time (if applicable)
      ssl: entry.secureConnectionStart > 0
        ? entry.connectEnd - entry.secureConnectionStart
        : undefined,

      // Time to first byte (waiting)
      waiting: entry.responseStart - entry.requestStart,

      // Content download time
      downloading: entry.responseEnd - entry.responseStart
    };
  }

  private addAdditionalMetrics(timings: ResourceTiming[]): ResourceTiming[] {
    // Group resources by type
    const grouped = {
      scripts: timings.filter(t => t.isScript),
      styles: timings.filter(t => t.isStyle),
      fonts: timings.filter(t => t.isFont),
      images: timings.filter(t => t.isImage),
      other: timings.filter(t => !t.isScript && !t.isStyle && !t.isFont && !t.isImage)
    };

    // Add aggregate metrics
    const withMetrics = [...timings];

    // Add summary entry
    withMetrics.push({
      name: '_summary',
      entryType: 'summary',
      startTime: 0,
      duration: Math.max(...timings.map(t => t.startTime + t.duration)),
      initiatorType: 'summary',
      nextHopProtocol: '',
      transferSize: timings.reduce((sum, t) => sum + t.transferSize, 0),
      encodedBodySize: timings.reduce((sum, t) => sum + t.encodedBodySize, 0),
      decodedBodySize: timings.reduce((sum, t) => sum + t.decodedBodySize, 0),
      timing: {
        dns: Math.max(...timings.map(t => t.timing?.dns || 0)),
        connection: Math.max(...timings.map(t => t.timing?.connection || 0)),
        ssl: Math.max(...timings.map(t => t.timing?.ssl || 0)),
        waiting: Math.max(...timings.map(t => t.timing?.waiting || 0)),
        downloading: timings.reduce((sum, t) => sum + (t.timing?.downloading || 0), 0)
      }
    });

    // Add type summaries
    Object.entries(grouped).forEach(([type, resources]) => {
      if (resources.length > 0) {
        withMetrics.push({
          name: `_summary_${type}`,
          entryType: 'summary',
          startTime: Math.min(...resources.map(r => r.startTime)),
          duration: Math.max(...resources.map(r => r.startTime + r.duration)) -
                   Math.min(...resources.map(r => r.startTime)),
          initiatorType: type,
          nextHopProtocol: '',
          transferSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
          encodedBodySize: resources.reduce((sum, r) => sum + r.encodedBodySize, 0),
          decodedBodySize: resources.reduce((sum, r) => sum + r.decodedBodySize, 0),
          timing: {
            dns: Math.max(...resources.map(r => r.timing?.dns || 0)),
            connection: Math.max(...resources.map(r => r.timing?.connection || 0)),
            ssl: Math.max(...resources.map(r => r.timing?.ssl || 0)),
            waiting: Math.max(...resources.map(r => r.timing?.waiting || 0)),
            downloading: resources.reduce((sum, r) => sum + (r.timing?.downloading || 0), 0)
          }
        });
      }
    });

    return withMetrics;
  }

  async getResourceMetrics() {
    const timings = await this.getResourceTimings();

    return {
      // Overall metrics
      totalResources: timings.length,
      totalTransferSize: timings.reduce((sum, t) => sum + t.transferSize, 0),
      totalDuration: Math.max(...timings.map(t => t.startTime + t.duration)),

      // Resource type breakdown
      resourceTypes: {
        scripts: timings.filter(t => t.isScript).length,
        styles: timings.filter(t => t.isStyle).length,
        fonts: timings.filter(t => t.isFont).length,
        images: timings.filter(t => t.isImage).length,
        other: timings.filter(t => !t.isScript && !t.isStyle && !t.isFont && !t.isImage).length
      },

      // Performance metrics
      performance: {
        averageDNSTime: this.average(timings.map(t => t.timing?.dns || 0)),
        averageConnectionTime: this.average(timings.map(t => t.timing?.connection || 0)),
        averageWaitingTime: this.average(timings.map(t => t.timing?.waiting || 0)),
        averageDownloadTime: this.average(timings.map(t => t.timing?.downloading || 0))
      },

      // Size metrics
      sizeMetrics: {
        averageTransferSize: this.average(timings.map(t => t.transferSize)),
        averageEncodedSize: this.average(timings.map(t => t.encodedBodySize)),
        averageDecodedSize: this.average(timings.map(t => t.decodedBodySize)),
        compressionRatio: this.average(timings.map(t =>
          t.encodedBodySize ? t.decodedBodySize / t.encodedBodySize : 1
        ))
      },

      // Protocol metrics
      protocols: this.countProtocols(timings),

      // Resource status
      statusCodes: this.countStatusCodes(timings)
    };
  }

  private average(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private countProtocols(timings: ResourceTiming[]): Record<string, number> {
    return timings.reduce((acc, t) => {
      if (t.nextHopProtocol) {
        acc[t.nextHopProtocol] = (acc[t.nextHopProtocol] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }

  private countStatusCodes(timings: ResourceTiming[]): Record<string, number> {
    return timings.reduce((acc, t) => {
      if (t.responseStatus) {
        const category = Math.floor(t.responseStatus / 100) + 'xx';
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }
}

// Usage example:
async function analyzeResources(page: Page) {
  const analyzer = new ResourceTimingAnalyzer(page);

  // Get detailed timings for all resources
  const timings = await analyzer.getResourceTimings();

  // Get aggregated metrics
  const metrics = await analyzer.getResourceMetrics();

  return {
    timings,
    metrics
  };
}