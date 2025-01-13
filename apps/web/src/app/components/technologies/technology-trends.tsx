'use client';

import React, { useMemo } from 'react';
import { ChartConfig } from '@/components/ui/chart';
import { TechnologyTrend } from '@/lib/api/get-technology-trends';
import { TrendCard } from './trend-card';
import { TrendsChart } from './trends-chart';
import { useTrends } from '@/app/hooks/technologies/use-trends';
import { TrendingUp } from 'lucide-react';

interface TechnologyTrendsProps {
  data: TechnologyTrend[];
  chartConfig: ChartConfig;
}

export function TechnologyTrends({ data, chartConfig }: TechnologyTrendsProps) {
  const trends = useTrends(data);

  const risingTrend = trends.find((t) => t.direction === 'up');
  const decliningTrend = trends.find((t) => t.direction === 'down');
  const risingTrendTitle = useMemo(() => {
    if (risingTrend) {
      const chartLabel = chartConfig[risingTrend.name].label;
      const status = risingTrend.direction === 'up' ? 'rising' : 'declining';
      const changePercent = Math.round(risingTrend.change);
      return (
        <div>
          <div className="text-foreground/80 text-lg flex gap-2 font-medium leading-none justify-center">
            <b>{chartLabel}</b>
            {` is ${status} by ${changePercent}% over ${risingTrend.dataPoints} days`}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-foreground/50 text-center mt-4">
            Showing technologies trends for the last 30 days period
          </div>
        </div>
      );
    }
    return null;
  }, [risingTrend, chartConfig]);

  return (
    <div className="space-y-4 flex flex-col">
      <TrendsChart data={data} chartConfig={chartConfig} />
      <div className="pt-2 pb-2 pl-12 flex flex-col flex-1 justify-center">
        {risingTrendTitle}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {risingTrend && (
            <TrendCard
              trend={risingTrend}
              chartConfig={chartConfig}
              className="border-l-4"
            />
          )}
          {decliningTrend && (
            <TrendCard
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
