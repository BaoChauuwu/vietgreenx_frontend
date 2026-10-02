module.exports = {
  apps: [
    {
      name: 'vietgreenx-frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_develop: { NODE_ENV: 'development', PORT: 3001 },
      env_staging: { NODE_ENV: 'staging', PORT: 3001 },
      env_production: { NODE_ENV: 'production', PORT: 3001 },
    },
  ],
};
