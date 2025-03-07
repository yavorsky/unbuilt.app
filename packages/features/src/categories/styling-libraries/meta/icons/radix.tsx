import { LogoProps } from '../../../../types/meta.js';

const RadixLogo = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      fill={color}
      className={`text-black dark:text-white ${className}`}
      role="img"
    >
      <title>shadcn/ui</title>
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Radix UI</title>
        <path
          fill={color}
          d="M11.52 24a7.68 7.68 0 0 1-7.68-7.68 7.68 7.68 0 0 1 7.68-7.68V24Zm0-24v7.68H3.84V0h7.68Zm4.8 7.68a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68Z"
        />
      </svg>
    </svg>
  );
};

export default RadixLogo;
