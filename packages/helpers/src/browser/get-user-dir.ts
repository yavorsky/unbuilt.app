import * as os from 'os';
import * as path from 'path';

export function getChromeUserDataDir() {
  const platform = os.platform();
  const homedir = os.homedir();

  if (platform === 'darwin') {
    // macOS
    return path.join(homedir, 'Library/Application Support/Google/Chrome');
  } else if (platform === 'win32') {
    // Windows
    const localAppData = process.env.LOCALAPPDATA || '';
    return path.join(localAppData, 'Google/Chrome/User Data');
  } else if (platform === 'linux') {
    // Linux
    return path.join(homedir, '.config/google-chrome');
  }

  throw new Error(`Unsupported platform: ${platform}`);
}
