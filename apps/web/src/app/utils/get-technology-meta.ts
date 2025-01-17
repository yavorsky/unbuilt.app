import {
  bundlerMeta,
  frameworkMeta,
  minifierMeta,
  stylingProcessorMeta,
  modulesMeta,
  uiLibraryMeta,
  stateManagementMeta,
  httpClientMeta,
  routerMeta,
  translationsMeta,
  datesMeta,
  stylingLibrariesMeta,
  transpilerMeta,
} from '@unbuilt/features';
import type { Meta } from '@unbuilt/features';

const technologyMetaMap = {
  bundler: bundlerMeta,
  framework: frameworkMeta,
  minifier: minifierMeta,
  stylingProcessor: stylingProcessorMeta,
  modules: modulesMeta,
  uiLibrary: uiLibraryMeta,
  stateManagement: stateManagementMeta,
  httpClient: httpClientMeta,
  router: routerMeta,
  translations: translationsMeta,
  dates: datesMeta,
  stylingLibraries: stylingLibrariesMeta,
  transpiler: transpilerMeta,
};

export type TechnologyMetaMap = typeof technologyMetaMap;
export type TechnologyMetaKeys = keyof TechnologyMetaMap;
export type TechnologyMetaResults<T extends TechnologyMetaKeys> =
  keyof TechnologyMetaMap[T]['meta'];

export function getTechnologyMeta<
  T extends TechnologyMetaKeys,
  V extends TechnologyMetaResults<T>,
>(technology: T) {
  const technologyMeta = technologyMetaMap[technology];
  if (!technologyMeta) {
    throw new Error(`No technology meta defined for ${technology}`);
  }
  return technologyMetaMap[technology].meta as Record<V, Meta>;
}

export function getTechnologyMetaForType<
  T extends TechnologyMetaKeys,
  V extends TechnologyMetaResults<T>,
>(technology: T, key: V) {
  const meta = getTechnologyMeta(technology);
  return meta[key];
}
