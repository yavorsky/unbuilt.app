/**
 * Custom error class for URL normalization errors
 */
class UrlNormalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UrlNormalizationError';
  }
}

/**
 * Normalizes a URL string according to a set of rules
 * @param url - The URL string to normalize
 * @returns The normalized URL string
 * @throws {UrlNormalizationError} If the URL is invalid or empty
 */
export function normalizeUrl(url: string): string {
  if (!url) {
    throw new UrlNormalizationError('URL cannot be empty');
  }

  try {
    // Remove leading/trailing whitespace
    url = url.trim();

    // Add https:// if no protocol is specified
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = 'https://' + url;
    }

    // Use URL constructor for parsing and normalization
    const urlObj = new URL(url);

    // Convert hostname to lowercase
    urlObj.hostname = urlObj.hostname.toLowerCase();

    // Remove default ports (80 for HTTP, 443 for HTTPS)
    if (
      (urlObj.protocol === 'http:' && urlObj.port === '80') ||
      (urlObj.protocol === 'https:' && urlObj.port === '443')
    ) {
      urlObj.port = '';
    }

    // Normalize path
    // - Remove trailing slash unless path is just "/"
    // - Preserve empty path as "/"
    if (urlObj.pathname.length > 1 && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    } else if (!urlObj.pathname) {
      urlObj.pathname = '/';
    }

    // Sort query parameters
    if (urlObj.search) {
      const searchParams = new URLSearchParams(urlObj.search);
      const sortedParams = Array.from(searchParams.entries()).sort(
        ([keyA], [keyB]) => keyA.localeCompare(keyB)
      );

      urlObj.search = new URLSearchParams(sortedParams).toString();
    }

    // Remove empty fragments
    if (urlObj.hash === '#') {
      urlObj.hash = '';
    }

    return urlObj.toString();
  } catch (error) {
    throw new UrlNormalizationError(
      `Invalid URL: ${error instanceof Error ? error.message : 'unknown error'}`
    );
  }
}
