import { FC } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Box } from 'lucide-react';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { Badge } from '@/components/ui/badge';
import { AnalyzeResult } from '@unbuilt/analyzer';

export const JSLibrariesCard: FC<{
  jsLibraries: AnalyzeResult['analysis']['jsLibraries'];
}> = ({ jsLibraries }) => {
  // Convert the categories object to a sorted array
  const sortedCategories = Object.entries(jsLibraries).sort(
    ([, a], [, b]) => b.confidence - a.confidence
  );

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Box className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">JS Libraries</h3>
        </div>
        <div className="space-y-4">
          {sortedCategories.map(([categoryName, category]) => (
            <div key={categoryName} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">{categoryName}</span>
                <div className="flex justify-around gap-2">
                  <Badge variant="outline" className="capitalize">
                    {category.name}
                  </Badge>
                  <ConfidenceIndicator confidence={category.confidence} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
