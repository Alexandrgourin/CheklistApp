"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const error_1 = require("./error");
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new error_1.AppError('Authentication required', 401);
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            if (!decoded || !decoded.id || !decoded.email) {
                throw new error_1.AppError('Invalid token', 401);
            }
            req.user = {
                id: decoded.id,
                email: decoded.email
            };
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new error_1.AppError('Invalid token', 401);
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new error_1.AppError('Token expired', 401);
            }
            throw error;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.auth = auth;
