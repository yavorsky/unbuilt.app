import { startAnalysis } from '@/actions/analyzer';
import { trackError } from '@/app/utils/error-monitoring';
import logger from '@/app/utils/logger/logger';

export async function POST(request: Request) {
  let analysisUrl: string | undefined;
  try {
    const { url, lookupForExisting = false } = await request.json();
    analysisUrl = url;
    logger.info('Starting analysis', { url, lookupForExisting });

    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await startAnalysis(url, lookupForExisting);
    return Response.json(result);
  } catch (error) {
    trackError(error as Error, { url: analysisUrl });
    return Response.json(
      { error: 'Failed to analyze website', message: (error as Error).message },
      { status: 500 }
    );
  }
}
