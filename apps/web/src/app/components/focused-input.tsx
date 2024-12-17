import { Button, Input } from '@/components/ui';
import { ChevronRight, Loader2, Pencil } from 'lucide-react';
import React, {
  useState,
  InputHTMLAttributes,
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
  useRef,
  useCallback,
  KeyboardEvent,
} from 'react';

interface FocusedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
  value: string;
  withSubmit?: boolean;
  isPending?: boolean;
  skipBackground?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FocusedInput: React.FC<FocusedInputProps> = ({
  value,
  onChange,
  className = '',
  withSubmit = false,
  isPending = false,
  skipBackground = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: ReactFocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: ReactFocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleOverlayClick = (): void => {
    setIsFocused(false);
    props.onBlur?.(
      new FocusEvent('blur') as unknown as ReactFocusEvent<HTMLInputElement>
    );
  };

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  }, []);

  return (
    <div className="relative flex items-center">
      {isFocused && !skipBackground && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
          onClick={handleOverlayClick}
        />
      )}
      <div className="relative flex-1 group/input">
        <Input
          {...props}
          ref={inputRef}
          value={value}
          onChange={onChange}
          className={`relative z-50 bg-transparent text-white text-xl border-none outline-none p-0 pr-8 focus:ring-0
             transition-all duration-200
            ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {!isFocused && (
          <Pencil
            className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4
            text-white/70 opacity-0 pointer-events-none
            transition-opacity duration-200
            group-hover/input:opacity-50"
          />
        )}
      </div>
      {withSubmit && (
        <Button
          className="absolute -right-6 bg-transparent mt-1 px-2 py-2 z-50"
          variant="secondary"
          type="submit"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-500" />
          )}
        </Button>
      )}
    </div>
  );
};

export default FocusedInput;
