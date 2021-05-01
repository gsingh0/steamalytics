const axios = require('axios');
const steamConfig = require('../../config/steam-api-config.json');
const GameDataInterface = require('./gameDataInterface');

class SteamApiInterface {
    constructor() {
        this.gameDataInterface = new GameDataInterface();
        this.playerCountData = null;
        this.steamApi = steamConfig.steamApi;
        this.NUM_GAMES = 10;
    }

    async init() {
        await this.gameDataInterface.init();
    }

    async fetchPlayerCountData() {
        return new Promise((resolve, reject) => {
            axios.get(this.steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + this.gameDataInterface.getGameData().data[0].appid)
                .then(response => {
                    resolve(response.data.response.player_count);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
}

module.exports = SteamApiInterface;