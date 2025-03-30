export const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NODE_ENV === 'production'
    ? 'https://unbuilt.app/api'
    : 'http://localhost:3000/api';
