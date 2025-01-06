'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { URLInput } from './url-input';
import { useAnalysisForm } from '@/app/contexts/analysis-form/use-analysis-form';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { ArrowRight, Loader2, PlusCircle } from 'lucide-react';
import { useExistingAnalysisMeta } from '@/app/hooks/use-existing-analysis';
import { analyzeWebsite } from '@/actions';
import { toast } from '@/hooks/use-toast';

export const AnalyzeForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { url } = useAnalysisForm();
  const existingAnalysis = useExistingAnalysisMeta(url);

  const formattedDate = useMemo(() => {
    if (!existingAnalysis.analyzedAt) {
      return null;
    }
    const date = new Date(existingAnalysis.analyzedAt);
    return new Intl.DateTimeFormat(undefined).format(date);
  }, [existingAnalysis]);

  const handleStartNewAnalyis = useCallback(async () => {
    setIsPending(true);
    const form = new FormData();
    form.append('url', url);
    toast({
      title: `Starting analysis for ${url}`,
      description: 'Redirecting you to the existing analysis.',
    });
    const result = await analyzeWebsite(form);
    if (result.analysisId) {
      return router.push(`/analysis/${result.analysisId}`);
    } else if (result.error) {
      setError(result.error);
      return;
    }
    setIsPending(false);
  }, [url, router]);

  const handleNavigateToExistingAnalysis = useCallback(() => {
    if (existingAnalysis.status === 'NOT_FOUND') {
      throw new Error('No existing analysis found');
    }
    if (existingAnalysis.status === 'PENDING') {
      return;
    }
    return router.push(`/analysis/${existingAnalysis.id}`);
  }, [existingAnalysis, router]);

  const isLoading = existingAnalysis.status === 'PENDING' || isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (existingAnalysis.status === 'PENDING') {
          return;
        }
        if (existingAnalysis.status === 'FOUND') {
          handleNavigateToExistingAnalysis();
        } else {
          handleStartNewAnalyis();
        }
      }}
      className="space-y-4"
    >
      <div className="flex w-full items-around space-x mb-2 flex-col">
        <URLInput name="url" id="url" required />
        <div className="flex overflow-hidden mt-4">
          {existingAnalysis.status === 'FOUND' ? (
            <>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleStartNewAnalyis();
                }}
                className="transition-all duration-300 ease-in-out min-w-[140px] text-foreground hover:text-foreground bg-blue-700/20 hover:bg-blue-600/40 disabled:bg-blue-300/20 border-0"
                disabled={isLoading || !url}
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      className="flex-1 transition-all duration-300 ease-in-out min-w-[200px] bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300 ml-4"
                      disabled={isLoading || !url}
                    >
                      View Existing Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 bg-background text-foreground/80 rounded-lg text-sm">
                    <p>Last analyzed on: {formattedDate}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <Button
              type="submit"
              className="w-full transition-all duration-300 ease-in-out min-w-[200px] text-foreground hover:text-foreground bg-blue-700/40 hover:bg-blue-600/80 disabled:bg-blue-300/20 border-0"
              disabled={isLoading || !url}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Analyze
                  <ArrowRight className="ml-0 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-foreground/20">
        Unbuilt.app is currently in development phase. Some results could be
        wrong.
      </p>
      {error && <p className="text-red-500 text-base mt-4">{error}</p>}
    </form>
  );
};
