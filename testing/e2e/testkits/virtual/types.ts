export interface VirtualAppConfig {
  dependencies: Record<string, string>;
  files: Record<string, string>;
  buildCommand?: string;
  startCommand?: string;
  env?: Record<string, string>;
  port?: number;
  outDir: string;
}
