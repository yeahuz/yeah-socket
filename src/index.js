import config from "./config/index.js";
import { app } from "./app.js";

app.listen(config.port, (token) => {
  if (token) {
    console.log(`WebSocket server started on port: ${config.port}`);
  } else {
    console.log(`Failed to start WebSocket server`);
  }
});
