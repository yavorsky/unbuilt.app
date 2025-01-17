import { AnalysisResult } from '../../../components/analysis-result';

export default function ResultsPage({
  params,
}: {
  params: {
    analysisId: string;
  };
}) {
  return (
    <main className="flex-1 p-2 lg:p-8 md:p-8 pt-24">
      {params.analysisId ? (
        <AnalysisResult analysisId={params.analysisId} />
      ) : (
        <p>No analysis job ID provided</p>
      )}
    </main>
  );
}
