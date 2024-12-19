import { LogoProps } from '../../../../types/meta.js';

export const SucraseLogo = ({
  width = 24,
  height = 24,
  color = '#2D5FD2',
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
      className={className}
    >
      <title>Sucrase</title>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm1 3.5c-2.5 0-4.5.8-5.2 1.4-.3.3-.3.8 0 1.1l.4.4c.3.3.7.3 1 0 .5-.4 1.9-1 3.6-1 1.4 0 2.2.5 2.2 1.3 0 2.5-7.4 1.1-7.4 5.6 0 2 1.6 3.2 4.4 3.2 2.2 0 3.8-.7 4.6-1.3.3-.2.3-.7 0-1l-.4-.4c-.3-.3-.7-.2-.9 0-.6.4-1.8.9-3.2.9-1.4 0-2.2-.5-2.2-1.3 0-2.5 7.4-1.1 7.4-5.6 0-2-1.7-3.3-4.3-3.3z" />
    </svg>
  );
};
