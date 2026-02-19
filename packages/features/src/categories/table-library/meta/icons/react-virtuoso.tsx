import { LogoProps } from '../../../../types/meta.js';

export const ReactVirtuosoLogo = ({
  width = 24,
  height = 24,
  color = '#FF6B6B',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>React Virtuoso</title>
      <path d="M3 2h18a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm1 2v4h16V4H4zm0 6v4h16v-4H4zm0 6v4h16v-4H4z" />
    </svg>
  );
};
