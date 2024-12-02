"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checklist = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checklistSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active',
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
exports.Checklist = mongoose_1.default.model('Checklist', checklistSchema);
