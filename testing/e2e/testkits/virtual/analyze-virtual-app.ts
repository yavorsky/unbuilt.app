import path from 'node:path';
import { promisify } from 'node:util';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { ChildProcess, exec } from 'child_process';
import fs from 'fs/promises';
import * as getPortModule from 'get-port';
import type { VirtualAppConfig } from './types.js';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { afterAll } from 'vitest';
import { AppServerInstance, createAppServer } from './create-app-server.js';
import { closeBrowser } from '../helpers/browser-context.js';
import { analyzeApp } from '../helpers/analyze.js';

const execPromise = promisify(exec);

type Options = { preserveFiles?: boolean };
export async function analyzeVirtualApp(
  config: VirtualAppConfig,
  { preserveFiles = false }: Options = {}
): Promise<AnalyzeResult['analysis']> {
  const id = uuidv4();
  const testDir = path.join(os.tmpdir(), 'unbuilt-test', id);
  let server: AppServerInstance | null = null;
  let startProcess: ChildProcess | null = null;

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

    // Initialize package.json
    await fs.writeFile(
      path.join(testDir, 'package.json'),
      JSON.stringify(
        {
          name: 'test-project',
          version: '1.0.0',
          dependencies: config.dependencies,
          packageManager: 'npm@10.2.4',
          scripts: {
            build: config.buildCommand,
            start: config.startCommand,
          },
          ...(config.packageJson ?? {}),
        },
        null,
        2
      )
    );

    // Install and build
    console.log('Running `npm install`...');
    await execPromise('npm install', { cwd: testDir });
    console.log('Running `npm run build`...');
    const port =
      config.port ??
      (await getPortModule.default({
        port: getPortModule.portNumbers(4000, 5000),
      }));

    let stdout = '';
    let stderr = '';
    if (config.buildCommand) {
      const result = await execPromise('npm run build', {
        cwd: testDir,
        env: {
          ...process.env,
          ...config.env,
          PORT: port.toString(),
          NODE_ENV: 'production',
        },
      });
      stdout += result.stdout;
      stderr += result.stderr;
    }
    if (stdout.trim() !== '') {
      console.log('Build stdout:', stdout);
    }
    if (stderr.trim() !== '') {
      console.log('Build stderr:', stderr);
    }

    if (config.startCommand) {
      // Wait for server to be ready
      console.log(`Running start command: ${config.startCommand}`);
      // Wait for server to be ready
      startProcess = await exec('npm run start', {
        cwd: testDir,
        env: {
          ...process.env,
          ...config.env,
          PORT: port.toString(),
          NODE_ENV: 'production',
        },
      });

      // Log output from the start command
      startProcess?.stdout?.on('data', (data: string) =>
        console.log('Start command output:', data)
      );
      startProcess?.stderr?.on('data', (data: string) =>
        console.error('Start command error:', data)
      );

      server = {
        port,
        close: async () => {
          return new Promise<void>((resolve) => {
            if (startProcess) {
              startProcess.kill('SIGTERM');
              setTimeout(resolve, 1000); // Give process time to shut down
            } else {
              resolve();
            }
          });
        },
      };
    } else {
      // Start server
      console.log(
        `Serving files for ${path.join(testDir, config.outDir)}`,
        port
      );
      server = await createAppServer(path.join(testDir, config.outDir), port);
    }

    const result = await analyzeApp(`http://localhost:${server.port}`);
    return result;
  } catch (error) {
    // Cleanup on error
    if (server) await server.close();
    if (!preserveFiles) {
      await fs.rm(testDir, { recursive: true, force: true });
    }

    throw error;
  } finally {
    await server?.close();
    if (!preserveFiles) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  }
}

// Cleanup browser on test suite completion
afterAll(async () => {
  await closeBrowser();
});
