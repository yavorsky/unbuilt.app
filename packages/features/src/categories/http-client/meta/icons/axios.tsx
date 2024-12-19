import { LogoProps } from '../../../../types/meta.js';

export const AxiosLogo = ({
  width = 24,
  height = 24,
  color = '#5A29E4',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <title>Axios</title>
      <path d="M11.0683 2.89968V22.2973l-2.11399 1.70265V7.8638H4.975l6.0933-4.96412zM14.93426 0v15.76724H19.025l-6.20044 5.08865V1.4689L14.93426 0z" />
    </svg>
  );
};
