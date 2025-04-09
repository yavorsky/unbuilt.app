import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { chromium } from 'playwright';
import { getChromeUserDataDir } from './get-user-dir.js';
import { contextOptions } from './context-options.js';

const launchOptions = {
  channel: process.env.UNBUILT_BROWSER_CHANNEL || 'chrome',
  headless: false,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
};

const cleanup = async (tempUserDataDir: string) => {
  try {
    await fs.rm(tempUserDataDir, { recursive: true, force: true });
  } catch (cleanupError) {
    console.error('Error cleaning up temporary profile:', cleanupError);
  }
};

export async function runWithProfileCopy() {
  // Create a temporary copy of the profile
  const userDataDir = getChromeUserDataDir();
  const tempUserDataDir = path.join(
    os.tmpdir(),
    `chrome_profile_copy_${Date.now()}`
  );

  try {
    // Copy the profile
    await fs.cp(userDataDir, tempUserDataDir, { recursive: true });

    // Remove the lock file from the copy
    const lockFile = path.join(tempUserDataDir, 'SingletonLock');
    try {
      await fs.unlink(lockFile);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Ignore if the lock file doesn't exist
    }

    // Launch browser with the copy
    const context = await chromium.launchPersistentContext(tempUserDataDir, {
      ...launchOptions,
      viewport: contextOptions.viewport,
      screen: contextOptions.screen,
    });

    context.on('close', () => {
      cleanup(tempUserDataDir);
    });

    process.on('SIGINT', () => {
      cleanup(tempUserDataDir);
    });
    process.on('SIGTERM', () => {
      cleanup(tempUserDataDir);
    });
    process.on('exit', () => {
      cleanup(tempUserDataDir);
    });

    const browser = context.browser();

    return { browser, context };
  } catch (error) {
    console.error('Error during automation:', error);
    await cleanup(tempUserDataDir);
    throw error;
  }
}
