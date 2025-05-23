'use client';

import { useChartConfigForTechnology } from '@/app/hooks/use-chart-config';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

export const OverallChart = ({
  data,
  type,
}: {
  data: { name: string; count: number }[];
  type: AnalysisTechnologies;
}) => {
  // Adding fill field for BarChart entries
  const dataWithColors = useMemo(() => {
    return data.map((entry) => ({
      ...entry,
      fill: `var(--color-${entry.name})`,
    }));
  }, [data]);

  const router = useRouter();
  const chartConfig = useChartConfigForTechnology(type);

  const handleBarClick = useCallback(
    (item: { name: string; count: number }) => {
      router.push(`/technologies/${type}/${item.name}`);
    },
    [router, type]
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[50px] max-h-[200px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={dataWithColors}
        layout="vertical"
        // margin={{
        //   left: 20,
        // }}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={0}
          axisLine={false}
          width={80}
          tickFormatter={(value) => {
            const val = chartConfig[value]?.label as string;
            return val;
          }}
        />
        <XAxis dataKey="count" type="number" hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          className="hover:cursor-pointer"
          onClick={handleBarClick}
          dataKey="count"
          layout="vertical"
          maxBarSize={36}
          radius={5}
        />
      </BarChart>
    </ChartContainer>
  );
};
