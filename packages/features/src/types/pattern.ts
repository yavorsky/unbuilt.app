import { Browser, Page } from 'playwright';
import { AnalysisFeatures } from './analysis.js';

export interface Pattern<Name extends string = string> {
  score: number;
  name: Name;
  scripts?: RegExp[];
  stylesheets?: RegExp[];
  documents?: RegExp[];
  headers?: Record<string, RegExp>;
  filenames?: RegExp[];
  browser?: (page: Page, browser: Browser) => boolean | Promise<boolean>;
  dependencies?: (analysis: AnalysisFeatures) => boolean;
}

type InferPatternNames<T> = T extends Pattern<infer Name>[] ? Name : never;

export type AllPatternNames<T> = {
  [K in keyof T]: InferPatternNames<T[K]>;
}[keyof T];
