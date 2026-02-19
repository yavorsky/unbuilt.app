// React Window — package references and unique component names
export const reactWindow = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [/react-window[.\-@/]/],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"react-window"/, // Package self-reference
      /"FixedSizeList"/, // Component display names (preserved as strings for React DevTools)
      /"VariableSizeList"/,
      /"FixedSizeGrid"/,
      /"VariableSizeGrid"/,
    ],
  },
];
