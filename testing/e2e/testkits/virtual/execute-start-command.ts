import { exec } from 'child_process';

export const executeStartCommand = async ({
  startCommand,
  dir,
  port,
  env,
}: {
  startCommand: string;
  dir: string;
  port: number;
  env?: Record<string, string>;
}) => {
  // Wait for server to be ready
  console.log(`Running start command: ${startCommand} on port: ${port}`);
  // Wait for server to be ready
  const startProcess = await exec(startCommand, {
    cwd: dir,
    env: {
      ...process.env,
      ...env,
      PORT: port.toString(),
      NODE_ENV: 'production',
    },
  });

  // Wait for server to be ready. Improve in the future to read stdout.

  // Log output from the start command
  startProcess?.stdout?.on('data', (data: string) =>
    console.log('Start command output:', data)
  );
  startProcess?.stderr?.on('data', (data: string) =>
    console.error('Start command error:', data)
  );

  await new Promise((r) => setTimeout(r, 30000));

  return {
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
};
