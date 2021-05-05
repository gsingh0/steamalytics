const axios = require('axios');
const steamConfig = require('../../config/steam-api-config.json');
const GameDataInterface = require('./gameDataInterface');
const MultiThreading = require('../util/multithreading');

class SteamApiInterface {
    constructor() {
        this.gameDataInterface = new GameDataInterface();
        this.NUM_WORKERS = this.gameDataInterface.NUM_GAMES / 10; // number of api calls per worker taks
        this.multiThreading = new MultiThreading(this.gameDataInterface.NUM_GAMES, this.NUM_WORKERS);
        this.steamApi = steamConfig.steamApi;
    }

    async init() {
        await this.gameDataInterface.init();
        await this.multiThreading.init();
    }

    async fetchPlayerCountData() {
        return new Promise(async (resolve, reject) => {
            try {
                let gameData = this.gameDataInterface.getGameData();
                let playerCountData = await this.multiThreading.run(async (sublist, data) => {
                    for (let i = 0; i < sublist.length; i++) {
                        let name = gameData[sublist[i]].name;
                        let appid = gameData[sublist[i]].appid;
                        await axios({
                            method: 'get',
                            url: this.steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appid,
                            maxContentLength: Number.MAX_VALUE,
                            maxBodyLength: Number.MAX_VALUE
                        })
                        .then((response) => {
                            let playerCount = response.data.response.player_count;
                            data.push({ name: name, playerCount: playerCount, noise: 1 });
                        })
                        .catch((error) => {
                            let playerCount = -1;
                            data.push({ name: name, playerCount: playerCount, noise: 0 });
                        });
                    }
                });
                playerCountData.sort((a, b) => b.playerCount - a.playerCount);
                resolve(playerCountData);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    // worker(sublist, data) {
    //     // let gameData = this.gameDataInterface.getGameData();
    //     // let playerCountData = [];
    //     for (let i = 0; i < sublist.length; i++) {
    //         let name = sublist[i].name;
    //         let appid = sublist[i].appid;
    //         await axios({
    //             method: 'get',
    //             url: this.steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appid,
    //             maxContentLength: Number.MAX_VALUE,
    //             maxBodyLength: Number.MAX_VALUE
    //         })
    //             .then((response) => {
    //                 let playerCount = response.data.response.player_count;
    //                 data.push({ name: name, playerCount: playerCount, noise: 1 });
    //             })
    //             .catch((error) => {
    //                 let playerCount = -1;
    //                 data.push({ name: name, playerCount: playerCount, noise: 0 });
    //             });
    //     }
    // }


}

module.exports = SteamApiInterface;