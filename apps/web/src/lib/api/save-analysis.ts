import { AnalyzeResult } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import {
  extractDetectedFeatures,
  extractSecondaryMatches,
} from '../extract-secondary-matches';

export interface TechnologyInfo {
  type?: string;
  name: string;
  confidence: number;
  variant?: string;
  detectedFeatures?: Set<string>;
  secondaryMatches?: Record<string, unknown>;
}

/**
 * Save a new tech stack analysis
 */
export async function saveAnalysis(id: string, analysisData: AnalyzeResult) {
  try {
    const { data, error } = await supabase
      .from('tech_stack_analysis')
      .insert({
        id,
        url: analysisData.url,
        analyzed_at: analysisData.timestamp,
        duration: analysisData.duration,

        // Technologies
        bundler: analysisData.analysis.bundler?.name,
        bundler_confidence: analysisData.analysis.bundler?.confidence,
        dates: analysisData.analysis.dates?.name,
        dates_confidence: analysisData.analysis.dates?.confidence,
        framework: analysisData.analysis.framework?.name,
        framework_confidence: analysisData.analysis.framework?.confidence,
        http_client: analysisData.analysis.httpClient?.name,
        http_client_confidence: analysisData.analysis.httpClient?.confidence,
        minifier: analysisData.analysis.minifier?.name,
        minifier_confidence: analysisData.analysis.minifier?.confidence,
        modules: analysisData.analysis.modules?.name,
        modules_confidence: analysisData.analysis.modules?.confidence,
        router: analysisData.analysis.router?.name,
        router_confidence: analysisData.analysis.router?.confidence,
        state_management: analysisData.analysis.stateManagement?.name,
        state_management_confidence:
          analysisData.analysis.stateManagement?.confidence,
        transpiler: analysisData.analysis.transpiler?.name,
        transpiler_confidence: analysisData.analysis.transpiler?.confidence,
        ui_library: analysisData.analysis.uiLibrary?.name,
        ui_library_confidence: analysisData.analysis.uiLibrary?.confidence,
        styling_processor: analysisData.analysis.stylingProcessor?.name,
        styling_processor_confidence:
          analysisData.analysis.stylingProcessor?.confidence,
        translations: analysisData.analysis.translations?.name,
        translations_confidence: analysisData.analysis.translations?.confidence,

        // Stats
        resource_count: analysisData.analysis.stats.resourceCount,
        total_size: analysisData.analysis.stats.totalSize,
        script_metrics: analysisData.analysis.stats.scriptMetrics,
        image_metrics: analysisData.analysis.stats.imageMetrics,

        // Additional data including secondary matches
        additional_data: {
          secondaryMatches: extractSecondaryMatches(analysisData.analysis),
          detectedFeatures: extractDetectedFeatures(analysisData.analysis),
        },
      })
      .select()
      .single();

    if (error) throw error;

    // Insert styling libraries if present
    if (analysisData.analysis.stylingLibraries?.items) {
      const stylingItems = Object.entries(
        analysisData.analysis.stylingLibraries.items
      ).map(([name, data]) => ({
        analysis_id: id,
        library: name,
        confidence: data.confidence,
        matched: Array.from(data.matched) ?? [],
      }));

      if (stylingItems.length > 0) {
        const { error: stylingError } = await supabase
          .from('styling_libraries')
          .insert(stylingItems);

        if (stylingError) throw stylingError;
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return { data: null, error };
  }
}
