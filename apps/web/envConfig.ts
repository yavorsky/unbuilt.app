import { loadEnvConfig } from '@next/env';
import path from 'path';

const projectDir = path.resolve(process.cwd());
const loadedEnvConfig = loadEnvConfig(projectDir);

export default loadedEnvConfig;
