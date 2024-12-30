import { LogoProps } from '../../../../types/meta.js';

export const CJSLogo = ({
  width = 24,
  height = 24,
  color = '#f6dc3d',
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
      <rect width="24" height="24" fill={color} />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominantBaseline="middle"
        font-family="Monospace"
        font-size="11"
        font-weight="bold"
        fill="black"
      >
        CJS
      </text>
    </svg>
  );
};
export default CJSLogo;
