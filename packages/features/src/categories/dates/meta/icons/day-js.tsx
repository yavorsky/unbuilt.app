import { LogoProps } from '../../../../types/meta.js';

export const DayJSLogo = ({
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
      viewBox="0 0 80 80"
      className={className}
    >
      <path
        d="M44.348 80.176H0.176V0.176H80.176V80.176H44.348M13.46 44.688c-1.058 0.941-2.332 1.222-3.703 1.21-0.695-0.003-1.394-0.046-2.086 0.012-0.781 0.07-1.058-0.168-1.039-0.996 0.055-2.375 0.02-4.75 0.02-7.129v-0.371c-0.641 0-1.18 0-1.743 0v11.031c2.168 0 4.305 0.204 6.383-0.054 2.266-0.286 4.14-1.485 5.094-3.72 0.7-1.636 0.863-3.351 0.57-5.109-0.43-2.57-1.73-4.426-4.239-5.355-2.566-0.95-5.199-0.29-7.8-0.52v0.625c1.59 0 3.125-0.024 4.656 0.008 1.164 0.02 2.285 0.176 3.332 0.8 2.836 1.704 3.152 7.044 0.555 9.567M67.399 47.305c2.007 0.484 4.003 0.656 5.925-0.325 1.52-0.773 2.27-2.047 2.14-3.742-0.116-1.563-0.995-2.617-2.472-3.137-0.707-0.246-1.441-0.422-2.156-0.649-1.125-0.359-2.274-0.672-3.356-1.137-0.375-0.164-0.754-0.672-0.848-1.09-0.332-1.46 0.356-2.5 1.832-2.813 1.996-0.43 3.84-0.047 5.504 1.32 0.266-0.507 0.5-0.953 0.797-1.515-0.762-0.414-1.422-0.91-2.168-1.152-2.11-0.688-4.211-0.742-6.172 0.507-1.871 1.196-2.57 4.2-0.82 5.692 0.836 0.71 2.031 1.023 3.093 1.43 1.184 0.449 2.438 0.73 3.606 1.214 0.851 0.352 1.363 1.075 1.219 2.082-0.133 0.93-0.704 1.61-1.586 1.735-1.157 0.16-2.39 0.281-3.508 0.043-1.227-0.266-2.36-0.957-3.59-1.488-0.039 0.063-0.156 0.227-0.254 0.402-0.527 0.934-0.504 1.055 0.476 1.559 0.719 0.371 1.47 0.684 2.336 1.063M58.563 34.195v6.77c-0.02 0.976-0.11 1.965-0.313 2.922-0.336 1.582-1.14 2.226-2.754 2.168-0.957-0.035-1.906-0.281-2.887-0.434-0.226 0.582-0.66 1.258 0.332 1.637 3.016 1.153 6.946 0.543 7.234-3.742 0.239-3.512 0.141-7.047 0.188-10.574 0.004-0.075-0.07-0.145-0.094-0.188-0.566 0-1.097 0-1.691 0-0.004 0.469 0 0.871 0 1.441"
        fill="#ff5f4c"
      />
      <path
        d="M13.508 44.645c2.55-2.48 2.234-7.82-0.602-9.524-1.047-0.625-2.168-0.781-3.332-0.8-1.531-0.031-3.067-0.008-4.657-0.008v-1.625c2.602 0.23 5.235-0.43 7.801 0.52 2.508 0.929 3.809 2.785 4.239 5.355 0.293 1.758 0.129 3.473-0.57 5.11-0.954 2.234-2.829 3.433-5.094 3.718-2.079 0.258-4.215 0.055-6.383 0.055V36.414c0.562 0 1.101 0 1.742 0v1.371c0 2.38 0.035 4.754-0.02 7.13-0.02 0.827 0.258 1.066 1.04 0.996 0.691-0.059 1.39-0.016 2.085-0.012 1.371 0.011 2.645-0.27 3.75-1.254z"
        fill="#fffcfc"
      />
      <path
        d="M67.332 47.285c-0.8-0.36-1.551-0.672-2.27-1.043-0.98-0.504-1.003-0.625-0.476-1.559 0.098-0.175 0.215-0.34 0.254-0.402 1.23 0.531 2.363 1.222 3.59 1.488 1.117 0.238 2.351 0.117 3.508-0.043 0.882-0.125 1.453-0.805 1.586-1.735 0.144-1.008-0.368-1.73-1.22-2.082-1.167-0.484-2.421-0.765-3.605-1.215-1.063-0.406-2.258-0.719-3.094-1.43-1.75-1.492-1.05-4.496 0.82-5.691 1.961-1.25 4.063-1.195 6.172-0.508 0.746 0.242 1.406 0.738 2.168 1.152-0.297 0.562-0.531 1.008-0.797 1.515-1.664-1.367-3.508-1.75-5.504-1.32-1.476 0.313-2.164 1.352-1.832 2.813 0.094 0.418 0.473 0.926 0.848 1.09 1.082 0.465 2.23 0.777 3.356 1.136 0.714 0.227 1.449 0.403 2.156 0.649 1.477 0.52 2.356 1.574 2.473 3.137 0.129 1.695-0.621 2.969-2.14 3.742-1.922 0.98-3.918 0.809-5.993 0.305z"
        fill="#fcfbf8"
      />
      <path
        d="M58.563 34.11v-1.356c0.593 0 1.125 0 1.691 0 0.024 0.043 0.074 0.113 0.094 0.188 0.047 3.527-0.051 7.062 0.188 10.574 0.289 4.285-3.641 4.894-6.657 3.742-0.992-0.379-0.558-1.055-0.332-1.637 0.98 0.153 1.93 0.399 2.887 0.434 1.613 0.058 2.418-0.586 2.754-2.168 0.203-0.957 0.293-1.946 0.312-2.922 0.043-2.258 0.016-4.516 0.016-6.856z"
        fill="#fcfdfc"
      />
      <path
        d="M40.664 44.867v2.586c-0.64 0-1.23 0-1.879 0 0-1.7-0.039-3.379 0.027-5.055 0.016-0.414 0.368-0.824 0.594-1.223 1.555-2.703 3.114-5.406 4.696-8.097 0.105-0.18 0.379-0.332 0.59-0.356 0.457-0.055 0.922-0.015 1.59-0.015-0.629 1.046-1.18 1.972-1.735 2.898-1.207 2.008-2.433 4-3.597 6.032-0.227 0.394-0.239 0.93-0.274 1.406 0.047 0.578 0.012 1.16 0.012 1.824z"
        fill="#fcfcfc"
      />
      <path
        d="M29.664 39.707c1.055 2.594 2.078 5.13 3.094 7.64-0.145 0.09-0.188 0.145-0.235 0.145-1.605 0.098-1.605 0.098-2.207-1.394-0.308-0.781-0.63-1.555-0.898-2.348-0.172-0.488-0.45-0.64-0.965-0.625-1.289 0.04-2.582 0.012-3.891 0.012 0.281-1.403 0.281-1.403 1.54-1.403 0.808 0 1.617 0 2.59 0-0.442-1.203-0.703-2.414-1.305-3.418-0.742-1.246-0.363-2.215 0.324-3.304 0.653 1.57 1.29 3.105 1.953 4.695z"
        fill="#fcfdfc"
      />
      <path
        d="M26.047 34.766c-1.598 4.105-3.164 8.148-4.738 12.191-0.41 1.059-1.274 0.371-2.075 0.598 0.606-1.57 1.133-2.992 1.707-4.398 1.266-3.106 2.594-5.188 3.813-9.313 0.367-0.95 0.832-1.39 1.957-1.035-0.211 0.62-0.426 1.258-0.664 1.957z"
        fill="#fcf8f7"
      />
      <path
        d="M36.012 34.059c0.707 1.234 1.305 2.464 2.082 3.57 0.718 1.023 0.472 1.8-0.34 2.675-1.484-2.496-2.953-4.965-4.453-7.476 1.813-0.317 1.813-0.317 2.711 1.23z"
        fill="#fcf7f7"
      />
      <path
        d="M48.184 45.23h0.902v2.235h-1.442c0-0.601-0.031-1.195 0.024-1.785 0.015-0.16 0.285-0.297 0.516-0.45z"
        fill="#fff4f3"
      />
    </svg>
  );
};

export default DayJSLogo;
