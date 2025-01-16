import { supabase } from '../supabase';

export async function getAnalyzysMetaByUrl(url: string) {
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
    console.error('Error fetching analysis ID:', error);
    return { data: null, error };
  }
}
