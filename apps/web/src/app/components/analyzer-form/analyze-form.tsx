'use client';

import { useCallback, useState } from 'react';
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
import { useDateFormat } from '@/hooks/use-date-format';
import { validateUrl } from '@/app/utils/validate-url';

export const AnalyzeForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { url } = useAnalysisForm();
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
  const isValidUrl = validateUrl(url);

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
        <div className="flex overflow-hidden mt-4 gap-2">
          {existingAnalysis.status === 'FOUND' ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStartNewAnalyis();
                      }}
                      className="transition-all duration-300 ease-in-out  text-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary disabled:bg-secondary/20 border-0"
                      disabled={isLoading || !isValidUrl}
                      variant="outline"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Unbuild Again
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 bg-gray-900/90 backdrop-blur-sm border-gray-800 text-foreground/80 rounded-lg text-sm">
                    <p className="text-center">
                      Re-trigger the new analysis process. (Usually takes up to
                      10 seconds)
                      <br />
                      Useful if latest analysis is old or new technology was
                      added.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      className="flex-1 transition-all duration-300 ease-in-out bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300 text-white"
                      disabled={isLoading || !isValidUrl}
                    >
                      <span className="hidden sm:inline">Latest Analysis</span>
                      <span className="sm:hidden">Latest</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 bg-gray-900/90 backdrop-blur-sm border-gray-800 text-foreground/80 rounded-lg text-sm">
                    <p>
                      See latest results for this web app from{' '}
                      <b>{formattedDate}</b>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <Button
              type="submit"
              className="w-full transition-all duration-300 ease-in-out min-w-[200px] text-white bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300/20 border-0"
              disabled={isLoading || !validateUrl(url)}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Unbuild
                  <ArrowRight className="ml-0 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-foreground/30">
        Unbuilt.app is currently in development phase. Some results could be
        wrong.
      </p>
      {error && <p className="text-red-500 text-base mt-4">{error}</p>}
    </form>
  );
};
