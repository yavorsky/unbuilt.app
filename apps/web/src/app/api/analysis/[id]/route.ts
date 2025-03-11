import { getAnalysisResults } from '@/actions';
import { captureException } from '@sentry/nextjs';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getAnalysisResults(params.id);
    return Response.json(result);
  } catch (error) {
    captureException(error);
    return Response.json(
      { error: 'Failed to get analysis results' },
      { status: 500 }
    );
  }
}
