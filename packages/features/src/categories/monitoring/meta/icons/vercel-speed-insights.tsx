import { LogoProps } from '../../../../types/meta.js';

const VercelLogo = ({ width = 24, height = 24, className = '' }: LogoProps) => {
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
      <title>Vercel</title>
      <path fill="currentColor" d="m12 1.608 12 20.784H0Z" />
    </svg>
  );
};

export default VercelLogo;
