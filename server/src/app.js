const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const routes = require("./routes");
const { startWebSocketServer } = require("./services/wsService");

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// WebSocket setup
const wss = startWebSocketServer(server);

// Route
app.use("/api", routes);
app.get("/api", (req, res) =>
  res.send(`<h1>Welcome to Real-time Chat-App</h1>`)
);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
