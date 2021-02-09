const express = require('express');
const requestLogger = require('./middleware/logger');

const app = express();

app.use(requestLogger);

module.exports = app;
