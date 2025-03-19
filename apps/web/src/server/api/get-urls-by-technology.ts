import { AnalysisKeys } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import { trackError } from '@/app/utils/error-monitoring';

export async function getUrlsByTechnologyQuery(
  techType: AnalysisKeys,
  techName: string,
  minConfidence: number = 0
) {
  try {
    const { data, error } = await supabase.rpc('get_urls_by_technology', {
      tech_type: techType,
      tech_name: techName,
      min_confidence: minConfidence,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    trackError(error as Error, { techType, techName, minConfidence });
    return { data: null, error };
  }
}
