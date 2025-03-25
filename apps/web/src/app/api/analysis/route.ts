import { saveAnalysis } from '@/server/api';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await saveAnalysis(body?.id, body);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        cause: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
