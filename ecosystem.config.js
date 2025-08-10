module.exports = {
  apps: [
    {
      name: "auth-service",
      script: "devavi-backend/services/auth-service/index.js",
      watch: false,
    },
    {
      name: "user-service",
      script: "devavi-backend/services/user-service/index.js",
      watch: false,
    },
    {
      name: "dashboard-service",
      script: "devavi-backend/services/dashboard-service/index.js",
      watch: false,
    },
    {
      name: "blog-service",
      script: "devavi-backend/services/blog-service/index.js",
      watch: false,
    },
    {
      name: "chat-service",
      script: "devavi-backend/services/chat-service/index.js",
      watch: false,
    },
  ],
};
