import { FC } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Box } from 'lucide-react';
import { BuildFeatures } from '@unbuilt/analyzer';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { Badge } from '@/components/ui/badge';

export const BuildCard: FC<{ build: BuildFeatures }> = ({ build }) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Box className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Build Tools</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Bundler</span>
            <div className="flex items-center gap-2">
              <Badge>{build.bundler.name}</Badge>
              <ConfidenceIndicator confidence={build.bundler.confidence} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Transpiler</span>
            <div className="flex items-center gap-2">
              <Badge>{build.transpiler.name}</Badge>
              <ConfidenceIndicator confidence={build.transpiler.confidence} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
