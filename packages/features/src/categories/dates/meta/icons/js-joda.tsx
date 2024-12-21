import { LogoProps } from '../../../../types/meta.js';

const JSJodaLogo = ({
  width = 24,
  height = 24,
  color = '#B490F7',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 64 64"
      className={className}
      role="img"
    >
      <title>Luxon</title>
      <path
        fill={color}
        d="M47.96 2.81C56.09 7.54 61.58 14.92 64 24c1 11.04.13 19.86-6.2 29.25C49.62 61.3 41.59 64.4 30.16 64.37c-8.8-.22-15.89-3-22.12-9.37C.53 45.3-1.25 36.02 0 24 2.25 14.5 7.64 8.61 15.62 3.3c9.5-5.18 22.61-5.17 32.34-.49z"
      />
      <path
        fill={color === '#B490F7' ? '#B18DF7' : color}
        d="M27 24c1.32 0 2.64 0 4 0v15l2 1V24h4v3l1-2 4 1-2 3 3-3 3 1v2h4v2l2 2-1 1 3 1v5h-8c2.31.33 4.62.66 7 1l-1 2c-1.13-.19-2.27-.37-3.44-.56-1.76-.22-1.76-.22-3.56-.44l-.5 1c1.98.33 3.96.66 6 1-3.26 3.62-6.02 5.66-10.96 6.22a115.78 115.78 0 0 1-6.85.15c-5.95.03-9.7-1.48-14.85-4.45v-2l4-2c-3.96.5-3.96.5-8 1v-1h6l1 1h2l-3-3 3-3-5-1v-2l3 1-2-2v-2l1-1v1z"
      />
      <path
        fill={color === '#B490F7' ? '#7A60AB' : color}
        d="M54 41c3.88.88 5.7 1.67 8.38 4.69 1.94 3.96 2.39 5.96 1.62 10.31-2.52 4.86-6.13 7.38-11.12 9.44-9.24 2.89-17.64 2.39-26.59-1.22-2.92-1.56-4.62-3.37-6.29-6.22 3.3-.66 6.6-1.32 10-2l-1 2-5 1c2.79 3.23 5.68 4.74 9.96 5.22 2.29.12 4.56.15 6.85.15 5.96.03 9.7-1.48 14.85-4.45-2.47-.99-2.47-.99-5-2l1-2h1l-1-2c2.97.33 5.94.66 9 1v-2h-9v-1h9v-2h-7l4-2-3-2h2v-2c-1.98.33-3.96.66-6 1-.33-1.32-.66-2.64-1-4z"
      />
    </svg>
  );
};
export default JSJodaLogo;
