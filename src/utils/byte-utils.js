import { PackBytes, string, schemas, bits } from "packbytes";

export const schema = schemas({
  auth_scan: {
    topic: string,
    name: string,
    profile_photo_url: string,
  },
  subscribe: string,
  auth_init: null,
  auth_pending: string,
  auth_confirmed: { topic: string, token: string },
  auth_denied: string,
  ping: null,
  pong: null,
  new_message: {
    topic: string,
    content: string,
    timestamp: bits(32),
  },
});

export const encoder = new PackBytes(schema);
