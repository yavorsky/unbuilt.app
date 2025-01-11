import { LogoProps } from '../../../../types/meta.js';

export const ReactIntlLogo = ({
  width = 21, // Default width maintains original aspect ratio with 24px height (110:128)
  height = 24,
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || Math.round(width * (128 / 110));
  const calculatedWidth = width || Math.round(height * (110 / 128));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={calculatedWidth}
      height={calculatedHeight}
      viewBox="0 0 110 128"
      className={className}
    >
      {/* Background */}
      <rect x="0" y="0" width="110" height="128" fill="#6F3C97" />
      {/* Content */}
      <path
        d="M110 124H0V4h110v120zM23.243 34v64.26h8.551V68.829h29.52v-7.2h-29.52V41.2h33.66V34H23.243zm57.96 17.729V37.78h-7.649v13.95h-7.921v6.75h7.921v29.61c0 2.16.209 3.9.63 5.22.419 1.32 1.064 2.34 1.935 3.061.869.72 2.01 1.215 3.42 1.484 1.409.271 3.105.405 5.085.405h5.851v-6.75h-3.511c-1.2 0-2.175-.045-2.925-.135-.751-.09-1.336-.284-1.755-.585-.421-.3-.706-.721-.854-1.261-.151-.539-.226-1.26-.226-2.159V58.48h9.271v-6.75h-9.272z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export default ReactIntlLogo;
