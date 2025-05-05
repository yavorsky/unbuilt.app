import { FC, Suspense, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { OnProgressResult } from '@unbuilt/analyzer';
import { FrameworkCard } from './cards/framework';
import { BundlerCard } from './cards/bundler';
import { TranspilerCard } from './cards/transpiler';
import { UILibraryCard } from './cards/ui-library';
import { ModulesCard } from './cards/modules';
import { StylingLibrariesCard } from './cards/styling-libraries';
import { StylingProcessorCard } from './cards/styling-processor';
import { URLBreadcrumb } from './url-breadcrumb';
import { HTTPClientCard } from './cards/http-client';
import { StateManagementCard } from './cards/state-management';
import { DatesCard } from './cards/dates';
import { RouterCard } from './cards/router';
import { useDateFormat } from '@/hooks/use-date-format';
import { useTheme } from 'next-themes';
import { ErrorState } from '../error-state';
import { useTruncatedUrl } from '@/hooks/use-truncated-url';
import { PlatformCard } from './cards/platform';
import { TranslationsCard } from './cards/translations';
import { NewAnalysisDialog } from '../new-analysis-dialog';
import { StatsCard } from './cards/stats';
import { ComingSoonCard } from './cards/coming-soon';
import { AnalyticsCard } from './cards/analytics';
import { MonitoringCard } from './cards/monitoring';

const isUnknown = (name: string | undefined) => name === 'unknown';

export const CardsGrid: FC<{
  result: OnProgressResult | null;
  status: string | null;
  progress: number | null;
  error?: string | null;
  isLoading: boolean;
}> = ({ result, status, error, isLoading }) => {
  const truncatedUrl = useTruncatedUrl(result?.url);

  const actionLabel = useMemo(() => {
    // Loading Result
    if (!result) {
      return '';
    }
    // Unbuilding or initializing
    if (isLoading || status === 'delayed') {
      return 'Unbuilding';
    }
    if (status === 'failed') {
      return 'Failed to unbuild';
    }
    // Result is loaded
    return 'Unbuilt';
  }, [result, status, isLoading]);

  useEffect(() => {
    document.title = `${actionLabel} ${truncatedUrl}`;
  }, [truncatedUrl, actionLabel]);

  const formattedDate = useDateFormat(result?.timestamp);
  const { theme } = useTheme();

  // Determine the order of cards to render
  const cardOrder = useMemo(() => {
    // Define the cards and their values
    const cards = [
      {
        id: 'framework',
        isUnknown: isUnknown(result?.analysis.framework?.name),
        el: <FrameworkCard framework={result?.analysis.framework} />,
      },
      {
        id: 'uiLibrary',
        isUnknown: isUnknown(result?.analysis.uiLibrary?.name),
        el: <UILibraryCard uiLibrary={result?.analysis.uiLibrary} />,
      },
      {
        id: 'platform',
        isUnknown: isUnknown(result?.analysis.platform?.name),
        el: <PlatformCard platform={result?.analysis.platform} />,
      },
      {
        id: 'bundler',
        isUnknown: isUnknown(result?.analysis.bundler?.name),
        el: <BundlerCard bundler={result?.analysis.bundler} />,
      },
      {
        id: 'transpiler',
        isUnknown: isUnknown(result?.analysis.transpiler?.name),
        el: <TranspilerCard transpiler={result?.analysis.transpiler} />,
      },
      {
        id: 'router',
        isUnknown: isUnknown(result?.analysis.router?.name),
        el: <RouterCard router={result?.analysis.router} />,
      },
      {
        id: 'httpClient',
        isUnknown: isUnknown(result?.analysis.httpClient?.name),
        el: <HTTPClientCard httpClient={result?.analysis.httpClient} />,
      },
      {
        id: 'stateManagement',
        isUnknown: isUnknown(result?.analysis.stateManagement?.name),
        el: (
          <StateManagementCard
            stateManagement={result?.analysis.stateManagement}
          />
        ),
      },
      {
        id: 'dates',
        isUnknown: isUnknown(result?.analysis.dates?.name),
        el: <DatesCard dates={result?.analysis.dates} />,
      },
      {
        id: 'translations',
        isUnknown: isUnknown(result?.analysis.translations?.name),
        el: <TranslationsCard translations={result?.analysis.translations} />,
      },
      {
        id: 'analytics',
        isUnknown: isUnknown(result?.analysis.analytics?.name),
        el: <AnalyticsCard analytics={result?.analysis.analytics} />,
      },
      {
        id: 'monitoring',
        isUnknown: isUnknown(result?.analysis.monitoring?.name),
        el: <MonitoringCard monitoring={result?.analysis.monitoring} />,
      },
      {
        id: 'stylingLibraries',
        isUnknown:
          Object.values(result?.analysis.stylingLibraries ?? {}).length === 0,
        el: (
          <StylingLibrariesCard
            stylingLibraries={result?.analysis.stylingLibraries}
          />
        ),
      },
      {
        id: 'stylingProcessor',
        isUnknown: isUnknown(result?.analysis.stylingProcessor?.name),
        el: (
          <StylingProcessorCard
            stylingProcessor={result?.analysis.stylingProcessor}
          />
        ),
      },
      {
        id: 'modules',
        isUnknown: isUnknown(result?.analysis.modules?.name),
        el: <ModulesCard modules={result?.analysis.modules} />,
      },
    ];

    // Sort the cards - move only "unknown" values to the end
    return cards.sort((a, b) => {
      // Only sort if one is "unknown" and one is not
      if (a.isUnknown && !b.isUnknown) return 1;
      if (!a.isUnknown && b.isUnknown) return -1;
      return 0;
    });
  }, [result?.analysis]);

  return (
    <div className="max-w-7xl mx-auto pb-6">
      <div className="border-gray-900 flex items-center justify-center max-w-7xl mx-auto flex-col h-20">
        <div className="flex-1 flex items-start justify-start max-w-full overflow-x-scroll">
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
              <h3 className="text-foreground text-3xl">{actionLabel}</h3>
              {truncatedUrl ? (
                <URLBreadcrumb
                  skipBackground={theme === 'light'}
                  variant="large"
                  url={truncatedUrl}
                />
              ) : (
                <Loader2 className="h-5 w-5 mx-16 animate-spin text-white" />
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <span className="text-foreground/50 mt-4 h-6">
          {formattedDate && <>Analysis from {formattedDate}.</>}
          {truncatedUrl && (
            <NewAnalysisDialog initialUrl={truncatedUrl} selectOnOpen />
          )}
        </span>
      </div>
      {status !== 'failed' ? (
        <Suspense>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 pt-10">
            {/* Render cards in the determined order */}
            {cardOrder.map((card) => {
              return (
                <div
                  key={card.id}
                  className="col-span-1 sm:col-span-1 lg:col-span-2"
                >
                  {card.el}
                </div>
              );
            })}

            {/* Fixed position cards */}
            {/* Coming Soon Card - Centered in large screens */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:col-start-3">
              <ComingSoonCard isLoading={isLoading || status === 'delayed'} />
            </div>
            <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-6">
              <StatsCard stats={result?.analysis.stats} />
            </div>
          </div>
        </Suspense>
      ) : (
        <ErrorState error={error} className="mt-32" />
      )}
    </div>
  );
};
