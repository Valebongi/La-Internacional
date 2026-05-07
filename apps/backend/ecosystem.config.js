// PM2 ecosystem config: arranca los 8 servicios NestJS en un solo container.
// El gateway es el único expuesto externamente (PORT de Railway).
// Los demás se comunican internamente via localhost:300x.
module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'dist/services/auth/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'crm-core-service',
      script: 'dist/services/crm-core/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'messaging-service',
      script: 'dist/services/messaging/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'broadcasts-service',
      script: 'dist/services/broadcasts/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'postsale-service',
      script: 'dist/services/postsale/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'analytics-service',
      script: 'dist/services/analytics/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'integration-service',
      script: 'dist/services/integration/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
    {
      // Gateway va último: espera que los internos estén arriba
      name: 'gateway',
      script: 'dist/services/gateway/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
  ],
};
