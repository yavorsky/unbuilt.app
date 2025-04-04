import { FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// TODO: Move to common helpers
export const getConfidenceBarInfo = (confidence: number) => {
  const maxBars = 4;
  const bars = Math.min(Math.round((confidence / 3) * maxBars), maxBars);
  const percentage = Math.min(Math.round((confidence / 3) * 100), 100);
  return { bars, maxBars, percentage, confidence };
};

export const ConfidenceIndicator: FC<{ confidence: number }> = ({
  confidence,
}) => {
  const { maxBars, bars, percentage } = getConfidenceBarInfo(confidence);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            {/* <span className="text-gray-400 text-sm">Confidence</span> */}
            <div className="flex gap-1">
              {[...Array(maxBars)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm transition-colors duration-300 ${
                    i < bars ? 'bg-indigo-500/70' : 'bg-secondary'
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
