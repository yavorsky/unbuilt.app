'use client';

import { useEffect, useState } from 'react';
import { getJobStatus } from '../../../actions';
import { CardsResult } from './cards-result';
import { JSONResult } from './json-result';
import { Progress } from '@/components/ui/progress';

export function Results({ jobId }: { jobId: string }) {
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof getJobStatus>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAsJSON, setShowAsJSON] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await getJobStatus(jobId);

      if (status.error) {
        setError(status.error);
        setLoading(false);
        return;
      }

      setResult(status);
      console.log(status);

      if (status.status !== 'completed' && status.status !== 'failed') {
        setTimeout(checkStatus, 500);
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

  if (!result || loading) {
    return (
      <div className="flex items-center justify-center mt-20 max-w-7xl mx-auto">
        <Progress value={result?.progress ?? 0} />
      </div>
    );
  }

  if (showAsJSON) {
    console.log(result.result);
    return (
      <JSONResult
        result={result.result!}
        status={result.status!}
        id={+result.id!}
        finishedOn={result.finishedOn!.toString()}
      />
    );
  }

  return <CardsResult result={result.result} />;
}
