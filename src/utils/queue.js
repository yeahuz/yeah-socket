import Redis from "ioredis";

export const subscriber = new Redis();
export const publisher = new Redis();

subscriber.subscribe("new_messages", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: ", err.message);
  } else {
    console.log("Subscribed successfully");
  }
});

subscriber.on("message", (channel, message) => {
  message = JSON.parse(message);
  console.log({ channel, message });
});
