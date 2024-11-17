import { FC } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Package, Zap } from 'lucide-react';
import { MetaFrameworkFeatures } from '@unbuilt/analyzer';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';

export const MetaFrameworkCard: FC<{ metaFramework: MetaFrameworkFeatures }> = ({
  metaFramework,
}) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Package className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Meta Framework</h3>
          </div>
          <ConfidenceIndicator confidence={metaFramework.confidence} />
        </div>
        <div className="text-2xl font-bold text-white mb-4">{metaFramework.name}</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-gray-800 rounded">
            <div
              className={`text-2xl ${
                metaFramework.features.hasSSR ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {metaFramework.features.hasSSR ? '✓' : '×'}
            </div>
            <div className="text-xs text-gray-400">SSR</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-800 rounded">
            <div
              className={`text-2xl ${
                metaFramework.features.hasSSG ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {metaFramework.features.hasSSG ? '✓' : '×'}
            </div>
            <div className="text-xs text-gray-400">SSG</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-800 rounded">
            <div
              className={`text-2xl ${
                metaFramework.features.hasISR ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {metaFramework.features.hasISR ? '✓' : '×'}
            </div>
            <div className="text-xs text-gray-400">ISR</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
