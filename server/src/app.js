const express = require('express');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const secrets = require('./routes/secrets');
const cors = require('cors')

const app = express();

app.use(cors());

app.use(express.json());
app.use(requestLogger);

app.use('/api/secret', secrets);

app.use(errorHandler);
app.use((req, res, next) => {
    res.status(404).send("API endpoint does not exist");
  })

module.exports = app;
