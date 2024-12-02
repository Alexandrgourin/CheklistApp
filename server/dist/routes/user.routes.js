"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const error_1 = require("../middleware/error");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/avatars');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter
}).single('avatar');
// Upload avatar route with error handling
router.post('/avatar', auth_1.auth, async (req, res, next) => {
    upload(req, res, async (err) => {
        var _a;
        try {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
                }
                return res.status(400).json({ error: err.message });
            }
            else if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const user = await User_1.User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Delete old avatar if exists
            if (user.avatar) {
                const oldAvatarPath = path_1.default.join(__dirname, '../../uploads/avatars', path_1.default.basename(user.avatar));
                if (fs_1.default.existsSync(oldAvatarPath)) {
                    fs_1.default.unlinkSync(oldAvatarPath);
                }
            }
            // Save avatar path
            const avatarUrl = path_1.default.basename(req.file.path);
            user.avatar = avatarUrl;
            await user.save();
            res.json({
                message: 'Avatar uploaded successfully',
                avatarUrl
            });
        }
        catch (error) {
            console.error('Error uploading avatar:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error uploading avatar';
            res.status(500).json({ error: errorMessage });
        }
    });
});
// Get user profile
router.get('/profile', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const user = await User_1.User.findById(req.user.id).select('-password');
        if (!user) {
            throw new error_1.AppError('User not found', 404);
        }
        const response = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt.getTime(),
            updatedAt: user.updatedAt.getTime()
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Update user profile
router.put('/profile', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const { name, email } = req.body;
        if (!name && !email) {
            throw new error_1.AppError('At least one field (name or email) must be provided', 400);
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new error_1.AppError('Invalid email format', 400);
            }
            updateData.email = email;
        }
        const user = await User_1.User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true }).select('-password');
        if (!user) {
            throw new error_1.AppError('User not found', 404);
        }
        const response = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt.getTime(),
            updatedAt: user.updatedAt.getTime()
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
