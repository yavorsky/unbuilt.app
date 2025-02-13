// testing/e2e/utils/project.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import type { TestProjectConfig } from './types.js';

const execAsync = promisify(exec);

export async function generateUniqueTestDir(testName: string): Promise<string> {
  const timestamp = Date.now();
  const uniqueDir = path.join(
    process.cwd(),
    'tmp-test',
    `${timestamp}-${testName}`
  );
  await fs.mkdir(uniqueDir, { recursive: true });
  return uniqueDir;
}

export async function createProject(
  config: TestProjectConfig,
  testDir: string
) {
  // Initialize package.json
  await fs.writeFile(
    path.join(testDir, 'package.json'),
    JSON.stringify(
      {
        name: path.basename(testDir),
        version: '1.0.0',
        type: 'module',
        dependencies: config.dependencies,
        scripts: {
          build: config.buildCommand,
        },
      },
      null,
      2
    )
  );

  // Write test files
  for (const [filePath, content] of Object.entries(config.files)) {
    const fullPath = path.join(testDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content as string);
  }

  return testDir;
}

export async function buildProject(
  projectDir: string,
  env?: Record<string, string>
) {
  // Install dependencies
  await execAsync('npm install', {
    cwd: projectDir,
    env: { ...process.env, ...env },
  });

  // Build the project
  await execAsync('npm run build', {
    cwd: projectDir,
    env: { ...process.env, ...env },
  });
}
