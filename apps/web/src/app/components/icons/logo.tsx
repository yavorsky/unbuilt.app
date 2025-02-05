import { SVGProps } from 'react';

export interface IconProps {
  size?: number;
  className?: string;
}

export const LogoIcon = ({
  size = 40,
  className = '',
  ...props
}: IconProps & SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={40} height={40} rx="8" fill="#15183a" />
      <g clipPath="url(#clip0_2_218)">
        <path
          d="M10 11C10 10.4477 10.4477 10 11 10H14C14.5523 10 15 10.4477 15 11V15H10V11Z"
          fill="#2D39AA"
        />
        <rect x="15" y="25" width="5" height="5" fill="#2D39AA" />
        <rect x="20" y="25" width="5" height="5" fill="#4455FF" />
        <path
          d="M25 25H30V29C30 29.5523 29.5523 30 29 30H25V25Z"
          fill="#2D39AA"
        />
        <rect x="25" y="20" width="5" height="5" fill="#2D39AA" />
        <rect x="25" y="15" width="5" height="5" fill="#4455FF" />
        <path
          d="M25 11C25 10.4477 25.4477 10 26 10H29C29.5523 10 30 10.4477 30 11V15H25V11Z"
          fill="#2D39AA"
        />
        <rect x="10" y="15" width="5" height="5" fill="#2D39AA" />
        <rect x="10" y="20" width="5" height="5" fill="#4455FF" />
        <path
          d="M10 25H15V30H11C10.4477 30 10 29.5523 10 29V25Z"
          fill="#2D39AA"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_218">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(10 10)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
