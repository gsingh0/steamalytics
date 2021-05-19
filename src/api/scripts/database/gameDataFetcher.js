const fs = require('fs');
const FileParser = require('./fileParser');
const MultiThreading = require('../../steam-service/src/util/multithreading');
const axios = require('axios');


async function fetchAllGameData() {
    return new Promise((resolve, reject) => {
        axios("http://api.steampowered.com/ISteamApps/GetAppList/v0002/")
            .then(response => resolve(response.data.applist.apps))
            .catch(error => reject(error));
    })
}

async function fetchGamePlayerCount(gameData) {
    return new Promise(async (resolve, reject) => {
        // let totalWork = 5;
        // let numWorkers = totalWork / 2;

        let totalWork = gameData.length;
        let numWorkers = totalWork / 10;

        let multithreading = new MultiThreading(totalWork, numWorkers);
        await multithreading.init();
        let playerCountData = await multithreading.run(async (sublist, data) => {
            for (let i = 0; i < sublist.length; i++) {
                let name = gameData[sublist[i]].name;
                let appid = gameData[sublist[i]].appid;
                await axios({
                    method: 'get',
                    url: 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appid,
                    maxContentLength: Number.MAX_VALUE,
                    maxBodyLength: Number.MAX_VALUE
                })
                .then((response) => {
                    let playerCount = response.data.response.player_count;
                    data.push({ name: name, playerCount: playerCount, appid: appid});
                })
                .catch((error) => {
                    let playerCount = -1;
                    data.push({ name: name, playerCount: playerCount, appid: appid});
                });
            }
        });
        playerCountData.sort((a, b) => b.playerCount - a.playerCount);

        playerCountData = playerCountData.slice(0, 10);

        // playerCountData = playerCountData.slice(0, 500);
        let mostPopularGames = []
        playerCountData.forEach((game) => {
            mostPopularGames.push({ name: game.name, appid: game.appid });
        })
        resolve(mostPopularGames);
    }) 
}

async function main() {
    try {
        let gameData = await fetchAllGameData();
        let fileParser = new FileParser('./output/new-game-data.json');
        await fileParser.write(JSON.stringify(gameData));
    } catch(error) {
        console.log(error);
    }
}

main();