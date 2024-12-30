import { LogoProps } from '../../../../types/meta.js';

export const AMDLogo = ({
  width = 24,
  height = 24,
  color = '#FFCF00',
  className = '',
}: LogoProps) => {
  // Calculate height based on aspect ratio if only width is provided
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={calculatedHeight}
      className={className}
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Monospace"
        fontSize="11"
        fontWeight="bold"
        fill={color}
      >
        AMD
      </text>
    </svg>
  );
};
export default AMDLogo;
