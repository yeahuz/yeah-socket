import config from "../config/index.js";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { encoder, schema } from "../utils/byte-utils.js";

export const qr_auth = (app) => ({
  idleTimeout: config.jwt_expiration - 8,
  sendPingsAutomatically: false,
  open: (ws) => {
    ws.send(JSON.stringify(schema));
  },
  message: (ws, message, is_binary) => {
    const [op, payload] = encoder.decode(message);
    switch (op) {
      case "auth_init": {
        const rand_id = randomUUID();
        const token = jwt.sign({ data: rand_id }, config.jwt_secret, {
          expiresIn: config.jwt_expiration,
        });
        ws.subscribe(rand_id);
        ws.send(
          encoder.encode("auth_pending", `${config.qr_auth_uri}/${token}`),
          true
        );
        break;
      }
      default:
        break;
    }
  },
});
