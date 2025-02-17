export const superagent = [
  {
    name: 'messages' as const,
    score: 0.9,
    scripts: [
      /"no appendQueryString"/,
      /"no Request#pipe"/,
      /Warning: superagent request was sent twice, because both \.end\(\) and \.then\(\) were called\. Never call \.end\(\) if you use promises/,
      /Using browser-only version of superagent in non-browser environment/,
      /superagent can't mix \.send\(\) and \.attach\(\)/,
      /This is not supported in browser version of superagent/,
      /Warning: \.end\(\) was called twice\. This is not supported in superagent/,
      /Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc\./,

      // SuperAgent's unique implementation detail strings
      /"superagent first"/,
    ],
  },
  {
    name: 'serializerImplementation' as const,
    score: 0.8,
    scripts: [
      // SuperAgent's specific serialization strings
      /"no superagent serializer"/,
      /"multiple content-types"/,

      // SuperAgent's buffer/blob handling messages
      /"please use Buffer"/,
      /"should be a blob"/,
      /"unexpected form field"/,
    ],
  },
  {
    name: 'retryImplementation' as const,
    score: 0.7,
    scripts: [
      // SuperAgent's specific retry logic messages
      /"retries exceeded"/,
      /"retry: gave up"/,
      /"retry: too many redirects"/,
      /"retry count exceeds"/,
    ],
  },
  {
    name: 'headerSignatures' as const,
    score: 0.6,
    headers: {
      'x-superagent-retry-count': /^\d+$/,
    },
  },
  {
    name: 'uniqueUsagePatterns' as const,
    score: 0.8,
    scripts: [
      // SuperAgent's unique method chaining pattern (agent.get().accept().query().retry())
      /\.(?:accept|query|field|attach|set)\([^)]*\)\.(?:accept|query|field|attach|set)\([^)]*\)\.retry\(/,

      // SuperAgent's unique accept/type combination
      /\.accept\(['"]application\/json['"]\)\.type\(['"]application\/json['"]\)/,

      // SuperAgent's specific field/attach pattern
      /\.field\([^)]+\)\.attach\([^)]+\)/,
    ],
  },
  {
    name: 'attachmentUsage' as const,
    score: 0.7,
    scripts: [
      // SuperAgent's unique attachment handling pattern
      /\.attach\(['"]file['"],[^,]+,\{filename:/,
      /\.attach\(['"]file['"],[^,]+,\{contentType:/,

      // SuperAgent's specific field with attachment combination
      /\.field\(['"]name['"],[^)]+\)\.field\(['"]key['"],[^)]+\)\.attach\(/,
    ],
  },
];
