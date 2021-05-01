const axios = require('axios');
const steamConfig = require('../../config/steam-api-config.json');
const GameDataInterface = require('./gameDataInterface');

class SteamApiInterface {
    constructor() {
        this.gameDataInterface = new GameDataInterface();
        this.steamApi = steamConfig.steamApi;
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
                    let response = await axios.get(this.steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appid);
                    let playerCount = response.data.response.player_count;
                    playerCountData.push({ name: name, playerCount: playerCount });
                }
                resolve(playerCountData);
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = SteamApiInterface;