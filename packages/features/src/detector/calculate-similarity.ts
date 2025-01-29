export const calculateSimilarity = (str1: string, str2: string): number => {
  // Simple Jaccard similarity for text comparison
  const set1 = new Set(str1.split(/\s+/));
  const set2 = new Set(str2.split(/\s+/));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
};
