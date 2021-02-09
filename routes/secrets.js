const dayjs = require('dayjs');
const express = require('express');
const router = express.Router();
const mongo = require('../db/mongo');
const Secret = require('../db/secret');
const asyncHandler = require('../helpers/asyncHander')

router.get('/:hash', asyncHandler(async (req, res) => {
    const secrets = new Secret(mongo);
    const hash = req.params.hash;
    const secret = await secrets.getSecretByHash(hash);
    if (!secret) {
        const error = new Error(`No secret with the provided hash ${hash} exists`);
        error.statusCode = 404;
        throw error;
    }

    const {remainingViews, expiresAt, createdAt} = secret;

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

    res.json({
        ...secret,
        remainingViews: remainingViews -1,
    });
}));

module.exports = router;
