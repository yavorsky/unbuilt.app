import { LogoProps } from '../../../../types/meta.js';

export const SuperagentLogo = ({
  width = 24,
  height = 24,
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      className={className}
    >
      <title>Avatar Icon</title>
      {/* Background Circle */}
      <circle cx="12" cy="12" r="12" fill="#4CAF50" />

      {/* Face */}
      <rect x="7" y="8" width="10" height="8" rx="1" fill="#795548" />

      {/* Eyes */}
      <circle cx="9.5" cy="11" r="0.8" fill="white" />
      <circle cx="14.5" cy="11" r="0.8" fill="white" />

      {/* Hair */}
      <path d="M7 9c0-1 1-2.5 5-2.5s5 1.5 5 2.5v1H7V9z" fill="#3E2723" />
    </svg>
  );
};
