---
name: Feature Pattern Request
about: Suggest a new detection pattern for unbuilt.app
description: Please review our [CONTRIBUTING.md](../../CONTRIBUTING.md#feature-pattern-api) document for detailed information about our Feature Pattern API before submitting.
title: '[PATTERN] Add detection for {technology name}'
labels: 'enhancement, pattern-request'
assignees: ''
---

## Technology to Detect

**Name of technology:**
<!-- e.g., SvelteKit, Astro, XState -->

**Category:**
<!-- e.g., framework, bundler, state-management, etc. Is this for an existing category or a new one? -->

**Website/Documentation:**
<!-- Link to the technology's official site -->

**GitHub Repository:**
<!-- Link to the source code if available -->

## Detection Approach

**Proposed detection patterns:**
<!-- Describe how this technology can be detected. Include specific signatures, global variables, DOM patterns, etc. -->

```typescript
// Example pattern structure (replace with your actual implementation)
export const technologyName = [
  {
    name: 'core',
    score: 1.0,
    scripts: [
      // Distinctive patterns
      /specificPattern/,
    ],
  },
  // Additional pattern groups as needed
];
```

**Unique identifiers:**
<!-- What are some unique identifiers for this technology? E.g., global variables, CSS classes, HTML attributes -->

**Potential false positives:**
<!-- Are there similar technologies that might be confused with this one? How can we distinguish them? -->

## Testing

**How would you verify this technology:**
<!-- Choose the most appropriate approach for your pattern -->

Platform patterns changed:
- [ ] Public websites where this technology can be observed. Example [Shopfiy as platform](../../testing/e2e/tests/external/shopify.md)
  <!-- List at least 1 relevant test -->

Any other patterns changed (frameworks, libraries, new technologies)?:
- [ ] Virtual test needed. Example [Nextjs with React, Redux and Moment](../../testing/e2e/tests/virtual/nextjs-react-redux-moment.test.ts)
  <!-- List at least 1 relevant test -->

**Note:** For details on our testing approach, please see our [TESTING.md](../../testing/e2e/README.md) document.

## Additional Information

**Version differences:**
<!-- If applicable, do different versions of this technology have different signatures? -->

**Related technologies:**
<!-- Any related technologies that might be used alongside this one -->

**Anything else:**
<!-- Any other information that might be helpful -->

<!-- Thank you for contributing to unbuilt.app! -->

## Resources

- [Feature Pattern API Documentation](https://github.com/your-org/unbuilt.app/blob/main/CONTRIBUTING.md#feature-pattern-api)
- [Adding Detection Patterns Guide](https://github.com/your-org/unbuilt.app/blob/main/CONTRIBUTING.md#adding-detection-patterns)