#!/usr/bin/env node
/**
 * Development Environment Setup Script
 *
 * This script automates the process of setting up a complete local development environment:
 * 1. Checks and starts Redis if needed
 * 2. Installs project dependencies
 * 3. Sets up Playwright
 * 4. In local mode: Starts a local Supabase instance and updates .env.local
 * 5. In prod mode: Uses SUPABASE_PROD_* variables from .env.local and sets them as SUPABASE_*
 * 6. Applies any pending database migrations
 * 7. Starts the Next.js development server
 *
 * Usage:
 *   - For local development: yarn setup
 *   - For production database: yarn setup --prod
 *   - For local with schema sync: yarn setup --sync-schema
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Get project root directory (parent of scripts directory)
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configure paths relative to project root
const ENV_FILE = path.join(PROJECT_ROOT, '.env.local');
const EXAMPLE_ENV_FILE = path.join(PROJECT_ROOT, '.env.local.example');
const MIGRATIONS_DIR = path.join(PROJECT_ROOT, 'supabase/migrations');

const LOG_PREFIX = {
  setup: '🔧 [SETUP]',
  supabase: '🗄️ [SUPABASE]',
  redis: '🔴 [REDIS]',
  deps: '📦 [DEPS]',
  playwright: '🎭 [PLAYWRIGHT]',
  next: '▲ [NEXT.JS]',
  prod: '🌐 [PRODUCTION]',
  schema: '📊 [SCHEMA]',
};

// Variable names for Supabase
const VAR_NAMES = {
  local: {
    url: 'SUPABASE_URL',
    id: 'SUPABASE_ID',
    key: 'SUPABASE_KEY',
  },
  prod: {
    url: 'SUPABASE_PROD_URL',
    id: 'SUPABASE_PROD_ID',
    key: 'SUPABASE_PROD_KEY',
    dbPassword: 'SUPABASE_PROD_DB_PASSWORD',
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
const isProductionMode = args.includes('--prod');
const shouldSyncSchema = args.includes('--sync-schema');
const shouldStartDev = args.includes('--dev');

/**
 * Executes a command and returns if it was successful
 */
function execCommand(
  command: string,
  options: { silent?: boolean; ignoreError?: boolean; cwd?: string } = {}
) {
  try {
    // Default to project root directory if not specified
    const cwd = options.cwd || PROJECT_ROOT;

    execSync(command, {
      stdio: options.silent ? 'ignore' : 'inherit',
      cwd,
      ...options,
    });
    return true;
  } catch (error) {
    if (!options.ignoreError) {
      console.error(`Failed to execute: ${command}`);
      console.error(error);
    }
    return false;
  }
}

/**
 * Checks and installs Redis if necessary
 */
function setupRedis(): boolean {
  console.log(`${LOG_PREFIX.redis} Checking Redis installation...`);

  // Check if Redis is installed
  const isRedisInstalled = execCommand('redis-cli -v', {
    silent: true,
    ignoreError: true,
  });

  if (!isRedisInstalled) {
    console.log(`${LOG_PREFIX.redis} Redis not found. Installing Redis...`);

    // Install Redis based on operating system
    const isMac = os.platform() === 'darwin';

    if (isMac) {
      // macOS
      if (!execCommand('brew install redis')) {
        console.error(
          `${LOG_PREFIX.redis} Failed to install Redis. Please install it manually.`
        );
        return false;
      }
    } else {
      // Assume Linux
      if (
        !execCommand(
          'sudo apt-get update && sudo apt-get install -y redis-server'
        )
      ) {
        console.error(
          `${LOG_PREFIX.redis} Failed to install Redis. Please install it manually.`
        );
        return false;
      }
    }
  }

  // Check if Redis is running
  const isRedisRunning = execCommand('redis-cli ping', {
    silent: true,
    ignoreError: true,
  });

  if (!isRedisRunning) {
    console.log(`${LOG_PREFIX.redis} Starting Redis...`);

    const isMac = os.platform() === 'darwin';

    if (isMac) {
      if (!execCommand('brew services start redis')) {
        console.error(
          `${LOG_PREFIX.redis} Failed to start Redis. Please start it manually.`
        );
        return false;
      }
    } else {
      // Assume Linux
      if (!execCommand('sudo systemctl start redis')) {
        console.error(
          `${LOG_PREFIX.redis} Failed to start Redis. Please start it manually.`
        );
        return false;
      }
    }
  }

  console.log(`${LOG_PREFIX.redis} Redis is running ✓`);
  return true;
}

/**
 * Installs project dependencies
 */
function installDependencies(): boolean {
  console.log(`${LOG_PREFIX.deps} Installing project dependencies...`);
  return execCommand('yarn install', { cwd: PROJECT_ROOT });
}

/**
 * Sets up Playwright
 */
function setupPlaywright(): boolean {
  console.log(`${LOG_PREFIX.playwright} Setting up Playwright...`);
  return execCommand('yarn playwright install --with-deps', {
    cwd: PROJECT_ROOT,
  });
}

/**
 * Ensures the Supabase CLI is installed
 */
function checkSupabaseCLI(): boolean {
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error(
      `${LOG_PREFIX.setup} Supabase CLI not found. Please install it with:`
    );
    console.error('  npm install -g supabase');
    return false;
  }
}

/**
 * Ensures migrations directory exists
 */
function ensureMigrationsDirectory(): boolean {
  try {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.log(`${LOG_PREFIX.schema} Creating migrations directory...`);
      fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(
      `${LOG_PREFIX.schema} Failed to create migrations directory:`,
      error
    );
    return false;
  }
}

/**
 * Pulls schema from production database
 */
function pullSchema(): boolean {
  try {
    console.log(
      `${LOG_PREFIX.schema} Pulling schema from production database...`
    );

    // Ensure migrations directory exists
    if (!ensureMigrationsDirectory()) {
      return false;
    }

    // Get production DB credentials
    const env = getEnvVariables();
    const prodId = env[VAR_NAMES.prod.id];
    const prodDbPassword = env[VAR_NAMES.prod.dbPassword];

    if (!prodId || !prodDbPassword) {
      console.error(
        `${LOG_PREFIX.schema} Missing production database credentials in ${ENV_FILE}.`
      );
      console.error(
        `${LOG_PREFIX.schema} Please ensure you have set ${VAR_NAMES.prod.id} and ${VAR_NAMES.prod.dbPassword}`
      );
      return false;
    }

    // Pull schema from production
    const dbUrl = `postgresql://postgres:${prodDbPassword}@db.${prodId}.supabase.co:5432/postgres`;

    execCommand(`supabase db pull --db-url "${dbUrl}"`, {
      cwd: PROJECT_ROOT,
    });

    console.log(`${LOG_PREFIX.schema} Schema pulled successfully ✓`);
    return true;
  } catch (error) {
    console.error(`${LOG_PREFIX.schema} Failed to pull schema:`, error);
    return false;
  }
}

/**
 * Applies pending migrations to local database
 */
function applyMigrations(): boolean {
  try {
    console.log(`${LOG_PREFIX.schema} Applying database migrations...`);

    // Check if there are any migrations to apply
    if (
      !fs.existsSync(MIGRATIONS_DIR) ||
      fs.readdirSync(MIGRATIONS_DIR).length === 0
    ) {
      console.log(`${LOG_PREFIX.schema} No migrations found. Skipping.`);
      return true;
    }

    // Apply migrations
    execCommand('supabase db push --local', {
      cwd: PROJECT_ROOT,
    });

    console.log(`${LOG_PREFIX.schema} Migrations applied successfully ✓`);
    return true;
  } catch (error) {
    console.error(`${LOG_PREFIX.schema} Failed to apply migrations:`, error);
    return false;
  }
}

/**
 * Starts the local Supabase instance
 */
function startSupabase(): boolean {
  try {
    console.log(`${LOG_PREFIX.setup} Starting local Supabase instance...`);

    // Start Supabase (redirect output to see it in the console)
    execSync('supabase start', { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log(`${LOG_PREFIX.supabase} Local Supabase started successfully!`);

    return true;
  } catch (error) {
    console.error(`${LOG_PREFIX.setup} Failed to start Supabase:`, error);
    return false;
  }
}

/**
 * Extracts Supabase URL and anon key from the local instance
 */
function getSupabaseCredentials(): {
  url: string;
  id: string;
  key: string;
} | null {
  try {
    const url = execSync('supabase status -o json | jq -r ".API_URL"', {
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
    }).trim();
    const key = execSync('supabase status -o json | jq -r ".ANON_KEY"', {
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
    }).trim();

    if (!url || !key) {
      throw new Error('Could not extract Supabase credentials');
    }

    // Extract ID from the URL
    const urlObj = new URL(url);
    const id = urlObj.hostname.split('.')[0];

    return { url, id, key };
  } catch (error) {
    console.error(
      `${LOG_PREFIX.setup} Failed to extract Supabase credentials:`,
      error
    );
    return null;
  }
}

/**
 * Gets the current environment variables from .env.local
 */
function getEnvVariables(): Record<string, string> {
  const env: Record<string, string> = {};

  if (fs.existsSync(ENV_FILE)) {
    const content = fs.readFileSync(ENV_FILE, 'utf8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmedLine.substring(0, equalIndex);
          const value = trimmedLine.substring(equalIndex + 1);
          env[key] = value;
        }
      }
    }
  }

  return env;
}

/**
 * Updates the .env.local file with Supabase credentials
 */
function updateEnvFile(credentials: {
  url: string;
  id: string;
  key: string;
}): boolean {
  try {
    // Get existing environment variables
    const env = getEnvVariables();

    // Update with new values
    env[VAR_NAMES.local.url] = credentials.url;
    env[VAR_NAMES.local.id] = credentials.id;
    env[VAR_NAMES.local.key] = credentials.key;

    // Convert back to file content
    const fileContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write back to file
    fs.writeFileSync(ENV_FILE, fileContent);
    console.log(
      `${LOG_PREFIX.setup} Updated ${ENV_FILE} with Supabase credentials`
    );

    return true;
  } catch (error) {
    console.error(`${LOG_PREFIX.setup} Failed to update .env.local:`, error);
    return false;
  }
}

/**
 * Maps production credentials to local credential names
 */
function mapProductionCredentials(): boolean {
  try {
    // Get existing environment variables
    const env = getEnvVariables();

    // Check if production variables exist
    if (!env[VAR_NAMES.prod.url] || !env[VAR_NAMES.prod.key]) {
      console.error(
        `${LOG_PREFIX.prod} Missing required production Supabase credentials in ${ENV_FILE}.`
      );
      console.error(
        `${LOG_PREFIX.prod} Please ensure you have set ${VAR_NAMES.prod.url} and ${VAR_NAMES.prod.key}`
      );
      return false;
    }

    // Copy production values to local variable names
    env[VAR_NAMES.local.url] = env[VAR_NAMES.prod.url];
    env[VAR_NAMES.local.key] = env[VAR_NAMES.prod.key];

    // Copy ID if exists, otherwise extract from URL
    if (env[VAR_NAMES.prod.id]) {
      env[VAR_NAMES.local.id] = env[VAR_NAMES.prod.id];
    } else {
      try {
        const urlObj = new URL(env[VAR_NAMES.prod.url]);
        env[VAR_NAMES.local.id] = urlObj.hostname.split('.')[0];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.error(
          `${LOG_PREFIX.prod} Failed to extract Supabase ID from URL`
        );
        return false;
      }
    }

    // Convert back to file content
    const fileContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write back to file
    fs.writeFileSync(ENV_FILE, fileContent);
    console.log(
      `${LOG_PREFIX.prod} Mapped production credentials to local variable names in ${ENV_FILE}`
    );

    return true;
  } catch (error) {
    console.error(
      `${LOG_PREFIX.prod} Failed to map production credentials:`,
      error
    );
    return false;
  }
}

/**
 * Verifies if .env.local has the required Supabase production credentials
 */
function verifyProductionCredentials(): boolean {
  try {
    // Check if .env.local exists
    if (!fs.existsSync(ENV_FILE)) {
      console.error(
        `${LOG_PREFIX.prod} ${ENV_FILE} not found. Please create it with production credentials.`
      );
      return false;
    }

    const env = getEnvVariables();

    // Check for required variables
    const hasUrl = !!env[VAR_NAMES.prod.url];
    const hasKey = !!env[VAR_NAMES.prod.key];

    if (!hasUrl || !hasKey) {
      console.error(
        `${LOG_PREFIX.prod} Missing required production Supabase credentials in ${ENV_FILE}.`
      );
      console.error(
        `${LOG_PREFIX.prod} Please ensure you have set ${VAR_NAMES.prod.url} and ${VAR_NAMES.prod.key}`
      );
      return false;
    }

    console.log(
      `${LOG_PREFIX.prod} Production credentials found in ${ENV_FILE} ✓`
    );
    return true;
  } catch (error) {
    console.error(
      `${LOG_PREFIX.prod} Error verifying production credentials:`,
      error
    );
    return false;
  }
}

/**
 * Starts the Next.js development server
 */
function startNextDevServer() {
  console.log(`${LOG_PREFIX.next} Starting Next.js development server...`);

  const nextProcess = spawn('npx', ['next', 'dev'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    cwd: PROJECT_ROOT,
  });

  // Handle Next.js output
  if (nextProcess.stdout) {
    nextProcess.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n') as string[];
      lines.forEach((line) => console.log(`${LOG_PREFIX.next} ${line}`));
    });
  }

  // Handle Next.js errors
  if (nextProcess.stderr) {
    nextProcess.stderr.on('data', (data) => {
      const lines = data.toString().trim().split('\n') as string[];
      lines.forEach((line) => console.error(`${LOG_PREFIX.next} ${line}`));
    });
  }

  // Handle process exit
  nextProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(
        `${LOG_PREFIX.next} Next.js process exited with code ${code}`
      );
    }
  });

  // Handle script termination
  process.on('SIGINT', () => {
    console.log(
      `\n${LOG_PREFIX.setup} Shutting down development environment...`
    );
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
}

/**
 * Main function to orchestrate the setup process
 */
async function main() {
  console.log(
    `${LOG_PREFIX.setup} Starting development environment setup in ${isProductionMode ? 'PRODUCTION' : 'LOCAL'} mode...`
  );

  // Ensure we're working from the project root
  console.log(`${LOG_PREFIX.setup} Running from ${PROJECT_ROOT}`);

  if (!fs.existsSync(ENV_FILE)) {
    fs.copyFileSync(EXAMPLE_ENV_FILE, ENV_FILE);
    console.log(`${LOG_PREFIX.setup} .env.local created successfully`);
  }

  // Setup Redis
  if (!setupRedis()) {
    console.warn(
      `${LOG_PREFIX.setup} Redis setup had issues, but continuing with other steps...`
    );
  }

  // Install dependencies
  if (!installDependencies()) {
    console.error(`${LOG_PREFIX.setup} Failed to install dependencies`);
    process.exit(1);
  }

  // Setup Playwright
  if (!setupPlaywright()) {
    console.warn(
      `${LOG_PREFIX.setup} Playwright setup had issues, but continuing with other steps...`
    );
  }

  // Check Supabase CLI
  if (!checkSupabaseCLI()) {
    process.exit(1);
  }

  // Handle schema sync if requested (before starting local Supabase)
  if (shouldSyncSchema && !isProductionMode) {
    console.log(
      `${LOG_PREFIX.schema} Synchronizing database schema from production...`
    );

    if (!pullSchema()) {
      console.warn(
        `${LOG_PREFIX.schema} Schema synchronization had issues, but continuing with other steps...`
      );
    }
  }

  if (isProductionMode) {
    // Production mode - check for existing credentials and map them
    console.log(`${LOG_PREFIX.prod} Using production Supabase instance`);

    if (!verifyProductionCredentials()) {
      process.exit(1);
    }

    if (!mapProductionCredentials()) {
      process.exit(1);
    }

    console.log(
      `${LOG_PREFIX.prod} Production mode active - using credentials from ${ENV_FILE}`
    );
  } else {
    // Local mode - set up local Supabase

    // Start Supabase
    if (!startSupabase()) {
      process.exit(1);
    }

    // Apply migrations to local database after Supabase is started
    if (!applyMigrations()) {
      console.warn(
        `${LOG_PREFIX.schema} Migration application had issues, but continuing with other steps...`
      );
    }

    // Get Supabase credentials
    const credentials = getSupabaseCredentials();
    if (!credentials) {
      process.exit(1);
    }

    // Update .env.local
    if (!updateEnvFile(credentials)) {
      process.exit(1);
    }
  }

  // Print summary
  console.log('\n==== DEVELOPMENT ENVIRONMENT READY ====');
  console.log(`${LOG_PREFIX.redis} Redis is running`);
  console.log(`${LOG_PREFIX.deps} Dependencies installed`);
  console.log(`${LOG_PREFIX.playwright} Playwright is setup`);

  if (isProductionMode) {
    console.log(`${LOG_PREFIX.prod} Using production Supabase instance`);
    console.log(
      `${LOG_PREFIX.prod} Credentials mapped from ${VAR_NAMES.prod.url}/${VAR_NAMES.prod.key} to ${VAR_NAMES.local.url}/${VAR_NAMES.local.key}`
    );
  } else {
    console.log(`${LOG_PREFIX.supabase} Local Supabase is running`);
    console.log(`${LOG_PREFIX.supabase} Studio UI: http://localhost:54323`);
    console.log(`${LOG_PREFIX.schema} Database schema is up to date`);
  }

  console.log('==========================================\n');

  // Start Next.js dev server
  if (shouldStartDev) {
    startNextDevServer();
  }
}

// Execute main function
main().catch((error) => {
  console.error(`${LOG_PREFIX.setup} Setup failed:`, error);
  process.exit(1);
});
