import { AnalysisManager } from '@/server/analysis-manager';
import { trackError } from '@/app/utils/error-monitoring';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const analysisId = params.id;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      const sendError = (error: string) => {
        sendEvent({ type: 'error', error });
        controller.close();
      };

      let isComplete = false;
      let pollInterval: ReturnType<typeof setInterval> | null = null;

      const cleanup = () => {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        cleanup();
        if (!isComplete) {
          controller.close();
        }
      });

      try {
        const manager = AnalysisManager.getInstance();

        // Send initial status immediately
        const initialStatus = await manager.getAnalysisResults(analysisId);
        sendEvent({
          type: 'status',
          data: initialStatus,
        });

        // If already completed or failed, close the stream
        if (
          initialStatus.status === 'completed' ||
          initialStatus.status === 'failed'
        ) {
          isComplete = true;
          controller.close();
          return;
        }

        // Poll for updates every 500ms (more responsive than 2s polling)
        pollInterval = setInterval(async () => {
          try {
            const status = await manager.getAnalysisResults(analysisId);

            sendEvent({
              type: 'status',
              data: status,
            });

            // Close stream when analysis is complete or failed
            if (status.status === 'completed' || status.status === 'failed') {
              isComplete = true;
              cleanup();
              controller.close();
            }
          } catch (error) {
            trackError(error as Error, { analysisId });
            sendError('Failed to get analysis status');
            cleanup();
          }
        }, 500);
      } catch (error) {
        trackError(error as Error, { analysisId });
        sendError('Analysis not found');
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
