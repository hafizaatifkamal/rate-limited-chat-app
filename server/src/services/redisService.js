const redis = require("redis");
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Create a Redis client
const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

client.connect(REDIS_PORT);

const saveMessage = (message) => {
  // Implement code to save the message in Redis (e.g., using a list, set, etc.)
  return client.RPUSH("chat_messages", JSON.stringify(message));
};

const getLast50Messages = async () => {
  // Implement code to retrieve the last 50 messages from Redis
  const messages = await client.LRANGE("chat_messages", 0, -1);
  return messages.map((m) => JSON.parse(m));
};

module.exports = {
  saveMessage,
  getLast50Messages,
};
