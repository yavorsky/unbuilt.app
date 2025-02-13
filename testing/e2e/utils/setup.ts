import { ChildProcess, exec } from 'child_process';
import path from 'path';
import * as getPortModule from 'get-port';
import dotenv from 'dotenv';
import fs from 'fs';

let analyzerProcess: ChildProcess | null = null;
let analyzerPort: number;

function loadEnvFiles(appPath: string) {
  // Load .env files in order of priority
  const envFiles = [
    path.join(appPath, '.env.local'),
    path.join(appPath, '.env'),
  ];

  const env: Record<string, string> = {};

  envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`Loading environment from ${file}`);
      const envConfig = dotenv.parse(fs.readFileSync(file));
      Object.assign(env, envConfig);
    }
  });

  return env;
}

export async function setupAnalyzer() {
  const appPath = path.join(process.cwd(), '../../', 'apps/web');
  console.log('Starting analyzer setup...');
  console.log('App path:', appPath);

  // Find available port for the analyzer
  analyzerPort = await getPortModule.default({
    port: getPortModule.portNumbers(5100, 5200),
  });
  console.log('Selected port:', analyzerPort);

  // Load environment variables
  const env = loadEnvFiles(appPath);
  console.log('Loaded environment variables from files');

  // Start the analyzer app and capture its output
  return new Promise((resolve, reject) => {
    console.log('Starting analyzer process...');
    analyzerProcess = exec(`PORT=${analyzerPort} npm run dev`, {
      cwd: appPath,
      env: {
        ...process.env, // Include current environment
        ...env, // Add variables from .env files
        PORT: String(analyzerPort),
        NODE_ENV: 'development',
      },
    });

    let output = '';
    const timeout = setTimeout(() => {
      console.error('Analyzer startup timed out. Server output:\n' + output);
      reject(
        new Error('Analyzer startup timed out. Server output:\n' + output)
      );
    }, 60000); // 60 second timeout

    if (!analyzerProcess.stdout || !analyzerProcess.stderr) {
      clearTimeout(timeout);
      reject(new Error('Failed to get process streams'));
      return;
    }

    // Improved logging
    analyzerProcess.stdout.on('data', (data: string) => {
      process.stdout.write(`[Analyzer] ${data}`);
      output += data;

      // Look for Next.js ready message
      if (data.includes('ready started server') || data.includes('Ready in')) {
        clearTimeout(timeout);
        console.log(`\n[Setup] Analyzer is running on port ${analyzerPort}`);
        resolve(analyzerPort);
      }
    });

    analyzerProcess.stderr.on('data', (data: string) => {
      process.stderr.write(`[Analyzer Error] ${data}`);
      output += data;
      // Also check stderr for ready message in case Next.js changes output stream
      if (data.includes('ready started server') || data.includes('Ready in')) {
        clearTimeout(timeout);
        console.log(`\n[Setup] Analyzer is running on port ${analyzerPort}`);
        resolve(analyzerPort);
      }
    });

    analyzerProcess.on('error', (error: Error) => {
      console.error('[Setup] Process error:', error);
      clearTimeout(timeout);
      reject(
        new Error(
          `Failed to start analyzer: ${error.message}\nOutput:\n${output}`
        )
      );
    });

    analyzerProcess.on('exit', (code: number) => {
      if (code !== 0 && code !== null) {
        console.error(`[Setup] Process exited with code ${code}`);
        clearTimeout(timeout);
        reject(
          new Error(`Analyzer exited with code ${code}\nOutput:\n${output}`)
        );
      }
    });
  });
}

export async function teardownAnalyzer() {
  if (analyzerProcess) {
    console.log('\n[Teardown] Shutting down analyzer...');
    analyzerProcess.kill();
    analyzerProcess = null;
    console.log('[Teardown] Analyzer shut down successfully');
  }
}

// Process handlers remain the same but with improved logging
process.on('SIGINT', () => {
  console.log('\n[Process] Received SIGINT');
  teardownAnalyzer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Process] Received SIGTERM');
  teardownAnalyzer();
  process.exit(0);
});

process.on('SIGQUIT', () => {
  console.log('\n[Process] Received SIGQUIT');
  teardownAnalyzer();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    '[Process] Unhandled Rejection at:',
    promise,
    'reason:',
    reason
  );
  teardownAnalyzer();
  process.exit(1);
});

export function getAnalyzerUrl() {
  if (!analyzerPort) {
    throw new Error('Analyzer not initialized');
  }
  return `http://localhost:${analyzerPort}`;
}
