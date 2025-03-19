import { supabase } from '../supabase';
import { columnMapping } from '../utils/column-mapping';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { trackError } from '@/app/utils/error-monitoring';

// Usage example:
// const { data } = await getTechnologyStats();
// Result:
// Transpiler usage: [
//   { name: 'typescript', count: 74 },
//   { name: 'babel', count: 43 },
//   { name: 'esbuild', count: 11 }
// ]

type RPCResponse = {
  technology_value: AnalysisTechnologies;
  count: number;
}[];

export async function getTechnologyStatsQuery<T extends AnalysisTechnologies>(
  type: T
) {
  const dbColumn = columnMapping[type];

  const { data, error } = await supabase.rpc('get_unique_technologies_count', {
    technology_column: dbColumn,
    confidence_threshold: 0.5,
  });

  if (error) {
    trackError(error);
    throw error;
  }

  // TODO: Make supabase autogenerate types for RPC responses
  return (data as RPCResponse).map((item) => ({
    name: item.technology_value,
    count: item.count,
  }));
}
