'use client'

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { analyzeWebsite } from '../../../actions';
import { URLInput } from './URLInput';
import { SubmitButton } from './SubmitButton';

export const AnalyzeForm = () => {
  const [state, formAction, isPending] = useFormState(analyzeWebsite, { error: null });

  useEffect(() => {
    if (state.jobId) {
      redirect(`/results?jobId=${state.jobId}`);
    }
  }, [state]);


  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          Website URL
        </label>
        <URLInput
          name="url"
          id="url"
          required
        />
      </div>

      <SubmitButton isPending={isPending} />

      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  );
}
