import { decode_cookie } from "../utils/cookie.js";
import { needs } from "../api/needs.api.js";
import { encoder, schema } from "../utils/byte-utils.js";
import { pub } from "../utils/redis.js";
import { add_prefix } from "../utils/index.js";

export const chat = (app) => ({
  idleTimeout: 112,
  sendPingsAutomatically: false,
  upgrade: async (res, req, context) => {
    res.onAborted(() => {
      res.aborted = true;
    });

    const decoded = decode_cookie(req.getHeader("cookie"), "needs_session");
    const key = req.getHeader("sec-websocket-key");
    const protocol = req.getHeader("sec-websocket-protocol");
    const extensions = req.getHeader("sec-websocket-extensions");

    if (!decoded.sid) {
      return res.writeStatus("401").end();
    }

    const session = await needs
      .request(`/auth/sessions/${decoded.sid}`)
      .catch(console.log);

    if (res.aborted) return;

    if (!session?.active || session?.expired) {
      return res.writeStatus("401").end();
    }

    res.upgrade(
      { user_id: session.user_id },
      key,
      protocol,
      extensions,
      context
    );
  },

  open: async (ws) => {
    const chats = await needs.request(`/users/${ws.user_id}/chats`);
    for (const chat of chats) {
      console.log("USER: ", ws.user_id, "CHAT:", chat.id);
      ws.subscribe(add_prefix("chats", chat.id));
    }
    ws.subscribe(add_prefix("users", ws.user_id));
    ws.send(JSON.stringify(schema));
  },

  message: async (ws, message, is_binary) => {
    const [op, payload] = encoder.decode(message);
    switch (op) {
      case "subscribe": {
        ws.subscribe(payload);
      } break;
      case "message": {
        ws.publish(
          add_prefix("chats", payload.chat_id),
          message,
          is_binary
        );
      } break;
      case "message_read": {
        console.log({ payload });
        ws.publish(add_prefix("chats", payload.chat_id), message, is_binary);
      } break;
      default:
        break;
    }
  },
});
