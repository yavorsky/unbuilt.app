import { LogoProps } from '../../../../types/meta.js';

export const NextUiLogo = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>NextUI</title>
      <path d="M4 4h3v12.5L17 4h3v16h-3V7.5L7 20H4V4z" />
    </svg>
  );
};
