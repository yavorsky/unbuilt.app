import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { InfoIcon } from 'lucide-react';

export const NotDetectedLabel = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            Not Detected <InfoIcon className="w-4 h-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-60">
          <p>
            The app doesn&apos;t use this technology type or it uses one that
            unbuilt doesn&apos;t yet recognize
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
