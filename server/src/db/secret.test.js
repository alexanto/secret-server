const Secret = require("./secret");

describe('Secret', () => {
    let connection;
    let mockCollection;
    let mockFind;
    let mockUpdate;
    let mockInsert;

    beforeEach(() => {
        mockCollection = jest.fn();
        mockFind = jest.fn();
        mockUpdate = jest.fn();
        mockInsert = jest.fn();
        connection = {
            db: {
                collection: mockCollection
            }
        }
        mockCollection.mockReturnValue({
            findOne: mockFind,
            updateOne: mockUpdate,
            insertOne: mockInsert,
        })
    });

    it('should return the secret by hash', async () => {
        const expectedSecret = {
            secret: 'secret text',
        }
        mockFind.mockReturnValue(expectedSecret);
        const secret = new Secret(connection);
        const secretByHash = await secret.getSecretByHash('hash');

        expect(secretByHash).toEqual(expectedSecret);
        expect(mockFind).toHaveBeenCalledWith({hash: 'hash'});
    });

    it('should update views in db', async() => {
        mockUpdate.mockReturnValue({
            result: {
                nModified: 1,
            }
        })
        const secret = new Secret(connection);
        const modifiedDocsNumber = await secret.decreaseRemainingViews('hash', 13);

        expect(modifiedDocsNumber).toEqual(1);
        expect(mockUpdate).toHaveBeenCalledWith(
            {hash: 'hash'},
            {$set: {remainingViews: 13}},
        );
    });

    it('should insert a secret', async() => {
        mockInsert.mockReturnValue({
            result: {
                n: 1,
            }
        })
        const newSecret = {secret: 'text'};
        const secret = new Secret(connection);
        const modifiedNumber = await secret.insertSecret(newSecret);

        expect(modifiedNumber).toEqual(1);
        expect(mockInsert).toHaveBeenCalledWith(newSecret);
    });
});