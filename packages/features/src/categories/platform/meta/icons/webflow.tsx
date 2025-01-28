import { LogoProps } from '../../../../types/meta.js';

export const WebflowLogo = ({
  width = 24,
  height = 24,
  className = '',
  color = '#4353FF',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      className={className}
    >
      <title>Webflow</title>
      <path
        d="m24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z"
        fill={color}
      />
    </svg>
  );
};

export default WebflowLogo;
