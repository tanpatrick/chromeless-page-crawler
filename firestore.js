const firebase = require('firebase');
const config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
};

firebase.initializeApp(config);
const db = firebase.firestore();

class FirestoreDb {
    /**
     * Creates a new instance
     *
     * @param name - name of the firestore collection
     */
    constructor(name) {
        this.collection = db.collection(name);
    }

    add(data) {
        return this.collection.add(data);
    }
}

module.exports = FirestoreDb;
