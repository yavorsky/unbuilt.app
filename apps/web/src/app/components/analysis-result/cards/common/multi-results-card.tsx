import { FC, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Meta } from '@unbuilt/features';
import {
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  LucideProps,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnalyzeResult } from '@unbuilt/analyzer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ConfidenceIndicator } from '@/app/components/confidence-indicator';
import { capitalize } from 'lodash-es';
import { useActiveCategory } from '@/app/contexts/active-category';
import LoaderText from '@/app/components/loader-text';

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
        onClick={() => updateActiveCategory(name)}
      >
        <CardHeader className="space-y-1 py-4 pb-4">
          <div className="flex justify-between items-start">{label}</div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 space-y-4">
            <LoaderText supportedOptions={supportedOptions} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="max-w-md bg-gray-900/30 backdrop-blur-sm border-gray-800 hover:border-indigo-500 transition-all duration-300 min-h-40"
      onClick={() => updateActiveCategory(name)}
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
            {primaryLibraries.map((library) => {
              const resultMeta = meta?.[library.name];
              const ResultIcon = resultMeta?.Icon ?? Icon;

              return (
                <div
                  key={library.name}
                  className="flex justify-between items-center"
                >
                  <Badge>
                    <ResultIcon className="mr-2" />
                    <span className="text-gray-300 text-xl">
                      {resultMeta?.name ?? capitalize(library.name)}
                    </span>
                  </Badge>
                  <div className="flex items-center gap-2">
                    <ConfidenceIndicator confidence={library.confidence} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
