import { LogoProps } from '../../../../types/meta.js';

export const XStateLogo = ({
  width = 249,
  height,
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || (width * 68) / 249;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 249 68"
      className={`text-black dark:text-white ${className}`}
      width={width}
      height={calculatedHeight}
    >
      <g fill="currentColor" fill-rule="evenodd">
        <path d="M101.229 16.905c8.366 0 13.422 3.627 14.235 10.215l.025.198h-4.784l-.03-.138c-.942-4.45-3.767-6.348-9.446-6.348-5.153 0-8.355 2.203-8.355 5.747 0 3.5 1.4 5.248 9.691 6.364 8.67 1.216 14.044 3.448 14.044 10.797 0 6.244-6.145 10.952-14.292 10.952-11.884 0-15.141-6.388-15.78-11.747l-.024-.198h5.137l.022.15c.591 4.087 2.29 7.868 10.644 7.868 5.305 0 9.155-2.825 9.155-6.719 0-4.148-2.278-5.743-9.75-6.821-7.174-.983-13.812-2.903-13.812-10.236 0-5.843 5.601-10.084 13.32-10.084Zm49.349.459v4.683h-11.896v32.186h-5.31V22.047h-11.896v-4.683h29.102Zm21.3 0 13.975 36.869h-5.277l-4.005-10.521h-16.645l-3.946 10.52h-5.052l14.205-36.868h6.746Zm43.815 0v4.683h-11.896v32.186h-5.31V22.048h-11.896v-4.683h29.102v-.001Zm32.907 0v4.683h-19.853V33.4h10.076v4.632h-10.076v11.516H248.6v4.683h-25.162V17.364H248.6Zm-80.324 4.329-6.503 17.79h13.007l-6.504-17.79ZM2.16 0l13.485.11a4.27 4.27 0 0 1 3.346 1.664l48.174 62.378c1.092 1.412.09 3.467-1.689 3.467H51.36a4.274 4.274 0 0 1-3.4-1.689L34.523 47.452l-14.87 18.536a4.273 4.273 0 0 1-3.357 1.631H2.143c-1.788 0-2.787-2.074-1.678-3.483l23.589-30.021L.444 3.455C-.636 2.036.382-.013 2.162.002ZM65.46 0c1.796-.014 2.809 2.068 1.695 3.483L46.104 30.21c-1.5-1.187-13.153-10.99-1.912-24.115l1.734-2.04.314-.37c.731-.862 1.427-1.685 1.639-1.942C48.99.39 49.905.12 51.202.11l14.257-.11Z" />
      </g>
    </svg>
  );
};

export default XStateLogo;
