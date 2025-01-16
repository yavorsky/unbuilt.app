import { supabase } from '../supabase';

export async function getAnalysesByUrl(url: string) {
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
    const startTime = new Date(rawData.analyzed_at);
    const finishedOn = new Date(startTime.getTime() + rawData.duration);

    const formattedData = {
      id: rawData.id,
      url: rawData.url,
      timestamp: rawData.analyzed_at,
      finishedOn: finishedOn.toISOString(),
      duration: rawData.duration,
      analysis: {
        bundler: rawData.bundler
          ? {
              type: 'bundler',
              name: rawData.bundler,
              confidence: rawData.bundler_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.bundler || {},
            }
          : undefined,
        dates: rawData.dates
          ? {
              type: 'dates',
              name: rawData.dates,
              confidence: rawData.dates_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.dates || {},
            }
          : undefined,
        framework: rawData.framework
          ? {
              type: 'framework',
              name: rawData.framework,
              confidence: rawData.framework_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.framework || {},
            }
          : undefined,
        httpClient: rawData.http_client
          ? {
              type: 'httpClient',
              name: rawData.http_client,
              confidence: rawData.http_client_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.httpClient || {},
            }
          : undefined,
        minifier: rawData.minifier
          ? {
              type: 'minifier',
              name: rawData.minifier,
              confidence: rawData.minifier_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.minifier || {},
            }
          : undefined,
        modules: rawData.modules
          ? {
              type: 'modules',
              name: rawData.modules,
              confidence: rawData.modules_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.modules || {},
            }
          : undefined,
        router: rawData.router
          ? {
              type: 'router',
              name: rawData.router,
              confidence: rawData.router_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.router || {},
            }
          : undefined,
        stateManagement: rawData.state_management
          ? {
              type: 'stateManagement',
              name: rawData.state_management,
              confidence: rawData.state_management_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.stateManagement ||
                {},
            }
          : undefined,
        transpiler: rawData.transpiler
          ? {
              type: 'transpiler',
              name: rawData.transpiler,
              confidence: rawData.transpiler_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.transpiler || {},
            }
          : undefined,
        uiLibrary: rawData.ui_library
          ? {
              type: 'uiLibrary',
              name: rawData.ui_library,
              confidence: rawData.ui_library_confidence,
              secondaryMatches:
                rawData.additional_data?.secondaryMatches?.uiLibrary || {},
            }
          : undefined,
        stylingLibraries: {
          items: rawData.styling_libraries || [],
        },
        stats: {
          resourceCount: rawData.resource_count,
          totalSize: rawData.total_size,
          scriptMetrics: rawData.script_metrics,
          imageMetrics: rawData.image_metrics,
        },
      },
    };

    return { data: formattedData, error: null };
  } catch (error) {
    console.error('Error fetching analysis by URL:', error);
    return { data: null, error };
  }
}
