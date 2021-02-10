const {MongoClient} = require('mongodb');
const config = require('../config');

const {mongoUser, mongoPwd, dbName} = config;

class Mongo {
    constructor(mongoUser, mongoPwd, dbName) {
        this.url = `mongodb+srv://${mongoUser}:${mongoPwd}@cluster0.uai64.mongodb.net/${dbName}?retryWrites=true&w=majority`;
        this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async init() {
         await this.client.connect();
         this.db = this.client.db("secrets");
    }
}

module.exports = new Mongo(mongoUser, mongoPwd, dbName);