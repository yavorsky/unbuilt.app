import { useState, FC, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { ChevronDown, ChevronUp, LucideProps } from 'lucide-react';
import { ConfidenceIndicator } from '../../../confidence-indicator';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { Meta } from '@unbuilt/features';
import { capitalize } from 'lodash-es';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import LoaderText from '../../../loader-text';
import { getCategoryLabel } from '@/app/utils/get-category-label';
import { useActiveCategory } from '@/app/contexts/active-category';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';

export function SingleResultAnalysisCard<
  N extends keyof AnalyzeResult['analysis'],
  A extends AnalyzeResult['analysis'][N] | null,
>({
  name,
  analysis,
  supportedOptions,
  meta,
  Icon,
}: {
  name: N;
  analysis: A | undefined;
  supportedOptions: string[];
  Icon: FC<LucideProps>;
  // TODO: adding meta step by step
  meta?: Record<string, Meta | undefined>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = !analysis;
  const label = getCategoryLabel(name);
  const { activeAnalysis } = useActiveAnalysis();

  const { updateActiveCategory, activeCategory } = useActiveCategory();
  const activeState = activeCategory === name ? 'selected' : 'default';
  const className =
    'max-w-md bg-muted backdrop-blur-sm border-border hover:border-indigo-500/60 data-[state=selected]:border-indigo-500 data-[status=unknown]:opacity-60 transition-all duration-300 min-h-40';

  if (isLoading || !('name' in analysis)) {
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

  const resultMeta = meta?.[analysis.name];
  const ResultIcon = resultMeta?.Icon ?? Icon;

  const isUnknown = analysis.name === 'unknown';
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
                    <ResultIcon
                      width={18}
                      height={18}
                      className="h-6 w-6 text-indigo-400"
                    />
                  </Suspense>
                </div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`${isUnknown ? 'font-normal' : 'font-bold'} text-2xl tracking-tight text-foreground`}
                  >
                    {isUnknown
                      ? 'Unknown'
                      : (resultMeta?.name ?? capitalize(analysis.name))}
                  </h3>
                  {/* <Badge
                  variant="outline"
                  className="text-xs bg-slate-700 text-slate-200 border-0"
                >
                  v{version}
                </Badge> */}
                </div>
              </div>
            </div>
            <ConfidenceIndicator confidence={analysis.confidence} />
          </>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            {!isUnknown &&
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
                      .map(([name, match]) => {
                        const resultMeta = meta?.[name];

                        return (
                          <div
                            key={name}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-400">
                              {resultMeta?.name ?? capitalize(name)}
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
