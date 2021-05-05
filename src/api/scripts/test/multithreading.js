const fetch = require('node-fetch');

async function main() {
    runWorkers();
    // console.log(data);
}

async function runWorkers() {
    // return new Promise(async (resolve) => {
    //     let data = [];
    //     await worker(0, data);
    //     await worker(1, data);
    //     await worker(2, data);
    //     await worker(3, data);
    //     await worker(4, data);
    //     resolve(data);
    // })
    let data = []
    let workers = [];
    for (let i = 0; i < 5; i++) {
        workers.push(worker(i, data));
    }
    Promise.all(workers).then(() => console.log(data));
}

async function worker(i, data) {
    for (let j = 0; j < 5; j++) {
        let res = await fetch("http://google.com");
        data.push("worker " + i);
    }
}

main();