import { LogoProps } from '../../../../types/meta.js';

export const ESModulesLogo = ({
  width = 24,
  height = 24,
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  const calculatedWidth = width || height; // Square aspect ratio

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={calculatedWidth}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      className={className}
    >
      {/* Background */}
      <rect x="0.5" y="0.5" width="23" height="23" fill="rgb(248,220,61)" />
      {/* ES text converted to path for better compatibility */}
      <text
        x="50%"
        y="80%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Monospace"
        fontSize="11"
        fontWeight="bold"
        fill="black"
      >
        ESM
      </text>
    </svg>
  );
};

export default ESModulesLogo;
