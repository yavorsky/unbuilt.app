import { getTechnologyStats } from '@/actions';
import { TechnologiesDashboard } from '@/app/components/technologies/technologies-dashboard';

export default async function TechnologiesPage() {
  const stats = await getTechnologyStats();

  return (
    <main className="flex-1 p-8 pt-24">
      <TechnologiesDashboard stats={stats.data} />
    </main>
  );
}
