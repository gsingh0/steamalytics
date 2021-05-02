const cron = require('node-cron');

class SocketDefinitions {
    constructor() {
        this.CRON_SCHEDULE = "*/10 * * * * *";
     }

    async createPollPlayerCountTask(socket, steamApiInterface) {
        return new Promise((resolve, reject) => {
            try {
                let task = cron.schedule(this.CRON_SCHEDULE, async () => await this.pollPlayerCount(socket, steamApiInterface), { scheduled: false });
                resolve(task);
            } catch (error) {
                reject(error);
            }
        });
    }

    async pollPlayerCount(socket, steamApiInterface) {
        try {
            console.log("running cron job...");
            let playerCountData = await steamApiInterface.fetchPlayerCountData();
            socket.send(JSON.stringify(playerCountData));
        } catch (error) {
            return error;
        }
    }
}

module.exports = SocketDefinitions;