// app/actions/getTechnologyWebsites.ts
'use server';

import { AnalysisTechnologies, AnalyzeResult } from '@unbuilt/analyzer';
import { supabase } from '../supabase';
import { columnMapping } from '../utils/column-mapping';

export interface WebsiteData {
  id: string;
  url: string;
  analyzed_at: string;
  confidence: number;
}

interface RPCResponse {
  id: string;
  url: string;
  analyzed_at: string;
  confidence: number;
  total_count: number;
}

export interface TechnologyWebsites {
  data: WebsiteData[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export async function getTechnologyWebsitesQuery<
  T extends AnalysisTechnologies,
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

  // First row will have the total count (all rows will have the same count)
  const totalCount = data?.[0]?.total_count ?? 0;

  const websites: WebsiteData[] = (data || []).map((item: RPCResponse) => ({
    id: item.id,
    url: item.url,
    analyzed_at: item.analyzed_at,
    confidence: item.confidence,
  }));

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: websites,
    totalPages,
    totalCount,
    currentPage: page,
  };
}
