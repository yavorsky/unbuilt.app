// utils/mockTrendsData.ts

// Helper to generate smooth random changes
const generateSmoothData = (
  initialValue: number,
  months: number,
  volatility: number
) => {
  const data = [initialValue];
  for (let i = 1; i < months; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const newValue = Math.max(0, Math.min(100, data[i - 1] + change));
    data.push(Number(newValue.toFixed(1)));
  }
  return data;
};

export const generateMockTrendsData = (months = 6) => {
  const technologies = {
    React: { initial: 45.0, volatility: 2 },
    Vue: { initial: 15.0, volatility: 1.5 },
    Angular: { initial: 12.0, volatility: 1 },
    Svelte: { initial: 8.0, volatility: 2.5 },
    'Next.js': { initial: 18.0, volatility: 3 },
    Nuxt: { initial: 6.0, volatility: 1.5 },
    Gatsby: { initial: 4.0, volatility: 1 },
  };

  const dates = Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - 1) + i);
    return date.toISOString().slice(0, 7); // YYYY-MM format
  });

  const technologyData = {};
  Object.entries(technologies).forEach(([tech, { initial, volatility }]) => {
    technologyData[tech] = generateSmoothData(initial, months, volatility);
  });

  return dates.map((date, index) => ({
    date,
    ...Object.fromEntries(
      Object.entries(technologyData).map(([tech, values]) => [
        tech,
        values[index],
      ])
    ),
  }));
};
