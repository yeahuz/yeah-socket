import { PackBytes, string, schemas, bits, array } from "packbytes";

export const schema = schemas({
  new_chat: {
    id: bits(32),
    posting: {
      id: bits(32),
      cover_url: string,
      url: string,
      title: string,
      creator: string,
    },
    url: string
  },
  message_read: {
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
  message: {
    id: bits(32),
    chat_id: string,
    content: string,
    created_at: string,
    type: string,
    sender_id: bits(32),
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
