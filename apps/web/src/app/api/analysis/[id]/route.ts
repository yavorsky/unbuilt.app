import { getAnalysisResults } from '@/actions';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getAnalysisResults(params.id);
    return Response.json(result);
  } catch (error) {
    console.error('Analysis failed:', error);
    return Response.json(
      { error: 'Failed to get analysis results' },
      { status: 500 }
    );
  }
}
