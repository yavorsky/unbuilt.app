import { Card } from '@/components/ui';
import React, { useState, useEffect } from 'react';

export const HeroAnalyzis = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const technologies = [
    {
      name: 'React',
      translate: 'translate-x-32 -translate-y-32',
      type: 'UI Library',
    },
    {
      name: 'Webpack',
      translate: 'translate-x-32 translate-y-0',
      type: 'Bundler',
    },
    {
      name: 'Material UI',
      translate: 'translate-x-32 translate-y-32',
      type: 'Component Library',
    },
    {
      name: 'Redux',
      translate: '-translate-x-32 -translate-y-32',
      type: 'State Manager',
    },
    {
      name: 'date-fns',
      translate: '-translate-x-32 translate-y-0',
      type: 'Date Library',
    },
    {
      name: 'TypeScript',
      translate: '-translate-x-32 translate-y-32',
      type: 'Language',
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 500);
    setTimeout(() => setShowResults(true), 4000);
  }, []);

  return (
    <div className="relative w-96 h-64 flex items-center justify-center">
      <div
        className={`
          absolute w-64 h-34
          rounded-lg shadow-lg
          overflow-hidden
          transition-all duration-1000
          ${isVisible ? 'animate-pulse opacity-50' : 'opacity-100'}
        `}
      >
        <div className="h-8 bg-slate-300/10 backdrop-blur-sm border-gray-800 flex items-center px-3 space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full border-solid border" />
            <div className="w-3 h-3 rounded-full border border-solid" />
            <div className="w-3 h-3 rounded-full border border-solid" />
          </div>
          <div className="flex-1 bg-background h-5 rounded flex items-center px-2 text-xs text-gray-500">
            <span>website.com</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200/10 rounded w-3/4" />
          <div className="h-4 bg-gray-200/10 rounded w-1/2" />
          <div className="h-4 bg-gray-200/10 rounded w-2/3" />
        </div>
      </div>

      {technologies.map((tech, index) => (
        <Card
          key={tech.name}
          className={`
              absolute
              bg-gray-900/30 backdrop-blur-sm border-gray-800
              rounded p-3 shadow-lg
              transition-all duration-1000 ease-out
              ${isVisible ? `${tech.translate} opacity-100` : 'opacity-0'}
              z-10
            `}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex flex-col items-center min-w-[120px]">
            <span
              className={`
                  text-foreground/10
                  whitespace-nowrap
                  transition-all duration-500
                  ${!showResults ? 'animate-pulse' : 'hidden'}
                `}
            >
              Calculating {tech.type}...
            </span>
            <span
              className={`
                  text-foreground/50
                  font-medium
                  whitespace-nowrap
                  transition-all duration-500
                  ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {tech.name}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
