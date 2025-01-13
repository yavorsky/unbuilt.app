import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

export const OverallChart = ({
  chartConfig,
  data,
}: {
  chartConfig: ChartConfig;
  data: { name: string; count: number }[];
}) => {
  // Adding fill field for BarChart entries
  const dataWithColors = useMemo(() => {
    return data.map((entry) => ({
      ...entry,
      fill: `var(--color-${entry.name})`,
    }));
  }, [data]);

  return (
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
            const val = chartConfig[value]?.label as string;
            return val;
          }}
        />
        <XAxis dataKey="count" type="number" hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" layout="vertical" maxBarSize={36} radius={5} />
      </BarChart>
    </ChartContainer>
  );
};
