import { LogoProps } from '../../../../types/meta.js';

export const AnimejsLogo = ({
  width = 24,
  height = 24,
  color = '#252423',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>anime.js</title>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H8l5-10h3l-5 10z" />
    </svg>
  );
};
