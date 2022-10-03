module.exports = {
  apps: [
    {
      name: "needs-socket",
      script: "pnpm",
      args: "start",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
