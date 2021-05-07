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
        this.enableSocketInstance()
            .then(async () => {
                console.log("running initial interval!");
                await this.socketDefinitions.pollPlayerCount(this.ws, this.steamApiInterface, false);
                this.startPlayerCountTask()
            })
            .catch((error) => console.log(error));
    }

    async enableSocketInstance() {
        return new Promise(async (resolve, reject) => {
            try {
                this.ws.on('connection', (socket) => {
                    console.log("New client connected! [CLIENT_NUM]=" + this.ws.clients.size);
                    // this.startPlayerCountTask();
                   
                    // if (this.playerCountTask == null) {
                    //     this.playerCountTask = await this.socketDefinitions.createPollPlayerCountTask(this.ws, this.steamApiInterface);
                    // }

                    // if (!this.isPlayerCountTaskRunning) {
                    //     this.startPlayerCountTask();
                    // }
                    
                    socket.on('close', () => { 
                        console.log("Client disconnected! [CLIENT_NUM]=" + this.ws.clients.size)
                        // if (this.ws.clients.size == 0) {
                        //     this.stopPlayerCountTask();
                        // }
                    })
                })
                this.playerCountTask = await this.socketDefinitions.createPollPlayerCountTask(this.ws, this.steamApiInterface);
                resolve(this.ws);
            } catch (error) {
                // if (this.playerCountTask != null && this.isPlayerCountTaskRunning) {
                //     this.stopPlayerCountTask();
                // } 
                reject(error);
            }
        });
    }

    startPlayerCountTask() {
        this.playerCountTask.start();
        this.isPlayerCountTaskRunning = true;
    }

    stopPlayerCountTask() {
        this.playerCountTask.stop();
        this.isPlayerCountTaskRunning = false;
        this.playerCountTask == null;
        this.socketDefinitions.clearTimeoutInterval();
        console.log("cron job stopped!");
    }
}

module.exports = SocketManager;