const FileParser = require('../util/fileParser');

class GameDataInterface {
    constructor() {
        this.fileParser = new FileParser();
        this.gameData = null;
    }

    async init() {
        this.gameData = await this.parseGameData();
    }

    async parseGameData(){
        return new Promise(async (resolve, reject) => {
            try {
                let gameData = await this.fileParser.read();
                resolve(gameData);
            } catch (error) {
                reject(error);
            }
        })
    }

    getGameData(n) {
        if (typeof(n) !== "undefined") {
            return this.gameData.slice(0, n);
        } else {
            return this.gameData;
        }
    }
}

module.exports = GameDataInterface;