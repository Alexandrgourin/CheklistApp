"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
// Database connection
mongoose_1.default.connect(config_1.config.mongoUri)
    .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app_1.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
