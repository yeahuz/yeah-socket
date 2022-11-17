module.exports = {
  apps: [
    {
      name: "needs-socket",
      script: "./src/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
