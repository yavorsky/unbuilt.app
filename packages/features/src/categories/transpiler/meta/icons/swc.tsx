import { LogoProps } from '../../../../types/meta.js';

export const SwcLogo = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <title>SWC</title>
      <path d="M7.063 7.797a.99.99 0 0 0-.7 1.69l3.987 3.986a.42.42 0 0 1 .093.48.42.42 0 0 1-.408.272.44.44 0 0 1-.312-.13L4.135 8.509a2.405 2.405 0 0 0-1.711-.71c-.507 0-.99.152-1.395.436a2.443 2.443 0 0 0-.994 2.403c.084.487.32.934.678 1.293L2.25 13.47c.183.183.14.379.098.48a.422.422 0 0 1-.409.274h-.695a.987.987 0 1 0 0 1.976h.705c.507 0 .987-.149 1.393-.433a2.449 2.449 0 0 0 .994-2.405 2.403 2.403 0 0 0-.678-1.293l-1.54-1.54a.42.42 0 0 1-.096-.483.42.42 0 0 1 .408-.272c.116 0 .226.045.31.13l5.588 5.587a2.405 2.405 0 0 0 1.711.71 2.379 2.379 0 0 0 1.996-1.048l.342.34a2.404 2.404 0 0 0 1.71.711h.05a2.41 2.41 0 0 0 1.392-.435c.374-.265.664-.631.842-1.059.176-.43.232-.896.152-1.346a2.403 2.403 0 0 0-.677-1.293l-1.541-1.539a.42.42 0 0 1-.096-.482.422.422 0 0 1 .408-.274h1.053a2.402 2.402 0 0 0-.008.862c.084.487.32.934.678 1.293l3.562 3.562a2.406 2.406 0 0 0 1.711.711c1.316 0 2.39-1.07 2.387-2.389a.99.99 0 1 0-1.979 0 .409.409 0 0 1-.408.409.436.436 0 0 1-.31-.13l-3.563-3.562a.422.422 0 0 1-.097-.482.422.422 0 0 1 .408-.274h.593a.987.987 0 1 0 0-1.976h-4.027c-.507 0-.989.15-1.394.435a2.443 2.443 0 0 0-.994 2.403c.084.487.319.934.677 1.293l1.537 1.54a.42.42 0 0 1 .096.483.417.417 0 0 1-.406.271h-.05a.436.436 0 0 1-.311-.128l-2.022-2.02-.004-.006-3.984-3.982a.991.991 0 0 0-.7-.291zm-4.64.867c.416 0 .806.16 1.1.455l5.59 5.588c.247.247.575.383.924.383a1.29 1.29 0 0 0 1.209-.807c.205-.497.1-1.04-.281-1.422L6.976 8.875a.12.12 0 0 1 0-.174c.05-.05.127-.05.176 0l6.006 6.006c.247.247.575.383.924.383h.05a1.29 1.29 0 0 0 1.21-.807 1.288 1.288 0 0 0-.285-1.424l-1.541-1.54a1.53 1.53 0 0 1-.336-1.694 1.533 1.533 0 0 1 1.437-.959h4.027c.07 0 .124.054.124.123 0 .07-.054.123-.124.123h-.593a1.29 1.29 0 0 0-1.21.807 1.288 1.288 0 0 0 .286 1.424l3.562 3.564c.248.247.576.383.924.383.702 0 1.274-.571 1.274-1.273 0-.07.055-.124.125-.124.069 0 .123.054.123.124a1.52 1.52 0 0 1-1.522 1.519c-.415 0-.805-.16-1.1-.455l-3.562-3.563a1.53 1.53 0 0 1-.336-1.693 1.56 1.56 0 0 1 .586-.713h-2.584a1.29 1.29 0 0 0-1.209.807 1.284 1.284 0 0 0 .283 1.424l1.541 1.54a1.53 1.53 0 0 1 .336 1.694 1.53 1.53 0 0 1-1.435.959h-.051c-.415 0-.805-.16-1.1-.455l-1.422-1.42c.065.3.034.614-.09.916a1.53 1.53 0 0 1-1.435.959c-.415 0-.807-.16-1.102-.455L3.346 9.293a1.297 1.297 0 0 0-.924-.383 1.29 1.29 0 0 0-1.21.807 1.288 1.288 0 0 0 .284 1.424l1.54 1.54a1.53 1.53 0 0 1 .337 1.694 1.53 1.53 0 0 1-1.436.959h-.693c-.07 0-.123-.054-.123-.123s.054-.123.123-.123h.695a1.29 1.29 0 0 0 1.21-.807 1.284 1.284 0 0 0-.286-1.423l-1.539-1.541a1.53 1.53 0 0 1-.336-1.692c.245-.593.793-.96 1.436-.96z" />
    </svg>
  );
};

export default SwcLogo;
