import { LogoProps } from '../../../../types/meta.js';

const AWSAmplifyLogo = ({
  width = 24,
  height = 24,
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
      className={`text-black dark:text-white ${className}`}
    >
      <title>AWS Amplify</title>
      <path
        fill="currentColor"
        d="M5.223 17.905h6.76l1.731 3.047H0l4.815-8.344 2.018-3.494 1.733 3.002zm2.52-10.371L9.408 4.65l9.415 16.301h-3.334zm2.59-4.486h3.33L24 20.952h-3.334z"
      />
    </svg>
  );
};

export default AWSAmplifyLogo;
