class Secret {
    constructor(connection) {
        this.collection = connection.db.collection('secrets');
    }

    async getSecretByHash(secretHash) {
        return this.collection.findOne({hash: secretHash});
    }

    async decreaseRemainingViews(secretHash, viewNumber) {
        const query = { hash: secretHash };
        const newValue = { $set: {remainingViews: viewNumber } };
        const response = await this.collection.updateOne(query, newValue);
        return response.result.nModified;
    }

    async insertSecret(secret) {
        const response = await this.collection.insertOne(secret);
        return response.result.n;
    }
}

module.exports = Secret;