import { FC } from 'react';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Paintbrush2, FileCode2, ChartNetwork } from 'lucide-react';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import LoaderText from '../../loader-text';
import { SizeDisplay } from '../../size-display';

export const StatsCard: FC<{
  stats: AnalyzeResult['analysis']['stats'] | undefined;
}> = ({ stats }) => {
  const { activeCategory } = useActiveCategory();
  const { activeAnalysis } = useActiveAnalysis();
  const isLoading = !stats;
  const activeState = activeCategory === 'stats' ? 'selected' : 'default';

  if (isLoading) {
    return (
      <Card data-state={activeState}>
        <CardHeader className="py-4 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-400">Stats</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 pt-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-[150px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeAnalysis?.status === 'active' && (
            <div className="p-6 space-y-4">
              <LoaderText
                supportedOptions={['JS files', 'CSS files', 'HTML files']}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analysis resources</CardTitle>
        <p className="text-xs text-muted-foreground">
          Resources unbuilt: <b>{stats.resourceCount}</b>
        </p>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="flex flex-col max-w-sm col-span-1 sm:col-span-1 lg:col-span-2 gap-y-2">
            <div>
              <div className="flex items-center space-x-4">
                <FileCode2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium">Scripts</p>
                  <div className="flex space-x-4">
                    <p className="text-xs text-muted-foreground">
                      Async: <b>{stats.scriptMetrics.async}</b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Modules: <b>{stats.scriptMetrics.modules}</b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Preload: <b>{stats.scriptMetrics.preload}</b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Inline: <b>{stats.scriptMetrics.inline}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg flex justify-center items-center flex-col">
              <div className="text-xl font-semibold">
                {stats.scriptMetrics.modules +
                  stats.scriptMetrics.inline +
                  stats.scriptMetrics.preload +
                  stats.scriptMetrics.async}
              </div>
              <p className="text-xs text-muted-foreground">Total Scripts</p>
            </div>
          </div>

          <div className="flex flex-col max-w-sm col-span-1 sm:col-span-1 lg:col-span-2 gap-y-2">
            <div>
              <div className="flex items-center space-x-4">
                <Paintbrush2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium">StyleSheets</p>
                  <div className="flex space-x-4">
                    <p className="text-xs text-muted-foreground">
                      Inline: <b>{stats.styleMetrics.inline}</b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Modules: <b>{stats.styleMetrics.modules}</b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Preload: <b>{stats.styleMetrics.preload}</b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Default:{' '}
                      <b>
                        {stats.styleMetrics.total -
                          (stats.styleMetrics.preload +
                            stats.styleMetrics.modules +
                            stats.styleMetrics.inline)}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg flex justify-center items-center flex-col">
              <div className="text-xl font-semibold">
                {stats.styleMetrics.total}
              </div>
              <p className="text-xs text-muted-foreground">StyleSheets</p>
            </div>
          </div>

          <div className="flex flex-col max-w-sm col-span-1 sm:col-span-1 lg:col-span-2 gap-y-2">
            <div>
              <div className="flex items-center space-x-4">
                <ChartNetwork className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium">DOM</p>
                  <div className="flex space-x-4">
                    <p className="text-xs text-muted-foreground">
                      Nodes Size:{' '}
                      <b>
                        <SizeDisplay bytes={stats.domMetrics.totalSize} />
                      </b>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max Depth: <b>{stats.domMetrics.maxDepth} nodes</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg flex justify-center items-center flex-col">
              <div className="text-xl font-semibold">
                {stats.domMetrics.totalNodes}
              </div>
              <p className="text-xs text-muted-foreground">Total Nodes</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
