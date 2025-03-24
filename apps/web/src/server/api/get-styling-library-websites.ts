import { supabase } from '../supabase';
import { formatGetTechnologyWebsitesResponse } from '../utils/format-get-technology-websites-response';

export async function getStylingLibraryWebsitesQuery({
  technology,
  page = 1,
  search = '',
  pageSize = 20,
}: {
  technology: string;
  page?: number;
  search?: string;
  pageSize?: number;
}) {
  const { data, error } = await supabase.rpc(
    'get_unique_styling_library_websites',
    {
      styling_library_value: technology,
      confidence_threshold: 0.5,
      search_term: search,
      page_number: page,
      items_per_page: pageSize,
    }
  );

  if (error) {
    throw error;
  }

  return formatGetTechnologyWebsitesResponse(data, page, pageSize);
}
