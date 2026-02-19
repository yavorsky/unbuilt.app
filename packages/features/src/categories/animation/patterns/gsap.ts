export const gsap = [
  {
    name: 'coreBundle' as const,
    score: 1,
    scripts: [/\bgsap\b/, /greensock/, /GreenSock/],
    filenames: [/gsap/],
  },
  {
    name: 'apiUsage' as const,
    score: 0.8,
    scripts: [/gsap\.to\s*\(/, /gsap\.from\s*\(/, /gsap\.fromTo\s*\(/, /gsap\.timeline\s*\(/, /ScrollTrigger/, /gsap\.registerPlugin/],
  },
];
