const router = require("express").Router();
const WebSocket = require("ws");

const broadcast = (clients, message) => {

    clients.forEach((client) => {

        if (client.readyState === WebSocket.OPEN) {

            client.send(message);
        }
    });
};

router.get("/dog", (req, res) => {

    broadcast(req.app.locals.clients, "Bark!");

    return res.sendStatus(200);
});

router.get("/cat", (req, res) => {

    broadcast(req.app.locals.clients, "Meow!");

    return res.sendStatus(200);
});

module.exports = router;
