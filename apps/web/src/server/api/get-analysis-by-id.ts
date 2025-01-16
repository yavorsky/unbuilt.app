import { AnalyzeResult } from '@unbuilt/analyzer';
import { supabase } from '../supabase';

/**
 * Get analysis by ID
 */
export async function getAnalysisById(id: string) {
  try {
    const { data, error } = await supabase
      .from('tech_stack_analysis')
      .select(
        `
        *,
        styling_libraries (
          library,
          confidence,
          matched
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;

    const formattedData = formatAnalyzis(data);

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return { data: null, error };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: make supabase results staticly typesafe
const formatAnalyzis = (data: any): AnalyzeResult => {
  return {
    url: data.url,
    timestamp: data.analyzed_at,
    duration: data.duration,
    analysis: {
      bundler: {
        type: 'bundler',
        name: data.bundler,
        confidence: data.bundler_confidence,
        secondaryMatches: data.additional_data?.secondaryMatches?.bundler || {},
      },
      dates: {
        type: 'dates',
        name: data.dates,
        confidence: data.dates_confidence,
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
        secondaryMatches:
          data.additional_data?.secondaryMatches?.httpClient || {},
      },
      minifier: {
        type: 'minifier',
        name: data.minifier,
        confidence: data.minifier_confidence,
        secondaryMatches:
          data.additional_data?.secondaryMatches?.minifier || {},
      },
      modules: {
        type: 'modules',
        name: data.modules,
        confidence: data.modules_confidence,
        secondaryMatches: data.additional_data?.secondaryMatches?.modules || {},
      },
      router: {
        type: 'router',
        name: data.router,
        confidence: data.router_confidence,
        secondaryMatches: data.additional_data?.secondaryMatches?.router || {},
      },
      stateManagement: {
        type: 'stateManagement',
        name: data.state_management,
        confidence: data.state_management_confidence,
        secondaryMatches:
          data.additional_data?.secondaryMatches?.stateManagement || {},
      },
      translations: {
        type: 'translations',
        name: data.translations,
        confidence: data.translations_confidence,
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
        items: formatStylingLibraries(data.styling_libraries),
      },
      stylingProcessor: {
        type: 'stylingProcessor',
        name: data.styling_processor,
        confidence: data.styling_processor_confidence,
        secondaryMatches:
          data.additional_data?.secondaryMatches?.stylingProcessor || {},
      },
      stats: {
        resourceCount: data.resource_count,
        totalSize: data.total_size,
        scriptMetrics: data.script_metrics,
        imageMetrics: data.image_metrics,
      },
    },
  };
};

type StylingLibraries = AnalyzeResult['analysis']['stylingLibraries']['items'];
type StylingLibrariesInput<
  N extends keyof StylingLibraries = keyof StylingLibraries,
> = {
  library: N;
  confidence: number;
  matched: StylingLibraries[N]['matched'];
}[];

const formatStylingLibraries = (stylingLibraries: StylingLibrariesInput) => {
  return (stylingLibraries ?? []).reduce((acc, item) => {
    acc[item.library] = {
      confidence: item.confidence,
      matched: new Set(item.matched),
    };
    return acc;
  }, {} as StylingLibraries);
};
