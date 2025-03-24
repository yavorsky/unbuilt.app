'use server';

import { AnalyzeResult } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import { columnMapping } from '../utils/column-mapping';
import { getStylingLibraryWebsitesQuery } from './get-styling-library-websites';
import { AnalysisKeys } from '@unbuilt/features';
import { formatGetTechnologyWebsitesResponse } from '../utils/format-get-technology-websites-response';

export interface WebsiteData {
  id: string;
  url: string;
  analyzed_at: string;
  confidence: number;
}

export interface TechnologyWebsites {
  data: WebsiteData[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export async function getTechnologyWebsitesQuery<
  T extends Exclude<AnalysisKeys, 'stats'>,
>({
  type,
  technology,
  page = 1,
  search = '',
  pageSize = 20,
}: {
  type: T;
  technology: keyof AnalyzeResult['analysis'][T];
  page?: number;
  search?: string;
  pageSize?: number;
}) {
  // Handle styling libraries differently as they're in a separate table
  if (type === 'stylingLibraries') {
    return getStylingLibraryWebsitesQuery({
      technology: technology as string,
      page,
      search,
      pageSize,
    });
  }

  // For all other technology types
  const dbColumn = columnMapping[type];

  const { data, error } = await supabase.rpc('get_unique_technology_websites', {
    technology_column: dbColumn,
    technology_value: technology as string,
    confidence_threshold: 0.5,
    search_term: search,
    page_number: page,
    items_per_page: pageSize,
  });

  if (error) {
    throw error;
  }

  return formatGetTechnologyWebsitesResponse(data, page, pageSize);
}
