import { captureException } from '@sentry/nextjs';
import { supabase } from '../supabase';
import { formatAnalyzisResponse } from '../utils/format-analyzis-response';

/**
 * Get analysis by ID
 */
export async function getAnalysisByIdQuery(id: string) {
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

    const formattedData = formatAnalyzisResponse(data);

    return { data: formattedData, error: null };
  } catch (error) {
    captureException(error);
    return { data: null, error };
  }
}
