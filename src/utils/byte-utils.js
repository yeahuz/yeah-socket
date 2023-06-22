import { PackBytes, string, schemas, bits, array } from "packbytes";

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
  publish_message: {
    chat_id: string,
    content: string,
    temp_id: string,
  },
  publish_file: {
    chat_id: string,
    file: string,
    temp_id: string,
  },
  publish_photos: {
    chat_id: string,
    photos: array(string),
    temp_id: string,
  },
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
  new_files: {
    sender_id: bits(32),
    reply_to: bits(32),
    attachments: array({
      resource_id: string,
      name: string,
      size: bits(32),
      type: string,
      url: string,
      id: bits(32),
    }),
    id: bits(32),
    chat_id: bits(32),
    type: string,
    created_at: string,
  },
  files_sent: {
    temp_id: string,
    message: bits(32),
  },
  new_message: {
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
});

export const encoder = new PackBytes(schema);
