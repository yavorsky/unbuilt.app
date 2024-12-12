export interface IconProps {
  size?: number;
  className?: string;
}

export const LogoIcon = ({
  size = 32,
  className = '',
  opacity = 0.3,
  blockColor = 'rgb(129, 140, 248)',
  backgroundColor = 'rgb(25, 32, 60)',
}: IconProps & {
  opacity?: number;
  blockColor?: string;
  backgroundColor?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
    >
      {/* Background */}
      <rect width="32" height="32" rx="6" fill={backgroundColor} />

      {/* Stylized "U" shape formed by building blocks */}
      <rect
        x="8"
        y="8"
        width="4"
        height="12"
        fill={blockColor}
        opacity={opacity}
      />
      <rect
        x="20"
        y="8"
        width="4"
        height="12"
        fill={blockColor}
        opacity={opacity}
      />
      <rect
        x="8"
        y="20"
        width="16"
        height="4"
        fill={blockColor}
        opacity={opacity}
      />

      {/* Animated building blocks */}
      <rect x="8" y="16" width="4" height="4" fill={blockColor} />
      <rect x="20" y="12" width="4" height="4" fill={blockColor} />
      <rect x="14" y="20" width="4" height="4" fill={blockColor} />
    </svg>
  );
};
