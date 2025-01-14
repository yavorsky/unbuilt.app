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
import { analyzeWebsite } from '@/actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export const URLBreadcrumb: FC<{
  url: string;
  variant?: 'large' | 'medium';
  skipSubmit?: boolean;
  skipBackground?: boolean;
  className?: string;
}> = ({ url, variant, skipBackground, skipSubmit, className }) => {
  const [newUrl, setNewUrl] = useState(url);
  const handleNewUrlChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setNewUrl(evt.currentTarget.value);
    },
    []
  );
  const isUrlChanged = newUrl !== url;

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleStartNewAnalyis = useCallback(async () => {
    if (!isUrlChanged) {
      return;
    }
    setIsPending(true);
    const form = new FormData();
    form.append('url', newUrl);
    toast({
      title: `Starting analysis for ${newUrl}`,
      description: 'Redirecting you to the existing analysis.',
    });
    const result = await analyzeWebsite(form, true);
    if (result.analysisId) {
      return router.push(`/analysis/${result.analysisId}`);
    }
    setIsPending(false);
  }, [newUrl, router, isUrlChanged]);

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
    return () => {
      if (blurTimeoutRef.current !== null) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const textClass =
    variant === 'large'
      ? 'text-3xl font-bold text-white'
      : 'text-lg font-normal text-white';

  return (
    <BreadcrumbItem className={`${textClass} ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStartNewAnalyis();
        }}
        className="flex items-center"
      >
        <FocusedInput
          type="text"
          name="url"
          id="url"
          skipBackground={skipBackground}
          value={newUrl}
          onChange={handleNewUrlChange}
          onBlur={handleBlur}
          className={`bg-transparent text-white border-none outline-none p-0 focus:ring-0 ${textClass}`}
          withSubmit={!skipSubmit && !!isUrlChanged}
          isPending={isPending}
        />
      </form>
    </BreadcrumbItem>
  );
};
