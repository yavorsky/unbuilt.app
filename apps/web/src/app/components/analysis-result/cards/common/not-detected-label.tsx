import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { InfoIcon } from 'lucide-react';
import { cn } from '@/app/utils';

export const NotDetectedLabel = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            <span className="shine-text text-foreground/50 transition-all duration-300">
              Not Detected
            </span>
            <InfoIcon
              className={cn(
                'w-4 h-4 transition-all duration-300',
                'opacity-50 group-hover/card:opacity-100'
              )}
            />
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
