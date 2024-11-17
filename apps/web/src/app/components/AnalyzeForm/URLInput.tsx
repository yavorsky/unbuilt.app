import { ChangeEvent, FC, useCallback, useRef, useState } from 'react';

export const URLInput: FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props) => {
  const [url, setUrl] = useState('https://');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const url = `https://${value.replace(/h?t?t?p?s?\:?\/?\/?/, '')}`;
    setUrl(url);
  };

  const forceCursorToEnd = useCallback(() => {
    if (inputRef.current && url === 'https://') {
      inputRef.current.setSelectionRange(url.length, url.length);
    }
  }, [url]);

  const handleFocus = () => {
    forceCursorToEnd();
  };

  const handleClick = () => {
    forceCursorToEnd();
  };

  return (
    <input
      {...props}
      ref={inputRef}
      type="url"
      onFocus={handleFocus}
      onClick={handleClick}
      onChange={handleUrlUpdate}
      value={url}
      placeholder="https://unbuilt.app"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
    />
  );
};
