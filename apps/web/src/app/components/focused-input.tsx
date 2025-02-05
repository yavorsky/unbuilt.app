import { Button, Input } from '@/components/ui';
import { Loader2, MoveRightIcon, Pencil, Repeat2Icon } from 'lucide-react';
import React, {
  useState,
  InputHTMLAttributes,
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
  useRef,
  useCallback,
  KeyboardEvent,
  useEffect,
  forwardRef,
} from 'react';
import { useActiveAnalysis } from '../contexts/active-analysis';
import { validateUrl } from '../utils';

interface FocusedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
  value: string;
  withSubmit?: boolean;
  withPencil?: boolean;
  skipBackground?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FocusedInput = forwardRef<HTMLInputElement, FocusedInputProps>(
  (
    {
      value,
      onChange,
      className = '',
      withSubmit = false,
      withPencil = false,
      skipBackground = false,
      ...props
    },
    forwardedRef
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
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
      setTimeout(() => {
        setIsFocused(false);
        props.onBlur?.(e);
      }, 100);
    };

    const handleOverlayClick = (): void => {
      setIsFocused(false);
      if (forwardedRef && 'current' in forwardedRef && forwardedRef.current) {
        forwardedRef.current.blur();
      }
      props.onBlur?.(
        new FocusEvent('blur') as unknown as ReactFocusEvent<HTMLInputElement>
      );
    };

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          if (
            forwardedRef &&
            'current' in forwardedRef &&
            forwardedRef.current
          ) {
            forwardedRef.current.blur();
          }
        }
      },
      [forwardedRef]
    );

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
            ref={forwardedRef}
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
        {withSubmit && isFocused && (
          <Button
            className="absolute -right-20 top-1/2 -translate-y-1/2 px-4 py-4 z-30 bg-primary hover:bg-primary/80 text-primary-foreground"
            type="submit"
            variant="ghost"
            disabled={!validateUrl(value)}
          >
            Unbuild
          </Button>
        )}
      </div>
    );
  }
);

FocusedInput.displayName = 'FocusedInput';

export default FocusedInput;
