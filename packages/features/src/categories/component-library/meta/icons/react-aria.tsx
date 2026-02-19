import { LogoProps } from '../../../../types/meta.js';

export const ReactAriaLogo = ({
  width = 24,
  height = 24,
  color = '#E1251B',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>React Aria</title>
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 9v6l-8 4-8-4V9l8-4.82z" />
    </svg>
  );
};
