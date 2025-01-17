import { getTechnologyWebsites } from '@/actions';
import { TechnologyDashboard } from '@/app/components/technology/technology-dashboard';
import { AnalysisTechnologies, AnalyzeResult } from '@unbuilt/analyzer';

interface PageProps<T extends AnalysisTechnologies> {
  params: {
    type: T;
    name: keyof AnalyzeResult['analysis'][T];
  };
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function TechnologyPage<T extends AnalysisTechnologies>({
  params,
  searchParams,
}: PageProps<T>) {
  const data = await getTechnologyWebsites({
    type: params.type,
    technology: params.name,
    page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
    search: searchParams.search,
  });

  return (
    <main className="flex-1 p-2 lg:p-8 md:p-8 pt-24">
      <TechnologyDashboard
        initialData={data}
        type={params.type}
        technology={params.name}
      />
    </main>
  );
}
