import { LogoProps } from '../../../../types/meta.js';

export const ReactWindowLogo = ({
  width = 24,
  height = 24,
  color = '#61DAFB',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>React Window</title>
      <path d="M3 1h18a2 2 0 012 2v18a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2zm0 2v8h8V3H3zm10 0v8h8V3h-8zM3 13v8h8v-8H3zm10 0v8h8v-8h-8z" />
    </svg>
  );
};
