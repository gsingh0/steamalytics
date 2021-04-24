// library dependencies
const axios = require('axios');

// object dependencies
// 
//

// configuration dependencies
const steamConfig = require('../config/steam-api-config.json');


const steamApi = steamConfig.steamApi;

let getPlayerCount = (request, response) => {
    axios.get(steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/')
        .then(response => {
            response.send(response.data);
        })
        .catch(error => {
            response.send(error);
        })
}

let getAllGames = (request, response) => {
    axios.get(steamApi.url + '/ISteamApps/GetAppList/v2/')
        .then(response => {
            response.send(response.data);
        })
        .catch(error => {
            response.send(error);
        })
}

module.exports = {
    getPlayerCount: getPlayerCount,
    getAllGames: getAllGames
}