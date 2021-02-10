const {constants} = require('http2');

const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }
    const statusCode = error.statusCode || 500;
    const httpStatus = Object.entries(constants).find(([key, value]) => value === statusCode)[0];
    return res.status(statusCode).json({
        msg: error.message || httpStatus,
    })
}

module.exports = errorHandler;