module.exports = {
  apps: [
    {
      name: "needs-socket",
      script: "./src/index.js",
      instances: 1,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "needs-socket-dev",
      script: "./src/index.js",
      instances: 1,
      exec_mode: "cluster",
      restart_delay: 10000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "development",
      }
    },
  ],
};
