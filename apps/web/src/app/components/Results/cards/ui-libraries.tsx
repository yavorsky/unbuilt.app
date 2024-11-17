import { FC } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Blocks } from 'lucide-react';
import { UILibFeatures } from '@unbuilt/analyzer';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { Badge } from '@/components/ui/badge';

export const UILibrariesCard: FC<{ uiLib: UILibFeatures }> = ({ uiLib }) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300 lg:col-span-2">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Blocks className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">UI Framework</h3>
          </div>
          <ConfidenceIndicator confidence={uiLib.confidence} />
        </div>
        <div className="text-2xl font-bold text-white mb-3">{uiLib.name}</div>
        <div className="flex flex-wrap gap-2">
          {uiLib.libraries?.stateManagement.map((lib) => (
            <Badge key={lib}>{lib}</Badge>
          ))}
          {uiLib.libraries?.router.map((lib) => (
            <Badge key={lib} color="emerald">
              {lib}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
