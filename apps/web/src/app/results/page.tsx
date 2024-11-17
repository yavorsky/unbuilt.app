import { Results } from '../components/Results';
import Link from 'next/link';

export default function ResultsPage({
  searchParams
}: {
  searchParams: { jobId?: string }
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
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-100"
        >
          New Analysis
        </Link>
      </div>
    </main>
  );
}
