const formatBytes = (bytes: number) => {
  if (bytes === 0 || bytes == null) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;

  // Calculate the unit index directly
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate the exact value with full precision
  const exactValue = bytes / Math.pow(k, i);

  // Always show 2 decimal places for more precise display
  const formattedValue = exactValue.toFixed(2);

  // For your specific case of 307572:
  // 307572 / 1024 = 300.36328125 KB
  // This will now show as "300.36 KB" instead of "300 KB"

  return `${formattedValue} ${units[i]}`;
};

// Example usage component
export const SizeDisplay = ({
  bytes,
  className = '',
}: {
  bytes: number;
  className?: string;
}) => {
  return <span className={className}>{formatBytes(bytes)}</span>;
};
