import * as zstd from 'zstd-codec';

// Initialize zstd decoder
let zstdDecoder: zstd.ZstdStreamingCodec | null = null;
// Async initialization for zstd codec
export const initZstd = async () => {
  if (!zstdDecoder) {
    return new Promise<zstd.ZstdStreamingCodec>((resolve) => {
      const ZstdCodec = zstd.ZstdCodec;
      ZstdCodec.run((instance) => {
        zstdDecoder = new instance.Streaming();
        resolve(zstdDecoder);
      });
    });
  }
  return zstdDecoder;
};
