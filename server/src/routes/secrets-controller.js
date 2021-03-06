const crypto = require('crypto');
const Secret = require('../db/secret');
const mongo = require('../db/mongo');
const dayjs = require('dayjs');
const {encrypt, decrypt} = require('../helpers/encrypt');
const config = require('../config');

const {encryptKey} = config;

const isEmpty = (value) => {
    return typeof value === "undefined" || value === null || value === "";
}

const getSecret = async (req, res) => {
    const secrets = new Secret(mongo);
    const hash = req.params.hash;
    const secret = await secrets.getSecretByHash(hash);
    if (!secret) {
        const error = new Error(`No secret with the provided hash ${hash} exists`);
        error.statusCode = 404;
        throw error;
    }

    const {remainingViews, expiresAt, secretText, iv} = secret;

    if (remainingViews === 0) {
        const error = new Error(`Maximum views for secret ${hash} exhausted, no more views possible`);
        error.statusCode = 403;
        throw error;
    }

    if (expiresAt && expiresAt != 0 && dayjs(expiresAt).isBefore(dayjs())) {
        const error = new Error(`Secret ${hash} is expired, can no longer be viewed`);
        error.statusCode = 403;
        throw error;
    }

    if (!await secrets.decreaseRemainingViews(hash, remainingViews - 1)) {
        const error = new Error(`Error writing into database`);
        error.statusCode = 500;
        throw error;
    }

    const decryptedSecret = decrypt(secretText, iv, encryptKey);

    const {iv: initializationVector, _id: id, ...rest} = secret;

    return {
        ...rest,
        secretText: decryptedSecret,
        remainingViews: remainingViews -1,
    }
};

const storeSecret = async (req, res) => {
    const {body} = req;
    const {secret, expireAfterViews, expireAfter} = body;

    if (isEmpty(secret) || isEmpty(expireAfterViews)) {
        const error = new Error('A secret and maximum view times must be provided in the request');
        error.statusCode = 400;
        throw error;
    }

    const secrets = new Secret(mongo);
    const currentDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ');
    const hash = crypto.createHash('sha1', secret).update(currentDate).digest('hex');
    const encryptedSecret = encrypt(secret, encryptKey);
    const {encryptedData, iv} = encryptedSecret;
    const remainingViews = Number(expireAfterViews);

    let expiresAt;
    if (typeof expireAfter !== "undefined" && Number(expireAfter) !== 0) {
        expiresAt = dayjs(currentDate).add(Number(expireAfter), 'minute').format('YYYY-MM-DDTHH:mm:ss.sssZ');
    }

    const newSecret = {
        hash,
        secretText: encryptedData,
        iv,
        createdAt: currentDate,
        remainingViews,
        ...expiresAt && { expiresAt }, 
    }
    
    const insertResult = await secrets.insertSecret(newSecret);

    if (!insertResult) {
        const error = new Error('Saving secret to database has failed');
        error.statusCode = 500;
        throw error;
    }

    return {
        hash,
        secretText: secret,
        createdAt: currentDate,
        remainingViews,
        ...expiresAt && { expiresAt },  
    }
}

module.exports = {
    getSecret,
    storeSecret,
}