import { LogoProps } from '../../../../types/meta.js';

export const ReactSpringLogo = ({
  width = 24,
  height = 24,
  color = '#6DB33F',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" className={className}>
      <title>React Spring</title>
      <path d="M12 2c-3 4-3 6 0 10s3 6 0 10" />
      <path d="M8 4c-3 4-3 6 0 8s3 4 0 8" />
      <path d="M16 4c-3 4-3 6 0 8s3 4 0 8" />
    </svg>
  );
};
