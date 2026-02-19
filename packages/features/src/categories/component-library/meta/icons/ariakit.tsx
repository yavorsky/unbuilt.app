import { LogoProps } from '../../../../types/meta.js';

export const AriakitLogo = ({
  width = 24,
  height = 24,
  color = '#007ACC',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Ariakit</title>
      <path d="M12 1L3 5v14l9 4 9-4V5l-9-4zm0 2.18l7 3.11v11.42l-7 3.11-7-3.11V6.29l7-3.11zM12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
};
