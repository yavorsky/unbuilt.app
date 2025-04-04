export const getConfidenceBarInfo = (confidence: number) => {
  const maxBars = 4;
  const bars = Math.min(Math.round((confidence / 3) * maxBars), maxBars);
  const percentage = Math.min(Math.round((confidence / 3) * 100), 100);
  return { bars, maxBars, percentage, confidence };
};
