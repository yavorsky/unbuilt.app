'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisForm } from '@/app/contexts/analysis-form/use-analysis-form';
import { useExistingAnalysisMeta } from '@/app/hooks/use-existing-analysis';
import { useDateFormat } from '@/hooks/use-date-format';
import { validateUrl } from '@/app/utils/validate-url';
import { InputWithSubmit } from '../input-with-submit';
import { useStartNewAnalysis } from '@/app/hooks/use-start-new-analysis';
import { URLSuggestions } from '../url-suggestions';

export const AnalyzeForm = ({
  buttonClassName,
  selectOnOpen = false,
  forceNewAnalysis = false,
  withAutosuggestions = false,
}: {
  buttonClassName?: string;
  selectOnOpen?: boolean;
  forceNewAnalysis?: boolean;
  withAutosuggestions?: boolean;
}) => {
  const router = useRouter();
  const { url, changeUrl } = useAnalysisForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isPendingRef = useRef(false);

  const existingAnalysis = useExistingAnalysisMeta(url);

  const formattedDate = useDateFormat(existingAnalysis.analyzedAt);

  const { startNewAnalysis, error } = useStartNewAnalysis();

  const handleNavigateToExistingAnalysis = useCallback(() => {
    if (existingAnalysis.status === 'NOT_FOUND') {
      throw new Error('No existing analysis found');
    }
    router.push(`/analysis/${existingAnalysis.id}`);
  }, [existingAnalysis, router]);

  const shouldNavigateToExistingAnalysis =
    !forceNewAnalysis && existingAnalysis.status === 'FOUND';

  useEffect(() => {
    if (
      !isSubmitted ||
      existingAnalysis.status === 'PENDING' ||
      isPendingRef.current
    ) {
      return;
    }
    try {
      isPendingRef.current = true;
      if (shouldNavigateToExistingAnalysis) {
        handleNavigateToExistingAnalysis();
      } else {
        startNewAnalysis(url);
      }
    } finally {
      isPendingRef.current = false;
      setIsSubmitted(false);
    }
  }, [
    isSubmitted,
    url,
    existingAnalysis,
    startNewAnalysis,
    shouldNavigateToExistingAnalysis,
    handleNavigateToExistingAnalysis,
  ]);

  const changeUrlAndSubmit = (url: string) => {
    changeUrl(url);
    setIsSubmitted(true);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitted(true);
      }}
      className="space-y-8 justify-center items-center min-w-[400px] max-w-[420px]"
    >
      <InputWithSubmit
        id="url"
        type="text"
        value={url}
        onInputChange={changeUrl}
        placeholder="https://"
        spellCheck="false"
        autoFocus
        isLoading={isSubmitted}
        autoCapitalize="off"
        autoCorrect="off"
        validate={validateUrl}
        buttonClassName={buttonClassName}
        selectOnOpen={selectOnOpen}
        tooltipContent={
          shouldNavigateToExistingAnalysis ? (
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

      {withAutosuggestions && (
        <URLSuggestions onChangeUrl={changeUrlAndSubmit} />
      )}
    </form>
  );
};
