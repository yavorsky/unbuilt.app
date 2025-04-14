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
  errorTrackingMeta,
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
  errorTrackingMeta,
};

// This is a Server Component
export default function AboutPage() {
  return (
    <div className="pt-24 container mx-auto px-4 max-w-4xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r rounded-xl mt-4 mb-12 shadow-sm">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Unbuilt: Web Technology Detection Made Simple
        </h1>

        <div className="text-xl">
          <p className="mb-4 leading-relaxed">
            <b>Unbuilt.app</b> is a free, open-source tool that reveals the
            technology stack behind any website in seconds with primary focus on
            modern tools.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">Mission</h2>
        <p className="text-lg leading-relaxed">
          Born as a <a href="https://yavorsky.org">personal</a> side project in
          2024, Unbuilt began as a fast way to identify specific technologies on
          web applications. It was decided to open-source it to provide
          developers with an easy way to discover tech stacks, contribute
          patterns, and track technology adoption trends across the web.
        </p>
      </div>

      {/* Why Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">Why Unbuilt?</h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              Real-Time Code Analysis
            </h3>
            <p>
              Unlike some tools that rely on outdated databases or manual
              entries, Unbuilt uses only evidence-based detection through
              open-source patterns. Our results are derived from actual code
              analysis, not rumors or outdated information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              Completely Free
            </h3>
            <p>
              No premium plans, usage limits, or restricted features that plague
              other tools.
            </p>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              Lightning Fast
            </h3>
            <p>
              Analysis takes just seconds instead of minutes with competing
              solutions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              100% Open Source
            </h3>
            <p>
              We believe in collaborative improvement. Rather than submitting
              error reports, we encourage developers to contribute pattern
              updates directly. With the help of AI, we&apos;re continuously
              expanding our detection capabilities across the spectrum of web
              technologies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              Modern Tech Focus
            </h3>
            <p>
              Specialized in detecting cutting-edge frameworks, focususing on
              supporting relevant technologies, including even tools which are
              in beta.
            </p>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              Score-Based Results
            </h3>
            <p>
              We report not only technologies, but also confidence. Each pattern
              has various scores, so we are able to provide more accurate
              results.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-secondary/50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3 text-primary">
              Intelligent Caching
            </h3>
            <p>
              Our dual-layer caching system provides immediate results for
              previously analyzed sites and allows for easy sharing of analysis
              reports. This includes short-term caching for ongoing processes
              and long-term storage for completed analyses.
            </p>
          </div>
        </div>
      </div>

      {/* Growing Ecosystem Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">
          Growing Ecosystem
        </h2>
        <p className="text-lg leading-relaxed mb-8">
          Currently available as both a [web app](https://unbuilt.app) and [CLI
          tool](https://github.com/yavorsky/unbuilt.app/tree/main/apps/cli/README.md),
          we&apos;re expanding to browser extensions to analyze pages behind
          authentication. Our cross-platform pattern system means we can easily
          scale to more applications that can access web sources in different
          environments.
        </p>
      </div>

      {/* How We Compare Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">
          How We Compare
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary/50">
                <th className="border border-gray-300 dark:border-gray-700 p-4 text-left">
                  Feature
                </th>
                <th className="border border-gray-300 dark:border-gray-700 p-4 text-left">
                  Unbuilt
                </th>
                <th className="border border-gray-300 dark:border-gray-700 p-4 text-left">
                  Other Alternatives
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                  Detection Method
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Live code analysis of actual running website
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Pre-defined signatures based on patterns
                </td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                  Data Relevance
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Fresh analysis can be triggered any time
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Often rely on pre-saved data or hardcoded values from user
                  reports
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                  Price
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Completely free, no usage limits
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Often freemium with paid tiers for advanced features
                </td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                  Technologies Relevance
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Specialized in detecting cutting-edge frameworks
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Varies, often slower to detect newest technologies
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-4 font-semibold">
                  Analysis Speed
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Results typically in under 10 seconds
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-4">
                  Fresh analysis takes minutes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Unbuilt Pieces Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 border-b pb-2">
          Unbuilt pieces
        </h2>
        <p className="text-lg leading-relaxed mb-8">
          Unbuilt detects a comprehensive range of web technologies across
          multiple categories. We are activelly working on extending the list of
          supported technologies. Feel free to open issue or submit a PR to{' '}
          <a
            href="https://github.com/yavorsky/unbuilt.app"
            target="_blank"
            className="text-primary hover:underline"
            rel="noopener noreferrer"
          >
            our repo
          </a>{' '}
          for new technologies.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
          {Object.entries(supportedCategories).map(
            ([categoryMetaName, value]) => {
              const category = value.meta;
              const cateogryName = categoryMetaName.replace(
                'Meta',
                ''
              ) as AnalysisKeys;

              return (
                <div key={categoryMetaName} className="pb-4">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    {getCategoryLabel(cateogryName)}
                  </h3>
                  <div className="flex flex-wrap leading-7">
                    {Object.entries(category).map(
                      ([name, meta], i, allCategories) => {
                        const isLast = i === allCategories.length - 1;
                        return (
                          <span key={name}>
                            <a
                              href={`/technologies/${cateogryName}/${name}`}
                              target="_blank"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              rel="noopener noreferrer"
                            >
                              {meta.name}
                            </a>
                            {isLast ? null : (
                              <span className="text-gray-400 mr-1">,</span>
                            )}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
        {/* Growing Ecosystem Section */}
        <div className="mb-16 mt-12">
          <h3 className="text-xl font-bold mb-4 text-primary">
            More categories and patterns are coming!
          </h3>
          <p className="text-lg leading-relaxed mb-8">
            This project is new and we actively working on adding new
            categories:{' '}
            <b>
              Error Monitoring, Auth, Data Visualization, Forms, Tables,
              Virtualization, Logging and General Utility libraries and more
            </b>
            .{' '}
            <a
              href="https://x.com/yavorsky_"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Stay tuned!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
