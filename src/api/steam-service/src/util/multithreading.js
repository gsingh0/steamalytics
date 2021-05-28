const { buildBatchListMT } = require('./batch');

class MultiThreading {
    /**
     * 
     * @param {*} totalWork 
     * @param {*} numWorkers 
     */
    constructor(totalWork, numWorkers) {
        this.totalWork = totalWork;
        this.numWorkers = numWorkers;
        this.capacity = Math.ceil(this.totalWork / this.numWorkers);
        this.sublists = [];
        this.workers = [];
    }

    async init() {
        this.sublists = await this.buildSublists();
    }

    async buildSublists() {
        return new Promise(async (resolve) => {
            let sublists = await buildBatchListMT(this.totalWork, this.capacity);
            resolve(sublists);
        })
    }

    async run(worker) {
        return new Promise((resolve, reject) => {
            try {
                let data = [];
                for (let i = 0; i < this.numWorkers; i++) {
                    this.workers.push(worker(this.sublists[i], data));
                }
                Promise.all(this.workers)
                    .then(() => resolve(data))
                    .catch((error) => reject(error));
            } catch (error) {
                reject(error);
            }
        })
    }

}

module.exports = MultiThreading;