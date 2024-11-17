import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FC } from 'react';

export const ConfidenceIndicator: FC<{ confidence: number }> = ({ confidence }) => {
  const maxBlocks = 4;
  const filledBlocks = Math.round((confidence / 5) * maxBlocks);
  const percentage = Math.round((confidence / 5) * 100);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Confidence</span>
            <div className="flex gap-1">
              {[...Array(maxBlocks)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm transition-colors duration-300 ${
                    i < filledBlocks ? 'bg-indigo-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Confidence: {percentage}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
