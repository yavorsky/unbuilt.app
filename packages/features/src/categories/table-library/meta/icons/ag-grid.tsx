import { LogoProps } from '../../../../types/meta.js';

export const AgGridLogo = ({
  width = 24,
  height = 24,
  color = '#66B2FF',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>AG Grid</title>
      <rect x="1" y="1" width="6" height="6" rx="0.5" />
      <rect x="9" y="1" width="6" height="6" rx="0.5" />
      <rect x="17" y="1" width="6" height="6" rx="0.5" />
      <rect x="1" y="9" width="6" height="6" rx="0.5" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" />
      <rect x="17" y="9" width="6" height="6" rx="0.5" />
      <rect x="1" y="17" width="6" height="6" rx="0.5" />
      <rect x="9" y="17" width="6" height="6" rx="0.5" />
      <rect x="17" y="17" width="6" height="6" rx="0.5" />
    </svg>
  );
};
