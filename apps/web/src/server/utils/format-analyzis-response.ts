import { AnalyzeResult } from '@unbuilt/analyzer';
import { formatStylingLibrariesResponse } from './format-styling-libraries-response';
import { toCamelCase } from './convert-keys';

export const formatAnalyzisResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a response from the API. We'll fix supabase auto-generation later
  data: any
): AnalyzeResult => {
  return {
    url: data.url,
    id: data.id,
    timestamp: data.analyzed_at,
    duration: data.duration,
    analysis: {
      bundler: {
        type: 'bundler',
        name: data.bundler,
        confidence: data.bundler_confidence,
        detectedFeatures: data.additional_data?.detectedFeatures?.bundler || {},
        secondaryMatches: data.additional_data?.secondaryMatches?.bundler || {},
      },
      dates: {
        type: 'dates',
        name: data.dates,
        confidence: data.dates_confidence,
        detectedFeatures: data.additional_data?.detectedFeatures?.dates || {},
        secondaryMatches: data.additional_data?.secondaryMatches?.dates || {},
      },
      framework: {
        type: 'framework',
        name: data.framework,
        confidence: data.framework_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.framework || [],
        secondaryMatches:
          data.additional_data?.secondaryMatches?.framework || {},
      },
      httpClient: {
        type: 'httpClient',
        name: data.http_client,
        confidence: data.http_client_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.httpClient || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.httpClient || {},
      },
      platform: {
        type: 'platform',
        name: data.platform,
        confidence: data.platform_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.platform || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.platform || {},
      },
      analytics: {
        type: 'analytics',
        name: data.analytics,
        confidence: data.analytics_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.analytics || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.analytics || {},
      },
      minifier: {
        type: 'minifier',
        name: data.minifier,
        confidence: data.minifier_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.minifier || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.minifier || {},
      },
      modules: {
        type: 'modules',
        name: data.modules,
        confidence: data.modules_confidence,
        detectedFeatures: data.additional_data?.detectedFeatures?.modules || {},
        secondaryMatches: data.additional_data?.secondaryMatches?.modules || {},
      },
      router: {
        type: 'router',
        name: data.router,
        confidence: data.router_confidence,
        detectedFeatures: data.additional_data?.detectedFeatures?.router || {},
        secondaryMatches: data.additional_data?.secondaryMatches?.router || {},
      },
      stateManagement: {
        type: 'stateManagement',
        name: data.state_management,
        confidence: data.state_management_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.stateManagement || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.stateManagement || {},
      },
      translations: {
        type: 'translations',
        name: data.translations,
        confidence: data.translations_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.translations || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.translations || {},
      },
      transpiler: {
        type: 'transpiler',
        name: data.transpiler,
        confidence: data.transpiler_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.transpiler || [],
        secondaryMatches:
          data.additional_data?.secondaryMatches?.transpiler || {},
      },
      monitoring: {
        type: 'monitoring',
        name: data.monitoring,
        confidence: data.monitoring_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.monitoring || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.monitoring || {},
      },
      uiLibrary: {
        type: 'uiLibrary',
        name: data.ui_library,
        confidence: data.ui_library_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.uiLibrary || [],
        secondaryMatches:
          data.additional_data?.secondaryMatches?.uiLibrary || {},
      },
      stylingLibraries: {
        items: formatStylingLibrariesResponse(data.styling_libraries),
        detectedFeatures:
          data.additional_data?.detectedFeatures?.stylingLibraries || {},
      },
      stylingProcessor: {
        type: 'stylingProcessor',
        name: data.styling_processor,
        confidence: data.styling_processor_confidence,
        detectedFeatures:
          data.additional_data?.detectedFeatures?.stylingProcessor || {},
        secondaryMatches:
          data.additional_data?.secondaryMatches?.stylingProcessor || {},
      },
      stats: {
        resourceCount: data.resource_count,
        totalSize: data.total_size,
        scriptMetrics: toCamelCase(data.script_metrics),
        styleMetrics: toCamelCase(data.style_metrics ?? {}),
        imageMetrics: toCamelCase(data.image_metrics),
        domMetrics: toCamelCase(data.dom_metrics ?? {}),
      },
    },
  };
};
