export const ky = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Ky's unique error messages from its implementation
      /"options.retry.methods, options.retry.statusCodes .* must be an array"/,
      /"The `onDownloadProgress` option must be a function"/,

      // Ky's specific validation messages
      /"Failed to parse URL from /,
      /"The `prefixUrl` option must start with/,
    ],
  },
  {
    name: 'errorImplementation' as const,
    score: 0.8,
    scripts: [
      // Ky's specific error response format
      /"Response code [0-9]+ \([^)]+\)"/,

      // Ky's internal hook error messages
      /"Failed to execute request hook"/,
      /"Hook must be a function"/,
    ],
  },
  {
    name: 'uniqueOptionsUsage' as const,
    score: 0.9,
    scripts: [
      // Ky's unique combination of options that doesn't exist in other libraries
      /\{(?:[^}]*retry:[^}]+prefixUrl:[^}]+throwHttpErrors:[^}]*|[^}]*prefixUrl:[^}]+throwHttpErrors:[^}]+retry:[^}]*)\}/,

      // Ky's specific retry configuration shape
      /retry:\s*\{\s*limit:\s*\d+,\s*statusCodes:\s*\[\d+(?:,\s*\d+)*\],\s*methods:\s*\[["'](?:GET|POST|PUT|DELETE)["']/,
    ],
  },
  {
    name: 'errorHandling' as const,
    score: 0.8,
    scripts: [
      // Ky's specific error handling with HTTPError
      /\{\s*status,\s*statusText,\s*response\s*\}\s*=\s*error/,
    ],
  },
];
