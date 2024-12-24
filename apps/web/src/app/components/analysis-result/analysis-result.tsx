'use client';

import { useEffect, useRef, useState } from 'react';
import { getJobStatus } from '../../../actions';
import { CardsGrid } from './cards-grid';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';

export function AnalysisResult({ analysisId }: { analysisId: string }) {
  const [jobStatus, setJobStatus] = useState<Awaited<
    ReturnType<typeof getJobStatus>
  > | null>(null);
  const { updateActiveAnalysis, clearActiveAnalysis } = useActiveAnalysis();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCheckingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (isCheckingRef.current) {
        return;
      }
      isCheckingRef.current = true;

      const jobStatus = await getJobStatus(analysisId);

      if (jobStatus.error) {
        setError(jobStatus.error);
        setIsLoading(false);
        return;
      }

      setJobStatus(jobStatus);

      if (jobStatus?.result?.url) {
        updateActiveAnalysis({ url: jobStatus?.result?.url });
      }

      if (jobStatus.status !== 'completed' && jobStatus.status !== 'failed') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(checkStatus, 2000);
      } else {
        setIsLoading(false);
      }
      isCheckingRef.current = false;
    };

    checkStatus();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [analysisId, updateActiveAnalysis]);

  useEffect(() => {
    return () => {
      clearActiveAnalysis();
    };
  }, [clearActiveAnalysis]);

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
      <CardsGrid
        result={jobStatus?.result ?? null}
        progress={jobStatus?.progress ?? null}
        isLoading={isLoading}
      />
    </div>
  );
}
