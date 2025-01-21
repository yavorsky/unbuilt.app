import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
import { AnalysisFeatures } from '../../types/analysis.js';
import { detectFeature } from '../../utils/detect-feature.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  return detectFeature({
    type: 'dates',
    resources,
    page,
    browser,
    patterns,
    analysis,
  });
};
