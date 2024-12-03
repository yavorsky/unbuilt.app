'use client';

import { useCallback, useEffect, useState } from 'react';
import { getJobStatus } from '../../../actions';
import { CardsResult } from './cards-result';
import { JSONResult } from './json-result';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function Results({ jobId }: { jobId: string }) {
  const [jobStatus, setJobStatus] = useState<Awaited<
    ReturnType<typeof getJobStatus>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAsJSON, setShowAsJSON] = useState(false);

  const handleSwitchJSONChange = useCallback(() => {
    setShowAsJSON(!showAsJSON);
  }, [showAsJSON]);

  useEffect(() => {
    const checkStatus = async () => {
      const jobStatus = await getJobStatus(jobId);

      if (jobStatus.error) {
        setError(jobStatus.error);
        setLoading(false);
        return;
      }

      setJobStatus(jobStatus);

      if (jobStatus.status !== 'completed' && jobStatus.status !== 'failed') {
        setTimeout(checkStatus, 200);
      } else {
        setLoading(false);
      }
    };

    checkStatus();
  }, [jobId]);

  if (!jobStatus) {
    return (
      <div className="flex items-center justify-center mt-20 max-w-7xl mx-auto">
        No job found. Please try again.
      </div>
    );
  }

  if (error || !jobStatus?.result) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        <h3 className="font-bold">Error</h3>
        <p>{error ?? 'No result exists. Please try again'}</p>
      </div>
    );
  }

  const results = showAsJSON ? (
    <>
      <JSONResult
        result={jobStatus.result!}
        status={jobStatus.status!}
        id={jobStatus.id!.toString()!}
        progress={jobStatus?.progress}
        started={jobStatus.timestamp!}
        isLoading={loading}
      />
    </>
  ) : (
    <CardsResult
      result={jobStatus.result}
      progress={jobStatus?.progress}
      isLoading={loading}
    />
  );

  return (
    <div className="space-y-4">
      <Switch
        id="json-mode"
        checked={showAsJSON}
        onCheckedChange={handleSwitchJSONChange}
      />
      <Label htmlFor="airplane-mode" className="text-white ml-4">
        Show as JSON
      </Label>
      <div>{results}</div>
    </div>
  );
}
