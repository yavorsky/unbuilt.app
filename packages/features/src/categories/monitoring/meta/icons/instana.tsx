import { LogoProps } from '../../../../types/meta.js';

const BeeLogo = ({ width = 24, height, className = '' }: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 32 32"
      className={`text-black dark:text-white ${className}`}
    >
      <title>Bee</title>
      <path
        fill="currentColor"
        d="M16,10a6,6,0,0,0-6,6v8a6,6,0,0,0,12,0V16A6,6,0,0,0,16,10Zm-4.25,7.87h8.5v4.25h-8.5ZM16,28.25A4.27,4.27,0,0,1,11.75,24v-.13h8.5V24A4.27,4.27,0,0,1,16,28.25Zm4.25-12.13h-8.5V16a4.25,4.25,0,0,1,8.5,0Z"
      />
      <path
        fill="currentColor"
        d="M30.66,19.21,24,13v9.1a4,4,0,0,0,8,0A3.83,3.83,0,0,0,30.66,19.21ZM28,24.35a2.25,2.25,0,0,1-2.25-2.25V17l3.72,3.47h0A2.05,2.05,0,0,1,30.2,22,2.25,2.25,0,0,1,28,24.35Z"
      />
      <path
        fill="currentColor"
        d="M0,22.1a4,4,0,0,0,8,0V13L1.34,19.21A3.88,3.88,0,0,0,0,22.1Zm2.48-1.56h0L6.25,17v5.1a2.25,2.25,0,0,1-4.5,0A2.05,2.05,0,0,1,2.48,20.54Z"
      />
      <path
        fill="currentColor"
        d="M15,5.5A3.5,3.5,0,1,0,11.5,9,3.5,3.5,0,0,0,15,5.5Zm-5.25,0A1.75,1.75,0,1,1,11.5,7.25,1.77,1.77,0,0,1,9.75,5.5Z"
      />
      <path
        fill="currentColor"
        d="M20.5,2A3.5,3.5,0,1,0,24,5.5,3.5,3.5,0,0,0,20.5,2Zm0,5.25A1.75,1.75,0,1,1,22.25,5.5,1.77,1.77,0,0,1,20.5,7.25Z"
      />
    </svg>
  );
};

export default BeeLogo;
