import { FC, Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Meta } from '@unbuilt/features';
import { LucideProps } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { ConfidenceIndicator } from '@/app/components/confidence-indicator';
import { capitalize } from 'lodash-es';
import { useActiveCategory } from '@/app/contexts/active-category';
import LoaderText from '@/app/components/loader-text';
import { Skeleton } from '@/components/ui/skeleton';

export function MultiResultAnalysisCard<
  N extends keyof AnalyzeResult['analysis'],
  A extends AnalyzeResult['analysis'][N] | null,
>({
  name,
  analysis,
  label,
  supportedOptions,
  meta,
  Icon,
}: {
  name: N;
  analysis: A | undefined;
  label: string;
  supportedOptions: string[];
  Icon: FC<LucideProps>;
  meta?: Record<string, Meta | undefined>;
}) {
  const isLoading = !analysis;

  const { updateActiveCategory } = useActiveCategory();

  // Separate libraries into primary and secondary based on confidence
  const allLibraries = useMemo(() => {
    return analysis && 'items' in analysis
      ? [
          ...Object.entries(analysis?.items).map(([name, data]) => ({
            name,
            confidence: data.confidence,
          })),
        ]
      : [];
  }, [analysis]);

  const primaryLibraries = useMemo(
    () =>
      allLibraries
        .filter((lib) => lib.confidence >= 0.4)
        .sort((a, b) => b.confidence - a.confidence),
    [allLibraries]
  );

  if (isLoading || !('items' in analysis)) {
    return (
      <Card
        className="max-w-md bg-gray-900/30 backdrop-blur-sm border-gray-800 hover:border-indigo-500 transition-all duration-300 min-h-40"
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
          <div className="flex items-center space-x-4 pt-2">
            <div className="space-y-3">
              <Skeleton className="h-8 w-[150px]" />
              <Skeleton className="h-8 w-[120px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!isLoading && (
            <div className="p-6 space-y-4">
              <LoaderText supportedOptions={supportedOptions} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const noLibrariesDetected = !primaryLibraries.length;

  return (
    <Card
      className={`max-w-md bg-gray-900/30 backdrop-blur-sm border-gray-800 hover:border-indigo-500 transition-all duration-300 min-h-40 ${noLibrariesDetected ? 'opacity-70' : ''}`}
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
            </div>
          </>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pt-0 pb-6">
          {/* Primary Results */}
          <div className="space-y-3">
            {!noLibrariesDetected ? (
              primaryLibraries.map((library) => {
                const resultMeta = meta?.[library.name];
                const ResultIcon = resultMeta?.Icon ?? Icon;

                return (
                  <div
                    key={library.name}
                    className="flex justify-between items-center"
                  >
                    <Badge variant="secondary">
                      <div className="w-5 flex justify-center items-center">
                        <Suspense>
                          <ResultIcon className="mr-2" />
                        </Suspense>
                      </div>
                      <span className="text-gray-300 text-xl">
                        {resultMeta?.name ?? capitalize(library.name)}
                      </span>
                    </Badge>
                    <div className="flex items-center gap-2">
                      <ConfidenceIndicator confidence={library.confidence} />
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="text-foreground/70 text-xl">
                No libraries detected
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
