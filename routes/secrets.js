const dayjs = require('dayjs');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const mongo = require('../db/mongo');
const Secret = require('../db/secret');
const asyncHandler = require('../helpers/asyncHander');
const config = require('../config');

const {encryptKey} = config;

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    console.log(encryptKey);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};


const decrypt = (text, iv) => {
    const encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

router.get('/:hash', asyncHandler(async (req, res) => {
    const secrets = new Secret(mongo);
    const hash = req.params.hash;
    const secret = await secrets.getSecretByHash(hash);
    if (!secret) {
        const error = new Error(`No secret with the provided hash ${hash} exists`);
        error.statusCode = 404;
        throw error;
    }

    const {remainingViews, expiresAt, createdAt, secretText, iv} = secret;

    if (remainingViews === 0) {
        const error = new Error(`Maximum views for secret ${hash} exhausted, no more views possible`);
        error.statusCode = 403;
        throw error;
    }

    const createdDate = dayjs(createdAt);
    const minutesSinceCreation = dayjs().diff(createdDate, 'minute');

    if (expiresAt && expiresAt < minutesSinceCreation) {
        const error = new Error(`Secret ${hash} is expired, can no longer be viewed`);
        error.statusCode = 403;
        throw error;
    }

    if (!await secrets.decreaseRemainingViews(hash, remainingViews - 1)) {
        const error = new Error(`Error writing into database`);
        error.statusCode = 500;
        throw error;
    }

    const decryptedSecret = decrypt(secretText, iv);

    const {iv: initializationVector, ...rest} = secret;

    res.json({
        ...rest,
        secretText: decryptedSecret,
        remainingViews: remainingViews -1,
    });
}));

module.exports = router;
