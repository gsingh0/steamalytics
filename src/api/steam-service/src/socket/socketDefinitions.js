const cron = require('node-cron');
const sleep = require('../util/Thread');

class SocketDefinitions {
    constructor() {
        this.CRON_SCHEDULE = "*/30 * * * * *";
        this.timeout = null;
        this.task = null;
     }

    async createPollPlayerCountTask(ws, steamApiInterface) {
        return new Promise((resolve, reject) => {
            try {
                this.task = cron.schedule(this.CRON_SCHEDULE, async () => await this.pollPlayerCount(ws, steamApiInterface), { scheduled: false });
                resolve(this.task);
            } catch (error) {
                reject(error);
            }
        });
    }

    async pollPlayerCount(ws, steamApiInterface) {
        try {
            console.log("running cron job...");
            this.clearTimeoutInterval();
            let playerCountData = await steamApiInterface.fetchPlayerCountData();
            ws.clients.forEach((client) => client.send(JSON.stringify(playerCountData)))
            // clear timeout and add sleep
            sleep(2000);
            console.log("interval started!");
            this.timeout = setInterval(async () => {
                console.log("running interval...")
                let numNoisyGames = this.getRandomInteger(1, playerCountData.length / 2);
                let randGamesIndices = await this.getRandomIndices(playerCountData, numNoisyGames);
                playerCountData = await this.addNoiseModel(playerCountData, randGamesIndices);
                ws.clients.forEach((client) => client.send(JSON.stringify(playerCountData)))
            }, 3000)
        } catch (error) {
            console.log("error polling player count. Error: " + error); // should not fall here
        }
    }

    getRandomInteger(min, max) { // inclusive
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async getRandomIndices(array, numRandom) {
        return new Promise((resolve) => {
            let randomIndices = []
            while (randomIndices.length != numRandom) {
                let index = this.getRandomInteger(0, array.length - 1);
                if (!randomIndices.includes(index)) {
                    randomIndices.push(index);
                }
            }
            resolve(randomIndices);
        });
    }

    async addNoiseModel(playerCountData, randomIndices) {
        return new Promise((resolve) => {
            for (let i = 0; i < randomIndices.length; i++) {
                let randIndex = randomIndices[i];
                let noise = this.getRandomInteger(-5, 5);
                playerCountData[randIndex].playerCount = playerCountData[randIndex].playerCount + noise;
                playerCountData[randIndex].noise = noise;
            }
            resolve(playerCountData);
        });
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