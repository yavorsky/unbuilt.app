import { AnalyzeResult } from '@unbuilt/analyzer';
import { FC } from 'react';

export const JSONResult: FC<{
  result: AnalyzeResult;
  finishedOn: string;
  id: number;
  status: string;
}> = ({ result, finishedOn, id, status }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-bold">Status: {status}</h3>
        <p>Result ID: {id}</p>
        <p>Started: {new Date(result.timestamp).toLocaleString()}</p>
        {finishedOn && <p>Finished: {new Date(finishedOn).toLocaleString()}</p>}
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
