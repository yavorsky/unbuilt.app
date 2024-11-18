'use client'

import { useEffect, useState } from 'react';
import { getJobStatus } from '../../../actions';
import { CardsResult } from './cards-result';
import { JSONResult } from './json-result';

export function Results({ jobId }: { jobId: string }) {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAsJSON, setShowAsJSON] = useState(false);

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
      <div className="flex items-center justify-center mt-20 max-w-7xl mx-auto">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (showAsJSON) {
    return <JSONResult result={result.result} status={result.status} id={result.id} finishedOn={result.finishedOn} />
  }

  return <CardsResult result={result.result} />
}