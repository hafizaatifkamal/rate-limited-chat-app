const express = require("express");
const routes = express.Router();
const chatRoutes = require("./chat");

routes.use("/messages", chatRoutes);

module.exports = routes;
