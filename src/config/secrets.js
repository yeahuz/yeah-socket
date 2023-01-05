import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT, 10);
const PORT_DEV = parseInt(process.env.PORT_DEV, 10);
const PORT_STAGING = parseInt(process.env.PORT_STAGING, 10);
const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION, 10);

export { PORT, PORT_DEV, PORT_STAGING, JWT_EXPIRATION };

export const {
  NODE_ENV,
  JWT_SECRET,
  QR_AUTH_URI,
  QR_AUTH_URI_DEV,
  QR_AUTH_URI_STAGING,
  NEEDS_API_URI,
  NEEDS_API_URI_DEV,
  NEEDS_API_URI_STAGING,
  NEEDS_API_USERNAME,
  NEEDS_API_PASSWORD,
  NEEDS_API_SID,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME_DEV,
  SESSION_COOKIE_NAME_STAGING,
  SESSION_COOKIE_SECRET,
} = process.env;
