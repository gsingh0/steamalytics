const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const sleep = require('../../service/util/Thread');
const Firebase = require('../../service/src/firebase');
const FileParser = require('./fileParser');


var csvGamesList = new Map();
var apiGamesList = [];
var databaseGamesMap = new Map(); // for data processing
var databaseGamesList = []; // for final database storage
var batchList = [];
var firebase = new Firebase();
var fileParser = new FileParser();

main();

async function main() {
    try {
        await parseCsvGameData();
        await fetchApiSteamGames();
        await crossCheckLists();
        await convertDatabaseList();
        await sortList(); 

        // for file implementation
            // await fileParser.write(JSON.stringify({data: databaseGamesList}));


        // for debugging
            // await printList();

        // for database implementation
        // await initalizeBatchList();
            // debugging
                // databaseGamesList = [{data: 0}, {data: 0}, {data: 0}, {data: 0}, {data: 0}];
                // await firebase.addMultiple('games', databaseGamesList);
        // await executeBatchProcess();
        // console.log("firebase data updated successfully");
    } catch (error) {
        console.log("error: " + error);
    }

}

async function printList() {
    let iter = 50;
    for (let i = 0; i < iter; i++) {
        console.log(databaseGamesList[i].name + "; " + databaseGamesList[i].rating);
    }
}

async function sortList() {
    return new Promise((resolve, reject) => {
        databaseGamesList.sort(function (a, b) { return b.rating - a.rating });
        resolve(databaseGamesList);
    })
}

async function executeBatchProcess() {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < batchList.length; i++) {
                await firebase.database.enableNetwork();
                console.log("batch process " + i + " started");
                await firebase.addMultiple('games', batchList[i]);
                console.log("batch process " + i + " completed");
                await firebase.database.disableNetwork();
                await sleep(5000);
            }
            resolve(batchList);
        } catch (error) {
            reject(error);
        }
    });
}

async function initalizeBatchList() {
    return new Promise((resolve, reject) => {
        let capacity = 400;
        let batch = [];
        for (let i = 0; i < databaseGamesList.length; i++) {
            if (batch.length == capacity) {
                batchList.push(batch);
                batch = [];
            }
            batch.push(databaseGamesList[i]);
            if (i == databaseGamesList.length - 1) {
                batchList.push(batch);
            }
        }
        resolve(batchList);
    });
}

async function convertDatabaseList() {
    return new Promise((resolve, reject) => {
        databaseGamesMap.forEach((value, key, map) => {
            databaseGamesList.push(value);
        });
        resolve(databaseGamesList);
    })
}

async function crossCheckLists() {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < apiGamesList.length; i++) {
            let game = apiGamesList[i];
            if (csvGamesList.has(game.name)) {
                let name = game.name;
                let appid = game.appid;
                let rating = Number(csvGamesList.get(name));
                if (databaseGamesMap.has(name)) {
                    if (databaseGamesMap.get(name).rating < rating) {
                        databaseGamesMap.set(name, { name: name, appid: appid, rating: rating });
                    }
                } else {
                    databaseGamesMap.set(name, { name: name, appid: appid, rating: rating });
                }
            }
        }
        resolve(databaseGamesMap);
    });
}

async function fetchApiSteamGames() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
            .then(response => {
                let apps = response.data.applist.apps;
                for (let i = 0; i < apps.length; i++) {
                    let game = apps[i];
                    apiGamesList.push(game);
                }
                resolve(apiGamesList);
            })
            .catch(error => {
                reject(error);
            })
    });
}

async function parseCsvGameData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./data/games-features.csv')
            .pipe(csv())
            .on('data', (row) => {
                csvGamesList.set(row.Name, row.RecommendationScore);
            })
            .on('end', () => {
                console.log("done parsing");
                resolve();
            });
    });
}