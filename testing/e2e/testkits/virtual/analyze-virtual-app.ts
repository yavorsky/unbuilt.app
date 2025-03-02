import path from 'node:path';
import { promisify } from 'node:util';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import fs from 'fs/promises';
import type { VirtualAppConfig } from './types.js';
import { AnalyzeResult } from '@unbuilt/analyzer';
import { afterAll } from 'vitest';
import { AppServerInstance, createAppServer } from './create-app-server.js';
import { closeBrowser } from '../helpers/browser-context.js';
import { analyzeApp } from '../helpers/analyze.js';
import { getPort } from './get-port.js';
import { executeStartCommand } from './execute-start-command.js';

const execPromise = promisify(exec);

type Options = { preserveFiles?: boolean };
export async function analyzeVirtualApp(
  config: VirtualAppConfig,
  { preserveFiles = false }: Options = {}
): Promise<AnalyzeResult['analysis']> {
  const id = uuidv4();
  const testDir = path.join(os.tmpdir(), 'unbuilt-test', id);
  let server: AppServerInstance | null = null;

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
    const port = config.port ?? (await getPort());

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
      server = await executeStartCommand({
        startCommand: config.startCommand,
        dir: testDir,
        env: config.env,
        port,
      });
    } else {
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
