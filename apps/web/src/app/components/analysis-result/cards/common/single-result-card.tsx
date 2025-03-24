import { useState, FC, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { ChevronDown, ChevronUp, LucideProps } from 'lucide-react';
import { ConfidenceIndicator } from '../../../confidence-indicator';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalysisTechnologies, AnalyzeResult } from '@unbuilt/analyzer';
import { capitalize } from 'lodash-es';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import LoaderText from '../../../loader-text';
import { getCategoryLabel } from '@/app/utils/get-category-label';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';
import {
  getTechnologyMeta,
  getTechnologyMetaForType,
  TechnologyMetaResults,
} from '@/app/utils/get-technology-meta';
import { getResultsName } from '@/app/utils';
import { Badge } from '@/components/ui/badge';
import { useStartNewAnalysis } from '@/app/hooks/use-start-new-analysis';
import { DetectedLabel } from './detected-label';
import { NotDetectedLabel } from './not-detected-label';

export function SingleResultAnalysisCard<
  N extends AnalysisTechnologies,
  A extends AnalyzeResult['analysis'][N] | null,
  M extends TechnologyMetaResults<N>,
>({
  name,
  analysis,
  Icon,
  withSecondaryMatches = true,
}: {
  name: N;
  analysis: A | undefined;
  Icon: FC<LucideProps>;
  withSecondaryMatches?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const label = getCategoryLabel(name);
  const { activeAnalysis } = useActiveAnalysis();

  const isCompleted = activeAnalysis?.status === 'completed';
  const isLoading = !analysis;
  const { startNewAnalysis } = useStartNewAnalysis();

  const { updateActiveCategory, activeCategory } = useActiveCategory();
  const supportedOptions = useMemo(
    () => getResultsName(getTechnologyMeta(name)),
    [name]
  );
  const activeState = activeCategory === name ? 'selected' : 'default';
  const className =
    'max-w-md bg-muted backdrop-blur-sm border-border hover:border-indigo-500/60 data-[state=selected]:border-indigo-500 data-[status=unknown]:opacity-60 transition-all duration-300 min-h-40';

  const categoryAddedAfterAnalysis = isCompleted && analysis?.name === null;

  if (categoryAddedAfterAnalysis) {
    return (
      <Card className={className}>
        <CardHeader className="py-4 pb-4">
          <p className="text-sm text-slate-400">{label}</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-5 flex justify-center items-center">
              <Icon width={18} height={18} className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-normal text-2xl tracking-tight text-foreground">
                Not Processed
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-foreground/50">
                This category was added after the current analysis. <br />
                <a
                  className="bold underline cursor-pointer hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    startNewAnalysis(activeAnalysis?.url);
                  }}
                >
                  Start new analysis
                </a>{' '}
                to get fresh results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLoadingOrUnknown = isLoading || !('name' in analysis);
  if (isLoadingOrUnknown) {
    return (
      <Card
        className={className}
        data-state={activeState}
        onClick={(evt) => {
          evt.stopPropagation();
          updateActiveCategory(name);
        }}
      >
        <CardHeader className="py-4 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 pt-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-[150px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeAnalysis?.status === 'active' && (
            <div className="p-6 space-y-4">
              <LoaderText supportedOptions={supportedOptions} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const resultMeta = getTechnologyMetaForType(name, analysis.name as M);
  const ResultIcon = resultMeta?.Icon ?? Icon;

  const isUnknown = analysis.name === 'unknown' || analysis.name === null;
  const discoveredStatus = isUnknown ? 'unknown' : 'discovered';

  return (
    <Card
      className={className}
      data-state={activeState}
      data-status={discoveredStatus}
      onClick={(evt) => {
        evt.stopPropagation();
        updateActiveCategory(name);
      }}
    >
      <CardHeader className="space-y-1 py-4 pb-4">
        <div className="flex justify-between items-start">
          <>
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-5 flex justify-center items-center">
                  <Suspense>
                    <ResultIcon width={18} height={18} className="h-6 w-6" />
                  </Suspense>
                </div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`${isUnknown ? 'font-normal' : 'font-bold'} text-2xl tracking-tight text-foreground`}
                  >
                    {isUnknown ? (
                      <NotDetectedLabel />
                    ) : (
                      <DetectedLabel
                        label={resultMeta?.name ?? capitalize(analysis.name)}
                        resultName={analysis.name}
                        category={name}
                      />
                    )}
                  </h3>
                </div>
              </div>
            </div>
            <ConfidenceIndicator confidence={analysis.confidence} />
          </>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 py-0 space-y-4">
          {Array.from(analysis.detectedFeatures).map((feature) => {
            if (!resultMeta?.featuresToDisplay?.[feature]) {
              return null;
            }
            const label =
              typeof resultMeta?.featuresToDisplay[feature] === 'string'
                ? resultMeta?.featuresToDisplay[feature]
                : feature;
            return (
              <Badge key={feature} variant="outline" className="text-xs">
                <div className="flex items-center gap-2">{label}</div>
              </Badge>
            );
          })}
          <div className="space-y-3 pb-4">
            {resultMeta?.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-slate-700 text-slate-200 border-0"
              >
                {tag}
              </Badge>
            ))}
            {!isUnknown &&
              withSecondaryMatches &&
              'secondaryMatches' in analysis &&
              Object.keys(analysis.secondaryMatches).length > 0 && (
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                    {Object.keys(analysis.secondaryMatches).length} secondary
                    matches{' '}
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-1 mt-2">
                    {Object.entries(analysis.secondaryMatches)
                      .sort(([, a], [, b]) => b.confidence - a.confidence)
                      .map(([secondaryName, match]) => {
                        const secondaryMeta = getTechnologyMetaForType(
                          name as N,
                          secondaryName as M
                        );

                        return (
                          <div
                            key={secondaryName}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-400">
                              {secondaryMeta?.name ?? capitalize(secondaryName)}
                            </span>
                            <div className="flex items-center gap-2">
                              <ConfidenceIndicator
                                confidence={match.confidence}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </CollapsibleContent>
                </Collapsible>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
