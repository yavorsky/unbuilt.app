import { LogoProps } from '../../../../types/meta.js';

const HeapLogo = ({
  width = 30,
  height = width * 1.6,
  className = '',
}: LogoProps) => {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 30 48"
      className={`${className}`}
    >
      <title>Heap Logo</title>
      <rect y="10.6197" width="5.45956" height="26.9973" fill="currentColor" />
      <rect
        x="11.8295"
        y="0.333405"
        width="5.45956"
        height="20.5693"
        fill="currentColor"
      />
      <rect
        x="11.8295"
        y="27.3348"
        width="5.45956"
        height="20.5693"
        fill="#31D891"
      />
      <rect
        x="23.6589"
        y="10.6197"
        width="5.45956"
        height="26.9973"
        fill="#31D891"
      />
    </svg>
  );
};

export default HeapLogo;
