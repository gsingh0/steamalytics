const firebase = require('firebase').default;
const admin = require('firebase-admin');
const serviceAccount = require('../config/steamalytics-firebase-adminsdk-v5awp-74c6fcca48.json');

class Firebase {
    constructor() {
        firebase.initializeApp({
            apiKey: admin.credential.cert(serviceAccount),
            databaseURL: 'https://steamalytics.us-east1.firebasedatabase.app',
            projectId: 'steamalytics'
          });
        this.database = firebase.firestore();
    }

    async addMultiple(collection, dataArray) {
        return new Promise(async (resolve, reject) => {
            let batch = this.database.batch();
            dataArray.forEach((game, index) => {
                let docRef = this.database.collection(collection).doc();
                batch.set(docRef, game);
            })
            batch.commit()
                .then(() =>{ console.log("resolved"); resolve()})
                .catch((error) => { console.log("not resolved: " + error); reject(error)});
        })
    }
}

module.exports = Firebase;