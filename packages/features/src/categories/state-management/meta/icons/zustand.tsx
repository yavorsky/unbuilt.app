import { LogoProps } from '../../../../types/meta.js';

export const ValtioLogo = ({
  width = 24,
  height = 24,
  color = '#3B82F6',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 120 24"
      className={className}
    >
      <title>Valtio</title>
      <text
        x="60"
        y="20"
        fontSize="24"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
        fill={color}
        style={{ fontWeight: 'bold' }}
      >
        valtio
      </text>
    </svg>
  );
};
