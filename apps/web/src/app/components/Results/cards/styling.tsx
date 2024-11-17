import { FC } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Palette } from 'lucide-react';
import { StylingFeatures } from '@unbuilt/analyzer';

export const StylingCard: FC<{ styling: StylingFeatures }> = ({ styling }) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Palette className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Styling</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(styling.frameworks).map(([name, enabled]) => (
            <div key={name} className="flex flex-col items-center p-2 bg-gray-800 rounded">
              <div className={`text-2xl ${enabled ? 'text-green-400' : 'text-red-400'}`}>
                {enabled ? '✓' : '×'}
              </div>
              <div className="text-xs text-gray-400 capitalize">{name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
