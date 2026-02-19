import { LogoProps } from '../../../../types/meta.js';

export const HandsontableLogo = ({
  width = 24,
  height = 24,
  color = '#185AC6',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Handsontable</title>
      <path d="M2 2h20v20H2V2zm2 2v7h7V4H4zm9 0v7h7V4h-7zM4 13v7h7v-7H4zm9 0v7h7v-7h-7z" />
    </svg>
  );
};
