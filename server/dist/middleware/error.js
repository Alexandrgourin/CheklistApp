"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err.message
        });
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'fail',
            error: err.message
        });
    }
    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'fail',
            error: 'Invalid token. Please log in again.'
        });
    }
    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'fail',
            error: 'Your token has expired. Please log in again.'
        });
    }
    // Default error
    return res.status(500).json({
        status: 'error',
        error: 'Something went wrong!'
    });
};
exports.errorHandler = errorHandler;
