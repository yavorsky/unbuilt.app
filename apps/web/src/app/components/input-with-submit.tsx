import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  useCallback,
  ReactNode,
} from 'react';

interface InputWithSubmitProps extends InputHTMLAttributes<HTMLInputElement> {
  onInputChange?: (url: string) => void;
  validate?: (url: string) => boolean;
  value: string;
  tooltipContent?: ReactNode;
  isLoading?: boolean;
}

export const InputWithSubmit = ({
  value,
  isLoading,
  className,
  tooltipContent,
  validate,
  onInputChange,
  ...props
}: InputWithSubmitProps) => {
  const isValidValue = validate?.(value) ?? true;

  const handleUrlUpdate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onInputChange?.(e.currentTarget.value);
    },
    [onInputChange]
  );
  const dataState = isLoading ? 'loading' : '';

  return (
    <div className="relative z-20 overflow-hidden rounded-[18px]">
      <div
        className="absolute inset-0 z-[-1] hidden data-[state=loading]:block bg-transparent rounded-[18px]"
        data-state={dataState}
      >
        <div
          className="w-[100px] aspect-[2/1] absolute animate-border-rotate
                  bg-[radial-gradient(100%_100%_at_right,#760ec3,transparent_50%)] [offset-path:border-box] [offset-anchor:100%_50%]"
        ></div>
      </div>
      <Input
        onChange={handleUrlUpdate}
        value={value}
        data-state={dataState}
        className={`bg-accent h-14 [background-clip:padding-box] pl-6 pr-32 border-2 border-transparent rounded-[18px] focus:border-indigo-500 focus-visible:ring-0 ${className}`}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <TooltipProvider>
          {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStartNewAnalyis();
                      }}
                      className="transition-all duration-300 h-10 ease-in-out text-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary disabled:bg-secondary/20 border-0"
                      disabled={isLoading || !isValidUrl}
                      variant="outline"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Unbuild Again
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 bg-gray-900/90 backdrop-blur-sm border-gray-800 text-foreground/80 rounded-lg text-sm">
                    <p className="text-center">
                      Re-trigger the new analysis process. (Usually takes up to
                      10 seconds)
                      <br />
                      Useful if latest analysis is old or new technology was
                      added.
                    </p>
                  </TooltipContent>
                </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                className="flex-1 px-8 h-9 transition-all duration-300 ease-in-out bg-[#4455FF] hover:bg-[#4455FF]/80 disabled:opacity-30 rounded-[8px] border-0 text-white"
                disabled={isLoading || !isValidValue}
              >
                <span>Unbuild</span>
              </Button>
            </TooltipTrigger>
            {tooltipContent && (
              <TooltipContent className="p-2 bg-gray-900/90 backdrop-blur-sm border-gray-800 text-foreground/80 rounded-lg text-sm">
                {tooltipContent}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
