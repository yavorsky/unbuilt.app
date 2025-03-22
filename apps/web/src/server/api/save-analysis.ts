import { AnalyzeResult } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import {
  extractDetectedFeatures,
  extractSecondaryMatches,
} from '../utils/extract-secondary-matches';
import { Json, TablesInsert } from '../../../supabase/database.types';
import { toSnakeCase } from '../utils/convert-keys';
import { trackError } from '@/app/utils/error-monitoring';
import logger from '@/app/utils/logger/logger';

export interface TechnologyInfo {
  type?: string;
  name: string;
  confidence: number;
  variant?: string;
  detectedFeatures?: Set<string>;
  secondaryMatches?: Record<string, unknown>;
}

type TechStackAnalysisInsert = TablesInsert<'tech_stack_analysis'>;
type StylingLibraryInsert = TablesInsert<'styling_libraries'>;

/**
 * Save a new tech stack analysis
 */
export async function saveAnalysis(id: string, analysisData: AnalyzeResult) {
  logger.info('Result is saved', { id, url: analysisData.url });
  try {
    const insertData: TechStackAnalysisInsert = {
      id,
      url: analysisData.url,
      analyzed_at: analysisData.timestamp,
      duration: analysisData.duration,

      // Technologies
      bundler: analysisData.analysis.bundler?.name ?? null,
      bundler_confidence: analysisData.analysis.bundler?.confidence ?? null,
      dates: analysisData.analysis.dates?.name ?? null,
      dates_confidence: analysisData.analysis.dates?.confidence ?? null,
      framework: analysisData.analysis.framework?.name ?? null,
      framework_confidence: analysisData.analysis.framework?.confidence ?? null,
      http_client: analysisData.analysis.httpClient?.name ?? null,
      http_client_confidence:
        analysisData.analysis.httpClient?.confidence ?? null,
      minifier: analysisData.analysis.minifier?.name ?? null,
      minifier_confidence: analysisData.analysis.minifier?.confidence ?? null,
      modules: analysisData.analysis.modules?.name ?? null,
      modules_confidence: analysisData.analysis.modules?.confidence ?? null,
      router: analysisData.analysis.router?.name ?? null,
      router_confidence: analysisData.analysis.router?.confidence ?? null,
      state_management: analysisData.analysis.stateManagement?.name ?? null,
      state_management_confidence:
        analysisData.analysis.stateManagement?.confidence ?? null,
      transpiler: analysisData.analysis.transpiler?.name ?? null,
      transpiler_confidence:
        analysisData.analysis.transpiler?.confidence ?? null,
      ui_library: analysisData.analysis.uiLibrary?.name ?? null,
      ui_library_confidence:
        analysisData.analysis.uiLibrary?.confidence ?? null,
      styling_processor: analysisData.analysis.stylingProcessor?.name ?? null,
      styling_processor_confidence:
        analysisData.analysis.stylingProcessor?.confidence ?? null,
      translations: analysisData.analysis.translations?.name ?? null,
      translations_confidence:
        analysisData.analysis.translations?.confidence ?? null,
      platform: analysisData.analysis.platform?.name ?? null,
      platform_confidence: analysisData.analysis.platform?.confidence ?? null,
      analytics: analysisData.analysis.analytics?.name ?? null,
      analytics_confidence: analysisData.analysis.analytics?.confidence ?? null,

      // Stats
      resource_count: analysisData.analysis.stats.resourceCount,
      total_size: analysisData.analysis.stats.totalSize,
      script_metrics: toSnakeCase(analysisData.analysis.stats.scriptMetrics),
      style_metrics: toSnakeCase(analysisData.analysis.stats.styleMetrics),
      image_metrics: toSnakeCase(analysisData.analysis.stats.imageMetrics),
      dom_metrics: toSnakeCase(analysisData.analysis.stats.domMetrics),

      // Additional data including secondary matches
      additional_data: {
        secondaryMatches: extractSecondaryMatches(analysisData.analysis),
        detectedFeatures: extractDetectedFeatures(analysisData.analysis),
      } as Json,
    };

    const { data, error } = await supabase
      .from('tech_stack_analysis')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    // Insert styling libraries if present
    if (analysisData.analysis.stylingLibraries?.items) {
      const stylingItems = Object.entries(
        analysisData.analysis.stylingLibraries.items
      ).map(
        ([name, data]) =>
          ({
            analysis_id: id,
            library: name,
            confidence: data.confidence,
            matched: Array.from(data.matched) ?? [],
          }) as StylingLibraryInsert
      );

      if (stylingItems.length > 0) {
        const { error: stylingError } = await supabase
          .from('styling_libraries')
          .insert(stylingItems);

        if (stylingError) throw stylingError;
      }
    }

    return { data, error: null };
  } catch (error) {
    trackError(error as Error, { id });
    return { data: null, error };
  }
}
