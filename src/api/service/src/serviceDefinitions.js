// library dependencies
const axios = require('axios');

// object dependencies
const FileParser = require('../../scripts/database/fileParser');
//

// configuration dependencies
const steamConfig = require('../config/steam-api-config.json');


const steamApi = steamConfig.steamApi;
var fileParser = new FileParser();

let getPlayerCount = (req, res) => {
    axios.get(steamApi.url + '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error);
        })
}

let getAllGames = (req, res) => {
    axios.get(steamApi.url + '/ISteamApps/GetAppList/v2/')
        .then(response => {
            console.log(response);
            res.send(response.data);
        })
        .catch(error => {
            console.log("err " + error);
            res.send(error);
        })
}

module.exports = {
    getPlayerCount: getPlayerCount,
    getAllGames: getAllGames
}