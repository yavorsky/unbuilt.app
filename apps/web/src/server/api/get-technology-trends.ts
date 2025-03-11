import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import { columnMapping } from '../utils/column-mapping';
import { captureException } from '@sentry/nextjs';

export type TimeRange = 'week' | 'month' | '3months' | 'year';

export interface TechnologyTrend {
  date: string;
  technologies: Record<string, number>; // technology name -> usage percentage
  totalAnalyzed: number;
}

export async function getTechnologyTrendsQuery(
  type: AnalysisTechnologies,
  timeRange: TimeRange = 'month'
): Promise<TechnologyTrend[]> {
  // 1. Set the date range
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

  // 2. Load data from Supabase
  const dbColumn = columnMapping[type];
  const { data: rawData, error } = await supabase
    .from('tech_stack_analysis')
    .select(`analyzed_at, ${dbColumn}`)
    .gte('analyzed_at', startDate.toISOString())
    .not(dbColumn, 'eq', 'unknown')
    .order('analyzed_at', { ascending: true });

  if (error || !rawData) {
    captureException(error);
    return [];
  }

  // 3. Group data by date and calculate percentages
  const dailyStats = rawData.reduce<
    Record<
      string,
      {
        technologies: Record<string, number>;
        totalAnalyzed: number;
      }
    >
  >((acc, row) => {
    const date = new Date(row.analyzed_at).toISOString().split('T')[0];
    // TODO: Improve typing for supabase response
    const technology = row[dbColumn as keyof typeof row];

    if (!acc[date]) {
      acc[date] = {
        technologies: {},
        totalAnalyzed: 0,
      };
    }

    // Count occurrences of each technology
    acc[date].technologies[technology] =
      (acc[date].technologies[technology] || 0) + 1;
    acc[date].totalAnalyzed += 1;

    return acc;
  }, {});

  // 4. Convert to percentages and format response
  const trends: TechnologyTrend[] = Object.entries(dailyStats).map(
    ([date, stats]) => ({
      date,
      technologies: Object.fromEntries(
        Object.entries(stats.technologies).map(([tech, count]) => [
          tech,
          Number(((count / stats.totalAnalyzed) * 100).toFixed(1)),
        ])
      ),
      totalAnalyzed: stats.totalAnalyzed,
    })
  );

  return trends.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
