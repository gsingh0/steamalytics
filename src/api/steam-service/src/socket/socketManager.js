const Websocket = require('ws');
const uuid = require('uuid');

class SocketManager {
    constructor(server) {
        this.ws = new Websocket.Server({ server: server});
    }

    async init() {
        await this.socketTest();
    }

    async socketTest() {
        return new Promise((resolve, reject) => {
            try {
                this.ws.on('connection', (socket) => {
                    console.log("connected: " + this.ws.clients.size);
                    socket.send("hello");
                    socket.on('close', () => {
                        console.log("user connection closed!" + this.ws.clients.size);
                    })
                })
                resolve(this.io);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = SocketManager;