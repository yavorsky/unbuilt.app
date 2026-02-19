import { LogoProps } from '../../../../types/meta.js';

export const ReactVirtualizedLogo = ({
  width = 24,
  height = 24,
  color = '#61DAFB',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
      <title>React Virtualized</title>
      <rect x="2" y="2" width="20" height="4" rx="1" fill={color} opacity="1" stroke="none" />
      <rect x="2" y="8" width="20" height="4" rx="1" fill={color} opacity="0.6" stroke="none" />
      <rect x="2" y="14" width="20" height="4" rx="1" fill={color} opacity="0.3" stroke="none" />
      <rect x="2" y="20" width="20" height="2" rx="1" fill={color} opacity="0.1" stroke="none" />
    </svg>
  );
};
