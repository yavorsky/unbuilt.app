import { AnalyzeResult } from '@unbuilt/analyzer';

type TechnologyKeys = Exclude<
  keyof AnalyzeResult['analysis'],
  'stats' | 'stylingLibraries'
>;

export function extractSecondaryMatches(analysis: AnalyzeResult['analysis']) {
  const result: Record<TechnologyKeys, Record<string, unknown>> = {
    bundler: analysis.bundler?.secondaryMatches || {},
    transpiler: analysis.transpiler?.secondaryMatches || {},
    framework: analysis.framework?.secondaryMatches || {},
    minifier: analysis.minifier?.secondaryMatches || {},
    stylingProcessor: analysis.stylingProcessor?.secondaryMatches || {},
    modules: analysis.modules?.secondaryMatches || {},
    router: analysis.router?.secondaryMatches || {},
    dates: analysis.dates?.secondaryMatches || {},
    translations: analysis.translations?.secondaryMatches || {},
    stateManagement: analysis.stateManagement?.secondaryMatches || {},
    uiLibrary: analysis.uiLibrary?.secondaryMatches || {},
    httpClient: analysis.httpClient?.secondaryMatches || {},
  };

  return result;
}

export function extractDetectedFeatures(analysis: AnalyzeResult['analysis']) {
  const result: Partial<Record<TechnologyKeys, string[]>> = {};

  if (analysis.transpiler?.detectedFeatures) {
    result.transpiler = Array.from(analysis.transpiler.detectedFeatures);
  }
  if (analysis.framework?.detectedFeatures) {
    result.framework = Array.from(analysis.framework.detectedFeatures);
  }
  if (analysis.uiLibrary?.detectedFeatures) {
    result.uiLibrary = Array.from(analysis.uiLibrary.detectedFeatures);
  }

  return result;
}
