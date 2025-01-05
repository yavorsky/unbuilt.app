import { supabase } from '../supabase';

export async function getAnalyzysIdByUrl(url: string) {
  try {
    const { data, error } = await supabase
      .from('tech_stack_analysis')
      .select('id')
      .ilike('url', `%${url}%`)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching analysis ID:', error);
    return { data: null, error };
  }
}
