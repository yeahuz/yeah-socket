module.exports = {
  apps: [
    {
      name: "needs-socket",
      script: "npm",
      args: "start",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
