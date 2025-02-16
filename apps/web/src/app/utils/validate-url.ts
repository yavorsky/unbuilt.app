export const validateUrl = (url: string) => {
  if (!url) {
    return false;
  }
  const urlPattern =
    /^[a-zA-Z0-9][a-zA-Z0-9-._]*\.[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  return urlPattern.test(url);
};
