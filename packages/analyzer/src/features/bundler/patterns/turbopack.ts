import { webpack } from './webpack.js';

// Turbopack is based on webpack, so we can reuse the webpack patterns and add turbopack specific ones
const webpackCompilation = webpack.find((item) => item.name === 'compilation');

export const turbopack = [
  {
    name: 'compilation' as const,
    score: 0.2,
    runtime: [
      ...(webpackCompilation?.runtime ?? []),
      // Turbopack specific
      /turbopack/,
      /__turbopack_require__/,
      /__turbopack_export__/,
      /__turbopack_load__/,
      /__turbopack_chunk__/,
      /turbo_modules/,
      /__turbopack__/,

      // Turbopack comments and markers
      /\/\*\s*Turbopack\s*\*\//,
      /Turbopack\sChunk/,
      /TURBOPACK\s/,

      // Next.js + Turbopack specific
      /next-turbopack/,
      /__next_turbopack__/,
      /app-turbopack/,
      /pages-turbopack/,

      // Rust-generated patterns (Turbopack specific)
      /__turbopack_external_require__/,
      /__turbopack_resolve_module__/,
      /__turbopack_refresh__/,
      /__turbopack_import__/,

      // Error handling
      /__turbopack_error__/,
      /__turbopack_handle_error__/,

      // Development features
      /TURBOPACK_DEBUG/,
      /TURBOPACK_DEVELOPMENT/,
      /__turbopack_debug__/,

      // Asset handling
      /__turbopack_asset__/,
      /__turbopack_asset_url__/,
      /__turbopack_public_path__/,
    ],
  },
  {
    name: 'chunks' as const,
    score: 0.2,
    runtime: [
      /* previous patterns */
    ],
    filenames: [
      // Static chunks
      /static\/chunks\/\w+\.[a-f0-9]{16}\.js$/,
      /static\/chunks\/\[\w+\]\.js$/,

      // Client-side entries
      /static\/\w+\/pages\/\[\w+\]\.js$/,
      /static\/\w+\/app\/\[\w+\]\.js$/,

      // Development builds (loaded in browser)
      /_next\/static\/chunks\/\w+\.js$/,
      /_next\/static\/development\/\w+\.js$/,

      // HMR related
      /static\/hmr\/\w+\.js$/,
    ],
  },
];
