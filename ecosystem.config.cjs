module.exports = {
  apps: [{
    name: 'web',
    cwd: './apps/web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env_file: '/home/server/unbuilt-app/.env',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      // eslint-disable-next-line no-undef
      SUPABASE_URL: process.env.SUPABASE_URL,
      // eslint-disable-next-line no-undef
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      // eslint-disable-next-line no-undef
      GA_ID: process.env.GA_ID,
      // eslint-disable-next-line no-undef
      LOGFLARE_SOURCE_TOKEN: process.env.LOGFLARE_SOURCE_TOKEN,
      // eslint-disable-next-line no-undef
      LOGFLARE_API_KEY: process.env.LOGFLARE_API_KEY
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '3G',

    watch_delay: 1000,
    listen_timeout: 3000,
    kill_timeout: 5000,

    // Restart on memory issues
    exp_backoff_restart_delay: 100,

    // Optional: Add error handling
    min_uptime: '30s',
    max_restarts: 10,

    // Optional: Add monitoring
    monitor: true,
    instance_var: 'INSTANCE_ID',

    health_check: {
      port: 3000,
      path: '/api/health'
    },
  }]
};