const MAX_SCORE = 10;

export const normalizeScore = (score: number) => {
  return Math.max(Math.min(score, MAX_SCORE), 0);
};
