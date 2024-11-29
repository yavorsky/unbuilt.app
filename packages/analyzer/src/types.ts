export type Pattern = {
  runtime?: RegExp[];
  filenames?: RegExp[];
  browser?: () => boolean | Promise<boolean>;
  score: number;
  name: string;
};
