import { supabase } from '../supabase';
import { TechCount, TechnologyStats } from '../../types';

// Usage example:
// const { data } = await getTechnologyStats();
// console.log('Transpiler usage:', data.transpilers);
// Result:
// Transpiler usage: [
//   { name: 'typescript', count: 74 },
//   { name: 'babel', count: 43 },
//   { name: 'esbuild', count: 11 }
// ]

const getTechnologyStatsFromDB = async () => {
  const { data, error } = await supabase.from('tech_stack_analysis').select(`
    url,
    bundler,
    transpiler,
    framework,
    http_client,
    minifier,
    modules,
    router,
    styling_processor,
    translations,
    state_management,
    ui_library,
    dates,
    styling_libraries (
      library
    )
  `);

  if (error) {
    console.error('Error fetching technology stats:', error);
    throw error;
  }

  return data;
};

type TechResults = Awaited<ReturnType<typeof getTechnologyStatsFromDB>>;

function countTechnologies(
  items: TechResults,
  field: keyof TechResults[0]
): TechCount[] {
  const counts = items.reduce(
    (acc, item) => {
      const tech = item[field];
      if (tech && tech !== 'unknown') {
        acc[tech] = (acc[tech] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.keys(counts)
    .map((name) => {
      const count = counts[name];
      return { name, count };
    })
    .sort((a, b) => b.count - a.count);
}

export async function getTechnologyStatsQuery() {
  const data = await getTechnologyStatsFromDB();
  // Helper function to count technologies

  // Count styling libraries separately as they're in a nested array
  const stylingLibraryCounts = data.reduce(
    (acc, item) => {
      item.styling_libraries?.forEach((sl: { library: string }) => {
        if (sl.library && sl.library !== 'unknown') {
          acc[sl.library] = (acc[sl.library] || 0) + 1;
        }
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const stats: TechnologyStats = {
    bundler: countTechnologies(data, 'bundler'),
    transpiler: countTechnologies(data, 'transpiler'),
    framework: countTechnologies(data, 'framework'),
    httpClient: countTechnologies(data, 'http_client'),
    minifier: countTechnologies(data, 'minifier'),
    modules: countTechnologies(data, 'modules'),
    stylingProcessor: countTechnologies(data, 'styling_processor'),
    translations: countTechnologies(data, 'translations'),
    router: countTechnologies(data, 'router'),
    stateManagement: countTechnologies(data, 'state_management'),
    uiLibrary: countTechnologies(data, 'ui_library'),
    dates: countTechnologies(data, 'dates'),
    stylingLibraries: Object.entries(stylingLibraryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  };

  return { data: stats, error: null };
}
