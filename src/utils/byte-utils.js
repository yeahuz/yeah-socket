import { PackBytes, string, schemas, bits, array, float } from "packbytes";

export const schema = schemas({
  new_chat: {
    id: bits(32),
    created_by: bits(32),
    posting: {
      id: bits(32),
      cover_url: string,
      url: string,
      title: string
    },
    members: array({ name: string, id: bits(32) }),
    url: string
  },
  read_message: {
    id: bits(32),
    chat_id: bits(32)
  },
  auth_scan: {
    topic: string,
    name: string,
    profile_photo_url: string,
  },
  subscribe: string,
  auth_init: null,
  auth_pending: string,
  auth_confirmed: { topic: string, token: string },
  auth_denied: null,
  ping: null,
  pong: null,
  message_sent: {
    temp_id: string,
    id: bits(32),
    chat_id: bits(32),
    type: string,
    created_at: string,
    sender_id: bits(32),
    reply_to: bits(32),
    content: string,
    attachments: array({
      resource_id: string,
      name: string,
      size: bits(32),
      type: string,
      url: string,
      id: bits(32),
    }),
  },
  new_message: {
    chat_id: string,
    content: string,
    temp_id: string,
    created_at: float(64),
    type: string,
    attachments: array({
      resource_id: string,
      name: string,
      size: bits(32),
      type: string,
      url: string,
    })
  },
});

export const encoder = new PackBytes(schema);
