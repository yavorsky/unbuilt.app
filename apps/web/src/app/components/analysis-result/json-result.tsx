import { Progress } from '@/components/ui/progress';
import { OnProgressResult } from '@unbuilt/analyzer';
import { FC } from 'react';

export const JSONResult: FC<{
  result: OnProgressResult;
  id: string;
  status: string;
  started: number;
  progress: number;
  isLoading: boolean;
}> = ({ result, id, status, started, isLoading, progress }) => {
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center mt-20 max-w-7xl mx-auto">
          <Progress value={progress ?? 0} />
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-bold">Status: {status}</h3>
        <p>Result ID: {id}</p>
        <p>Started: {new Date(started).toLocaleString()}</p>
        <p>Finished: {new Date(result.timestamp).toLocaleString()}</p>
        <p>Duration: {result.duration}ms</p>
      </div>

      {result && (
        <div className="p-4 bg-white border rounded">
          <h3 className="font-bold mb-2">Analysis Results</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
