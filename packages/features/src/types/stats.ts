export type Stats = {
  resourceCount: number;
  totalSize: number;
  scriptMetrics: {
    async: number;
    defer: number;
    modules: number;
  };
  imageMetrics: {
    lazyLoaded: number;
    total: number;
  };
};
