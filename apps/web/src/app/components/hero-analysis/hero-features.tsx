import React, { useState } from 'react';

const AnimatedLineReveal = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-96 h-96 p-8">
      {/* Starting Block */}
      <div
        className="absolute top-8 left-8 w-20 h-20 bg-blue-500 rounded-lg cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      />

      {/* SVG Path Container */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          {/* Glowing effect filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Angular path definition using line segments */}
          <path
            id="angularPath"
            d="M 68 68 L 200 68 L 200 200 L 332 332"
            fill="none"
          />
        </defs>

        {/* Animated line with glow */}
        <use
          href="#angularPath"
          className={`stroke-gray-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          strokeWidth="1"
          filter="url(#glow)"
          strokeDasharray="600"
          strokeDashoffset={isHovered ? '0' : '600'}
          style={{
            transition: 'stroke-dashoffset 1s ease-out, opacity 0.3s ease',
          }}
        />
      </svg>

      {/* Ending Block */}
      <div
        className={`
          absolute bottom-8 right-8 w-20 h-20
          bg-green-500 rounded-lg
          transition-all duration-200 delay-300
          ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
        `}
      />
    </div>
  );
};

export default AnimatedLineReveal;
