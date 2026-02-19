import { LogoProps } from '../../../../types/meta.js';

export const WebSocketLogo = ({
  width = 24,
  height = 24,
  color = '#333333',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>WebSocket</title>
      <path d="M2 12l4-4v3h12V8l4 4-4 4v-3H6v3l-4-4z" />
    </svg>
  );
};
