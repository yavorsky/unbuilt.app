import { saveAnalysis } from '@/server/api';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // In the future, we will introduce sessions, but for now we only want to limit cache updates to web app or CLI for admins.
    const adminPass = req.headers.get('X-Analysis-Passcode');

    const result = await saveAnalysis(body?.id, body, adminPass);

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
