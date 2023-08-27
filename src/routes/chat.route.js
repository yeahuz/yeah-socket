import { decode_cookie } from "../utils/cookie.js";
import { encoder, schema } from "../utils/byte-utils.js";
import { add_prefix } from "../utils/index.js";
import { query } from "../db/pool.js";

export let chat = (app) => ({
  idleTimeout: 112,
  sendPingsAutomatically: false,
  upgrade: async (res, req, context) => {
    res.onAborted(() => {
      res.aborted = true;
    });

    let decoded = decode_cookie(req.getHeader("cookie"), "needs_session");
    let key = req.getHeader("sec-websocket-key");
    let protocol = req.getHeader("sec-websocket-protocol");
    let extensions = req.getHeader("sec-websocket-extensions");

    if (!decoded.sid) {
      return res.writeStatus("401").end();
    }

    //TODO: handle sid not being UUID4
    let { rows: [session] } = await query(`select *,
      case when now() > expires_at then 1 else 0 end as expired
      from sessions where id = $1`, [decoded.sid]);

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
    let { rows } = await query(`select * from chats c join chat_members cm on cm.chat_id = c.id and cm.user_id = $1`, [ws.user_id]);
    for (let chat of rows) {
      ws.subscribe(add_prefix("chats", chat.id));
    }
    ws.subscribe(add_prefix("users", ws.user_id));
    ws.send(JSON.stringify(schema));
  },

  message: async (ws, message, is_binary) => {
    let [op, payload] = encoder.decode(message);
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
        ws.publish(add_prefix("chats", payload.chat_id), message, is_binary);
      } break;
      default:
        break;
    }
  },
});
