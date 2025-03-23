'use client';

import React, { useMemo, useState } from 'react';
import { TechnologyTrend } from '@/server/api/get-technology-trends';
import { TrendCard } from './trend-card';
import { TrendsChart } from './trends-chart';
import { useTrends } from '@/app/hooks/technologies/use-trends';
import { HashIcon, TrendingUp } from 'lucide-react';
import { useChartConfigForTechnology } from '@/app/hooks/use-chart-config';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
      const changeLabel = Math.round(risingTrend.change);
      return (
        <div>
          <div className="text-foreground/80 text-lg flex gap-2 font-medium leading-none justify-center">
            <b>{chartLabel}</b>
            {` is ${status} by ${changeLabel}${displayType === 'percentage' ? '%' : ` web app${changeLabel === 1 ? '' : 's'}`} over ${risingTrend.dataPoints} day${risingTrend.dataPoints === 1 ? '' : 's'}`}
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
        <ToggleGroup
          type="single"
          value={displayType}
          onValueChange={(value) =>
            value && setDisplayType(value as DisplayType)
          }
        >
          <ToggleGroupItem
            value="count"
            className="data-[state=on]:bg-secondary"
          >
            <HashIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="percentage"
            className="data-[state=on]:bg-secondary"
          >
            %
          </ToggleGroupItem>
        </ToggleGroup>
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
              type={type}
              className="border-l-4"
            />
          )}
          {decliningTrend && (
            <TrendCard
              displayType={displayType}
              trend={decliningTrend}
              chartConfig={chartConfig}
              type={type}
              className="border-l-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}
