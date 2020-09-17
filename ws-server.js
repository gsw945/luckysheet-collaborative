// from: https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express/57426017#57426017
const { createServer } = require("http");
const querystring = require("querystring");

const express = require("express");
const WebSocket = require("ws");
const pako = require('pako');
const { isText, isBinary, getEncoding } = require('istextorbinary');
const md5 = require('md5');

function isJSON(str) {
    // from: https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try/40464459#40464459
    if ( /^\s*$/.test(str) ) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
}

const app = express();
app.use(express.json({ extended: false }));
app.use("/api", require("./ws-api"));

const port = process.env.PORT || 3000;
const server = createServer(app);
server.listen(port, () => console.info(`Server running on port: ${port}`));

const webSocketServer = new WebSocket.Server({server: server, path: "/ws/update"});
webSocketServer.on("connection", (webSocket, req) => {
    const wsKey = req.headers['sec-websocket-key'];
    webSocket.WSKey = wsKey;
    webSocket.GUID = md5(wsKey);
    console.info("Total connected clients:", webSocketServer.clients.size);
    console.info("New connected client key:", webSocket.GUID);
    app.locals.clients = webSocketServer.clients

    webSocket.on('message', (data) => {
        // isText(null, data)
        try {
            let msg = data;
            if (isBinary(null, data)) {
                msg = querystring.unescape(pako.ungzip(data, { to: "string" }))
            }
            if (isJSON(msg)) {
                let obj = JSON.parse(msg)
                processMessage(webSocket, obj)
            } else {
                console.log(msg)
            }
        } catch (e) {
            console.error(e)
        }
    })
});
function broadcast(webSocket, data) {
    webSocketServer.clients.forEach((client) => {
        if (client !== webSocket && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    })
}
function processMessage(webSocket, msgObj) {
    console.log(msgObj);
    const updateTypes = [
        'all', 'cg', 'rv', 'rv_end'
    ];
    if (msgObj.t === 'mv') { // 格子选择变化
        let ret = {
            type: 3,
            id: webSocket.GUID,
            username: 'null',
            data: JSON.stringify(msgObj, null, 0)
        };
        broadcast(webSocket, JSON.stringify(ret));
    } else if (msgObj.t === 'v') { // 单个单元格刷新
        let ret = {
            type: 2,
            data: JSON.stringify(msgObj, null, 0)
        };
        broadcast(webSocket, JSON.stringify(ret));
    } else if (updateTypes.indexOf(msgObj.t) >= 0) { // 通用保存
        let ret = {
            type: 2,
            data: JSON.stringify(msgObj, null, 0)
        };
        broadcast(webSocket, JSON.stringify(ret));
    }
}