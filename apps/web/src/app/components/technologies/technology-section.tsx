'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { TableTechnologies } from './technology-list';
import { TechnologyTrends } from './technology-trends';
import { getTechnologyTrends } from '@/actions';
import type { TechnologyTrend } from '@/server/api/get-technology-trends';
import { OverallChart } from './overall-chart';
import {
  getTechnologyMeta,
  TechnologyMetaResults,
} from '@/app/utils/get-technology-meta';

export function TechnologyTypeSection<
  T extends AnalysisTechnologies,
  V extends TechnologyMetaResults<T>,
>({
  title,
  data,
  type,
}: {
  title: string;
  type: T;
  data: { name: string; count: number }[];
}) {
  const [trendsData, setTrendsData] = useState<TechnologyTrend[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTechnologyTrends(type);
      setTrendsData(data);
    };
    load();
  }, [type]);

  const meta = getTechnologyMeta<T, V>(type);
  const chartConfig = useMemo(() => {
    const chartConfigPerType = Object.keys(meta ?? {}).reduce(
      (acc, key, index) => {
        if (meta === undefined) return acc;

        const metaValue = meta[key as V];
        return {
          ...acc,
          [key]: {
            label: metaValue?.name,
            color: `hsl(var(--chart-${index + 1}))`,
          },
        };
      },
      {}
    );

    return {
      ...chartConfigPerType,
      count: {
        label: <span className="mr-2">Total Web Apps</span>,
        color: 'hsl(var(--chart-5))',
      },
      other: {
        label: 'Other',
        color: 'hsl(var(--chart-5))',
      },
    };
  }, [meta]);

  return (
    <Card className="bg-muted backdrop-blur-sm border transition-all">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <OverallChart data={data} chartConfig={chartConfig} type={type} />
            <div className="mt-4 space-y-2">
              <TableTechnologies type={type} features={data} meta={meta} />
            </div>
          </div>

          {trendsData && (
            <TechnologyTrends data={trendsData} chartConfig={chartConfig} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
