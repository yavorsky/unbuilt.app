export interface TestProjectConfig {
  dependencies: Record<string, string>;
  files: Record<string, string>;
  buildCommand?: string;
  startCommand?: string;
  env?: Record<string, string>;
  outDir: string;
}
