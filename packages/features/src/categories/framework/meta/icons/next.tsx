import { LogoProps } from '../../../../types/meta.js';

export const NextLogo = ({
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
      viewBox="0 0 180 180"
      className={className}
    >
      <mask
        id="nextjs_mask"
        maskUnits="userSpaceOnUse"
        width="180"
        height="180"
        x="0"
        y="0"
        style={{ maskType: 'alpha' }}
      >
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#nextjs_mask)">
        <circle cx="90" cy="90" r="90" fill="black" data-circle="true" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#nextjs_gradient_1)"
        />
        <rect
          width="12"
          height="72"
          x="115"
          y="54"
          fill="url(#nextjs_gradient_2)"
        />
      </g>
      <defs>
        <linearGradient
          id="nextjs_gradient_1"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="nextjs_gradient_2"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
