import { FC, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import {
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  LucideProps,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ConfidenceIndicator } from '@/app/components/confidence-indicator';
import { capitalize } from 'lodash-es';

export function MultiResultAnalysisCard<
  N extends keyof AnalyzeResult['analysis'],
  A extends AnalyzeResult['analysis'][N] | null,
>({
  name,
  analysis,
  onCardSelect,
  Icon,
}: {
  name: N;
  analysis: A | undefined;
  supportedOptions: string[];
  Icon: FC<LucideProps>;
  onCardSelect: (label: AnalysisKeys) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = !analysis;

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
        .filter((lib) => lib.confidence >= 1)
        .sort((a, b) => b.confidence - a.confidence),
    [allLibraries]
  );
  const secondaryLibraries = useMemo(
    () => allLibraries.filter((lib) => lib.confidence < 1),
    [allLibraries]
  );

  const hasSecondaryResults = secondaryLibraries.length > 0;

  return (
    <Card
      className="bg-gray-900/30 backdrop-blur-sm border-gray-800 hover:border-indigo-500 transition-all duration-300 min-h-40"
      onClick={() => onCardSelect(name)}
    >
      <CardContent className="p-0">
        <div className="border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 ">
              {isLoading ? (
                <LoaderCircle className="h-6 w-6 text-indigo-400 animate-spin" />
              ) : (
                <Icon className="h-6 w-6 text-indigo-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100">
              {capitalize(name)}
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Primary Results */}
          <div className="space-y-3">
            {primaryLibraries.map((library) => (
              <div
                key={library.name}
                className="flex justify-between items-center"
              >
                <Badge>
                  <span className="text-gray-300 text-xl">{library.name}</span>
                </Badge>
                <div className="flex items-center gap-2">
                  <ConfidenceIndicator confidence={library.confidence} />
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Results (Collapsible) */}
          {hasSecondaryResults && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {secondaryLibraries.length} additional styling libraries
                detected
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 space-y-2 mt-2">
                {secondaryLibraries
                  .sort((a, b) => b.confidence - a.confidence)
                  .map((library) => (
                    <div
                      key={library.name}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-400">{library.name}</span>
                      <div className="flex items-center gap-2">
                        <ConfidenceIndicator confidence={library.confidence} />
                      </div>
                    </div>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
