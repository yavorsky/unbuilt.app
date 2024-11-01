// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { chromium } from 'playwright';
import { Queue } from 'bull';

interface AnalysisResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

// Initialize Redis queue
const analysisQueue = new Queue('website-analysis', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Add job to queue
    const job = await analysisQueue.add('analyze-website', {
      url,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      jobId: job.id.toString(),
      status: 'queued',
    });
  } catch (error) {
    console.error('Analysis request error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
