import { supabase } from '../supabase';
import { trackError } from '@/app/utils/error-monitoring';

export async function getAnalyzysMetaByUrlQuery(url: string) {
  try {
    // First, get the most recent record with all fields
    const { data, error } = await supabase
      .from('tech_stack_analysis')
      .select('*') // Select all fields to check for NULLs
      .eq('url', url)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    // If we have data, find which fields are NULL
    if (data) {
      const notProcessedFields = Object.keys(data).filter(
        (key) => data[key as keyof typeof data] === null
      );

      // Return the original requested fields plus the null fields information
      return {
        data: {
          id: data.id,
          analyzed_at: data.analyzed_at,
          not_processed: notProcessedFields,
        },
        error: null,
      };
    }

    return { data, error: null };
  } catch (error) {
    trackError(error as Error, {
      url,
    });
    return { data: null, error };
  }
}
