'use client';

import { useEffect, useState } from 'react';
import { getJobStatus } from '../../../actions';
import { CardsResult } from './cards-result';
import { Loader2 } from 'lucide-react';

export function Results({ analysisId }: { analysisId: string }) {
  const [jobStatus, setJobStatus] = useState<Awaited<
    ReturnType<typeof getJobStatus>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const jobStatus = await getJobStatus(analysisId);

      if (jobStatus.error) {
        setError(jobStatus.error);
        setIsLoading(false);
        return;
      }

      setJobStatus(jobStatus);

      if (jobStatus.status !== 'completed' && jobStatus.status !== 'failed') {
        setTimeout(checkStatus, 200);
      } else {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [analysisId]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        <h3 className="font-bold">Error</h3>
        <p>{error ?? 'No result exists. Please try again'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CardsResult
        result={jobStatus?.result ?? null}
        progress={jobStatus?.progress ?? null}
        isLoading={isLoading}
      />
    </div>
  );
}
