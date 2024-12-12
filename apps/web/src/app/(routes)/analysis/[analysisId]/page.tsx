import { AnalysisResult } from '../../../components/analysis-result';

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
        <AnalysisResult analysisId={params.analysisId} />
      ) : (
        <p>No analysis job ID provided</p>
      )}
    </main>
  );
}
