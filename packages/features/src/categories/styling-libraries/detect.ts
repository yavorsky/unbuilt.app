import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
import { AnalysisFeatures } from '../../types/analysis.js';
import { detectMultipleFeatures } from '../../detector/detect-multiple-features.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  return detectMultipleFeatures({
    type: 'stylingLibraries',
    resources,
    page,
    browser,
    patterns,
    analysis,
    minConfidence: 0.8,
    debug: true,
  });
};
