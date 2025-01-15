import { Button, Input } from '@/components/ui';
import { ArrowRight, Loader2, Pencil } from 'lucide-react';
import React, {
  useState,
  InputHTMLAttributes,
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
  useRef,
  useCallback,
  KeyboardEvent,
  useEffect,
} from 'react';

interface FocusedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
  value: string;
  withSubmit?: boolean;
  withPencil?: boolean;
  isPending?: boolean;
  skipBackground?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FocusedInput: React.FC<FocusedInputProps> = ({
  value,
  onChange,
  className = '',
  withSubmit = false,
  withPencil = false,
  isPending = false,
  skipBackground = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (measureRef.current) {
      const newWidth = measureRef.current.offsetWidth;
      setWidth(Math.max(newWidth + 16, 40)); // Add padding and set minimum width
    }
  }, [value]);

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
      {/* Hidden span to calculate width */}
      <span
        ref={measureRef}
        className={`absolute invisible whitespace-pre ${className}`}
      >
        {value || props.placeholder || ''}
      </span>
      {isFocused && !skipBackground && (
        <div
          className="fixed inset-0 bg-black/50 z-20 transition-opacity duration-200 pr-4"
          onClick={handleOverlayClick}
        />
      )}
      <div className="relative flex-1 group/input">
        <Input
          {...props}
          style={{ width: `${width}px` }}
          ref={inputRef}
          value={value}
          onChange={onChange}
          className={`relative z-30 text-foreground text-xl border-none outline-none p-0 pr-8 focus:ring-0
             transition-all duration-50 ring-0 focus-visible:ring-0
            ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {!isFocused && withPencil && (
          <Pencil
            className="absolute -right-1 top-1/2 -translate-y-1/2 h-4 w-4
            text-white/70 opacity-0 pointer-events-none
            transition-opacity duration-200
            group-hover/input:opacity-50"
          />
        )}
      </div>
      {withSubmit && (
        <Button
          className="absolute -right-12 bg-blue-700 hover:bg-blue-600 mt-1 border-0 px-2 py-4 z-30"
          variant="outline"
          type="submit"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <ArrowRight className="h-5 w-5 text-white" />
          )}
        </Button>
      )}
    </div>
  );
};

export default FocusedInput;
