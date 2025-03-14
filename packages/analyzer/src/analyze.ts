import { Browser, Page } from 'playwright';
import { createProgressTracker } from './utils/progress.js';
import { Resources } from '@unbuilt/resources';
import { checkUrlAvailability } from './utils/check-for-availability.js';
import { errors } from './utils/errors.js';
import { navigateToPage } from './utils/navigate-to-page.js';
import {
  AnalysisFeaturesWithStats,
  AnalyzeResult,
  OnProgress,
} from './types.js';
import {
  analyzeFeature,
  detectionCategories,
} from './utils/analyze-feature.js';
import { AnalysisFeatures } from '@unbuilt/features';

export const analyze = async (
  url: string,
  id: string,
  page: Page,
  browser: Browser,
  handleProgress?: OnProgress,
  onError?: (error: Error) => void
): Promise<AnalyzeResult> => {
  const startedAt = new Date();

  const { isAvailable, finalUrl, wasRedirected } = await checkUrlAvailability(
    page,
    url
  );

  // Track no resource found on early stage
  if (!isAvailable) {
    // No need to track via sentry since exception is expected. No resource found is a valid use-case.
    throw new Error(errors.RESOURCE_NOT_AVAILABLE, { cause: url });
  }

  // Override url if it was redirected by server
  if (wasRedirected) {
    url = finalUrl;
  }

  // Initialize resources tracking
  const resources = new Resources(page);
  await resources.initialize();

  // Navigate to the page and wait for loading events with specific timeouts
  await navigateToPage(url, page, onError);

  // Create progress tracker
  const onProgress = createProgressTracker({
    url,
    id,
    onProgress: handleProgress,
    startedAt,
    totalResults: detectionCategories.length,
  });
  const analysis = {} as AnalysisFeaturesWithStats;

  // Run analysis in sequence. We can't use parallel because of the opened browsers limitation.
  for (const featureName of detectionCategories) {
    await analyzeFeature({
      featureName,
      analysis,
      page,
      browser,
      resources,
      onProgress,
    });
  }

  // Re-run analysis again, but only calling 'dependencies' checks. It will help us to update scores based on all categories.
  await Promise.all(
    detectionCategories
      .filter((key) => key !== 'stats')
      .map((key) =>
        analyzeFeature({
          featureName: key as keyof AnalysisFeatures,
          analysis,
          page,
          browser,
          resources,
          initialAnalysis: analysis,
        })
      )
  );

  const finishedAt = new Date();
  const duration = finishedAt.getTime() - startedAt.getTime();

  const result = {
    url,
    id,
    timestamp: finishedAt.toISOString(),
    duration,
    analysis,
  };

  handleProgress?.(result, 100);

  // Remove listeners and cancel ongoing requests
  await resources.cleanup();

  return result;
};
