const fs = require('fs');

class FileParser {
    constructor() {
        this.FILE_OUTPUT_PATH = __dirname + '/../data/game-data.json';
    }

    async write(data) {
        return new Promise((resolve, reject) => {
            console.log(data);
            try {
                fs.writeFileSync(this.FILE_OUTPUT_PATH, data);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async read() {
        return new Promise((resolve, reject) => {
            try {
                let data = fs.readFileSync(this.FILE_OUTPUT_PATH);
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = FileParser;