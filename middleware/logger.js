const dayjs = require('dayjs');

const logger = (req, res, next) => {
    console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports = logger;