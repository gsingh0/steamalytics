const buildBatchList = async (gameData, capacity) => {
    return new Promise((resolve) => {
        let batchList = [];
        let batch = [];
        for (let i = 0; i < gameData.length; i++) {
            if (batch.length == capacity) {
                batchList.push(batch);
                batch = [];
            }
            batch.push(gameData[i]);
            if (i == gameData.length - 1) {
                batchList.push(batch);
            }
        }
        resolve(batchList);
    })
}

/**
 * for multithreading
 */
const buildBatchListMT = async (numData, capacity) => {
    return new Promise((resolve) => {
        let batchList = [];
        let batch = [];
        for (let i = 0; i < numData; i++) {
            if (batch.length == capacity) {
                batchList.push(batch);
                batch = [];
            }
            batch.push(i);
            if (i == numData - 1) {
                batchList.push(batch);
            }
        }
        resolve(batchList);
    })
}

module.exports = {
    buildBatchList: buildBatchList,
    buildBatchListMT: buildBatchListMT
}