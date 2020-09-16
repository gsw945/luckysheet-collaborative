const { createServer } = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json({ extended: false }));
app.use("/api/pets", require("./ws-api"));

const port = process.env.PORT || 3000;
const server = createServer(app);
server.listen(port, () => console.info(`Server running on port: ${port}`));

const webSocketServer = new WebSocket.Server({ server });
webSocketServer.on("connection", (webSocket) => {

    console.info("Total connected clients:", webSocketServer.clients.size);

    app.locals.clients = webSocketServer.clients;
});
