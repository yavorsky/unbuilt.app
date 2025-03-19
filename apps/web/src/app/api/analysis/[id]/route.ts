import { getAnalysisResults } from '@/actions';
import { trackError } from '@/app/utils/error-monitoring';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getAnalysisResults(params.id);
    return Response.json(result);
  } catch (error) {
    trackError(error as Error, {
      analysisId: params.id,
    });
    return Response.json(
      { error: 'Failed to get analysis results' },
      { status: 500 }
    );
  }
}
