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
  ],
};
