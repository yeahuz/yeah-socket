import { decode_cookie } from "../utils/cookie.js";
import { needs } from "../api/needs.api.js";
import { encoder, schema } from "../utils/byte-utils.js";
import { pub } from "../utils/redis.js";

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
      ws.subscribe(String(chat.id));
    }
    ws.subscribe(String(ws.user_id))
    ws.send(JSON.stringify(schema));
  },

  message: async (ws, message, is_binary) => {
    const [op, payload] = encoder.decode(message);
    switch (op) {
      case "subscribe": {
        ws.subscribe(payload)
      } break;
      case "publish_message": {
        const message = {
          chat_id: payload.chat_id,
          sender_id: ws.user_id,
          content: payload.content,
          temp_id: payload.temp_id,
          created_at: new Date().toISOString(),
          type: "text",
          attachments: []
        }

        pub.lpush("messages/list", JSON.stringify(message));
        pub.publish("api/messages", JSON.stringify({ queue: "messages/list" }))

        ws.publish(
          message.chat_id,
          encoder.encode("new_message", message),
          is_binary
        );
      } break;
      case "publish_file": {
        const message = {
          chat_id: payload.chat_id,
          temp_id: payload.temp_id,
          file: payload.file,
          sender_id: ws.user_id,
          created_at: new Date().toISOString(),
          type: "file",
          content: '',
        }

        pub.lpush("messages/list", JSON.stringify(message))
        pub.publish("api/messages", JSON.stringify({ queue: "messages/list" }))
        ws.publish(payload.chat_id, encoder.encode("new_message", Object.assign(message, { attachments: [payload.file] })), true)
        // const message = await needs.request(`/chats/${payload.chat_id}/files`, {
        //   data: {
        //     sender_id: ws.user_id,
        //     file: payload.file,
        //   },
        // });

        // ws.publish(
        //   payload.chat_id,
        //   encoder.encode("new_message", message),
        //   is_binary
        // );
        //
        // ws.send(
        //   encoder.encode(
        //     "message_sent",
        //     Object.assign(message, { temp_id: payload.temp_id })
        //   ),
        //   is_binary
        // );
      } break;
      case "publish_photos": {
        const message = await needs.request(
          `/chats/${payload.chat_id}/photos`,
          {
            data: {
              sender_id: ws.user_id,
              photos: payload.photos,
            },
          }
        );

        ws.publish(
          payload.chat_id,
          encoder.encode("new_message", message),
          is_binary
        );

        ws.send(
          encoder.encode(
            "message_sent",
            Object.assign(message, { temp_id: payload.temp_id })
          ),
          is_binary
        );
      } break;
      default:
        break;
    }
  },
});
