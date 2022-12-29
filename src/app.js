import { App } from "uWebSockets.js";
import { qr_auth } from "./routes/qr-auth.route.js";
import { chat } from "./routes/chat.route.js";
import { home } from "./routes/home.route.js";

const app = App({})
  .ws("/qr-auth", qr_auth)
  .ws("/chat", chat)
  .ws("/", home);

export { app };
