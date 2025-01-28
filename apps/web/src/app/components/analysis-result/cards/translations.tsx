import { FC } from 'react';
import { LanguagesIcon } from 'lucide-react';
import type { AnalysisFeatures } from '@unbuilt/features';
import { SingleResultAnalysisCard } from './common/single-result-card';

export const TranslationsCard: FC<{
  translations: AnalysisFeatures['translations'] | undefined;
}> = ({ translations }) => {
  return (
    <SingleResultAnalysisCard
      name="translations"
      analysis={translations}
      Icon={LanguagesIcon}
    />
  );
};
