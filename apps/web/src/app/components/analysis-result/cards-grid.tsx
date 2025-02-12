import { FC, Suspense, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { OnProgressResult } from '@unbuilt/analyzer';
import { FrameworkCard } from './cards/framework';
import { BundlerCard } from './cards/bundler';
import { TranspilerCard } from './cards/transpiler';
import { UILibraryCard } from './cards/ui-library';
import { MinifierCard } from './cards/minifier';
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

  return (
    <div className="max-w-7xl mx-auto pb-6">
      <div className="border-gray-900 flex items-center justify-center max-w-7xl mx-auto flex-col h-20">
        <div className="flex-1 flex items-start justify-start">
          <Breadcrumb>
            <BreadcrumbList>
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
          {formattedDate && (
            <>Tech stack results based on the analysis from {formattedDate}.</>
          )}
          {truncatedUrl && (
            <NewAnalysisDialog initialUrl={truncatedUrl} selectOnOpen />
          )}
        </span>
      </div>
      {status !== 'failed' ? (
        <Suspense>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 pt-10">
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <FrameworkCard framework={result?.analysis.framework} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <UILibraryCard uiLibrary={result?.analysis.uiLibrary} />
            </div>

            {/* All subsequent items */}
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <PlatformCard platform={result?.analysis.platform} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <BundlerCard bundler={result?.analysis.bundler} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <TranspilerCard transpiler={result?.analysis.transpiler} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <MinifierCard minifier={result?.analysis.minifier} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <RouterCard router={result?.analysis.router} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <HTTPClientCard httpClient={result?.analysis.httpClient} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <StateManagementCard
                stateManagement={result?.analysis.stateManagement}
              />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <DatesCard dates={result?.analysis.dates} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <TranslationsCard translations={result?.analysis.translations} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <StylingLibrariesCard
                stylingLibraries={result?.analysis.stylingLibraries}
              />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <StylingProcessorCard
                stylingProcessor={result?.analysis.stylingProcessor}
              />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
              <ModulesCard modules={result?.analysis.modules} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2">
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
