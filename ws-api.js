const nodePath = require('path');
const fs = require('fs');

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

router.all('/:action', function (req, res, next) {
    let file = nodePath.join(__dirname, "mock", `${req.params.action}.json`);
    if (fs.existsSync(file)) {
        res.sendFile(file, {
            headers: {
                'content-type': 'text/plain; charset=UTF-8'
            }
        }, function (err) {
            if (err) {
                next(err)
            } else {
                console.log('Sent:', file)
            }
        });
    }
    else {
        console.log(`file [${file}] not found`);
        next();
    }
});

module.exports = router;
