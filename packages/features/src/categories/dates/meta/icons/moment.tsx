import { LogoProps } from '../../../../types/meta.js';

const MomentLogo = ({
  width = 24,
  height = 24,
  color = '#529990',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 256 256"
      className={className}
      role="img"
    >
      <title>Moment.js</title>
      {/* Outer ring */}
      <path
        fill={color === '#529990' ? '#376660' : color}
        d="M128 256c70.69 0 128-57.31 128-128S198.69 0 128 0 0 57.31 0 128s57.31 128 128 128zm0-19.2c-60.09 0-108.8-48.71-108.8-108.8C19.2 67.91 67.91 19.2 128 19.2c60.09 0 108.8 48.71 108.8 108.8 0 60.09-48.71 108.8-108.8 108.8z"
      />
      {/* Inner circle and clock hands */}
      <path
        fill={color}
        d="M128 230.4c56.55 0 102.4-45.85 102.4-102.4 0-56.55-45.85-102.4-102.4-102.4-56.55 0-102.4 45.85-102.4 102.4 0 56.55 45.85 102.4 102.4 102.4zM128 32c-3.53 0-6.4 2.88-6.4 6.44v83.16H76.78c-3.52 0-6.38 2.84-6.38 6.4 0 3.53 2.92 6.4 6.37 6.4h57.63v-96c0-3.54-2.84-6.4-6.4-6.4z"
      />
    </svg>
  );
};

export default MomentLogo;
