import { Results } from '../components/results';
import Link from 'next/link';

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { jobId?: string };
}) {
  return (
    <main className="min-h-screen bg-gray-950 p-8">
      {searchParams.jobId ? (
        <Results jobId={searchParams.jobId} />
      ) : (
        <p>No analysis job ID provided</p>
      )}
      <div className="flex items-center justify-center mt-20 max-w-7xl mx-auto">
        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-blue-300"
        >
          New Analysis
        </Link>
      </div>
    </main>
  );
}
