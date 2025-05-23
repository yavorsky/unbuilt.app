import { supabase } from '../supabase';
import { AnalysisKeys } from '@unbuilt/analyzer';
import { trackError } from '@/app/utils/error-monitoring';

/**
 * Search for sites using multiple technologies
 * Example: searchByTechStackQuery({ framework: 'React', bundler: 'Webpack' })
 */
export async function searchByTechStackQuery(
  technologies: Partial<Record<AnalysisKeys, string>>,
  minConfidence: number = 0
) {
  try {
    const { data, error } = await supabase.rpc('search_by_tech_stack', {
      techs: technologies,
      min_confidence: minConfidence,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    trackError(error as Error, { technologies, minConfidence });
    return { data: null, error };
  }
}
