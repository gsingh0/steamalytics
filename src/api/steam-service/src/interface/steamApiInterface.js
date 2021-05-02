const axios = require('axios');
const steamConfig = require('../../config/steam-api-config.json');
const GameDataInterface = require('./gameDataInterface');

class SteamApiInterface {
    constructor() {
        this.gameDataInterface = new GameDataInterface();
        this.steamApi = steamConfig.steamApi;
        this.PLAYER_COUNT_BATCH_LIMIT = 30;
    }

    async init() {
        await this.gameDataInterface.init();
    }

    async fetchPlayerCountData() {
        return new Promise(async (resolve, reject) => {
            try {
                let gameData = this.gameDataInterface.getGameData();
                let playerCountData = [];
                for (let i = 0; i < gameData.length; i++) {
                    let name = gameData[i].name;
                    let appid = gameData[i].appid;
                    await axios({
                        method: 'get',
                        url: this.steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appid,
                        maxContentLength: Number.MAX_VALUE,
                        maxBodyLength: Number.MAX_VALUE
                    })
                    .then((response) => {
                        let playerCount = response.data.response.player_count;
                        playerCountData.push({ name: name, playerCount: playerCount });
                    })
                    .catch((error) => {
                        let playerCount = -1;
                        playerCountData.push({ name: name, playerCount: playerCount });
                    });
                }
                playerCountData.sort((a, b) => b.playerCount - a.playerCount);
                resolve(playerCountData);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }
}

module.exports = SteamApiInterface;