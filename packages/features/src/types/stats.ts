export type Stats = {
  resourceCount: number;
  totalSize: number;
  scriptMetrics: {
    async: number;
    defer: number;
    modules: number;
    // NEW
    inline: number;
    crossOrigin: number;
    preload: number;
    totalSize: number;
  };
  // NEW
  styleMetrics: {
    inline: number;
    total: number;
    preload: number;
    modules: number;
    totalSize: number;
  };
  imageMetrics: {
    lazyLoaded: number;
    total: number;
    // NEW
    totalSize: number;
  };
  domMetrics: {
    totalNodes: number;
    maxDepth: number;
    totalSize: number;
  };
};
