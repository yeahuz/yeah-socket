import {
  NODE_ENV,
  PORT,
  PORT_DEV,
  JWT_SECRET,
  JWT_EXPIRATION,
  QR_AUTH_URI,
} from "./secrets.js";

export const configs = {
  production: {
    port: PORT,
    node_env: NODE_ENV,
    jwt_secret: JWT_SECRET,
    qr_auth_uri: QR_AUTH_URI,
    jwt_expiration: JWT_EXPIRATION,
  },
  development: {
    port: PORT_DEV,
    node_env: NODE_ENV,
    jwt_secret: JWT_SECRET,
    qr_auth_uri: QR_AUTH_URI,
    jwt_expiration: JWT_EXPIRATION,
  },
};
