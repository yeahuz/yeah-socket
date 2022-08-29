import { App } from "uWebSockets.js";
import { encoder } from "./utils/byte-utils.js";
import { randomUUID } from "crypto";
import config from "./config/index.js";
import jwt from "jsonwebtoken";

const app = App({})
  .ws("/qr-auth", {
    idleTimeout: config.jwt_expiration - 8,
    sendPingsAutomatically: false,
    open: (ws) => {
      const rand_id = randomUUID();
      const token = jwt.sign({ data: rand_id }, config.jwt_secret, {
        expiresIn: config.jwt_expiration,
      });
      ws.subscribe(rand_id);
      ws.send(
        encoder.encode("auth_init", `${config.qr_auth_uri}/${token}`),
        true
      );
    },
    message: (ws, message, is_binary) => {
      const [op, payload] = encoder.decode(message);
    },
  })
  .ws("/", {
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
