"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/modern-web-app',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: '1d'
};
