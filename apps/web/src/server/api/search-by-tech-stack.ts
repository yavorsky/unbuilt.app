import { supabase } from '../supabase';
import { AnalysisKeys } from '@unbuilt/analyzer';

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
    console.error('Error searching by tech stack:', error);
    return { data: null, error };
  }
}
