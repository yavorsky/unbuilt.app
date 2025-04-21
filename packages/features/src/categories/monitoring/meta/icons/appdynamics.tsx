import { LogoProps } from '../../../../types/meta.js';

const AppDynamicsLogo = ({ width = 24, height, className = '' }: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      className={`text-black dark:text-white ${className}`}
    >
      <title>AppDynamics</title>
      <g>
        <path
          fill="currentColor"
          d="M10.945 18.508l-7.937-16.546c-1.916,1.76-3.128,4.261-3.128,7.077c0,5.278 4.302,9.58 9.581,9.58c0.508,0 0.978-0.039 1.486-0.117"
        />
        <path
          fill="currentColor"
          d="M7.757 0c0.587-0.117 1.173-0.156 1.76-0.156c5.279,0 9.581,4.302 9.581,9.58c0,2.894-1.29,5.515-3.363,7.272l2.347,4.929c3.832-2.698 6.333-7.155 6.333-12.201C24.453,4.147 19.066,0 11.744,0C10.336,0 8.929,0.195 7.757,0.587z"
        />
      </g>
    </svg>
  );
};

export default AppDynamicsLogo;
