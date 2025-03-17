import { Card, CardContent } from '@/components/ui';
import { ChartConfig } from '@/components/ui/chart';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { DisplayType } from './technology-trends';

interface TrendInfo {
  name: string;
  change: number;
  direction: 'up' | 'down';
}

export function TrendCard({
  trend,
  chartConfig,
  displayType,
  className,
}: {
  trend: TrendInfo;
  chartConfig: ChartConfig;
  displayType?: DisplayType;
  className?: string;
}) {
  const Icon = trend.direction === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const label = chartConfig[trend.name]?.label || trend.name;
  const colorClass =
    trend.direction === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <Card
      style={{ borderLeftColor: chartConfig[trend.name]?.color }}
      className={`bg-secondary/20 border-border/50 h-[100%] ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-center lg:justify-between md:justify-between flex-wrap">
          <span className="text-xl font-medium text-foreground">{label}</span>
          <div className={`flex items-center gap-1 ${colorClass}`}>
            <Icon className="w-4 h-4" />
            <span className="text-base font-medium text-inherit">
              {Math.abs(trend.change).toFixed(1)}
              {displayType === 'percentage' ? '%' : ''}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
