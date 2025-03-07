import { LogoProps } from '../../../../types/meta.js';

const MomentLogo = ({ width = 24, height = 24, className = '' }: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 40 40"
      className={className}
      role="img"
    >
      <title>Moment.js</title>
      {/* Outer ring */}
      <ellipse
        stroke-width="3"
        cx="20"
        cy="20"
        rx="18.5"
        ry="18.5"
        stroke="#fff"
      ></ellipse>
      <path
        fill-rule="evenodd"
        fill="#fff"
        d="M20,36 C28.836556,36 36,28.836556 36,20 C36,11.163444 28.836556,4 20,4 C11.163444,4 4,11.163444 4,20 C4,28.836556 11.163444,36 20,36 Z M20,5 C19.4477153,5 19,5.44994876 19,6.00684547 L19,19 L11.9970301,19 C11.4463856,19 11,19.4438648 11,20 C11,20.5522847 11.4556644,21 11.9953976,21 L21,21 L21,6.00087166 C21,5.4481055 20.5561352,5 20,5 Z"
      ></path>
    </svg>
  );
};

export default MomentLogo;
