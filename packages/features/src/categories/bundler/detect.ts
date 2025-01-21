import { Browser, Page } from 'playwright';
import { patterns } from './patterns/index.js';
import { Resources } from '@unbuilt/resources';
import { AnalysisFeatures } from '../../types/analysis.js';
import { detectFeature } from '../../utils/detect-feature.js';

export const detect = async (
  page: Page,
  browser: Browser,
  resources: Resources,
  analysis?: AnalysisFeatures
) => {
  return detectFeature({
    type: 'bundler',
    resources,
    page,
    browser,
    patterns,
    analysis,
  });
};
