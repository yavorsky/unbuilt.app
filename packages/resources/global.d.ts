declare module 'zstd-codec' {
  export interface ZstdCodec {
    run(callback: (instance: ZstdInstance) => void): void;
  }

  export interface ZstdInstance {
    Streaming: new () => ZstdStreamingCodec;
    Simple: new () => ZstdSimpleCodec;
  }

  export interface ZstdStreamingCodec {
    compress(input: Uint8Array, compressionLevel?: number): Uint8Array;
    decompress(input: Uint8Array): Uint8Array;
  }

  export interface ZstdSimpleCodec {
    compress(input: Uint8Array, compressionLevel?: number): Uint8Array;
    decompress(input: Uint8Array): Uint8Array;
  }

  export const ZstdCodec: ZstdCodec;
}
