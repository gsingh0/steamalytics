const FileParser = require('../util/fileParser');

class GameDataInterface {
    constructor() {
        this.fileParser = new FileParser();
        this.gameData = null;
        this.NUM_GAMES = 10;
    }

    async init() {
        this.gameData = await this.parseGameData();
    }

    async parseGameData(){
        return new Promise(async (resolve, reject) => {
            try {
                let gameData = await this.fileParser.read();
                gameData = gameData.data.slice(0, this.NUM_GAMES);
                resolve(gameData);
            } catch (error) {
                reject(error);
            }
        })
    }

    getGameData(n) {
        return this.gameData;
    }
}

module.exports = GameDataInterface;