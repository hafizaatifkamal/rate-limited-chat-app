const express = require("express");
const chatRoutes = express.Router();
const rateLimitMiddleware = require("../middlewares/rateLimitMiddleware");
const { postMessage, getLast50Messages } = require("../controllers/chat");

chatRoutes.get("/", getLast50Messages);
chatRoutes.post("/", rateLimitMiddleware, postMessage);

module.exports = chatRoutes;
