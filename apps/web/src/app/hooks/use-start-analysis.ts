'use client';

import { analyzeWebsite } from '@/actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useState } from 'react';

export const useStartNewAnalysis = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const startNewAnalysis = useCallback(
    async (url: string) => {
      setIsPending(true);
      const form = new FormData();
      form.append('url', url);
      toast({
        title: `Starting analysis for ${url}`,
        description: 'Redirecting you to the existing analysis.',
      });
      const result = await analyzeWebsite(form, true);
      if (result.analysisId) {
        return router.push(`/analysis/${result.analysisId}`);
      }
      setIsPending(false);
    },
    [router]
  );

  return { startNewAnalysis, isPending };
};
