import { analyzeWebsite } from '@/actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { trackAnalysisStart } from '../utils/analytics';

export const useStartNewAnalysis = () => {
  const [isNewAnalysisPending, setIsNewAnalysisPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startNewAnalysis = useCallback(
    async (url: string) => {
      setIsNewAnalysisPending(true);
      const form = new FormData();
      form.append('url', url);
      toast({
        title: `Starting analysis for ${url}`,
        description: 'Usually takes up to 10 seconds.',
      });
      const result = await analyzeWebsite(form);
      trackAnalysisStart(url, false);

      if (result.analysisId) {
        return router.push(`/analysis/${result.analysisId}`);
      } else if (result.error) {
        setError(result.error);
        return;
      }
      setIsNewAnalysisPending(false);
    },
    [router]
  );

  return useMemo(
    () => ({
      startNewAnalysis,
      isNewAnalysisPending,
      error,
    }),
    [startNewAnalysis, isNewAnalysisPending, error]
  );
};
