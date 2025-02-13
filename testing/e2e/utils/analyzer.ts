import fetch from 'node-fetch';
import { AnalysisResults, AnalyzerResponse } from './types.js';
import { getAnalyzerUrl } from './setup.js';

const POLLING_INTERVAL = 2000;
const MAX_POLLING_ATTEMPTS = 15;

export class AnalyzerClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getAnalyzerUrl();
  }

  async startAnalysis(url: string, lookupForExisting = false): Promise<string> {
    console.log(
      `Starting analysis for ${`${this.baseUrl}/api/analyze`} -- ${url}`
    );
    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, lookupForExisting }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start analysis: ${response.statusText}`);
    }

    const result = (await response.json()) as AnalyzerResponse;

    if (result.error) {
      throw new Error(`Analysis error: ${result.error}`);
    }

    if (!result.analysisId) {
      throw new Error('No analysis ID returned');
    }

    return result.analysisId;
  }

  async getAnalysisStatus(analysisId: string) {
    const response = await fetch(`${this.baseUrl}/api/analysis/${analysisId}`);

    if (!response.ok) {
      throw new Error(`Failed to get analysis status: ${response.statusText}`);
    }

    return response.json() as Promise<AnalysisResults>;
  }

  async waitForAnalysis(analysisId: string) {
    let attempts = 0;

    while (attempts < MAX_POLLING_ATTEMPTS) {
      const result = await this.getAnalysisStatus(analysisId);
      console.log(result.status, analysisId);

      if (result.status === 'completed') {
        return result.result;
      }

      if (result.status === 'failed') {
        throw new Error(`Analysis failed: ${result.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
    }

    throw new Error('Analysis timed out');
  }
}
