export const typescript = [
  {
    name: 'core' as const,
    score: 1.0,
    runtime: [
      // TypeScript-specific helper markers
      /__generator/,
      /__spreadArray/,
      /__spreadArrays/,
      /__assign/,
      /__await/,
    ],
  },
  {
    name: 'decorators' as const,
    score: 0.9,
    runtime: [
      // TypeScript's unique decorator implementation
      /__decorate/,
      /__metadata/,
      /__param/,
      /Reflect\.decorate/,
      /Reflect\.metadata/,
    ],
  },
  {
    name: 'class-transforms' as const,
    score: 0.8,
    runtime: [
      // TypeScript's unique class transformation patterns
      /__extends/,
      /__values/,
      /__importStar/,
      /__importDefault/,
      /__createBinding/,
    ],
  },
  {
    name: 'enums' as const,
    score: 0.7,
    runtime: [
      // TypeScript's specific enum metadata and helpers
      /Object\.defineProperty\(\w+,\s*"\__enumIsFlags",\s*{.*?}\)/, // Flag enum metadata
      /createEnum\(/, // TypeScript's enum helper
      /initEnum\(/, // TypeScript's enum initialization
    ],
  },
];
