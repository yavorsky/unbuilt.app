import { LogoProps } from '../../../../types/meta.js';

export const MotionOneLogo = ({
  width = 24,
  height = 24,
  color = '#F8E71C',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Motion One</title>
      <path d="M2 4h4l3 8-3 8H2l3-8L2 4zm7 0h4l3 8-3 8H9l3-8L9 4zm7 0h4l3 8-3 8h-4l3-8-3-8z" />
    </svg>
  );
};
