import { decode_cookie } from "../utils/cookie.js";
import { needs } from "../api/needs.api.js";
import { encoder, schema } from "../utils/byte-utils.js";

export const chat = {
  idleTimeout: 112,
  sendPingsAutomatically: false,
  upgrade: async (res, req, context) => {
    res.onAborted(() => {
      res.aborted = true;
    });

    const decoded = decode_cookie(req.getHeader("cookie"));

    const key = req.getHeader("sec-websocket-key");
    const protocol = req.getHeader("sec-websocket-protocol");
    const extensions = req.getHeader("sec-websocket-extensions");

    if (!decoded) {
      return res.writeStatus("401").end();
    }

    const session = await needs.request(`/auth/sessions/${decoded.sid}`);

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
      ws.subscribe(String(chat.id));
    }
    ws.send(JSON.stringify(schema));
  },

  message: async (ws, message, is_binary) => {
    const [op, payload] = encoder.decode(message);
    switch (op) {
      case "publish_message": {
        const message = await needs.request(
          `/chats/${payload.chat_id}/messages`,
          {
            data: {
              sender_id: ws.user_id,
              content: payload.content,
            },
          }
        );
        ws.publish(
          payload.chat_id,
          encoder.encode("new_message", message),
          is_binary
        );
        ws.send(
          encoder.encode("message_sent", {
            temp_id: payload.temp_id,
            message_id: message.id,
          }),
          is_binary
        );
        break;
      }
      default:
        break;
    }
  },
};
