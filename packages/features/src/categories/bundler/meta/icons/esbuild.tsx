import { LogoProps } from '../../../../types/meta.js';

export const EsbuildLogo = ({
  width = 24,
  height = 24,
  color = '#FFCF00',
  className = '',
}: LogoProps) => {
  // Calculate height based on aspect ratio if only width is provided
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      width={width}
      height={calculatedHeight}
      fill={color}
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>esbuild</title>
      <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zM6.718 5.282L13.436 12l-6.718 6.718-2.036-2.036L9.364 12 4.682 7.318zm7.2 0L20.636 12l-6.718 6.718-2.036-2.036L16.564 12l-4.682-4.682z" />
    </svg>
  );
};
export default EsbuildLogo;
