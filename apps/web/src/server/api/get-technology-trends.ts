import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import { columnMapping } from '../utils/column-mapping';
import { captureException } from '@sentry/nextjs';

export type TimeRange = 'week' | 'month' | '3months' | 'year';

export interface TechnologyTrend {
  date: string;
  technologies: Record<string, { count: number; percentage: number }>;
  totalAnalyzed: number;
}

export async function getTechnologyTrendsQuery(
  type: AnalysisTechnologies,
  timeRange: TimeRange = 'month'
): Promise<TechnologyTrend[]> {
  // 1. Set the date range for display
  const startDate = new Date();
  switch (timeRange) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3months':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  // 2. Get the full trend data in a single RPC call
  const dbColumn = columnMapping[type];

  const { data: trendData, error } = await supabase.rpc(
    'get_technology_trends',
    {
      technology_column: dbColumn,
      start_date: startDate.toISOString(),
      confidence_threshold: 0.5,
    }
  );

  if (error || !trendData) {
    captureException(error);
    return [];
  }

  // 3. Convert RPC results to the expected format
  const trends: TechnologyTrend[] = trendData.map((item) => ({
    date: item.date,
    technologies: item.technologies as Record<
      string,
      { count: number; percentage: number }
    >,
    totalAnalyzed: item.total_analyzed,
  }));

  return trends;
}
