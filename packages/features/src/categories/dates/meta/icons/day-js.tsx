import { LogoProps } from '../../../../types/meta.js';

const DayJsLogo = ({
  width = 24,
  height = 24,
  color = '#FF5F4C',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 50 50"
      className={className}
      role="img"
    >
      <title>Day.js</title>
      <path
        fill={color}
        d="M5.5 14.2c-1.5 3.7-2.3 7.7-2.3 11.8 0 4.1.8 8.1 2.3 11.8 1.4 3.3 3.4 6.4 6.6 9.2h5.8c-6-5.9-9-13.1-9-21.5 0-8.4 3-15.6 9-21.5h-5.8c-3.2 2.8-5.2 5.9-6.6 9.2z"
      />
      <path
        fill={color}
        d="M44.5 37.8c1.5-3.7 2.3-7.6 2.3-11.8 0-4.1-.8-8.1-2.3-11.7-1.4-3.3-3.4-6.4-6.6-9.8h-5.8c6 5.9 9 13.1 9 21.5 0 8.4-3 15.6-9 21.5h5.8c3.2-2.8 5.2-5.9 6.6-9.7z"
      />
      <path
        fill={color}
        d="M25 7.1h-3.8v21.9h3.8v-.1L40.5 13l-2.5-2.5-13 13V7.1z"
      />
    </svg>
  );
};
export default DayJsLogo;
