import {
  NODE_ENV,
  PORT,
  PORT_DEV,
  PORT_STAGING,
  JWT_SECRET,
  JWT_EXPIRATION,
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
  POSTGRES_URI,
  POSTGRES_URI_DEV
} from "./secrets.js";

export const configs = {
  production: {
    port: PORT,
    node_env: NODE_ENV,
    jwt_secret: JWT_SECRET,
    qr_auth_uri: QR_AUTH_URI,
    jwt_expiration: JWT_EXPIRATION,
    needs_api_uri: NEEDS_API_URI,
    needs_api_username: NEEDS_API_USERNAME,
    needs_api_password: NEEDS_API_PASSWORD,
    needs_api_sid: NEEDS_API_SID,
    session_cookie_name: SESSION_COOKIE_NAME,
    session_cookie_secret: SESSION_COOKIE_SECRET,
    postgres_uri: POSTGRES_URI
  },
  development: {
    port: PORT_DEV,
    node_env: NODE_ENV,
    jwt_secret: JWT_SECRET,
    qr_auth_uri: QR_AUTH_URI_DEV,
    jwt_expiration: JWT_EXPIRATION,
    needs_api_uri: NEEDS_API_URI_DEV,
    needs_api_username: NEEDS_API_USERNAME,
    needs_api_password: NEEDS_API_PASSWORD,
    needs_api_sid: NEEDS_API_SID,
    session_cookie_name: SESSION_COOKIE_NAME_DEV,
    session_cookie_secret: SESSION_COOKIE_SECRET,
    postgres_uri: POSTGRES_URI_DEV
  },
  staging: {
    port: PORT_STAGING,
    node_env: NODE_ENV,
    jwt_secret: JWT_SECRET,
    qr_auth_uri: QR_AUTH_URI_STAGING,
    jwt_expiration: JWT_EXPIRATION,
    needs_api_uri: NEEDS_API_URI_STAGING,
    needs_api_username: NEEDS_API_USERNAME,
    needs_api_password: NEEDS_API_PASSWORD,
    needs_api_sid: NEEDS_API_SID,
    session_cookie_name: SESSION_COOKIE_NAME_STAGING,
    session_cookie_secret: SESSION_COOKIE_SECRET,
    postgres_uri: POSTGRES_URI_DEV
  },
};
