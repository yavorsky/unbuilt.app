export const i18next = [
  {
    name: 'initialization' as const,
    score: 0.5,
    scripts: [
      // i18next's initialization states in constructor
      /defaultNS:\s*\["translation"\]/,

      // i18next's specific option structure
      /pluralSeparator:\s*["']_["']/,

      // i18next's unique flags combination
      /isInitialized:\s*!0,\s*isInitializing:\s*!0/,
    ],
  },
  {
    name: 'backendHandling' as const,
    score: 0.4,
    scripts: [
      // i18next's specific backend options
      /maxParallelReads:\d+,\s*maxRetries:\d+,\s*retryTimeout:\d+/,

      // i18next's resource loading states
      /isInitialized\s*\?\s*n\s*\(\s*\)\s*:\s*this\.on\(["']initialized["']/,
    ],
  },
  {
    name: 'pluralHandling' as const,
    score: 0.3,
    scripts: [
      // i18next's specific plural separator handling
      /this\.options\.pluralSeparator\s*\|\|\s*["']_["']/,

      // i18next's ordinal handling structure
      /ordinal:\s*!1,\s*offset:\s*\d+/,
    ],
  },
  {
    name: 'initialization' as const,
    score: 0.5,
    scripts: [
      // i18next's unique initialization pattern
      /this\.modules\.i18nFormat.*this\.modules\.external/,

      // i18next's specific backend initialization
      /backend\.init\s*\(\s*services\s*,\s*options\.backend\s*,\s*options\)/,

      // i18next's unique store pattern
      /resourceStore\s*=\s*new\s+ResourceStore\s*\(\s*this\.data\s*,\s*this\.options\)/,
    ],
  },
  {
    name: 'resourceHandling' as const,
    score: 0.4,
    scripts: [
      // i18next's unique resource bundle pattern
      /addResourceBundle\s*\([^)]*skipCopy:\s*!1/,

      // i18next's resource loading pattern
      /loadResources\s*\(\s*\w+\s*,\s*this\.options\.ns\s*,/,
    ],
  },
  {
    name: 'pluralHandling' as const,
    score: 0.4,
    scripts: [
      // i18next's specific plural resolver pattern
      /pluralResolver\s*=\s*new\s+PluralResolver\s*\(\s*\w+\s*,\s*\{\s*prepend:\s*this\.options\.pluralSeparator/,

      // i18next's specific suffix handling
      /getSuffix\s*\([^)]*\)\s*\{[^}]*this\.getRule\s*\([^)]*\)\.select\s*\(/,

      // i18next's plural rules pattern
      /resolvedOptions\(\)\.pluralCategories\.sort\s*\(\s*\([^)]*\)\s*=>\s*\$\[\w+\]\s*-\s*\$\[\w+\]\s*\)/,
    ],
  },
  {
    name: 'icuFormat' as const,
    score: 0.4,
    scripts: [
      // ICU specific message format pattern
      /type:\s*["']messageFormatPattern["'],\s*elements:\s*\[/,

      // ICU specific plural format
      /type:\s*["']pluralFormat["'],\s*ordinal:\s*(?:true|false)/,

      // ICU select format pattern
      /type:\s*["']selectFormat["'],\s*options:\s*\{/,
    ],
  },
  {
    name: 'icuRuntime' as const,
    score: 0.3,
    scripts: [
      // ICU formatter initialization
      /formatter\.init\s*\(\s*services\s*,\s*options\)/,

      // ICU message compilation
      /compileMessage\s*\(\s*\w+\s*\)\s*\{[^}]*messageFormatPattern/,

      // ICU format registration
      /registerMessageResolver.*registerMessageCompiler/,
    ],
  },
];
