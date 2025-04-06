import { getCategoryLabel } from '@/app/utils';
import {
  datesMeta,
  routerMeta,
  bundlerMeta,
  modulesMeta,
  platformMeta,
  analyticsMeta,
  frameworkMeta,
  minifierMeta,
  uiLibraryMeta,
  httpClientMeta,
  transpilerMeta,
  translationsMeta,
  stateManagementMeta,
  stylingLibrariesMeta,
  stylingProcessorMeta,
  AnalysisKeys,
} from '@unbuilt/features';

const supportedCategories = {
  frameworkMeta,
  bundlerMeta,
  routerMeta,
  platformMeta,
  minifierMeta,
  transpilerMeta,
  modulesMeta,
  uiLibraryMeta,
  stateManagementMeta,
  datesMeta,
  httpClientMeta,
  translationsMeta,
  stylingLibrariesMeta,
  stylingProcessorMeta,
  analyticsMeta,
};

// This is a Server Component
export default function AboutPage() {
  return (
    <div className="pt-24 container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        Unbuilt: Web Technology Detection Made Simple
      </h1>

      <div className="mb-12 text-lg">
        <p className="mb-4">
          <b>Unbuilt.app</b> is a free, open-source tool that reveals the
          technology stack behind any website in seconds.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Mission</h2>
      <p className="mb-10">
        Born as a side project in 2024, Unbuilt began as a fast way to identify
        specific technologies on web applications. It was decided to
        open-sourced it to provide developers with an easy way to discover tech
        stacks, contribute patterns, and track technology adoption trends across
        the web.
      </p>

      <h2 className="text-2xl font-bold mb-4">Key Features</h2>

      <div className="grid gap-8 mb-12">
        <div>
          <h3 className="text-xl font-bold mb-2">Lightning-Fast Analysis</h3>
          <p>
            Unbuilt delivers results in under 10 seconds through our optimized
            server architecture and queue system. We use Playwright to visit
            websites and analyze them based on available resources, with
            parallel processing for efficiency.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Community-Driven Patterns</h3>
          <p>
            We believe in collaborative improvement. Rather than submitting
            error reports, we encourage developers to contribute pattern updates
            directly. With the help of AI, we&apos;re continuously expanding our
            detection capabilities across the spectrum of web technologies.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Intelligent Caching</h3>
          <p>
            Our dual-layer caching system provides immediate results for
            previously analyzed sites and allows for easy sharing of analysis
            reports. This includes short-term caching for ongoing processes and
            long-term storage for completed analyses.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Pattern-Based Detection</h3>
          <p>
            Unlike some tools that rely on outdated databases or manual entries,
            Unbuilt uses only evidence-based detection through open-source
            patterns. Our results are derived from actual code analysis, not
            rumors or outdated information.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Growing Ecosystem</h2>
      <p className="mb-8">
        Currently available as both a web app and CLI tool, we&apos;re expanding
        to browser extensions to analyze pages behind authentication. Our
        cross-platform pattern system means we can easily scale to more
        applications that can access web sources in different environments.
      </p>

      <h2 className="text-2xl font-bold mb-4">Technology Insights</h2>
      <p className="mb-8">
        By aggregating anonymized analysis results (excluding those processed
        locally via CLI), we provide valuable insights into technology adoption
        trends across the web. This helps developers make informed decisions
        about which technologies to learn or adopt in their projects.
      </p>

      <h1 className="mb-2 pt-8 border-t text-2xl font-bold">Unbuilt pieces</h1>
      <p className="mb-10">
        Unbuilt detects a comprehensive range of web technologies across
        multiple categories. We are activelly working on extending the list of
        supported technologies. Feel free to open issue or submit a PR to{' '}
        <a
          href="https://github.com/yavorsky/unbuilt.app"
          target="_blank"
          className="underline"
          rel="noopener noreferrer"
        >
          our repo
        </a>{' '}
        for new technologies.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-6">
        {Object.entries(supportedCategories).map(([key, value]) => {
          const category = value.meta;

          return (
            <div key={key} className="pb-6 pr-2">
              <h3 className="pb-4 font-bold">
                {getCategoryLabel(key.replace('Meta', '') as AnalysisKeys)}
              </h3>
              {Object.values(category)
                .map((meta) => {
                  return meta.name;
                })
                .join(', ')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
