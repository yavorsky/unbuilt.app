import { AnalysisResult } from '../../../components/analysis-result';

export default function ResultsPage({
  params,
}: {
  params: {
    analysisId: string;
  };
}) {
  return (
    <main className="flex-1 px-2 lg:px-8 md:px-8 pt-24">
      {params.analysisId ? (
        <AnalysisResult analysisId={params.analysisId} />
      ) : (
        <p>No analysis job ID provided</p>
      )}
    </main>
  );
}
