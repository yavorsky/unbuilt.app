import React from 'react';

export interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  gradient?: { start: string; end: string };
  className?: string;
}

export interface Meta<T extends string[] | undefined = string[] | undefined> {
  name: string;
  website: string;
  description: string;
  tags?: T;
  // Consider moving to react-agnostic approach if we'll have issues in node environment.
  Icon: React.FC<LogoProps> | null;
}
