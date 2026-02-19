export const framerMotion = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/framer-motion/, /\bmotion\/react\b/],
    filenames: [/framer-motion/],
  },
  {
    name: 'domMarkers' as const,
    score: 0.8,
    documents: [/data-framer-/, /data-projection-id/],
    scripts: [/motion\.div/, /motion\.span/, /AnimatePresence/, /useMotionValue\s*\(/, /useSpring\s*\(/],
  },
];
