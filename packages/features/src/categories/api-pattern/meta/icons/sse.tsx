import { LogoProps } from '../../../../types/meta.js';

export const SseLogo = ({
  width = 24,
  height = 24,
  color = '#333333',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Server-Sent Events</title>
      <path d="M4 4h16v2H4V4zm0 4h12v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2zm0 4h16v2H4v-2z" />
    </svg>
  );
};
