module.exports = {
  apps: [
    // Dashboard Service
    {
      name: "dashboard-service",
      script: "devavi-backend/services/dashboard-service/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
        REDIS_HOST: "127.0.0.1",
        REDIS_PORT: 6379,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
        JWT_SECRET: "Avya25042",
        JWT_REFRESH_SECRET: "Pappa25042",
        JWT_EXPIRES_IN: "15m",
        JET_REFRESH_EXPIRES_IN: "7d",
        REDIS_HOST: "redis",
        REDIS_PORT: 6379,
      },
    },

    //blog service
    {
      name: "blog-service",
      script: "devavi-backend/services/blog-service/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3004,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
        REDIS_HOST: "127.0.0.1",
        REDIS_PORT: 6379,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3004,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
        JWT_SECRET: "Avya25042",
        JWT_REFRESH_SECRET: "Pappa25042",
        JWT_EXPIRES_IN: "15m",
        JET_REFRESH_EXPIRES_IN: "7d",
        REDIS_HOST: "redis",
        REDIS_PORT: 6379,
      },
    },
    // User Service
    {
      name: "user-service",
      script: "devavi-backend/services/user-service/index.js",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "development",
        PORT: 3002,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3002,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
        JWT_SECRET: "Avya25042",
        JWT_REFRESH_SECRET: "Pappa25042",
        JWT_EXPIRES_IN: "15m",
        JET_REFRESH_EXPIRES_IN: "7d",
        REDIS_HOST: "redis",
        REDIS_PORT: 6379,
      },
    },

    // Chat Service
    {
      name: "chat-service",
      script: "devavi-backend/services/chat-service/index.js",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "development",
        PORT: 4000,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
        MONGO_URI:
          "mongodb+srv://devavinash0606:Priti25042@portfolio.crmljcw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Portfolio",
        JWT_SECRET: "Avya25042",
        JWT_REFRESH_SECRET: "Pappa25042",
        JWT_EXPIRES_IN: "15m",
        JET_REFRESH_EXPIRES_IN: "7d",
        REDIS_HOST: "redis",
        REDIS_PORT: 6379,
      },
    },
  ],
};
