import { App } from "uWebSockets.js";
import { qr_auth } from "./routes/qr-auth.route.js";
import { chat } from "./routes/chat.route.js";
import { home } from "./routes/home.route.js";
import { sub } from "./utils/redis.js";
import { encoder } from "./utils/byte-utils.js";
import { add_prefix } from "./utils/index.js";

const app = App({});
app.ws("/", home(app));
app.ws("/chat", chat(app));
app.ws("/qr-auth", qr_auth(app));

sub.on("message", (channel, payload) => {
  switch (channel) {
    case "chats/new": {
      const chat = JSON.parse(payload);
      for (const member of chat.members) {
        app.publish(add_prefix("users", member), encoder.encode("new_chat", chat), true);
      }
    } break;
    case "messages/new": {
      const message = JSON.parse(payload);
      app.publish(add_prefix("chats", message.chat_id), encoder.encode("message", message), true);
    } break;
    case "auth/qr": {
      const message = JSON.parse(payload);
      app.publish(String(message.topic), encoder.encode(message.op, message), true);
    } break;
    default:
      break;
  }
})

export { app };
