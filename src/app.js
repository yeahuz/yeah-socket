import { App } from "uWebSockets.js";
import { encoder } from "./utils/byte-utils.js";
import { qr_auth } from "./routes/qr-auth.route.js";
import { chat } from "./routes/chat.route.js";
import { schema } from "./utils/byte-utils.js";

const app = App({})
  .ws("/qr-auth", qr_auth)
  .ws("/chat", chat)
  .ws("/", {
    open: (ws) => {
      ws.send(JSON.stringify(schema));
    },
    message: (ws, message, is_binary) => {
      const [op, payload] = encoder.decode(message);
      switch (op) {
        case "auth_scan": {
          app.publish(payload.topic, message, is_binary);
          break;
        }
        case "auth_confirmed": {
          app.publish(payload.topic, message, is_binary);
          break;
        }
        case "auth_denied": {
          app.publish(payload, message, is_binary);
          break;
        }
        default:
          break;
      }
    },
  });

export { app };
