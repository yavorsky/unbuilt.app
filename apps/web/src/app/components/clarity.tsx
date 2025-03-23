// components/MicrosoftClarity.js
'use client'; // Required for Next.js App Router

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';
import logger from '../utils/logger/logger';
import { trackError } from '../utils/error-monitoring';

export default function MicrosoftClarity({
  projectId,
}: {
  projectId?: string;
}) {
  useEffect(() => {
    // Skip during development if desired
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof projectId !== 'string'
    ) {
      logger.info('Microsoft Clarity disabled');
      return;
    }

    // Initialize Clarity
    try {
      clarity.init(projectId);
      logger.info('Microsoft Clarity initialized successfully');
    } catch (error) {
      trackError(error as Error, { cause: 'Microsoft clarity init' });
    }
  }, [projectId]);

  // This component doesn't render anything
  return null;
}
