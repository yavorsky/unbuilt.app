import { HeadersMap } from './types.js';

export function normalizeHeaders(headers: Record<string, string>): HeadersMap {
  const normalized: HeadersMap = {};
  for (const [key, value] of Object.entries(headers)) {
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
}
