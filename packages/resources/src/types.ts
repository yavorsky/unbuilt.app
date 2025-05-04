export interface ResourceAnalysis {
  js: {
    count: number;
    size: number;
    external: number;
    inline: number;
  };
  css: {
    count: number;
    size: number;
    external: number;
    inline: number;
  };
  images: {
    count: number;
    size: number;
    optimized: number;
  };
  fonts: {
    count: number;
    size: number;
    preloaded: number;
  };
}

export type ResourceType =
  | 'document'
  | 'stylesheet'
  | 'image'
  | 'media'
  | 'font'
  | 'script'
  | 'texttrack'
  | 'xhr'
  | 'fetch'
  | 'eventsource'
  | 'websocket'
  | 'manifest'
  | 'other';

export type Resource = {
  type: ResourceType;
  size: number;
  url: string;
  timing: number;
  status?: number;
  headers?: HeadersMap;
};

export type ResourcesMap = Map<string, Resource>;
export type ScriptsMap = Map<string, string>;
export type HeadersMap = Record<string, string>;
