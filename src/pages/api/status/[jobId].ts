import type { NextApiRequest, NextApiResponse } from 'next';
import { Queue } from 'bull';

const analysisQueue = new Queue('website-analysis', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;

  try {
    const job = await analysisQueue.getJob(jobId as string);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return res.status(200).json({
      jobId,
      status: state,
      result: result || null,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ error: 'Failed to check status' });
  }
}