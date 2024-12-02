"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const checklist_1 = require("../models/checklist");
const error_1 = require("../middleware/error");
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
function createChecklistResponse(checklist) {
    return {
        id: checklist._id.toString(),
        title: checklist.title,
        shortName: checklist.shortName,
        status: checklist.status,
        userId: checklist.userId.toString(),
        userName: checklist.userName,
        createdAt: checklist.createdAt.getTime(),
        updatedAt: checklist.updatedAt.getTime()
    };
}
// Get all user's checklists
router.get('/', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const checklists = await checklist_1.Checklist.find({ userId: new mongoose_1.Types.ObjectId(req.user.id) });
        const response = checklists.map(createChecklistResponse);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Create new checklist
router.post('/', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const { title, shortName, status } = req.body;
        // Validate input
        if (!title || !shortName || !status) {
            throw new error_1.AppError('Title, shortName and status are required', 400);
        }
        // Validate status
        if (!Object.values(checklist_1.ChecklistStatus).includes(status)) {
            throw new error_1.AppError('Invalid status value', 400);
        }
        const checklist = new checklist_1.Checklist({
            title,
            shortName,
            status,
            userId: new mongoose_1.Types.ObjectId(req.user.id),
            userName: req.user.email || 'Anonymous'
        });
        await checklist.save();
        res.status(201).json(createChecklistResponse(checklist));
    }
    catch (error) {
        next(error);
    }
});
// Update checklist
router.put('/:id', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const { title, shortName, status } = req.body;
        // Validate input
        if (!title || !shortName || !status) {
            throw new error_1.AppError('Title, shortName and status are required', 400);
        }
        // Validate status
        if (!Object.values(checklist_1.ChecklistStatus).includes(status)) {
            throw new error_1.AppError('Invalid status value', 400);
        }
        const checklist = await checklist_1.Checklist.findOneAndUpdate({
            _id: new mongoose_1.Types.ObjectId(req.params.id),
            userId: new mongoose_1.Types.ObjectId(req.user.id)
        }, { title, shortName, status }, { new: true });
        if (!checklist) {
            throw new error_1.AppError('Checklist not found', 404);
        }
        res.json(createChecklistResponse(checklist));
    }
    catch (error) {
        next(error);
    }
});
// Delete checklist
router.delete('/:id', auth_1.auth, async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new error_1.AppError('Authentication required', 401);
        }
        const checklist = await checklist_1.Checklist.findOneAndDelete({
            _id: new mongoose_1.Types.ObjectId(req.params.id),
            userId: new mongoose_1.Types.ObjectId(req.user.id)
        });
        if (!checklist) {
            throw new error_1.AppError('Checklist not found', 404);
        }
        res.json({ message: 'Checklist deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
