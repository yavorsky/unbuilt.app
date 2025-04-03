import * as esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Check if --watch flag is passed
const isWatchMode = process.argv.includes('--watch');

async function createBuildOptions(): Promise<esbuild.BuildOptions> {
  const buildDir = join(rootDir, 'build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  return {
    entryPoints: [join(rootDir, 'src/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: join(buildDir, 'index.js'),
    format: 'cjs',
    banner: {
      js: '#!/usr/bin/env node',
    },
    // Configure loaders to handle different file types
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.svg': 'dataurl',
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.gif': 'dataurl',
    } as const,
    // Set JSX options
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    define: {
      // This ensures process.env.UNBUILT_API_KEY stays as a runtime lookup
      // and isn't replaced with any value during build time
      'process.env.UNBUILT_API_KEY': 'process.env.UNBUILT_API_KEY',
      'process.env.API_BASE_URL': 'process.env.API_BASE_URL',
    },
    // Exclude Node.js built-ins and Playwright-related packages
    external: [
      // Native Node.js modules - keep all built-ins external
      'node:*',
      'fs',
      'path',
      'os',
      'child_process',
      'util',
      'stream',
      'events',
      'url',
      'assert',
      'crypto',
      'http',
      'https',
      'net',
      'tls',
      'zlib',
      'dns',
      'buffer',
      'string_decoder',
      'querystring',
      'timers',
      'console',

      // Playwright and its dependencies
      'playwright',
      'playwright-core',
      'playwright-core/*',
      'chromium-bidi',
      'chromium-bidi/*',
      'playwright-core/browsers',

      // React-related packages (allow importing but don't bundle)
      'react',
      'react-dom',

      // Other platform-specific binaries
      'fsevents',
    ],
    // Make source maps available for debugging
    sourcemap: true,
    // Don't minify to make debugging easier
    minify: false,
    // Log all warnings and errors
    logLevel: 'info',
  };
}

async function build() {
  try {
    const buildOptions = await createBuildOptions();

    if (isWatchMode) {
      // Start watch mode
      console.log('Starting watch mode...');

      const context = await esbuild.context(buildOptions);
      await context.watch();

      console.log('Watching for changes... (Press Ctrl+C to stop)');

      // Make the output file executable after initial build
      fs.chmodSync(join(rootDir, 'build', 'index.js'), '755');

      // Handle process termination
      const handleTermination = async () => {
        console.log('\nStopping watch mode...');
        await context.dispose();
        process.exit(0);
      };

      process.on('SIGINT', handleTermination);
      process.on('SIGTERM', handleTermination);
    } else {
      // Single build
      await esbuild.build(buildOptions);
      console.log('Build complete!');

      // Make the output file executable
      fs.chmodSync(join(rootDir, 'build', 'index.js'), '755');
      console.log('Made output file executable');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
