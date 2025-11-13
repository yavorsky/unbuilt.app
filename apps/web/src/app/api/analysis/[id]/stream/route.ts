import { AnalysisManager } from '@/server/analysis-manager';
import { QueueManager } from '@/server/queue-manager';
import { trackError } from '@/app/utils/error-monitoring';
import logger from '@/app/utils/logger/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const analysisId = params.id;

  logger.info('SSE connection requested', { analysisId });

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Helper function to send SSE message
      const sendEvent = (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial connection message
      sendEvent('connected', { analysisId });

      try {
        const queueManager = QueueManager.getInstance();
        await queueManager.initialize();

        const job = await queueManager.getJob(analysisId);

        if (!job) {
          // Job not in queue, check if it's completed in database
          const analysisManager = AnalysisManager.getInstance();
          try {
            const result = await analysisManager.getAnalysisResults(analysisId);
            sendEvent('status', result);

            if (result.status === 'completed' || result.status === 'failed') {
              sendEvent('close', { reason: 'Job already finished' });
              controller.close();
              return;
            }
          } catch (error) {
            sendEvent('error', {
              message: 'Analysis not found',
              analysisId
            });
            controller.close();
            return;
          }
        }

        // Send initial status
        if (job) {
          const state = await job.getState();
          const initialStatus = {
            id: job.id as string,
            status: state,
            result: job.data,
            progress: job.progress() as number,
            timestamp: job.timestamp ?? 0,
            processedOn: job.processedOn ?? 0,
            finishedOn: job.finishedOn ?? 0,
            error: job.failedReason ?? null,
          };
          sendEvent('status', initialStatus);
        }

        // Set up event listeners for this specific job
        const queue = queueManager.queue;
        if (!queue) {
          throw new Error('Queue not available');
        }

        let isClosed = false;

        const cleanup = () => {
          if (isClosed) return;
          isClosed = true;

          queue.off('progress', handleProgress);
          queue.off('completed', handleCompleted);
          queue.off('failed', handleFailed);
          queue.off('active', handleActive);

          logger.info('SSE connection closed', { analysisId });
        };

        // Handle progress updates
        const handleProgress = async (job: any, progress: number) => {
          if (job.id !== analysisId || isClosed) return;

          try {
            const state = await job.getState();
            sendEvent('status', {
              id: job.id,
              status: state,
              result: job.data,
              progress,
              timestamp: job.timestamp ?? 0,
              processedOn: job.processedOn ?? 0,
              finishedOn: job.finishedOn ?? 0,
              error: null,
            });
          } catch (err) {
            logger.error('Error handling progress event', {
              error: err,
              analysisId
            });
          }
        };

        // Handle job completion
        const handleCompleted = async (job: any, result: any) => {
          if (job.id !== analysisId || isClosed) return;

          try {
            sendEvent('status', {
              id: job.id,
              status: 'completed',
              result,
              progress: 100,
              timestamp: job.timestamp ?? 0,
              processedOn: job.processedOn ?? 0,
              finishedOn: job.finishedOn ?? Date.now(),
              error: null,
            });
            sendEvent('close', { reason: 'Job completed' });
            cleanup();
            controller.close();
          } catch (err) {
            logger.error('Error handling completed event', {
              error: err,
              analysisId
            });
          }
        };

        // Handle job failure
        const handleFailed = async (job: any, error: Error) => {
          if (job.id !== analysisId || isClosed) return;

          try {
            sendEvent('status', {
              id: job.id,
              status: 'failed',
              result: job.data,
              progress: job.progress() as number,
              timestamp: job.timestamp ?? 0,
              processedOn: job.processedOn ?? 0,
              finishedOn: job.finishedOn ?? Date.now(),
              error: error.message,
            });
            sendEvent('close', { reason: 'Job failed' });
            cleanup();
            controller.close();
          } catch (err) {
            logger.error('Error handling failed event', {
              error: err,
              analysisId
            });
          }
        };

        // Handle job active state
        const handleActive = async (job: any) => {
          if (job.id !== analysisId || isClosed) return;

          try {
            sendEvent('status', {
              id: job.id,
              status: 'active',
              result: job.data,
              progress: job.progress() as number,
              timestamp: job.timestamp ?? 0,
              processedOn: job.processedOn ?? Date.now(),
              finishedOn: null,
              error: null,
            });
          } catch (err) {
            logger.error('Error handling active event', {
              error: err,
              analysisId
            });
          }
        };

        // Register event listeners
        queue.on('progress', handleProgress);
        queue.on('completed', handleCompleted);
        queue.on('failed', handleFailed);
        queue.on('active', handleActive);

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          cleanup();
          controller.close();
        });

        // Set up a timeout to close stale connections (5 minutes)
        const timeout = setTimeout(() => {
          sendEvent('close', { reason: 'Timeout' });
          cleanup();
          controller.close();
        }, 5 * 60 * 1000);

        // Clean up timeout on close
        request.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
        });

      } catch (error) {
        trackError(error as Error, { analysisId });
        sendEvent('error', {
          message: 'Internal server error',
          error: (error as Error).message
        });
        controller.close();
      }
    },
  });

  // Return SSE response with appropriate headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
