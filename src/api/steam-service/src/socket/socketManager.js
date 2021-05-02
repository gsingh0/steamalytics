const Websocket = require('ws');
const uuid = require('uuid');
const SocketDefinitions = require('./socketDefinitions');

class SocketManager {
    constructor(server, steamApiInterface) {
        this.ws = new Websocket.Server({ server: server});
        this.steamApiInterface = steamApiInterface;
        this.socketDefinitions = new SocketDefinitions();
        this.playerCountTask = null;
        this.isPlayerCountTaskRunning = false;
    }

    async init() {
        await this.enableSocketInstance();
    }

    async enableSocketInstance() {
        return new Promise((resolve, reject) => {
            try {
                this.ws.on('connection', async (socket) => {
                    console.log("New client connected! [CLIENT_NUM]=" + this.ws.clients.size);
                    if (this.playerCountTask == null) {
                        this.playerCountTask = await this.socketDefinitions.createPollPlayerCountTask(this.ws, this.steamApiInterface);
                    }

                    if (!this.isPlayerCountTaskRunning) {
                        this.startPlayerCountTask();
                    }
                    
                    socket.on('close', () => { 
                        console.log("Client disconnected! [CLIENT_NUM]=" + this.ws.clients.size)
                        if (this.ws.clients.size == 0) {
                            this.stopPlayerCountTask();
                        }
                    })
                })
                resolve(this.ws);
            } catch (error) {
                if (this.playerCountTask != null && this.isPlayerCountTaskRunning) {
                    this.stopPlayerCountTask();
                } 
                console.log(error);
                reject(error);
            }
        });
    }

    startPlayerCountTask() {
        this.playerCountTask.start();
        this.isPlayerCountTaskRunning = true;
        console.log("cron job started!");
    }

    stopPlayerCountTask() {
        this.playerCountTask.stop();
        this.isPlayerCountTaskRunning = false;
        this.playerCountTask == null;
        console.log("cron job stopped!");
    }
}

module.exports = SocketManager;