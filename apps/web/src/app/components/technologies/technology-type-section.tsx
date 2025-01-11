'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { AnalysisKeys } from '@unbuilt/analyzer';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TableTechnologies } from './technology-type-list';

export function TechnologyTypeSection({
  title,
  data,
  type,
  meta,
}: {
  title: string;
  type: AnalysisKeys;
  data: { name: string; count: number }[];
  meta?: Record<string, { name: string }>;
}) {
  // Here, we are using metadata to configure the chart
  const chartConfigPerType = Object.keys(meta ?? {}).reduce(
    (acc, key, index) => {
      if (meta === undefined) return acc;

      const metaValue = meta[key];
      return {
        ...acc,
        [key]: { label: metaValue?.name, color: `hsl(var(--chart-${index}))` },
      };
    },
    {}
  );

  const chartConfig = useMemo(() => {
    return {
      ...chartConfigPerType,
      count: {
        label: 'Total Amount',
      },
      other: {
        label: 'Other',
        color: 'hsl(var(--chart-5))',
      },
    };
  }, [chartConfigPerType]);

  const dataWithColors = useMemo(
    () =>
      data.map((item, index) => {
        return { ...item, fill: `hsl(var(--chart-${index + 1}))` };
      }),
    [data]
  );

  return (
    <Card className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 hover:border-indigo-500 transition-all">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[50px] max-h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={dataWithColors}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              tickFormatter={(value) => {
                const val =
                  chartConfig[value as keyof typeof chartConfig]?.label;
                return val;
              }}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" maxBarSize={36} radius={5} />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          <TableTechnologies type={type} features={data} meta={meta} />
        </div>
      </CardContent>
    </Card>
  );
}
