import { useState, useEffect } from 'react';
import {
  Sparkles,
  Star,
  Sun,
  Moon,
  Circle,
  Square,
  Triangle,
  Heart,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const DESTINATIONS = [
  [-100, -100], // Top Left
  [100, -100], // Top Right
  [-100, 100], // Bottom Left
  [100, 100], // Bottom Right
];

const ICONS = [
  Sparkles,
  Star,
  Sun,
  Moon,
  Circle,
  Square,
  Triangle,
  Heart,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
];

export default function BlockDestruction() {
  const [isExploding, setIsExploding] = useState(false);
  const [fragments, setFragments] = useState<
    ReturnType<typeof generateDestinations>
  >([]);
  const [showIcons, setShowIcons] = useState(false);

  const generateDestinations = () => {
    return Array(12)
      .fill(0)
      .map((_, index) => {
        const groupIndex = Math.floor(index / 3);
        const [baseX, baseY] = DESTINATIONS[groupIndex];

        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        return {
          tx: baseX + offsetX,
          ty: baseY + offsetY,
          rotation: Math.random() * 360,
          IconComponent: ICONS[index],
        };
      });
  };

  useEffect(() => {
    setFragments(generateDestinations());
  }, []);

  const handleExplode = () => {
    setFragments(generateDestinations());
    setIsExploding(true);
    // Delay icon appearance slightly for smooth transition
    setTimeout(() => setShowIcons(true), 300);
  };

  const handleReset = () => {
    setIsExploding(false);
    setShowIcons(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        margin: '50px auto',
      }}
      onMouseEnter={() => handleExplode()}
      onMouseLeave={() => handleReset()}
    >
      <div>
        {Array(12)
          .fill(0)
          .map((_, index) => {
            const top = 150 + Math.floor(index / 3) * 25;
            const left = 150 + (index % 3) * 25;
            const fragment = fragments[index] || { tx: 0, ty: 0, rotation: 0 };
            const IconComponent = fragment.IconComponent;

            return (
              <div
                key={index}
                style={{
                  width: '25px',
                  height: '25px',
                  position: 'absolute',
                  background: '#2563eb',
                  // opacity: isExploding ? 1 : 0,
                  top: `${top}px`,
                  left: `${left}px`,
                  transition: 'opacity 0.3s',
                  transform: isExploding
                    ? `translate(${fragment.tx}px, ${fragment.ty}px) rotate(${fragment.rotation}deg)`
                    : 'translate(0, 0) rotate(0deg)',
                  transitionProperty: 'transform, opacity',
                  transitionDuration: '1s',
                  transitionTimingFunction: 'ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {IconComponent && showIcons && (
                  <div
                    style={{
                      position: 'absolute',
                      opacity: showIcons ? 1 : 0,
                      transition: 'opacity 0.5s',
                      transform: 'rotate(-' + fragment.rotation + 'deg)',
                      color: 'white',
                    }}
                  >
                    <IconComponent size={16} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
