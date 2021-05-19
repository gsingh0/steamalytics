const fs = require('fs');

class FileParser {
    constructor(fileOuputPath) {
        if (fileOuputPath === undefined) {
            this.FILE_OUTPUT_PATH = './output/game-data.json';
        } else {
            this.FILE_OUTPUT_PATH = fileOuputPath;
        }
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
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = FileParser;