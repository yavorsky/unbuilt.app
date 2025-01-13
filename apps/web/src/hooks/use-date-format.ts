import { useCallback, useMemo } from 'react';

// For react-component level usage
export const useDateFormat = (
  dateStr?: string | null,
  formatOptions?: Intl.DateTimeFormatOptions
) => {
  const handleDateFormat = useHandleDateFormat(formatOptions);

  return useMemo(() => {
    return handleDateFormat(dateStr);
  }, [dateStr, handleDateFormat]);
};

// For callback usage
export const useHandleDateFormat = (
  formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
) => {
  return useCallback(
    (dateStr?: string | null) => {
      if (!dateStr) return '';
      return new Intl.DateTimeFormat(undefined, formatOptions).format(
        new Date(dateStr)
      );
    },
    [formatOptions]
  );
};
