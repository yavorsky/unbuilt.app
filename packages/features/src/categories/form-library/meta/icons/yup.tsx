import { LogoProps } from '../../../../types/meta.js';

export const YupLogo = ({
  width = 24,
  height = 24,
  color = '#333333',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Yup</title>
      <path d="M3 4l4.5 7.5V20h3v-8.5L15 4h-3l-3 5.25L6 4H3zm12 0v10.5c0 1.93 1.57 3.5 3.5 3.5S22 16.43 22 14.5V4h-3v10.5a.5.5 0 01-1 0V4h-3z" />
    </svg>
  );
};
