import { App } from "uWebSockets.js";
import { qr_auth } from "./routes/qr-auth.route.js";
import { chat } from "./routes/chat.route.js";
import { home } from "./routes/home.route.js";
import { sub } from "./utils/redis.js";
import { encoder } from "./utils/byte-utils.js";

const app = App({})
app.ws("/", home(app))
app.ws("/chat", chat(app))
app.ws("/qr-auth", qr_auth(app))


sub.on("message", (channel, payload) => {
  switch (channel) {
    case "chats/new": {
      const chat = JSON.parse(payload)
      for (const member of chat.members) {
        app.publish(String(member.id), encoder.encode("new_chat", chat), true)
      }
    } break;
    case "messages/new": {
      const message = JSON.parse(payload)
      app.publish(String(message.chat_id), encoder.encode("new_message", message), true)
    } break;
    case "messages/sent": {
      const message = JSON.parse(payload)
      app.publish(String(message.sender_id), encoder.encode("message_sent", message), true)
    } break
    case "auth/qr": {
      const message = JSON.parse(payload)
      app.publish(String(message.topic), encoder.encode(message.op, message), true)
    } break;
    default:
      break;
  }
})

export { app };
