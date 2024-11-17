'use client'

import { useEffect, useState } from 'react';
import { getJobStatus } from '../../../actions';

export function Results({ jobId }: { jobId: string }) {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await getJobStatus(jobId);

      if (status.error) {
        setError(status.error);
        setLoading(false);
        return;
      }

      setResult(status);

      if (status.status !== 'completed' && status.status !== 'failed') {
        setTimeout(checkStatus, 2000);
      } else {
        setLoading(false);
      }
    };

    checkStatus();
  }, [jobId]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-2">Analyzing website...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-bold">Status: {result.status}</h3>
        <p>Job ID: {result.id}</p>
        <p>Started: {new Date(result.timestamp).toLocaleString()}</p>
        {result.finishedOn && (
          <p>Finished: {new Date(result.finishedOn).toLocaleString()}</p>
        )}
      </div>

      {result.result && (
        <div className="p-4 bg-white border rounded">
          <h3 className="font-bold mb-2">Analysis Results</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}