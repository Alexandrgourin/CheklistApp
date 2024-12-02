"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
// import checklistRoutes from './routes/checklist.routes';
// import userRoutes from './routes/user.routes';
const error_1 = require("./middleware/error");
const config_1 = require("./config");
exports.app = (0, express_1.default)();
// Middleware для логирования запросов
exports.app.use((0, morgan_1.default)('dev'));
// CORS configuration
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
// Body parser middleware
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Create uploads directory if it doesn't exist
const fs_1 = __importDefault(require("fs"));
const uploadsDir = path_1.default.join(__dirname, '../uploads');
const avatarsDir = path_1.default.join(uploadsDir, 'avatars');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs_1.default.existsSync(avatarsDir)) {
    fs_1.default.mkdirSync(avatarsDir, { recursive: true });
}
// Serve static files from uploads directory
exports.app.use('/api/uploads', express_1.default.static(uploadsDir));
// API Routes
exports.app.use('/api/auth', auth_1.default);
// app.use('/api/checklist', checklistRoutes);
// app.use('/api/user', userRoutes);
// Error handling middleware
exports.app.use((err, req, res, next) => {
    (0, error_1.errorHandler)(err, req, res, next);
});
// Serve static files from the React app
const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
exports.app.use(express_1.default.static(clientBuildPath));
// Handle React routing, return all requests to React app
exports.app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
});
// Only start the server if this file is run directly
if (require.main === module) {
    // Database connection
    mongoose_1.default.connect(config_1.config.mongoUri)
        .then(() => {
        console.log('Connected to MongoDB');
        const port = process.env.PORT || 5000;
        exports.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
        .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
}
