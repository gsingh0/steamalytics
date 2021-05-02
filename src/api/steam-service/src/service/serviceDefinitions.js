const SteamApiInterface = require('../interface/steamApiInterface');

class ServiceDefinitions {
    constructor() {
        this.steamApiInterface = new SteamApiInterface();
    }

    async init() {
        await this.steamApiInterface.init();
    }

    getPlayerCount = async (req, res) => {
        try {
            let gameData = await this.steamApiInterface.fetchPlayerCountData();
            res.send({ status: "Ok", statusCode: 200, data: gameData });
        } catch (error) {
            res.send({ status: "Error", statusCode: 400, errorMessage: error });
        }
    }

    /**
     * TESTING PURPOSES
     */
    getAllGames = (req, res) => {
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

}

module.exports = ServiceDefinitions;