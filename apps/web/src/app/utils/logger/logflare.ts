// Simple HTTP transport for Logflare
export const createLogflareTransport = () => {
  const apiKey = process.env.LOGFLARE_API_KEY;
  const sourceToken = process.env.LOGFLARE_SOURCE_TOKEN;

  if (!apiKey || !sourceToken) {
    console.warn('Logflare API key or source token missing');
    return null;
  }

  // Use Node.js built-in fetch API for Node 18+
  return {
    write: (obj: string) => {
      const logEntry = JSON.parse(obj);

      // Send log to Logflare API
      fetch('https://api.logflare.app/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        body: JSON.stringify({
          source: sourceToken,
          log_entry: logEntry.msg,
          metadata: {
            ...logEntry,
            // Remove duplicate message
            msg: undefined,
          },
        }),
      }).catch((err) => {
        // Don't let logging errors affect the application
        console.error('Error sending log to Logflare:', err);
      });
    },
  };
};
