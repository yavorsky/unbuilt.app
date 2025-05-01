export function createSeededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function getSeededRandomSuggestions(
  items: string[],
  count = 4,
  seed = getTodaysSeed()
) {
  const random = createSeededRandom(seed);

  // Create a copy of the array to avoid modifying original
  const shuffled = [...items];

  // Shuffle with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

const getTodaysSeed = () => new Date().getDate() + new Date().getMonth() * 31;
