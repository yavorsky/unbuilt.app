import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';

export const URLInput: FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = (props) => {
  const [url, setUrl] = useState('https://');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const url = `https://${value.replace(/h?t?t?p?s?\:?\/?\/?/, '').replace(/https\:\/\//, '')}`;
    setUrl(url);
  };

  const forceCursorToEnd = useCallback(() => {
    if (inputRef.current && url === 'https://') {
      inputRef.current.setSelectionRange(url.length, url.length);
    }
  }, [url]);

  useEffect(() => {
    inputRef.current?.focus();
    forceCursorToEnd();
  }, []);

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
      className="block w-full px-3 text-white outline-none border border-gray-500 py-2 rounded-md focus:border-indigo-500 "
    />
  );
};
