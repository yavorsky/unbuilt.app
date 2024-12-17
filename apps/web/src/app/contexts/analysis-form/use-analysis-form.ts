import { useContext } from 'react';
import { AnalysisFormContext } from './analysis-form-context';

export const useAnalysisForm = () => {
  const analysisForm = useContext(AnalysisFormContext);

  if (!analysisForm) {
    throw new Error(
      'useAnalysisForm must be used within an AnalysisFormProvider'
    );
  }

  return analysisForm;
};
