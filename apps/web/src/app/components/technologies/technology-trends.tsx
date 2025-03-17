'use client';

import React, { useMemo, useState } from 'react';
import { TechnologyTrend } from '@/server/api/get-technology-trends';
import { TrendCard } from './trend-card';
import { TrendsChart } from './trends-chart';
import { useTrends } from '@/app/hooks/technologies/use-trends';
import { TrendingUp } from 'lucide-react';
import { useChartConfigForTechnology } from '@/app/hooks/use-chart-config';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TechnologyTrendsProps {
  data: TechnologyTrend[];
  type: AnalysisTechnologies;
}

export type DisplayType = 'count' | 'percentage';

export function TechnologyTrends({ data, type }: TechnologyTrendsProps) {
  const [displayType, setDisplayType] = useState<DisplayType>('count');
  const trends = useTrends(data, displayType);
  const chartConfig = useChartConfigForTechnology(type);

  const risingTrend = trends.find((t) => t.direction === 'up' && t.change > 0);
  const decliningTrend = trends.find(
    (t) => t.direction === 'down' && t.change < 0
  );
  const risingTrendTitle = useMemo(() => {
    if (risingTrend) {
      const chartLabel = chartConfig[risingTrend.name]?.label;
      const status = risingTrend.direction === 'up' ? 'rising' : 'declining';
      const changePercent = Math.round(risingTrend.change);
      return (
        <div>
          <div className="text-foreground/80 text-lg flex gap-2 font-medium leading-none justify-center">
            <b>{chartLabel}</b>
            {` is ${status} by ${changePercent}${displayType === 'percentage' ? '%' : ' web apps'} over ${risingTrend.dataPoints} days`}
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      );
    }
    return null;
  }, [risingTrend, chartConfig, displayType]);

  return (
    <div className="space-y-4 flex flex-col">
      <div className="flex items-center justify-end">
        <Label htmlFor="airplane-mode">Percent</Label>
        <Switch
          className="ml-2"
          checked={displayType === 'percentage'}
          onCheckedChange={() =>
            setDisplayType((prev) =>
              prev === 'count' ? 'percentage' : 'count'
            )
          }
        />
      </div>
      <TrendsChart
        data={data}
        chartConfig={chartConfig}
        displayType={displayType}
      />
      <div className="pt-2 pb-2 flex flex-col flex-1 justify-center">
        {risingTrendTitle}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {risingTrend && (
            <TrendCard
              trend={risingTrend}
              chartConfig={chartConfig}
              displayType={displayType}
              className="border-l-4"
            />
          )}
          {decliningTrend && (
            <TrendCard
              displayType={displayType}
              trend={decliningTrend}
              chartConfig={chartConfig}
              className="border-l-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
