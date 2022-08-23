import { App } from "uWebSockets.js";
import { encoder, json_schema } from "./utils/byte-utils.js";
import { randomUUID } from "crypto";
import config from "./config/index.js";
import jwt from "jsonwebtoken";

function on_open(ws) {
  if (ws.timer) clearTimeout(ws.timer);
  const rand_id = randomUUID();
  const token = jwt.sign({ data: rand_id }, config.jwt_secret, {
    expiresIn: config.jwt_expiration,
  });
  ws.subscribe(rand_id);
  ws.send(
    encoder.encode("auth_init", `${config.qr_auth_uri}?token=${token}`),
    true
  );

  ws.timer = setTimeout(() => on_open(ws), 10000);
}

const app = App({})
  .ws("/qr-auth", {
    idleTimeout: config.jwt_expiration,
    sendPingsAutomatically: false,
    open: (ws) => {
      ws.send(json_schema, true);
      // const rand_id = randomUUID();
      // const token = jwt.sign({ data: rand_id }, config.jwt_secret, {
      //   expiresIn: config.jwt_expiration,
      // });
      // ws.subscribe(rand_id);
      // ws.send(
      //   encoder.encode("auth_init", `${config.qr_auth_uri}?token=${token}`),
      //   true
      // );
    },
    message: (ws, message, is_binary) => {
      const [op, payload] = encoder.decode(message);
      console.log({ op });
      if (op === "auth_init") {
        const rand_id = randomUUID();
        const token = jwt.sign({ data: rand_id }, config.jwt_secret, {
          expiresIn: config.jwt_expiration,
        });
        ws.subscribe(rand_id);
        ws.send(
          encoder.encode("auth_init", `${config.qr_auth_uri}?token=${token}`),
          true
        );
      }
    },
    close: (ws) => {
      if (ws.timer) clearTimeout(ws.timer);
    },
  })
  .ws("/", {
    message: (ws, message, is_binary) => {
      const [op, payload] = encoder.decode(message);
      console.log({ op });
      switch (op) {
        case "auth_scan": {
          app.publish(payload.topic, message, is_binary);
          break;
        }
        default:
          break;
      }
    },
  });

export { app };
