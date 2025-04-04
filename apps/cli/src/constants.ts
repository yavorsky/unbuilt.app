export const getBaseUrl = () => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://unbuilt.app'
    : 'http://localhost:3000';
};

export const getBaseAPIUrl = () => {
  return `${getBaseUrl()}/api`;
};
