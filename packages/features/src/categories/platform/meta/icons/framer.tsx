import { LogoProps } from '../../../../types/meta.js';

const FramerLogo = ({ width = 24, height = 24, className = '' }: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      className={`text-black dark:text-white ${className}`}
    >
      <title>Framer</title>
      <path fill="currentColor" d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  );
};

export default FramerLogo;
