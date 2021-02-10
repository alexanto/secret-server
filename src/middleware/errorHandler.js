const {constants} = require('http2');

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const httpStatus = Object.keys(constants).find(key => key === statusCode);
    return res.status(statusCode).json({
        msg: error.message || httpStatus,
    })
}

module.exports = errorHandler;