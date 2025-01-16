'use client';

import { FC } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ErrorState: FC<{ error?: string | null; className?: string }> = ({
  error,
  className,
}) => {
  return (
    <div
      className={`max-w-sm mx-auto flex flex-col justify-center px-4 ${className}`}
    >
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-lg">Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="text-xl">
            {error ??
              'Something went wrong. Please try again later or report an issue.'}
          </div>
          <div className="flex text-foreground/60 text-base space-x-2">
            <a
              className="hover:text-foreground underline"
              href="https://github.com/yavorsky/unbuilt.app/issues/new?template=Blank+issue"
              target="_blank"
              rel="noreferrer"
            >
              Report an issue
            </a>
            <span>or</span>
            <a
              className="hover:text-foreground underline"
              href="/"
              rel="noreferrer"
            >
              Start New Analysis
            </a>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
