import { Socket } from 'node:net';
import { createServer } from 'node:http';
import sirv from 'sirv';

export interface AppServerInstance {
  close: () => Promise<void>;
  port: number;
}

export async function createAppServer(
  projectDir: string,
  port: number
): Promise<AppServerInstance> {
  // Track all active connections
  const connections = new Set<Socket>();

  const sirvMiddleware = sirv(projectDir, {
    dev: true,
    etag: true,
    single: true,
  });
  const server = createServer((req, res) => sirvMiddleware(req, res));

  server.on('connection', (conn) => {
    // We want to track and remove all ongoing connections on server close to prevent memory leaks or server not being closed.
    connections.add(conn);
    conn.on('close', () => {
      connections.delete(conn);
    });
  });

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
      close: () => {
        return new Promise<void>((resolve) => {
          for (const conn of connections) {
            conn.destroy();
          }

          server.close((error) => {
            resolve();
          });
        });
      },
      port,
    };
  } catch (error) {
    for (const conn of connections) {
      conn.destroy();
    }

    await new Promise((resolve) => server.close(resolve));
    throw error;
  }
}
