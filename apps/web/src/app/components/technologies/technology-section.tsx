import { getTechnologyStats } from '@/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { TableTechnologies } from './technology-list';
import { TechnologyTrends } from './technology-trends';
import { getTechnologyTrends } from '@/actions';
import { OverallChart } from './overall-chart';

type TechnologyTypeSectionProps<T extends AnalysisTechnologies> = {
  title: string;
  type: T;
};

export async function TechnologyTypeSection<T extends AnalysisTechnologies>({
  title,
  type,
}: TechnologyTypeSectionProps<T>) {
  // Fetch data server-side
  const [trendsData, statsData] = await Promise.all([
    getTechnologyTrends(type),
    getTechnologyStats(type),
  ]);

  return (
    <Card className="bg-muted backdrop-blur-sm border transition-all min-h-[620px]">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <OverallChart data={statsData} type={type} />
            <div className="mt-4 space-y-2">
              <TableTechnologies type={type} features={statsData} />
            </div>
          </div>

          <TechnologyTrends data={trendsData} type={type} />
        </div>
      </CardContent>
    </Card>
  );
}
