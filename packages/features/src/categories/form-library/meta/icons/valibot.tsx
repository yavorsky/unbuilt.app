import { LogoProps } from '../../../../types/meta.js';

export const ValibotLogo = ({
  width = 24,
  height = 24,
  color = '#FFD100',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" width={width} height={calculatedHeight} viewBox="0 0 24 24" fill={color} className={className}>
      <title>Valibot</title>
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L19 9l-7 3.82L5 9l7-4.82zM5 10.88l6 3.27v6.53l-6-3.33v-6.47zm8 3.27l6-3.27v6.47l-6 3.33v-6.53z" />
    </svg>
  );
};
