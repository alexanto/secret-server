const {encryt, decrypt, encrypt} = require('./encrypt');
const crypto = require('crypto');

describe('encryption', () => {
    const testKey = 'df63ed4444c66a2569ab0d2f7de5987b';
    describe('encrypt', () => {
        it('should return the encrypted data and iv as strings', () => {
            const result = encrypt('testString', testKey);
            
            expect(result.encryptedData.length).toEqual(32);
            expect(result.iv.length).toEqual(32);
        });
    });

    describe('decrypt', () => {
        it('should return the decrypted string', () => {
            const result = decrypt('ed2fb657effcc72598c45e834f119ad5', '23f61f1ccfdb40e3e69ccb519cd18bd4', testKey);

            expect(result).toEqual('testString');
        });
    });
});