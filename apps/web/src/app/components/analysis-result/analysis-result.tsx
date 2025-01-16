'use client';

import { useEffect, useRef, useState } from 'react';
import { AnalysisResults, getAnalysisResults } from '../../../actions';
import { CardsGrid } from './cards-grid';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';

export function AnalysisResult({ analysisId }: { analysisId: string }) {
  const [jobStatus, setJobStatus] = useState<AnalysisResults | null>(null);
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

      const jobStatus = await getAnalysisResults(analysisId);

      if (jobStatus.error || !jobStatus.result) {
        setError(jobStatus.error);
        setIsLoading(false);
        setJobStatus(jobStatus);
        return;
      }

      setJobStatus(jobStatus);

      if (jobStatus?.result?.url) {
        updateActiveAnalysis({
          url: jobStatus?.result?.url,
          status: jobStatus.status,
        });
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

  const { updateActiveCategory } = useActiveCategory();

  return (
    <div className="space-y-4" onClick={() => updateActiveCategory(null)}>
      <CardsGrid
        result={jobStatus?.result ?? null}
        progress={jobStatus?.progress ?? null}
        isLoading={isLoading}
        status={jobStatus?.status ?? null}
        error={error}
      />
    </div>
  );
}
