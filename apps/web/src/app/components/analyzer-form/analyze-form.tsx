'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { analyzeWebsite } from '../../../actions';
import { URLInput } from './url-input';
import { SubmitButton } from './submit-button';

export const AnalyzeForm = () => {
  const [state, formAction, isPending] = useFormState(analyzeWebsite, {
    error: null,
  });

  useEffect(() => {
    if (state.jobId) {
      redirect(`/results?jobId=${state.jobId}`);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex w-full items-around space-x-2 mb-2">
        <URLInput name="url" id="url" required />
        <SubmitButton isPending={isPending} />
      </div>

      <p className="text-sm text-gray-500">
        Unbuilt.app is currently in development phase. Some results could be
        wrong.
      </p>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
};
