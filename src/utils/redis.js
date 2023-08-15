import Redis from "ioredis"

export const pub = new Redis()
export const sub = new Redis()

sub.subscribe("chats/new")
sub.subscribe("messages/new")
sub.subscribe("auth/qr")
