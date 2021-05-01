const ServiceManager = require('./serviceManager');

class ServiceDefinitions {
    constructor() {
        this.serviceManager = new ServiceManager();
    }

    async init() {
        await this.serviceManager.init();
    }

    getPlayerCount = async (req, res) => {
        try {
            let gameData = await this.serviceManager.steamApiInterface.fetchPlayerCountData();
            res.send({ status: "Ok", statusCode: 200, data: gameData });
        } catch (error) {
            res.send({ status: "Error", statusCode: 400, errorMessage: error });
        }
    }

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