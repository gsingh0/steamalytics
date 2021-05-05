const { getRandomInteger } = require('./randomGenerator');

const addNoiseModel = async (playerCountData, randomIndices) => {
    return new Promise((resolve) => {
        for (let i = 0; i < randomIndices.length; i++) {
            let randIndex = randomIndices[i];
            if (playerCountData[randIndex].playerCount > 0) {
                let noise = getRandomInteger(-2, 2);
                playerCountData[randIndex].playerCount = playerCountData[randIndex].playerCount + noise;
                playerCountData[randIndex].noise = noise;
            }
        }
        resolve(playerCountData);
    });
}

module.exports = addNoiseModel;