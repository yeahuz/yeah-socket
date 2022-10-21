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
  publish_message: {
    chat_id: string,
    content: string,
    temp_id: string,
  },
  message_sent: {
    temp_id: string,
    message_id: bits(32),
  },
  new_message: {
    id: bits(32),
    chat_id: bits(32),
    type: string,
    created_at: string,
    sender_id: bits(32),
    reply_to: bits(32),
    content: string,
  },
});

export const encoder = new PackBytes(schema);
