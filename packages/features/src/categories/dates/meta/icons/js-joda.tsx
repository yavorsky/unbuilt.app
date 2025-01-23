import { LogoProps } from '../../../../types/meta.js';

const JsJodaLogo = ({
  width = 24,
  height = 24,
  color = '#20221f',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 280 280"
      className={className}
      role="img"
    >
      <title>JS-Joda</title>
      <path fill="#fefefe" d="M-.5-.5h280v280H-.5z" />
      <path
        fill={color}
        d="M122.5 24.5c44.37-4.21 80.87 10.46 109.5 44 27.79 39.08 32.13 80.75 13 125-20.35 38.31-52.18 60.14-95.5 65.5-49.13 1.85-86.63-18-112.5-59.5-15-28.53-18.65-58.53-11-90 16-46.73 48.11-75.06 96.5-85z"
      />
      <path
        fill="#fdfdfd"
        d="M130.5 36.5c52.44-.72 88.61 22.94 108.5 71 12.4 42.83 2.9 80-28.5 111.5-38.01 31.17-79.01 35.84-123 14-39.9-26-57.07-62.82-51.5-110.5 12.42-49.63 43.92-78.29 94.5-86z"
      />
      <path
        fill={color}
        d="M136.5 58.5c3.36-.43 6.2.57 8.5 3 .33 23 .67 46 1 69 14.09-7.77 27.93-15.94 41.5-24.5 9.09-1.1 11.75 2.4 8 10.5-18.21 11.08-36.71 21.42-55.5 31-2.67.33-4.67-.67-6-3-.67-27.67-.67-55.33 0-83 1.05-.87 1.88-1.87 2.5-3z"
      />
    </svg>
  );
};

export default JsJodaLogo;
