import { Button, Input } from '@/components/ui';
import { ChevronRight, Loader2 } from 'lucide-react';
import React, {
  useState,
  InputHTMLAttributes,
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
} from 'react';

interface FocusedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
  value: string;
  withSubmit?: boolean;
  isPending?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FocusedInput: React.FC<FocusedInputProps> = ({
  value,
  onChange,
  className = '',
  withSubmit = false,
  isPending = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

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

  return (
    <div className="relative flex items-center">
      {isFocused && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
          onClick={handleOverlayClick}
        />
      )}
      <Input
        {...props}
        value={value}
        onChange={onChange}
        className={`relative z-50 bg-transparent text-white text-xl border-none outline-none p-0 focus:ring-0 ${className}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {withSubmit && (
        <Button
          className="absolute -right-6 bg-transparent mt-1 px-2 py-2 z-50"
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
