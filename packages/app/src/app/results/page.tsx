import { Results } from '../components/Results';
import Link from 'next/link';

export default function ResultsPage({
  searchParams
}: {
  searchParams: { jobId?: string }
}) {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Analysis Results</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          New Analysis
        </Link>
      </div>

      {searchParams.jobId ? (
        <Results jobId={searchParams.jobId} />
      ) : (
        <p>No analysis job ID provided</p>
      )}
    </main>
  );
}
