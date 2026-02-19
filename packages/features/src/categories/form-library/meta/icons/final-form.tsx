import { LogoProps } from '../../../../types/meta.js';

export const FinalFormLogo = ({
  width = 24,
  height = 24,
  color = '#333333',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Final Form</title>
      <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4v12h3v-5h5v-3h-5V6H6z" />
    </svg>
  );
};
