import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { AnalysisFormContext } from './analysis-form-context';

export const AnalysisFormProvider: FC<
  PropsWithChildren<{ initialUrl: string }>
> = ({ children, initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);

  const changeUrl = useCallback((url: string) => {
    const value = url.replace(/https:\/\//, '');
    setUrl(value);
  }, []);

  const analysisFormContext = useMemo(
    () => ({
      url,
      changeUrl,
      initialUrl,
      touched: url !== initialUrl,
    }),
    [url, changeUrl, initialUrl]
  );

  return (
    <AnalysisFormContext.Provider value={analysisFormContext}>
      {children}
    </AnalysisFormContext.Provider>
  );
};
