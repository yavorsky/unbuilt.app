'use client';

import { Suspense } from 'react';

type Status = 'healthy' | 'unhealthy';
interface HealthMetricsData {
  status: Status;
  memory: {
    heapUsed: string;
    heapTotal: string;
    rss: string;
    external: string;
  };
  system: {
    totalMemory: string;
    freeMemory: string;
    usedMemory: string;
    cpus: number;
    uptime: string;
  };
}

export function HealthMetrics({ data }: { data: HealthMetricsData }) {
  // Calculate memory usage percentage
  const memoryUsagePercent =
    (parseInt(data.memory.heapUsed) / parseInt(data.memory.heapTotal)) * 100;
  const systemMemoryUsagePercent =
    (parseInt(data.system.usedMemory) / parseInt(data.system.totalMemory)) *
    100;

  return (
    <Suspense>
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">System Health</h1>
          </div>

          {/* Status Card */}
          <div className="mb-8 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div
                className={`h-4 w-4 rounded-full ${
                  data.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <h2 className="text-xl font-semibold capitalize">
                {data.status}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Memory Usage */}
            <div className="rounded-lg p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Memory Usage</h3>

              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Heap Memory</span>
                  <span>{Math.round(memoryUsagePercent)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      memoryUsagePercent > 80
                        ? 'bg-red-500'
                        : memoryUsagePercent > 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${memoryUsagePercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-3">
                  <div className="text-sm">Heap Used</div>
                  <div className="text-lg font-semibold">
                    {data.memory.heapUsed}
                  </div>
                </div>
                <div className="rounded-lg p-3">
                  <div className="text-sm">Heap Total</div>
                  <div className="text-lg font-semibold">
                    {data.memory.heapTotal}
                  </div>
                </div>
                <div className="rounded-lg p-3">
                  <div className="text-sm">RSS</div>
                  <div className="text-lg font-semibold">{data.memory.rss}</div>
                </div>
                <div className="rounded-lg p-3">
                  <div className="text-sm ">External</div>
                  <div className="text-lg font-semibold">
                    {data.memory.external}
                  </div>
                </div>
              </div>
            </div>

            {/* System Resources */}
            <div className="rounded-lg p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">System Resources</h3>

              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>System Memory</span>
                  <span>{Math.round(systemMemoryUsagePercent)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      systemMemoryUsagePercent > 80
                        ? 'bg-red-500'
                        : systemMemoryUsagePercent > 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${systemMemoryUsagePercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-3">
                  <div className="text-sm ">Total Memory</div>
                  <div className="text-lg font-semibold">
                    {data.system.totalMemory}
                  </div>
                </div>
                <div className="rounded-lg p-3">
                  <div className="text-sm ">Free Memory</div>
                  <div className="text-lg font-semibold">
                    {data.system.freeMemory}
                  </div>
                </div>
                <div className="rounded-lg p-3">
                  <div className="text-sm ">CPU Cores</div>
                  <div className="text-lg font-semibold">
                    {data.system.cpus}
                  </div>
                </div>
                <div className="rounded-lg p-3">
                  <div className="text-sm">Uptime</div>
                  <div className="text-lg font-semibold">
                    {data.system.uptime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
