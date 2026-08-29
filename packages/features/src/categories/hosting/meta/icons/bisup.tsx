import { LogoProps } from '../../../../types/meta.js';

const BisupLogo = ({ width = 24, height = 24, className = '' }: LogoProps) => {
  return (
    <img
      src="/icons/bisup.ico"
      width={width}
      height={height}
      className={className}
      alt="Bisup"
    />
  );
};

export default BisupLogo;
