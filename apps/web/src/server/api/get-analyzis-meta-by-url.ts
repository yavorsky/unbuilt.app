import { supabase } from '../supabase';
import { trackError } from '@/app/utils/error-monitoring';

export async function getAnalyzysMetaByUrlQuery(url: string) {
  try {
    const { data, error } = await supabase
      .from('tech_stack_analysis')
      .select('id, analyzed_at')
      .eq('url', url)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    trackError(error as Error, {
      url,
    });
    return { data: null, error };
  }
}
