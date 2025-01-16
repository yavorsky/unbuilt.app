import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useHandleDateFormat } from '@/hooks/use-date-format';
import { TechnologyTrend } from '@/server/api/get-technology-trends';
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
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={handleTickFormat}
          ticks={[chartData[0]?.date]}
          interval={0}
          padding={{ left: 0, right: 0 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          ticks={[0, 50, 100]}
          tickFormatter={() => ''}
          domain={[0, 100]}
          hide={true}
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

export default TrendsChart;
