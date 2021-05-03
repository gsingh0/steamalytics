const cron = require('node-cron');

class SocketDefinitions {
    constructor() {
        this.CRON_SCHEDULE = "*/10 * * * * *";
     }

    async createPollPlayerCountTask(ws, steamApiInterface) {
        return new Promise((resolve, reject) => {
            try {
                let task = cron.schedule(this.CRON_SCHEDULE, async () => await this.pollPlayerCount(ws, steamApiInterface), { scheduled: false });
                resolve(task);
            } catch (error) {
                reject(error);
            }
        });
    }

    async pollPlayerCount(ws, steamApiInterface) {
        try {
            console.log("running cron job...");
            let playerCountData = await steamApiInterface.fetchPlayerCountData();
            ws.clients.forEach((client) => client.send(JSON.stringify(playerCountData)))
        } catch (error) {
            return error;
        }
    }

    
}

module.exports = SocketDefinitions;