import os from 'os';
import { HealthMetrics } from './health-metrics';

// This is a Server Component
export default function HealthPage() {
  // Server-side calculations
  const systemMemory = {
    total: os.totalmem(),
    free: os.freemem(),
    used: os.totalmem() - os.freemem()
  };

  const memory = process.memoryUsage();

  const metrics = {
    status: 'healthy',
    memory: {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
      rss: Math.round(memory.rss / 1024 / 1024) + 'MB',
      external: Math.round(memory.external / 1024 / 1024) + 'MB',
    },
    system: {
      totalMemory: Math.round(systemMemory.total / 1024 / 1024) + 'MB',
      freeMemory: Math.round(systemMemory.free / 1024 / 1024) + 'MB',
      usedMemory: Math.round(systemMemory.used / 1024 / 1024) + 'MB',
      cpus: os.cpus().length,
      uptime: Math.round(os.uptime() / 60) + ' minutes'
    }
  } as const;

  return <HealthMetrics data={metrics} />;
}
