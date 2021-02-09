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
}

module.exports = Secret;