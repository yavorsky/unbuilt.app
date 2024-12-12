import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import FocusedInput from '../focused-input';
import { useFormState } from 'react-dom';
import { analyzeWebsite } from '@/actions';
import { redirect } from 'next/navigation';

export const URLBreadcrumb: FC<{ url: string }> = ({ url }) => {
  const [newUrl, setNewUrl] = useState(url);
  const handleNewUrlChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setNewUrl(evt.currentTarget.value);
    },
    []
  );
  const isUrlChanged = newUrl !== url;

  const [state, formAction, isPending] = useFormState(analyzeWebsite, {
    error: null,
  });

  useEffect(() => {
    if (state.analysisId) {
      redirect(`/analysis/${state.analysisId}`);
    }
  }, [state]);

  return (
    <BreadcrumbItem className="text-xl">
      <form action={formAction} className="flex items-center">
        <label className="mr-1" htmlFor="url">
          https://
        </label>
        <FocusedInput
          type="text"
          name="url"
          id="url"
          value={newUrl}
          onChange={handleNewUrlChange}
          className="bg-transparent text-white text-xl border-none outline-none p-0 focus:ring-0"
          style={{ width: `${newUrl.length}ch` }}
          withSubmit={!!isUrlChanged}
          isPending={isPending}
        />
      </form>
    </BreadcrumbItem>
  );
};
