import { LogoProps } from '../../../../types/meta.js';

export const TanStackVirtualLogo = ({
  width = 24,
  height = 24,
  color = '#FF4154',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>TanStack Virtual</title>
      <path d="M2 3a1 1 0 011-1h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm0 5.5a1 1 0 011-1h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zm0 5.5a1 1 0 011-1h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zm0 5.5a1 1 0 011-1h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2z" />
    </svg>
  );
};
