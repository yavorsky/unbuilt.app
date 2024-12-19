import { LogoProps } from '../../../../types/meta.js';

export const KyLogo = ({
  width = 24,
  height = 24,
  color = '#4A5568',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <title>KY</title>
      <path d="M4 4h2.5v7.5L12 4h3l-6 8 6.5 8h-3l-6-7.5V20H4V4zm13 0h3l-4 8 4 8h-3l-4-8 4-8z" />
    </svg>
  );
};
