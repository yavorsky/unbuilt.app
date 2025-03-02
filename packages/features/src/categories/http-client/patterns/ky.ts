export const ky = [
  {
    name: 'coreImplementation' as const,
    score: 0.9,
    scripts: [
      // Ky's specific validation messages
      /"Failed to parse URL from /,
      /"The `prefixUrl` option must start with/,

      // Invalid request
      /new\s+\w+\.Request\(["']https:\/\/empty\.invalid["']/,
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

      // Retry validation for methods
      /throw\s+new\s+Error\(["']retry\.methods\s+must\s+be\s+an\s+array["']\)/,

      // Retry validation for array
      /throw\s+new\s+Error\(["']retry\.statusCodes\s+must\s+be\s+an\s+array["']\)/,

      /throw\s+new\s+Error\s*\(\s*["']Streams are not supported in your environment\.\s+`ReadableStream`\s+is\s+missing\.["']\s*\)/,

      /throw\s+new\s+Error\s*\(\s*["']`input`\s+must\s+not\s+begin\s+with\s+a\s+slash\s+when\s+using\s+`prefixUrl`["']\s*\)/,

      /throw\s+new\s+TypeError\s*\(\s*["']The\s+`onDownloadProgress`\s+option\s+must\s+be\s+a\s+function["']\s*\)/,

      /throw\s+new\s+Error\s*\(\s*["']Streams are not supported in your environment\.\s+`ReadableStream`\s+is\s+missing\.["']\s*\)/,

      // Ky's unique error messages from its implementation
      /"The `onDownloadProgress` option must be a function"/,
    ],
  },
  {
    name: 'properties' as const,
    score: 0.7,
    scripts: [
      // backoffLimit check
      /\b\w+\._options\.retry\.backoffLimit\b/,
      // Ky-specific method names
      /\w+\._options\.throwHttpErrors/g,
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
