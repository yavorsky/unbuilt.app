import { FC, useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Box, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { Badge } from '@/components/ui/badge';
import { AnalysisKeys, AnalyzeResult } from '@unbuilt/analyzer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export const BundlerCard: FC<{
  bundler: AnalyzeResult['analysis']['bundler'];
  onCardSelect: (label: AnalysisKeys) => void;
}> = ({ bundler, onCardSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasAlternatives = Object.keys(bundler.secondaryMatches).length > 0;

  return (
    <Card
      className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300"
      onClick={() => onCardSelect('bundler')}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Box className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Bundler</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Badge>
                <span className="text-gray-300 text-xl">{bundler.name}</span>
              </Badge>
              <div className="flex items-center gap-2">
                <ConfidenceIndicator confidence={bundler.confidence} />
              </div>
            </div>

            {hasAlternatives && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {Object.keys(bundler.secondaryMatches).length} alternative
                  bundlers
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-2">
                  {Object.entries(bundler.secondaryMatches)
                    .sort(([, a], [, b]) => b.confidence - a.confidence)
                    .map(([name, match]) => (
                      <div
                        key={name}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-400">{name}</span>
                        <div className="flex items-center gap-2">
                          <ConfidenceIndicator confidence={match.confidence} />
                        </div>
                      </div>
                    ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundlerCard;
