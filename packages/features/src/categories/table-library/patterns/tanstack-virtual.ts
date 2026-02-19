// TanStack Virtual — match package references
export const tanstackVirtual = [
  {
    name: 'coreBundle' as const,
    score: 1,
    filenames: [
      /@tanstack\/virtual-core[.\-@/]/,
      /@tanstack\/react-virtual[.\-@/]/,
      /@tanstack\/vue-virtual[.\-@/]/,
      /@tanstack\/solid-virtual[.\-@/]/,
    ],
  },
  {
    name: 'runtimeStrings' as const,
    score: 0.9,
    scripts: [
      /"@tanstack\/virtual-core"/, // Package self-reference
      /"@tanstack\/react-virtual"/,
      /"Virtualizer"/, // Class name as string
    ],
  },
];
