import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useHandleDateFormat } from '@/hooks/use-date-format';
import { TechnologyTrend } from '@/lib/api/get-technology-trends';
import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

export const TrendsChart = ({
  data,
  chartConfig,
}: {
  chartConfig: ChartConfig;
  data: TechnologyTrend[];
}) => {
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        date: point.date,
        ...point.technologies,
      })),
    [data]
  );

  const usedTechnologies = useMemo(() => {
    const technologies = data.reduce<Set<string>>((techSet, point) => {
      Object.keys(point.technologies).forEach((tech) => techSet.add(tech));
      return techSet;
    }, new Set());
    return [...technologies];
  }, [data]);

  const handleTickFormat = useHandleDateFormat({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ChartContainer
      className="min-h-[50px] max-h-[200px] w-full"
      config={chartConfig}
    >
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} stroke="rgba(250, 250, 250, 0.1)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={handleTickFormat}
          ticks={[chartData[0]?.date]}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          ticks={[0, 50, 100]}
          tickFormatter={() => ''}
          domain={[0, 100]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {usedTechnologies.map((tech) => (
          <Line
            key={tech}
            type="monotone"
            dataKey={tech}
            stroke={chartConfig[tech]?.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};
