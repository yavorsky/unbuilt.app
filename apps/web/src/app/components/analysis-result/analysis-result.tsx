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

  const eventSourceRef = useRef<EventSource | null>(null);

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
    // Use SSE for real-time updates instead of polling
    const streamUrl = `/api/analysis/${analysisId}/stream`;
    const eventSource = new EventSource(streamUrl);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('connected', () => {
      console.log('SSE connection established', { analysisId });
    });

    eventSource.addEventListener('status', (event) => {
      try {
        const updatedStatus: AnalysisResults = JSON.parse(event.data);
        const prevStatus = jobStatusRef.current;
        jobStatusRef.current = updatedStatus.status;

        if (updatedStatus.error || !updatedStatus.result) {
          setError(updatedStatus.error);
          // If status is delayed, we still trying to get the result
          if (updatedStatus.status !== 'delayed') {
            setJobStatus(updatedStatus);
            setIsLoading(false);
            if (updatedStatus.status === 'completed' || updatedStatus.status === 'failed') {
              eventSource.close();
            }
            return;
          }
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
          updatedStatus.status === 'completed' ||
          updatedStatus.status === 'failed'
        ) {
          setIsLoading(false);
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing SSE status event:', err);
      }
    });

    eventSource.addEventListener('error', (event: any) => {
      console.error('SSE connection error:', event);
      setError('Connection error occurred');
      setIsLoading(false);
      eventSource.close();
    });

    eventSource.addEventListener('close', (event) => {
      console.log('SSE connection closed:', JSON.parse(event.data));
      eventSource.close();
    });

    // Handle EventSource errors (connection lost, etc.)
    eventSource.onerror = () => {
      // EventSource will automatically try to reconnect
      // We can add custom logic here if needed
      console.log('SSE connection error, will retry...');
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
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
