import { supabase } from '../supabase';
import { formatAnalyzisResponse } from '../utils/format-analyzis-response';
import { trackError } from '@/app/utils/error-monitoring';

export async function getAnalysesByUrlQuery(url: string) {
  try {
    const { data: rawData, error } = await supabase
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
      .ilike('url', `%${url}%`)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    // Calculate finishedOn by adding duration to analyzed_at

    const formattedData = formatAnalyzisResponse(rawData);

    return { data: formattedData, error: null };
  } catch (error) {
    trackError(error as Error, {
      url,
    });
    return { data: null, error };
  }
}
