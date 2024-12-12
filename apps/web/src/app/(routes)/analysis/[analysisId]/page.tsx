import { Results } from '../../../components/results';

export default function ResultsPage({
  params,
}: {
  params: {
    analysisId: string;
  };
}) {
  return (
    <main className="min-h-screen p-8">
      {params.analysisId ? (
        <Results analysisId={params.analysisId} />
      ) : (
        <p>No analysis job ID provided</p>
      )}
    </main>
  );
}
