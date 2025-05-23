import { LogoProps } from '../../../../types/meta.js';

const NewRelicLogo = ({ width = 24, height, className = '' }: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 832.8 959.8"
      className={`text-black dark:text-white ${className}`}
    >
      <title>New Relic</title>
      <path
        d="M672.6 332.3l160.2-92.4v480L416.4 959.8V775.2l256.2-147.6z"
        fill="#00ac69"
      />
      <path
        d="M416.4 184.6L160.2 332.3 0 239.9 416.4 0l416.4 239.9-160.2 92.4z"
        fill="#1ce783"
      />
      <path
        d="M256.2 572.3L0 424.6V239.9l416.4 240v479.9l-160.2-92.2z"
        fill="#1d252c"
      />
    </svg>
  );
};

export default NewRelicLogo;
