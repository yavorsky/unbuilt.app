import { AnalyzeResult } from '@unbuilt/analyzer';

type StylingLibraries = AnalyzeResult['analysis']['stylingLibraries']['items'];
type StylingLibrariesInput<
  N extends keyof StylingLibraries = keyof StylingLibraries,
> = {
  library: N;
  confidence: number;
  matched: StylingLibraries[N]['matched'];
}[];

export const formatStylingLibrariesResponse = (
  stylingLibraries: StylingLibrariesInput
) => {
  return (stylingLibraries ?? []).reduce((acc, item) => {
    acc[item.library] = {
      confidence: item.confidence,
      matched: new Set(item.matched),
    };
    return acc;
  }, {} as StylingLibraries);
};
