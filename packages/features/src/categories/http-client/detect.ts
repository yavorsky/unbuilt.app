import { Browser, Page } from 'playwright';
import { Resources } from '@unbuilt/resources';
import { patterns } from './patterns/index.js';
import { AnalysisFeatures } from '../../types/analysis.js';
import { detectFeature } from '../../detector/detect-feature.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  return detectFeature({
    type: 'httpClient',
    resources,
    page,
    browser,
    patterns,
    analysis,
    debug: true,
  });
};
