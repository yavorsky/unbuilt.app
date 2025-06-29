import { redirect } from 'next/navigation';
import { getAnalysisMetaByUrl } from '@/actions';
import { startAnalysis } from '@/actions/analyzer';
import { normalizeUrl } from '@unbuilt/helpers';

interface PageProps {
  params: {
    url: string;
  };
}

export default async function AnalysePage({ params }: PageProps) {
  const decodedUrl = decodeURIComponent(params.url);

  try {
    // Normalize the URL for consistent lookups
    const normalizedUrl = normalizeUrl(decodedUrl);

    // Check if analysis exists for this URL
    const existingAnalysis = await getAnalysisMetaByUrl(normalizedUrl);

    if (existingAnalysis?.id) {
      // Redirect to the existing analysis
      redirect(`/analysis/${existingAnalysis.id}`);
    }

    // No existing analysis found, create a new one
    const result = await startAnalysis(normalizedUrl, false);

    if (result.analysisId) {
      // Redirect to the new analysis
      redirect(`/analysis/${result.analysisId}`);
    }

    // If there's an error, redirect to home with error message
    redirect(
      `/?error=${encodeURIComponent(result.error || 'Failed to start analysis')}`
    );
  } catch (error) {
    console.error('Error in analyse route:', error);
    redirect(`/?error=${encodeURIComponent('Invalid URL or analysis failed')}`);
  }
}
