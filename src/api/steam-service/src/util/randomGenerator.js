const getRandomInteger = (min, max) => { // inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getRandomIndices = async (array, numRandom) => {
    return new Promise((resolve) => {
        let randomIndices = []
        while (randomIndices.length != numRandom) {
            let index = getRandomInteger(0, array.length - 1);
            if (!randomIndices.includes(index)) {
                randomIndices.push(index);
            }
        }
        resolve(randomIndices);
    });
}

module.exports = {
    getRandomInteger: getRandomInteger,
    getRandomIndices: getRandomIndices
}