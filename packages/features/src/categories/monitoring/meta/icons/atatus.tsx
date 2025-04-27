import { LogoProps } from '../../../../types/meta.js';

const AtatusLogo = ({ width = 24, height, className = '' }: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 50 50"
      className={`text-black dark:text-white ${className}`}
    >
      <title>Atatus</title>
      <path
        fill="#0055DC"
        d="M2.533 9.043a10.154 10.154 0 016.51-6.51 51.523 51.523 0 0131.914 0 10.154 10.154 0 016.51 6.51 51.522 51.522 0 010 31.914 10.154 10.154 0 01-6.51 6.51 51.522 51.522 0 01-31.914 0 10.154 10.154 0 01-6.51-6.51 51.523 51.523 0 010-31.914z"
      />
      <path
        fill="white"
        d="M20.853 11.638c1.831-3.517 6.463-3.517 8.294 0l11.22 21.548a5.604 5.604 0 01-.032 5.235c-1.584 2.952-5.656 1.737-8.596.132l-1.946-1.063a10 10 0 00-9.586 0l-1.946 1.063c-2.94 1.605-7.012 2.82-8.596-.132a5.604 5.604 0 01-.032-5.235l11.22-21.548z"
      />
    </svg>
  );
};

export default AtatusLogo;
