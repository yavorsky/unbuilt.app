import { FC, useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Box, ChevronDown, ChevronUp } from 'lucide-react';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AnalyzeResult } from '@unbuilt/analyzer';

export const ModulesCard: FC<{
  modules: AnalyzeResult['analysis']['modules'];
}> = ({ modules }) => {
  const [isOpen, setIsOpen] = useState(false);
  const alternativeModules = Object.entries(modules.moduleSystems)
    .filter(([name]) => name !== modules.name)
    .sort(([, a], [, b]) => b.confidence - a.confidence);

  const hasAlternatives = alternativeModules.length > 0;

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Box className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Module System</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge>
                  <span className="text-gray-300 text-xl">
                    {modules.name.toUpperCase()}
                  </span>
                </Badge>
                {modules.mixedResults && (
                  <span className="text-yellow-500 text-sm">
                    (Mixed usage detected)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ConfidenceIndicator confidence={modules.confidence} />
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
                  {alternativeModules.length} other module systems detected
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-2">
                  {alternativeModules.map(([name, system]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-400">
                        {name.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <ConfidenceIndicator confidence={system.confidence} />
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

export default ModulesCard;
