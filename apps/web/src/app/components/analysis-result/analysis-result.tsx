'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnalysisResults, getAnalysisResults } from '../../../actions';
import { CardsGrid } from './cards-grid';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui';
import { useTruncatedUrlCallback } from '@/hooks/use-truncated-url';

export function AnalysisResult({ analysisId }: { analysisId: string }) {
  const [jobStatus, setJobStatus] = useState<AnalysisResults | null>(null);
  const jobStatusRef = useRef<string | null>(null);
  const { updateActiveAnalysis, clearActiveAnalysis } = useActiveAnalysis();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCheckingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const handleUrlTrancate = useTruncatedUrlCallback();

  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(
      handleUrlTrancate(window.location.href)
    );
    toast({
      description: 'Analysis URL copied to clipboard',
      duration: 2000,
    });
  }, [handleUrlTrancate]);

  useEffect(() => {
    const checkStatus = async () => {
      if (isCheckingRef.current) {
        return;
      }
      isCheckingRef.current = true;

      const updatedStatus = await getAnalysisResults(analysisId);
      const prevStatus = jobStatusRef.current;
      jobStatusRef.current = updatedStatus.status;

      if (updatedStatus.error || !updatedStatus.result) {
        setError(updatedStatus.error);
        setIsLoading(false);
        setJobStatus(updatedStatus);
        return;
      }

      setJobStatus(updatedStatus);

      if (updatedStatus?.result?.url) {
        updateActiveAnalysis({
          url: updatedStatus?.result?.url,
          status: updatedStatus.status,
        });
      }

      if (updatedStatus.status === 'completed' && prevStatus === 'active') {
        toast({
          title: `Analysis for ${handleUrlTrancate(updatedStatus?.result?.url)} is completed`,
          action: (
            <Button variant="secondary" onClick={handleCopyUrl}>
              Copy
            </Button>
          ),
        });
      }

      if (
        updatedStatus.status !== 'completed' &&
        updatedStatus.status !== 'failed'
      ) {
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
  }, [analysisId, updateActiveAnalysis, handleCopyUrl, handleUrlTrancate]);

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
