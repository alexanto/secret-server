const express = require('express');
const router = express.Router();
const asyncHandler = require('../helpers/asyncHandler');
const {getSecret, storeSecret} = require('./secrets-controller.js');

router.get('/:hash', asyncHandler(async(req, res) => {
    const response = await getSecret(req, res);
    res.json(response);
}));

router.post('/', asyncHandler(async (req, res) => {
    const response = await storeSecret(req, res);
    res.json(response);
}));

module.exports = router;
