const express = require('express');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const secrets = require('./routes/secrets');

const app = express();

app.use(requestLogger);

app.use('/api/secret', secrets);

app.use(errorHandler);

module.exports = app;
