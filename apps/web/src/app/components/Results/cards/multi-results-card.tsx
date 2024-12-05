import { useState, FC } from 'react';
import { Card, CardContent } from '@/components/ui';
import {
  Box,
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  LucideProps,
} from 'lucide-react';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { capitalize } from 'lodash-es';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import LoaderText from '../../loader-text';

export function AnalysisCard<
  N extends keyof AnalyzeResult['analysis'],
  A extends AnalyzeResult['analysis'][N] | null,
>({
  name,
  analysis,
  supportedOptions,
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

  return (
    <Card
      className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300 min-w-36"
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
          {analysis && 'name' in analysis ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-xl">{analysis.name}</span>
                <div className="flex items-center gap-2">
                  <ConfidenceIndicator confidence={analysis.confidence} />
                </div>
              </div>

              {'secondaryMatches' in analysis &&
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
                        .map(([name, match]) => (
                          <div
                            key={name}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-400">{name}</span>
                            <div className="flex items-center gap-2">
                              <ConfidenceIndicator
                                confidence={match.confidence}
                              />
                            </div>
                          </div>
                        ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
            </div>
          ) : (
            <LoaderText supportedOptions={supportedOptions} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
