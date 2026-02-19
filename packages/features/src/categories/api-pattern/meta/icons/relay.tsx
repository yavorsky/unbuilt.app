import { LogoProps } from '../../../../types/meta.js';

export const RelayLogo = ({
  width = 24,
  height = 24,
  color = '#F26B00',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Relay</title>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 4h3a3 3 0 013 3v2h-2V9a1 1 0 00-1-1h-3a1 1 0 00-1 1v2h-2V9a3 3 0 013-3zm-4 7h11v2h-11v-2zm3 4h3a1 1 0 001-1v-1h2v1a3 3 0 01-3 3h-3a3 3 0 01-3-3v-1h2v1a1 1 0 001 1z" />
    </svg>
  );
};
