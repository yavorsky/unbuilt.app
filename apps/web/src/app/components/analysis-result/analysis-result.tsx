'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnalysisResults } from '../../../actions';
import { CardsGrid } from './cards-grid';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui';
import { useTruncatedUrlCallback } from '@/hooks/use-truncated-url';

interface SSEMessage {
  type: 'status' | 'error';
  data?: AnalysisResults;
  error?: string;
}

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
    // Create SSE connection for real-time updates
    const eventSource = new EventSource(`/api/analysis/${analysisId}/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);

        if (message.type === 'error') {
          setError(message.error || 'Unknown error');
          setIsLoading(false);
          eventSource.close();
          return;
        }

        if (message.type === 'status' && message.data) {
          const updatedStatus = message.data;
          const prevStatus = jobStatusRef.current;
          jobStatusRef.current = updatedStatus.status;

          if (updatedStatus.error || !updatedStatus.result) {
            setError(updatedStatus.error);
            // If status is delayed, we still trying to get the result
            if (updatedStatus.status !== 'delayed') {
              setJobStatus(updatedStatus);
              setIsLoading(false);
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
        }
      } catch (e) {
        console.error('Error parsing SSE message:', e);
      }
    };

    eventSource.onerror = () => {
      // SSE connection error - the stream may have closed normally
      eventSource.close();
      setIsLoading(false);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
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
