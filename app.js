const express = require('express');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(requestLogger);
app.use(errorHandler);

module.exports = app;
