'use client';

import {
  ChangeEvent,
  forwardRef,
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

interface URLBreadcrumbProps {
  url: string;
  variant?: 'large' | 'medium';
  skipSubmit?: boolean;
  skipBackground?: boolean;
  className?: string;
}

export const URLBreadcrumb = forwardRef<HTMLInputElement, URLBreadcrumbProps>(
  ({ url, variant, skipBackground, skipSubmit, className }, ref) => {
    const [newUrl, setNewUrl] = useState(url);
    const handleNewUrlChange = useCallback(
      (evt: ChangeEvent<HTMLInputElement>) => {
        setNewUrl(evt.currentTarget.value);
      },
      []
    );

    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const urlIsChanged = newUrl !== url;

    const handleStartNewAnalyis = useCallback(async () => {
      setIsPending(true);
      const form = new FormData();
      form.append('url', newUrl);
      toast({
        title: `Starting analysis for ${newUrl}`,
        description: 'Redirecting you to the existing analysis.',
      });
      // If url was changed - look for existing analysis, if no - user wants to restart the analysis.
      // So we are not looking for existing analysis.
      const result = await analyzeWebsite(form, urlIsChanged);
      if (result.analysisId) {
        return router.push(`/analysis/${result.analysisId}`);
      }
      setIsPending(false);
    }, [newUrl, router, urlIsChanged]);

    const blurTimeoutRef = useRef<number | null>(null);

    const handleBlur = useCallback(() => {
      if (blurTimeoutRef.current !== null) {
        clearTimeout(blurTimeoutRef.current);
      }

      blurTimeoutRef.current = window.setTimeout(() => {
        setNewUrl(url);
        blurTimeoutRef.current = null;
      });
    }, [url]);

    useEffect(() => {
      return () => {
        if (blurTimeoutRef.current !== null) {
          clearTimeout(blurTimeoutRef.current);
        }
      };
    }, []);

    const textClass =
      variant === 'large'
        ? 'text-3xl font-bold text-foreground'
        : 'text-lg font-normal text-foreground';

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
            ref={ref}
            type="text"
            name="url"
            id="url"
            skipBackground={skipBackground}
            value={newUrl}
            onChange={handleNewUrlChange}
            onBlur={handleBlur}
            className={`text-foreground border-none outline-none p-0 focus:ring-0 ${textClass}`}
            withSubmit={!skipSubmit}
          />
        </form>
      </BreadcrumbItem>
    );
  }
);

URLBreadcrumb.displayName = 'URLBreadcrumb';
