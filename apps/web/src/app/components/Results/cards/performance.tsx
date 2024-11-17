import { FC } from "react";
import { Card, CardContent } from "@/components/ui";
import { Zap } from "lucide-react";
import { PerformanceFeatures } from '@unbuilt/analyzer';

export const PerformanceCard: FC<{ performance: PerformanceFeatures }> = ({ performance }) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Zap className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{performance.resourceCount}</div>
            <div className="text-sm text-gray-400">Resources</div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">
              {(performance.totalSize / 1024 / 1024).toFixed(1)}MB
            </div>
            <div className="text-sm text-gray-400">Total Size</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-800 rounded">
            <div className="text-lg font-semibold text-white">
              {performance.scriptMetrics.async}
            </div>
            <div className="text-xs text-gray-400">Async</div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded">
            <div className="text-lg font-semibold text-white">
              {performance.scriptMetrics.defer}
            </div>
            <div className="text-xs text-gray-400">Defer</div>
          </div>
          <div className="text-center p-2 bg-gray-800 rounded">
            <div className="text-lg font-semibold text-white">
              {performance.scriptMetrics.modules}
            </div>
            <div className="text-xs text-gray-400">Modules</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
