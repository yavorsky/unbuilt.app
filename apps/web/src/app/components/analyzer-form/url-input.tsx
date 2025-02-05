import { useAnalysisForm } from '@/app/contexts/analysis-form/use-analysis-form';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import {
  ChangeEvent,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react';

export const URLInput: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
  const { changeUrl, url, touched } = useAnalysisForm();
  const inputRef = useRef<HTMLInputElement>(null);

  const forceCursorToEnd = useCallback(() => {
    if (inputRef.current && !touched) {
      inputRef.current.setSelectionRange(url.length, url.length);
    }
  }, [url, touched]);

  const handleUrlUpdate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeUrl(e.currentTarget.value);
    },
    [changeUrl]
  );

  useEffect(() => {
    inputRef.current?.focus();
    forceCursorToEnd();
  }, [forceCursorToEnd]);

  const handleFocus = () => {
    forceCursorToEnd();
  };

  const handleClick = () => {
    forceCursorToEnd();
  };

  return (
    <div className="relative w-full">
      <Label
        htmlFor="url"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none text-foreground/50"
      >
        https://
      </Label>
      <Input
        {...props}
        ref={inputRef}
        type="text"
        id="url"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        onFocus={handleFocus}
        onClick={handleClick}
        onChange={handleUrlUpdate}
        value={url}
        className="w-full px-3 py-8 pr-24 text-base text-foreground outline-none border border-gray-500 rounded-2xl focus:border-indigo-500 focus-visible:ring-0"
      />
    </div>
  );
};
