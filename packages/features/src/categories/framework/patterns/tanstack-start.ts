// Since the project in beta, we don't have a lot of patterns yet

export const tanstackStart = [
  {
    name: 'core' as const,
    score: 0.8,
    scripts: [
      // Message about missing dehydrated data
      /Expected to find a dehydrated data on window\.__TSR_SSR__\.dehydrated\.\.\. but we did not\. Please file an issue!/,
      // Before load context prop
      /[a-zA-Z_$][\w$]*\.__beforeLoadContext\s*=\s*[a-zA-Z_$][\w$]*\.ssr!?\.serializer\.parse\(\s*[a-zA-Z_$][\w$]*\.__beforeLoadContext\s*,?\s*\)/s,
    ],
  },
  {
    name: 'ssr' as const,
    score: 0.8,
    scripts: [
      // SSR prop
      /Ce.parse(window.__TSR_SSR__.dehydrated)/,
      // Hydration
      /[a-zA-Z_$][\w$]*\.clientSsr\s*=\s*\{\s*getStreamedValue\s*:\s*(?:function\s*\([^)]*\)|[a-zA-Z_$][\w$]*\s*=>)\s*\{\s*.*?window\.__TSR_SSR__.*?streamedValues.*?serializer\.parse\(.*?\).*?\}\s*\}/s,
    ],
  },
];
