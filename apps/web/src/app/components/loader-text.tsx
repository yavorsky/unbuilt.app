import { useState, useEffect, FC } from 'react';

const LoaderText: FC<{ supportedOptions: string[]; interval?: number }> = ({
  supportedOptions,
  interval = 1000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalResult = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === supportedOptions.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(intervalResult);
  }, [supportedOptions.length, interval]);

  return (
    <div className="space-y-2">
      <span className="inline-block animate-pulse text-white">
        Looking for {supportedOptions[currentIndex]}...
      </span>
    </div>
  );
};

export default LoaderText;
