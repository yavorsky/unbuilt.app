import { BrowserContext, type Browser, type Page } from 'playwright';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { BrowserManager } from '@unbuilt/helpers';
import path from 'path';
import fs from 'fs/promises';
import * as getPortModule from 'get-port';
import sirv from 'sirv';
import { createServer } from 'http';
import type { TestProjectConfig } from './types.js';
import { analyze, AnalyzeResult } from '@unbuilt/analyzer';
import { afterAll } from 'vitest';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface ServerInstance {
  close: () => Promise<void>;
  port: number;
}

let browser: Browser | null = null;
let context: BrowserContext | null = null;

async function getBrowserContext() {
  if (!context) {
    const browserManager = new BrowserManager();
    await browserManager.initialize(1);
    context = await browserManager.getBrowserContext();
    browser = context.browser();
  }
  return context;
}

async function createDevServer(
  projectDir: string,
  port: number
): Promise<ServerInstance> {
  const sirvMiddleware = sirv(projectDir, {
    dev: true,
    etag: true,
    single: true,
    onNoMatch: (req) => {
      console.log('Not found:', req.url);
    },
  });
  const server = createServer((req, res) => sirvMiddleware(req, res));

  try {
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => {
        server.off('listening', onListening);
        reject(error);
      };

      const onListening = () => {
        server.off('error', onError);
        console.log(`Test server running at http://localhost:${port}`);
        resolve();
      };

      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port);
    });

    return {
      close: () =>
        new Promise<void>((resolve) => server.close(() => resolve())),
      port,
    };
  } catch (error) {
    await new Promise((resolve) => server.close(resolve));
    throw error;
  }
}

export async function initDetectionTest(
  config: TestProjectConfig,
  testName: string = 'unknown-test'
): Promise<AnalyzeResult['analysis'] | null> {
  const id = uuidv4();
  const testDir = path.join(os.tmpdir(), 'unbuilt-test', id);
  let server: ServerInstance | null = null;
  let page: Page | null = null;

  try {
    // Create and build test project
    console.log(`Creating test project in ${testDir}`);
    await fs.mkdir(testDir, { recursive: true });

    console.log(`Moving files to ${testDir}`);
    // Write test files
    for (const [filePath, content] of Object.entries(config.files)) {
      const fullPath = path.join(testDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }

    console.log(`Moving package.json to ${testDir}`);
    // Initialize package.json
    await fs.writeFile(
      path.join(testDir, 'package.json'),
      JSON.stringify(
        {
          name: testName,
          version: '1.0.0',
          dependencies: config.dependencies,
          scripts: {
            build: config.buildCommand,
          },
        },
        null,
        2
      )
    );

    // Install and build
    console.log('Running npm install and npm run build');
    await execPromise('npm install', { cwd: testDir });
    console.log('Running npm run build');

    await execPromise('npm run build', {
      cwd: testDir,
      env: { ...process.env, ...config.env },
    });

    // Start server
    console.log('Before picking port...', path.join(testDir, config.outDir));
    const port = await getPortModule.default({
      port: getPortModule.portNumbers(4000, 5000),
    });
    console.log(
      `Serving files for ${path.join(testDir, config.outDir)}...`,
      path.join(testDir, config.outDir),
      port
    );
    server = await createDevServer(path.join(testDir, config.outDir), port);

    console.log('After starting server...');

    // Setup browser and page
    const context = await getBrowserContext();
    const browser = await context.browser();
    page = (await context?.newPage()) ?? null;

    if (!page || !browser) {
      throw new Error('Page is not defined');
    }

    // Run analysis
    const testId = uuidv4();

    const result = await analyze(
      `http://localhost:${server.port}`,
      testId,
      page,
      browser,
      () => {}
    );

    return result?.analysis || null;
  } catch (error) {
    // Cleanup on error
    if (page) await page?.close();
    if (server) await server.close();
    await fs.rm(testDir, { recursive: true, force: true });

    throw error;
  } finally {
    await page?.close();
    await server?.close();
    await fs.rm(testDir, { recursive: true, force: true });
  }
}

// Cleanup browser on test suite completion
afterAll(async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
});
