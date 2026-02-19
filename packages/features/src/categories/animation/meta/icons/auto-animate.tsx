import { LogoProps } from '../../../../types/meta.js';

export const AutoAnimateLogo = ({
  width = 24,
  height = 24,
  color = '#4ADE80',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>AutoAnimate</title>
      <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 3l5 8h-3v4h-4v-4H7l5-8z" />
    </svg>
  );
};
