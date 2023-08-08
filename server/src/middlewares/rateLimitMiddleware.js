const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_PORT);
// Ensure the client is connected before performing operations
redisClient.connect();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // 1 minute (in seconds)
const RATE_LIMIT_MESSAGES = 15; // 15 messages per minute

const rateLimitMiddleware = async (req, res, next) => {
  // Implement code to check the user's rate limit using Redis
  // You can use Redis to store the user's message count and timestamps
  // If the user exceeds the rate limit, respond with an error

  const { sender } = req.body;

  if (!sender) {
    return res.status(400).json({ error: "Username is required." });
  }

  const messageCountKey = `messageCount:${sender}`;
  const timestampKey = `timestamp:${sender}`;

  try {
    const messageCount = await redisClient.get(messageCountKey);
    const lastTimestamp = await redisClient.get(timestampKey);

    const currentTime = Math.floor(Date.now() / 1000);
    const parsedMessageCount =
      messageCount === null || NaN ? 0 : JSON.parse(messageCount);
    const parsedLastTimestamp =
      lastTimestamp === null || NaN ? 0 : JSON.parse(lastTimestamp);

    if (currentTime - parsedLastTimestamp >= RATE_LIMIT_WINDOW) {
      // Reset the message count and timestamp for a new window
      redisClient.setEx(messageCountKey, RATE_LIMIT_WINDOW, JSON.stringify(1));
      redisClient.setEx(
        timestampKey,
        RATE_LIMIT_WINDOW,
        JSON.stringify(currentTime)
      );
    } else {
      if (parsedMessageCount >= RATE_LIMIT_MESSAGES) {
        // Rate limit exceeded
        return res
          .status(429)
          .json({ error: "Rate limit exceeded. Try again later." });
      }

      // Increment the message count for the current window
      await redisClient.setEx(
        messageCountKey,
        RATE_LIMIT_WINDOW,
        JSON.stringify(parsedMessageCount + 1)
      );
    }

    next();
  } catch (error) {
    console.error("Error occurred while rate limiting:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = rateLimitMiddleware;
