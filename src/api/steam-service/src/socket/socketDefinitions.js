const cron = require('node-cron');
const sleep = require('../util/Thread');
const { getRandomInteger, getRandomIndices } = require('../util/randomGenerator');
const addNoiseModel = require('../util/noise');

class SocketDefinitions {
    constructor() {
        this.CRON_COUNTER = 0; // count how many times cron job has run 
        this.CRON_SCHEDULE = "*/5 * * * *";
        this.timeout = null;
        this.task = null;
     }

    async createPollPlayerCountTask(ws, steamApiInterface) {
        return new Promise((resolve, reject) => {
            try {
                this.task = cron.schedule(this.CRON_SCHEDULE, async () => await this.pollPlayerCount(ws, steamApiInterface, true), { scheduled: false });
                resolve(this.task);
            } catch (error) {
                reject(error);
            }
        });
    }

    async pollPlayerCount(ws, steamApiInterface, isCron) {
        try {
            this.clearTimeoutInterval();
            if (isCron) {
                this.CRON_COUNTER++;
                console.log("[COUNT=" + this.CRON_COUNTER + "] running cron job...");
            }
            let playerCountData = await steamApiInterface.fetchPlayerCountData();
            ws.clients.forEach((client) => client.send(JSON.stringify(playerCountData)));
            // clear timeout and add sleep
            sleep(2000);
            console.log("interval started!");
            this.timeout = setInterval(async () => {
                console.log("running interval...");
                let numNoisyGames = getRandomInteger(1, playerCountData.length / 2);
                let randGamesIndices = await getRandomIndices(playerCountData, numNoisyGames);
                playerCountData = await addNoiseModel(playerCountData, randGamesIndices);
                ws.clients.forEach((client) => client.send(JSON.stringify(playerCountData)));
            }, 3000)
        } catch (error) {
            console.log("error polling player count. Error: " + error); // should not fall here
        }
    }

    clearTimeoutInterval() {
        if (this.timeout !== null) {
            clearInterval(this.timeout);
            console.log("interval cleared!");
            sleep(2000);
        }
    }
}

module.exports = SocketDefinitions;