'use client';

import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import FocusedInput from '../focused-input';
import { useFormState } from 'react-dom';
import { analyzeWebsite } from '@/actions';
import { redirect } from 'next/navigation';
import { useActiveCategory } from '@/app/contexts/active-category';

export const URLBreadcrumb: FC<{
  url: string;
  variant?: 'large' | 'medium';
  skipSubmit?: boolean;
  skipBackground?: boolean;
  className?: string;
}> = ({ url, variant, skipBackground, skipSubmit, className }) => {
  const [newUrl, setNewUrl] = useState(url);
  const { activeCategory } = useActiveCategory();
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

  const blurTimeoutRef = useRef<number | null>(null);

  const handleBlur = useCallback(() => {
    if (blurTimeoutRef.current !== null) {
      clearTimeout(blurTimeoutRef.current);
    }

    if (isUrlChanged) {
      blurTimeoutRef.current = window.setTimeout(() => {
        setNewUrl(url);
        blurTimeoutRef.current = null;
      });
    }
  }, [isUrlChanged, url]);

  useEffect(() => {
    if (state.analysisId) {
      // In case user updated the URL, we need to redirect to the new analysis with selected category
      // Not sure if it needed, but at least we'll preserve the state user created.
      const categoryStr = activeCategory ? `/${activeCategory}` : '';
      redirect(`/analysis/${state.analysisId}${categoryStr}`);
    }
  }, [state, activeCategory]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current !== null) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const textClass =
    variant === 'large' ? 'text-3xl font-bold text-white' : 'text-m text-white';

  return (
    <BreadcrumbItem className={`${textClass} ${className}`}>
      <form action={formAction} className="flex items-center">
        <FocusedInput
          type="text"
          name="url"
          id="url"
          skipBackground={skipBackground}
          value={newUrl}
          onChange={handleNewUrlChange}
          onBlur={handleBlur}
          className={`bg-transparent text-white font-normal border-none outline-none p-0 focus:ring-0 ${textClass}`}
          style={{ width: `${newUrl.length}ch` }}
          withSubmit={!skipSubmit && !!isUrlChanged}
          isPending={isPending}
        />
      </form>
    </BreadcrumbItem>
  );
};
