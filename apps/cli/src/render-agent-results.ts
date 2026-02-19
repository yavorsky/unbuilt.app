import { AnalyzeResult } from '@unbuilt/analyzer';

// Human-readable labels for category keys
const categoryLabels: Record<string, string> = {
  framework: 'Framework',
  uiLibrary: 'UI',
  bundler: 'Bundler',
  transpiler: 'Transpiler',
  stylingProcessor: 'Styling',
  stylingLibraries: 'Styling',
  stateManagement: 'State',
  httpClient: 'HTTP',
  router: 'Router',
  translations: 'i18n',
  dates: 'Dates',
  minifier: 'Minifier',
  modules: 'Modules',
  monitoring: 'Monitoring',
  analytics: 'Analytics',
  platform: 'Platform',
  tableLibrary: 'Tables',
  componentLibrary: 'Components',
  animation: 'Animation',
  formLibrary: 'Forms',
  apiPattern: 'API',
};

export function renderAgentResults(result: AnalyzeResult): void {
  if (!result || !result.analysis) {
    console.log('No results');
    return;
  }

  const lines: string[] = [];

  for (const [category, tech] of Object.entries(result.analysis)) {
    if (category === 'stats') continue;
    if (!tech || typeof tech !== 'object' || !('name' in tech)) continue;
    if (tech.name === 'unknown' && tech.confidence === 0) continue;

    const label = categoryLabels[category] || category;
    const parts: string[] = [];

    if (tech.name !== 'unknown') {
      parts.push(tech.name);
    }

    // Add secondary matches with decent confidence
    if (
      tech.secondaryMatches &&
      typeof tech.secondaryMatches === 'object'
    ) {
      for (const [name, details] of Object.entries(
        tech.secondaryMatches as Record<string, { confidence?: number }>
      )) {
        if (details.confidence && details.confidence > 0.3) {
          parts.push(name);
        }
      }
    }

    // Handle stylingLibraries special case (items)
    if ('items' in tech && tech.items && typeof tech.items === 'object') {
      for (const [name, details] of Object.entries(
        tech.items as Record<string, { confidence?: number }>
      )) {
        if (details.confidence && details.confidence > 0.3) {
          parts.push(name);
        }
      }
    }

    if (parts.length > 0) {
      lines.push(`${label}: ${parts.join(' + ')}`);
    }
  }

  console.log(lines.join('\n'));
}
