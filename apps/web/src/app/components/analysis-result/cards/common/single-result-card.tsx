import { useState, FC } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import {
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  LucideProps,
} from 'lucide-react';
import { ConfidenceIndicator } from '../../../confidence-indicator';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import { capitalize } from 'lodash-es';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import LoaderText from '../../../loader-text';

export function SingleResultAnalysisCard<
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
      className="max-w-md bg-gray-900/30 backdrop-blur-sm border-gray-800 hover:border-indigo-500 transition-all duration-300 min-h-40"
      onClick={() => onCardSelect(name)}
    >
      <CardHeader className="space-y-1 py-4 pb-4">
        <div className="flex justify-between items-start">
          {analysis && 'name' in analysis ? (
            <>
              <div>
                <p className="text-sm text-slate-400">{capitalize(name)}</p>
                <div className="flex items-center gap-3 mt-1">
                  {isLoading ? (
                    <LoaderCircle className="h-6 w-6 text-indigo-400 animate-spin" />
                  ) : (
                    <Icon className="h-6 w-6 text-indigo-400" />
                  )}
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {capitalize(analysis.name)}
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
              {/* <Badge
                variant="outline"
                className={`${confidence.color} text-white border-0`}
              >
                {confidence.level} confidence
              </Badge> */}
            </>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* <div className="border-b border-gray-800">
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
        </div> */}

        <div className="p-6 space-y-4">
          {analysis && 'name' in analysis ? (
            <div className="space-y-2">
              {/* <div className="flex justify-between items-center">
                <span className="text-gray-300 text-xl">{analysis.name}</span>
                <div className="flex items-center gap-2">
                  <ConfidenceIndicator confidence={analysis.confidence} />
                </div>
              </div> */}

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
