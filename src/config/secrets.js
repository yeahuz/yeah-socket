import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT, 10);
const PORT_DEV = parseInt(process.env.PORT_DEV, 10);
const PORT_STAGING = parseInt(process.env.PORT_STAGING, 10);
const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION, 10);

export { PORT, PORT_DEV, PORT_STAGING, JWT_EXPIRATION };

export const { NODE_ENV, JWT_SECRET, QR_AUTH_URI, QR_AUTH_URI_DEV } =
  process.env;
