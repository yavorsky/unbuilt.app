import { AnalyzeResult } from '@unbuilt/analyzer';

type TechnologyKeys = Exclude<
  keyof AnalyzeResult['analysis'],
  'stats' | 'stylingLibraries'
>;

export function extractSecondaryMatches(analysis: AnalyzeResult['analysis']) {
  const result: Record<TechnologyKeys, Record<string, unknown>> = {
    bundler: analysis.bundler?.secondaryMatches || {},
    transpiler: analysis.transpiler?.secondaryMatches || {},
    errorTracking: analysis.errorTracking?.secondaryMatches || {},
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
    analytics: analysis.analytics?.secondaryMatches || {},
    platform: analysis.platform?.secondaryMatches || {},
  };

  return result;
}

export function extractDetectedFeatures(analysis: AnalyzeResult['analysis']) {
  const result: Partial<Record<TechnologyKeys, string[]>> = {
    bundler: Array.from(analysis.bundler?.detectedFeatures),
    transpiler: Array.from(analysis.transpiler?.detectedFeatures),
    errorTracking: Array.from(analysis.errorTracking?.detectedFeatures),
    framework: Array.from(analysis.framework?.detectedFeatures),
    minifier: Array.from(analysis.minifier?.detectedFeatures),
    stylingProcessor: Array.from(analysis.stylingProcessor?.detectedFeatures),
    modules: Array.from(analysis.modules?.detectedFeatures),
    router: Array.from(analysis.router?.detectedFeatures),
    dates: Array.from(analysis.dates?.detectedFeatures),
    translations: Array.from(analysis.translations?.detectedFeatures),
    stateManagement: Array.from(analysis.stateManagement?.detectedFeatures),
    analytics: Array.from(analysis.analytics?.detectedFeatures),
    uiLibrary: Array.from(analysis.uiLibrary?.detectedFeatures),
    httpClient: Array.from(analysis.httpClient?.detectedFeatures),
    platform: Array.from(analysis.platform?.detectedFeatures),
  };

  return result;
}
