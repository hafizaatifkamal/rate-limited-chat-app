const wsService = require("../services/wsService");
const redisService = require("../services/redisService");

const postMessage = async (req, res) => {
  try {
    // Extract the sender, content, and timestamp from the request body
    const { sender, content, timestamp } = req.body;

    // Save the message to Redis
    redisService.saveMessage({ sender, content, timestamp });

    // Broadcast the message to all connected clients using WebSocket
    wsService.broadcastMessage({ sender, content, timestamp });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getLast50Messages = async (req, res) => {
  try {
    // Retrieve the last 50 messages from Redis
    const messages = await redisService.getLast50Messages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  postMessage,
  getLast50Messages,
};
