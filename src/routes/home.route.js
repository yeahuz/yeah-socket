import { encoder, schema } from "../utils/byte-utils.js";

export const home = (app) => ({
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
      case "new_chat": {
        app.publish(payload.topic, message, is_binary)
        break
      }
      default:
        break;
    }
  },
});
