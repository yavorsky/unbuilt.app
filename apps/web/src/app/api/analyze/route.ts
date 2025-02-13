import { startAnalysis } from '@/actions/analyzer';

export async function POST(request: Request) {
  try {
    const { url, lookupForExisting = false } = await request.json();
    console.log('starting analysis...', url, lookupForExisting);

    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await startAnalysis(url, lookupForExisting);
    return Response.json(result);
  } catch (error) {
    console.error('Analysis failed:', error);
    return Response.json(
      { error: 'Failed to analyze website', message: (error as Error).message },
      { status: 500 }
    );
  }
}
