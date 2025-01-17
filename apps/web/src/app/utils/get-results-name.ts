import type { Meta } from '@unbuilt/features';

export const getResultsName = (featureMap: Record<string, Meta>) =>
  Object.values(featureMap).map((item) => item.name);
