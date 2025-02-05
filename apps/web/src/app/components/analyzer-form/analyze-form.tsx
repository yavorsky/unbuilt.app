'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisForm } from '@/app/contexts/analysis-form/use-analysis-form';
import { useExistingAnalysisMeta } from '@/app/hooks/use-existing-analysis';
import { analyzeWebsite } from '@/actions';
import { toast } from '@/hooks/use-toast';
import { useDateFormat } from '@/hooks/use-date-format';
import { validateUrl } from '@/app/utils/validate-url';
import { InputWithSubmit } from '../input-with-submit';

export const AnalyzeForm = ({
  buttonClassName,
  selectOnOpen = false,
  onAnalyzisStarted,
  forceNewAnalysis = false,
}: {
  buttonClassName?: string;
  selectOnOpen?: boolean;
  forceNewAnalysis?: boolean;
  onAnalyzisStarted?: () => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { url, changeUrl } = useAnalysisForm();

  const existingAnalysis = useExistingAnalysisMeta(url);

  const formattedDate = useDateFormat(existingAnalysis.analyzedAt);

  const handleStartNewAnalyis = useCallback(async () => {
    setIsPending(true);
    const form = new FormData();
    form.append('url', url);
    toast({
      title: `Starting analysis for ${url}`,
      description: 'Usually takes up to 10 seconds.',
    });
    onAnalyzisStarted?.();
    const result = await analyzeWebsite(form);
    if (result.analysisId) {
      return router.push(`/analysis/${result.analysisId}`);
    } else if (result.error) {
      setError(result.error);
      return;
    }
    setIsPending(false);
  }, [url, router, onAnalyzisStarted]);

  const handleNavigateToExistingAnalysis = useCallback(() => {
    if (existingAnalysis.status === 'NOT_FOUND') {
      throw new Error('No existing analysis found');
    }
    if (existingAnalysis.status === 'PENDING') {
      return;
    }
    setIsPending(true);
    return router.push(`/analysis/${existingAnalysis.id}`);
  }, [existingAnalysis, router]);

  const isLoading = existingAnalysis.status === 'PENDING' || isPending;
  const shouldStartNewAnalysis =
    !forceNewAnalysis && existingAnalysis.status === 'FOUND';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (existingAnalysis.status === 'PENDING') {
          return;
        }
        if (shouldStartNewAnalysis) {
          handleNavigateToExistingAnalysis();
        } else {
          handleStartNewAnalyis();
        }
      }}
      className="space-y-4 justify-center items-center min-w-[400px] max-w-[420px]"
    >
      <InputWithSubmit
        id="url"
        type="text"
        value={url}
        onInputChange={changeUrl}
        placeholder="https://"
        spellCheck="false"
        autoFocus
        isLoading={isLoading}
        autoCapitalize="off"
        autoCorrect="off"
        validate={validateUrl}
        buttonClassName={buttonClassName}
        selectOnOpen={selectOnOpen}
        tooltipContent={
          shouldStartNewAnalysis ? (
            <p>
              See latest results for this web app from <b>{formattedDate}</b>
            </p>
          ) : (
            <p>Start new analysis</p>
          )
        }
      />

      {/* <p className="text-sm text-foreground/30">
        Unbuilt.app is currently in development phase. Some results could be
        wrong.
      </p> */}
      {error && <p className="text-red-500 text-base mt-4">{error}</p>}
    </form>
  );
};
