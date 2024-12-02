"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const auth_1 = require("../middleware/auth");
const error_1 = require("../middleware/error");
const router = express_1.default.Router();
// Registration
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            throw new error_1.AppError('All fields are required', 400);
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new error_1.AppError('Invalid email format', 400);
        }
        // Validate password length
        if (password.length < 6) {
            throw new error_1.AppError('Password must be at least 6 characters long', 400);
        }
        // Check if user exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            throw new error_1.AppError('Email already exists', 400);
        }
        // Create new user
        const user = new User_1.User({ name, email, password });
        await user.save();
        // Create token
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, config_1.config.jwtSecret, { expiresIn: '7d' });
        // Send response
        res.status(201).json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            token
        });
    }
    catch (error) {
        next(error);
    }
});
// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new error_1.AppError('Email and password are required', 400);
        }
        // Find user
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new error_1.AppError('Invalid credentials', 401);
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new error_1.AppError('Invalid credentials', 401);
        }
        // Create token
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, config_1.config.jwtSecret, { expiresIn: '7d' });
        // Send response
        res.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            token
        });
    }
    catch (error) {
        next(error);
    }
});
// Get current user
router.get('/me', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const user = await User_1.User.findById(req.user.id).select('-password');
        if (!user) {
            throw new error_1.AppError('User not found', 404);
        }
        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
