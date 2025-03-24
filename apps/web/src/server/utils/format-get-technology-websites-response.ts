import {
  TechnologyWebsites,
  WebsiteData,
} from '../api/get-technology-websites';

interface RPCResponse {
  id: string;
  url: string;
  analyzed_at: string;
  confidence: number;
  total_count: number;
}

// Helper function to format the response consistently
export function formatGetTechnologyWebsitesResponse(
  data: RPCResponse[] | null,
  page: number,
  pageSize: number
): TechnologyWebsites {
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
