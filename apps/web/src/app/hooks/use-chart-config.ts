import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { useMemo } from 'react';
import {
  getTechnologyMeta,
  TechnologyMetaResults,
} from '../utils/get-technology-meta';

export function useChartConfigForTechnology<
  T extends AnalysisTechnologies,
  V extends TechnologyMetaResults<T>,
>(type: T) {
  return useMemo(() => {
    const meta = getTechnologyMeta<T, V>(type);
    return Object.keys(meta ?? {}).reduce(
      (acc, key, index) => {
        if (meta === undefined) return acc;

        const metaValue = meta[key as V];
        return {
          ...acc,
          [key]: {
            label: metaValue?.name,
            color: `hsl(var(--chart-${index + 1}))`,
          },
        };
      },
      {
        count: {
          label: 'Total Web Apps',
          color: 'hsl(var(--chart-5))',
        },
        other: {
          label: 'Other',
          color: 'hsl(var(--chart-5))',
        },
      } as Record<string, { label: string; color: string }>
    );
  }, [type]);
}
